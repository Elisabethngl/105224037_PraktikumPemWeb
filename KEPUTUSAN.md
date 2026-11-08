# Dokumentasi Keputusan Kriptografi (Architectural Decision Record) — AgroMarket

**Mata Kuliah**: Kriptografi (Terintegrasi Rekayasa Perangkat Lunak & Keamanan Siber)  
**Produk**: AgroMarket (Marketplace Sarana Produksi Pertanian Terpadu)  
**Mahasiswa**: Elisabeth Nainggolan (NIM: 105224037)  
**Versi / Tag Rilis**: `v0.2`  
**Pekan**: Pekan 6  
**Tanggal**: 8 November 2026  

---

## 1. Matriks Keputusan: Kebutuhan $\rightarrow$ Mekanisme $\rightarrow$ Alasan

Arsitektur kriptografi pada platform **AgroMarket** dirancang dengan pendekatan *security by design* untuk melindungi data aset pertanian kritis:

```
+---------------------------------------------------------------------------------------------------------+
|                    POHON KEPUTUSAN ARSITEKTUR KRIPTOGRAFI AGROMARKET (v0.2)                             |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
| 1. Data Pesanan & PII Lahan Petani  --->  AEAD AES-256-GCM + AAD  --->  Kerahasiaan + Integritas        |
|                                                                         (Anti-Tampering & Anti-Replay)  |
|                                                                                                         |
| 2. Nomor Izin Edar Pupuk Kementan   --->  HMAC-SHA256             --->  Integritas & Otentikasi Asal    |
|                                                                         (Anti-Pemalsuan Zat Kimia B3)   |
|                                                                                                         |
| 3. Manajemen Sub-Kunci Hirarkis     --->  HKDF (RFC 5869)         --->  Pemisahan Domain Kriptografis   |
|                                                                         (Zero-Key-Reuse Weakness)       |
|                                                                                                         |
| 4. Penyimpanan Kata Sandi Akun      --->  Scrypt KDF (Slow Hash)  --->  Tahan Brute-Force GPU/ASIC      |
|                                                                         + Batas Input Mitigasi DoS      |
+---------------------------------------------------------------------------------------------------------+
```

### Tabel Rincian Keputusan

| No | Kebutuhan Perlindungan Data | Mekanisme Terpilih | Alasan & Justifikasi Kriptografis (*Rationale*) |
| :---: | :--- | :--- | :--- |
| **1** | **Kerahasiaan & Integritas Data Pemesanan serta PII Petani**<br>*(Nama, NIK Tani, No. WA, Titik Koordinat Lahan, Kuantitas Pupuk Bersubsidi & Obat Racun Hama B3)* | **Authenticated Encryption with Associated Data (AEAD) — AES-256-GCM**<br>*(NIST SP 800-38D)* | **Mengapa bukan AES-CBC biasa?**<br>Enkripsi simetris konvensional (seperti CBC atau CTR tanpa MAC) hanya menjamin kerahasiaan (*confidentiality*), tetapi sama sekali tidak menjamin integritas (*integrity*). Mode CBC rentan terhadap serangan manipulasi bit (*Bit-Flipping Attack*) dan serangan *Padding Oracle* yang memungkinkan penyerang mendekripsi data tanpa kunci.<br><br>**Mengapa AES-256-GCM?**<br>GCM (Galois/Counter Mode) menggabungkan mode CTR untuk enkripsi berperforma tinggi dengan Galois Field GMAC untuk menghasilkan tag otentikasi 128-bit secara terpadu. Fitur **AAD (Additional Authenticated Data)** memungkinkan sistem mengikat metadata pesanan (`orderId`, `userId`, `timestamp`) ke dalam perhitungan tag autentikasi tanpa harus mengenkripsi metadata tersebut, sehingga mematikan serangan *Context Transposition* (penyerang memindahkan ciphertext pesanan sah ke akun penyerang). |
| **2** | **Integritas & Keaslian Izin Edar Kementan serta Takaran Dosis Pestisida**<br>*(Mencegah distributor ilegal mengedarkan obat hama palsu / oplosan)* | **Keyed-Hash Message Authentication Code (HMAC-SHA256)**<br>*(RFC 2104 / NIST FIPS 198-1)* | **Mengapa bukan Hash polos (SHA-256 murni)?**<br>Hash kriptografis biasa tanpa kunci rentan terhadap serangan manipulasi *Length Extension Attack* dan tidak memiliki bukti keaslian asal (*origin authenticity*). Siapa pun dapat menghitung hash baru jika teks diubah.<br><br>**Mengapa HMAC-SHA256?**<br>HMAC mengombinasikan kunci rahasia distributor berizin dengan hashing dua lapis (*inner & outer hash*), membuktikan bahwa nomor registrasi izin dan formula kimia produk benar-benar diterbitkan oleh produsen resmi yang memegang kunci rahasia tersebut. |
| **3** | **Manajemen Kunci Terpusat & Pencegahan Penggunaan Kunci Berulang (*Key Reuse*)**<br>*(Pemisahan kunci enkripsi database, kunci signing HMAC, dan token)* | **HMAC-based Extract-and-Expand Key Derivation Function (HKDF)**<br>*(RFC 5869)* | **Mengapa HKDF?**<br>Menggunakan satu kunci yang sama untuk enkripsi AES dan pembuatan tanda tangan HMAC merupakan kerentanan fatal dalam kriptografi (*cryptographic key reuse*). HKDF memungkinkan satu Master Key aman di lingkungan luar diturunkan secara pseudorandom menjadi beberapa sub-kunci independen dengan pemisahan label konteks (`info`), sehingga kompromi pada satu sub-kunci tidak membahayakan operasi kriptografi lainnya. |
| **4** | **Penyimpanan Kredensial Kata Sandi Pengguna Tahan Brute-Force & DoS**<br>*(Petani, Distributor, dan Pengawas Dinas)* | **Scrypt Memory-Hard KDF**<br>*(RFC 7914 / OWASP Standard)* | **Mengapa bukan Hash Cepat (MD5 / SHA-256)?**<br>Fungsi hash cepat dirancang untuk verifikasi berkas berkecepatan tinggi, sehingga dapat di-crack ratusan juta kali per detik menggunakan rig GPU/ASIC modern.<br><br>**Mengapa Scrypt?**<br>Scrypt dirancang khusus dengan parameter kebutuhan memori dan CPU yang berat ($N=16384, r=8, p=1$), memaksa penyerang membutuhkan alokasi memori fisik besar per iterasi, mematikan akselerasi brute-force paralel pada chip grafis. Dilengkapi validasi panjang maksimal 72 karakter untuk memitigasi serangan *Denial of Service / Hash Bomb* pada Event Loop server. |

---

## 2. Parameter Terdokumentasi & Tata Kelola Kunci

Seluruh implementasi kriptografi menggunakan pustaka terpelihara resmi **Node.js Crypto (`node:crypto`)** dengan spesifikasi parameter sebagai berikut:

### A. Spesifikasi Parameter AEAD AES-256-GCM
* **Panjang Kunci Simetris**: 256-bit (32 byte), dibangkitkan melalui CSPRNG (*Cryptographically Secure Pseudorandom Number Generator*) `crypto.randomBytes(32)`.
* **Nonce / Initialization Vector (IV)**: 96-bit (12 byte), unik wajib dihasilkan per operasi enkripsi menggunakan CSPRNG (`crypto.randomBytes(12)`). Dilarang keras menggunakan IV statis (*IV reuse eliminates GCM authenticity*).
* **Additional Authenticated Data (AAD)**: String metadata transaksi berformat terstruktur (contoh: `orderId=ORD-AGRO-2026-001;userId=USR-PETANI-01;timestamp=2026-11-08T12:00:00Z`).
* **Authentication Tag**: 128-bit (16 byte) Galois Field GMAC tag, dihitung saat enkripsi (`cipher.getAuthTag()`) dan diverifikasi saat dekripsi (`decipher.setAuthTag()`).
* **Format Ciphertext**: Base64 encoded string.

### B. Penyimpanan Kunci di Luar Repositori
* **Prinsip Zero-Secrets in Repo**: Repositori kode **TIDAK MEMUAT** kunci privat asli, token rahasia, maupun kredensial produksi.
* **Mekanisme Penyimpanan**: Kunci disimpan pada berkas lingkungan lokal `.env.local` melalui variabel `AGROMARKET_MASTER_KEY` (32-byte Hex string).
* **Perlindungan Berkas**: Berkas `.env*` telah terdaftar secara ketat di `.gitignore` (hanya berkas template `.env.example` dengan nilai kosong yang di-commit).
* **Data Uji Sintetis**: Seluruh pengujian otomatis menggunakan data tiruan (sintetis) yang aman.

### C. Validasi Masukan & Prinsip Gagal Tertutup (*Fail-Closed*)
Sistem menerapkan penanganan kesalahan secara tertutup (*fail-closed error handling*):
1. **Validasi Masukan**: Memeriksa bahwa plaintext berupa string tidak kosong, kunci berukuran tepat 32 byte, IV berukuran tepat 12 byte, dan tag autentikasi berukuran tepat 16 byte.
2. **Kegagalan Verifikasi**: Jika penyerang memodifikasi 1 bit saja pada ciphertext, memalsukan tag autentikasi, mengubah metadata AAD, atau menggunakan kunci yang salah, proses dekripsi **langsung dibatalkan**.
3. **Pesan Kesalahan Seragam**: Sistem hanya melempar satu pesan kesalahan standar tanpa membocorkan struktur data internal maupun *stack trace*:
   ```
   Error: Dekripsi AEAD gagal: Integritas data, tag autentikasi, AAD, atau kunci tidak valid (Fail-Closed).
   ```

---

## 3. Hasil Pengujian Otomatis (8 Skenario Lengkap)

Pengujian dijalankan melalui script [test/crypto.test.mjs](test/crypto.test.mjs) menggunakan Test Runner resmi Node.js:

```bash
$ npm test

> agromarket@0.1.0 test
> node test/crypto.test.mjs && node test/access-control.test.mjs

✔ SKENARIO 1 (Berhasil): Enkripsi & Dekripsi AEAD AES-256-GCM dengan AAD Konteks Transaksi (1.4019ms)
✔ SKENARIO 2 (Berhasil): Derivasi Kunci Hirarkis Menggunakan HKDF (RFC 5869) (1.0712ms)
✔ SKENARIO 3 (Berhasil): Penandatanganan & Verifikasi Integritas Izin Edar Kementan (HMAC-SHA256) (0.2463ms)
✔ SKENARIO 4 (Berhasil): Password Hashing dengan Fungsi Lambat Scrypt KDF dan Verifikasi Waktu Konstan (54.5699ms)
✔ SKENARIO 5 (Kondisi Tidak Sah / Ditolak): Modifikasi Ciphertext Ditolak (Auth Tag Mismatch) (0.6922ms)
✔ SKENARIO 6 (Kondisi Tidak Sah / Ditolak): Manipulasi AAD Konteks Transaksi Ditolak Keras (0.2261ms)
✔ SKENARIO 7 (Kondisi Tidak Sah / Ditolak): Dekripsi Menggunakan Kunci yang Salah Ditolak (0.8599ms)
✔ SKENARIO 8 (Kondisi Tidak Sah / Ditolak): Auth Tag Dipalsukan / Rusak Ditolak (0.2378ms)
ℹ tests 8 | pass 8 | fail 0 | cancelled 0 | duration_ms 64.6366
```

### Rekapitulasi Pemenuhan Ketentuan Minimum:
* **Minimal 4 skenario uji, minimal 3 berhasil**: **TERPENUHI & DILAMPAUI** (Tersedia 8 skenario: 4 skenario berhasil + 4 skenario penolakan kondisi tidak sah).
* **Data atau tag yang dimodifikasi ditolak**: **TERPENUHI** (Skenario 5 & Skenario 8 membuktikan penolakan tamper data dan tamper tag).
* **Kunci yang salah ditolak**: **TERPENUHI** (Skenario 7 membuktikan penolakan kunci salah).
* **Manipulasi AAD ditolak**: **TERPENUHI** (Skenario 6 membuktikan integritas konteks transaksi terjamin).
