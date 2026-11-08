# Laporan Pengujian Kontrol Akses (RBAC) & Fungsi Hash Lambat — AgroMarket

**Mata Kuliah**: Keamanan Siber (Pekan 6 — Sub-CPMK 3: Kontrol Akses & System Hardening)  
**Produk**: AgroMarket (Marketplace Terpadu Sarana Pertanian, Pupuk, Bibit & Pestisida)  
**Mahasiswa**: Elisabeth Nainggolan (NIM: 105224037)  
**Penanda Rilis**: `sec-0.2`  
**Tanggal Pengujian**: 8 November 2026  
**Status Pengujian**: **27 / 27 PASS (100% Berhasil)**  

---

## 1. Matriks Akses Per Peran (Role-Based Access Control / RBAC)

Sistem **AgroMarket** menerapkan prinsip *Least Privilege* dan pemisahan tugas (*Separation of Duty*) untuk melindungi integritas produk pertanian dan data petani dari manipulasi. Terdapat 4 (empat) peran utama dalam sistem:

1. **Tamu (`tamu`)**: Pengunjung publik tanpa otentikasi.
2. **Petani (`petani`)**: Akun pembeli sarana produksi tani (saprotan) terdaftar.
3. **Distributor (`distributor`)**: Kios/produsen resmi terverifikasi penyedia pupuk dan pestisida berizin.
4. **Pengawas Kementan (`pengawas`)**: Administrator dinas pertanian pengawas regulasi dan sertifikasi keamanan bahan kimia/B3.

### Tabel Matriks Hak Akses

| Sumber Daya / Operasi | Rute / Endpoint | Tamu | Petani | Distributor | Pengawas Kementan | Rujukan Risiko Tugas 1 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Katalog Publik** | `GET /katalog` | **ALLOW** (200) | **ALLOW** (200) | **ALLOW** (200) | **ALLOW** (200) | — |
| **Detail Produk** | `GET /katalog/[id]` | **ALLOW** (200) | **ALLOW** (200) | **ALLOW** (200) | **ALLOW** (200) | — |
| **Tambah Produk Katalog** | `POST /katalog/tambah` | **DENY** (401) | **DENY** (403) | **ALLOW** (201)* | **ALLOW** (201) | `T-10`, `R-03` |
| **Ubah/Hapus Produk Toko** | `PUT /katalog/[id]` | **DENY** (401) | **DENY** (403) | **ALLOW (Milik)**<br>**DENY (IDOR)** | **ALLOW** (200) | `R-01`, `T-10` |
| **Buat Pesanan Saprotan** | `POST /order` | **DENY** (401) | **ALLOW** (201) | **DENY** (403) | **DENY** (403) | `T-02`, `T-10` |
| **Lihat Rincian Pesanan** | `GET /order/[id]` | **DENY** (401) | **ALLOW (Milik)**<br>**DENY (IDOR)** | **ALLOW (Toko)**<br>**DENY (Lain)** | **ALLOW** (200) | `R-02`, `T-07` |
| **Kirim Ulasan & Rating** | `POST /api/ulasan` | **DENY** (401) | **ALLOW** (201) | **DENY** (403) | **DENY** (403) | `T-03`, `T-10` |
| **Verifikasi Izin Kementan** | `POST /api/katalog/[id]/verifikasi` | **DENY** (401) | **DENY** (403) | **DENY** (403) | **ALLOW** (200) | `R-03`, `T-01` |
| **Karantina Produk Ilegal** | `POST /api/katalog/[id]/karantina` | **DENY** (401) | **DENY** (403) | **DENY** (403) | **ALLOW** (200) | `R-03`, `T-04` |
| **Akses Audit Log Forensik** | `GET /api/security/audit-log` | **DENY** (401) | **DENY** (403) | **DENY** (403) | **ALLOW** (200) | `R-02`, `T-08` |

*\*Distributor wajib memiliki status verifikasi izin usaha tani resmi.*

---

## 2. Rincian Pengujian Akses (12 Positif & 12 Negatif)

> **Kepatuhan Checklist**: Jumlah uji akses negatif (**12 uji penolakan**) dirancang **sama banyaknya** dengan uji akses positif (**12 uji perizinan**).

### A. 12 Uji Akses Positif (Akses Sah Diizinkan)

| Kode Uji | Peran | Skenario Akses Sah | Status Diharapkan | Hasil Uji | Keterangan |
| :---: | :---: | :--- | :---: | :---: | :--- |
| **POS-01** | `Tamu` | Mengakses halaman katalog produk sarana tani (`GET /katalog`) | `200 OK` | **PASS** | Akses publik diizinkan tanpa sesi |
| **POS-02** | `Tamu` | Melihat detail dosis & izin produk pupuk NPK (`GET /katalog/1`) | `200 OK` | **PASS** | Edukasi publik sarana produksi |
| **POS-03** | `Petani` | Mengakses katalog belanja saprotan (`GET /katalog`) | `200 OK` | **PASS** | Akun tani dapat menjelajah katalog |
| **POS-04** | `Petani` | Mengirim ulasan & testimoni produk yang dibeli (`POST /api/ulasan`) | `201 Created` | **PASS** | Konsumen berhak mengulas barang |
| **POS-05** | `Petani` | Melakukan checkout pesanan pupuk bersubsidi (`POST /order`) | `201 Created` | **PASS** | Petani sah membuat pesanan |
| **POS-06** | `Petani` | Melihat data rincian pesanan miliknya sendiri (`GET /order/ORD-001`) | `200 OK` | **PASS** | Verifikasi kepemilikan data sah |
| **POS-07** | `Distributor` | Membuka formulir pendaftaran komoditas kios (`GET /katalog/tambah`) | `201 Created` | **PASS** | Formulir dapat diakses penjual |
| **POS-08** | `Distributor` | Menerbitkan pupuk berizin edar resmi (`POST /katalog/tambah`) | `201 Created` | **PASS** | Distributor resmi menerbitkan produk |
| **POS-09** | `Distributor` | Memperbarui stok produk milik kiosnya sendiri (`PUT /katalog/101`) | `200 OK` | **PASS** | Hak kepemilikan produk tervalidasi |
| **POS-10** | `Pengawas` | Mengakses log audit forensik keamanan (`GET /api/security/audit-log`) | `200 OK` | **PASS** | Petugas berhak mengaudit sistem |
| **POS-11** | `Pengawas` | Memverifikasi nomor registrasi izin Kementan (`POST /api/katalog/101/verifikasi`) | `200 OK` | **PASS** | Otoritas legalisasi izin edar sah |
| **POS-12** | `Pengawas` | Membekukan (karantina) racun serangga ilegal (`POST /api/katalog/999/karantina`) | `200 OK` | **PASS** | Intervensi pengamanan publik aktif |

### B. 12 Uji Akses Negatif (Akses Tidak Sah Ditolak)

| Kode Uji | Peran | Skenario Percobaan Akses Tidak Sah | Ref. Risiko | Status Diharapkan | Hasil Uji | Mekanisme Penolakan |
| :---: | :---: | :--- | :---: | :---: | :---: | :--- |
| **NEG-01** | `Tamu` | Menerbitkan produk tanpa kredensial login (`POST /katalog/tambah`) | `T-10` | `401 Unauthorized` | **PASS** | Ditolak middleware otentikasi |
| **NEG-02** | `Tamu` | Checkout pesanan bahan berbahaya tanpa akun (`POST /order`) | `T-02` | `401 Unauthorized` | **PASS** | Mewajibkan verifikasi NIK tani |
| **NEG-03** | `Tamu` | Membuka rekap log audit forensik (`GET /api/security/audit-log`) | `R-02` | `401 Unauthorized` | **PASS** | Endpoint tertutup untuk publik |
| **NEG-04** | `Petani` | Menerbitkan produk ke katalog nasional (`POST /katalog/tambah`) | `T-10` | `403 Forbidden` | **PASS** | Hak penerbitan hanya untuk distributor |
| **NEG-05** | `Petani` | Mengubah harga/stok toko distributor (`PUT /katalog/101`) | `R-01` | `403 Forbidden` | **PASS** | Parameter tampering dicegah di server |
| **NEG-06** | `Petani` | Menyetujui nomor izin edar Kementan (`POST /api/katalog/101/verifikasi`) | `R-03` | `403 Forbidden` | **PASS** | Hak otorisasi terbatas pada pengawas |
| **NEG-07** | `Petani` | **Serangan IDOR**: Membaca pesanan/PII petani lain (`GET /order/ORD-002`) | `R-02` | `403 Forbidden` | **PASS** | Validasi kepemilikan sesi (`userId !== ownerId`) |
| **NEG-08** | `Distributor` | Memanipulasi ulasan/rating pada produk kios sendiri (`POST /api/ulasan`) | `T-03` | `403 Forbidden` | **PASS** | Blokir konflik kepentingan (*Anti-Shill*) |
| **NEG-09** | `Distributor` | **Cross-Tenant IDOR**: Mengubah produk distributor lain (`PUT /katalog/202`) | `R-01` | `403 Forbidden` | **PASS** | Isolasi tenant kios antar-distributor |
| **NEG-10** | `Distributor` | Menyetujui mandiri izin produk sendiri (`POST /api/katalog/101/verifikasi`) | `R-03` | `403 Forbidden` | **PASS** | Self-approval dilarang keras |
| **NEG-11** | `Distributor` | Membaca log transaksi rahasia server (`GET /api/security/audit-log`) | `R-02` | `403 Forbidden` | **PASS** | Penolakan asas least-privilege |
| **NEG-12** | `Pengawas` | Akun pengawas dinas bertransaksi komersial (`POST /order`) | `T-10` | `403 Forbidden` | **PASS** | *Separation of Duty* akun birokrasi |

---

## 3. Bukti Implementasi Fungsi Hash Lambat (Slow Hash KDF)

Sesuai rubrik evaluasi, sistem AgroMarket menggunakan **Scrypt Key Derivation Function (KDF)** berbasis `node:crypto` dengan parameter komputasi intensif (*CPU & Memory Hard*) untuk menyimpan kata sandi pengguna.

### A. Parameter Derivasi Kriptografis
* **Algoritma**: Scrypt KDF (RFC 7914 / NIST SP 800-132)
* **Cost Parameter ($N$)**: $16.384$ ($2^{14}$) — iterasi komputasi memori berat
* **Block Size ($r$)**: $8$ (1024 bytes per mixing block)
* **Parallelization ($p$)**: $1$ (jalur tunggal per hash)
* **Salt Kriptografis**: 16-byte (128-bit) CSPRNG per akun (`crypto.randomBytes(16)`)
* **Derived Key Length**: 64-byte (512-bit) output hex
* **Batas Maksimum Input (Mitigasi DoS R-04)**: 72 karakter (mencegah *Hash Bomb* / DoS exhaust memori Node.js)

### B. Benchmark Ketahanan Komputasi (Slow Hash vs Fast Hash)

Pengujian benchmark dijalankan secara lokal pada runtime produk AgroMarket:

| Fungsi Hash | Kategori | Waktu Rata-rata per Hash | Ketahanan Brute-Force (GPU/ASIC) | Evaluasi Keamanan |
| :--- | :--- | :---: | :---: | :--- |
| **MD5** | Fast Hash | **0.0051 ms** | Sangat Rentan (> 1 Milyar hash/detik) | **DILARANG** (Telah usang) |
| **SHA-256** | Fast Hash | **0.0069 ms** | Rentan (~500 Juta hash/detik) | **TIDAK COCOK** untuk Password |
| **Scrypt KDF** ($N=16384, r=8, p=1$) | **Slow Hash** | **26.20 ms** | **Sangat Kuat (~38 hash/detik/core)** | **STANDAR RESMI AGROMARKET** |

> **Analisis Bukti**: Fungsi Scrypt KDF terbukti **3.797 kali lebih lambat** daripada fast-hash SHA-256. Komputasi lambat ini secara eksponensial menggagalkan serangan *offline dictionary attack* dan *GPU rainbow-table clustering* tanpa mengorbankan kenyamanan login pengguna manusia (latensi < 30 ms tidak terasa oleh pengguna).

### C. Bukti Rekapitulasi Akun Uji Tanpa Membuka Data Pengguna Nyata (Masked Evidence)

Penyimpanan kredensial disajikan menggunakan prinsip **Zero-Knowledge Masking**: nilai plaintext kata sandi pengguna asli **tidak pernah disimpan maupun dicatat di log server**. Hanya hash terderivasi dan salt terpotong yang terdokumentasi:

```
========================================================================================
BUKTI VERIFIKASI HASH KREDENSIAL AGROMARKET (MASKED PRIVACY AUDIT RECORD)
========================================================================================
[1] Akun Uji Petani:
    User ID            : USR-AGRO-PETANI-01
    Peran (RBAC)       : petani
    Algoritma          : Scrypt KDF (N=16384, r=8, p=1, maxmem=32MB)
    Salt Kriptografis  : 4a7f9c...8e1c (16 byte CSPRNG, MASKED)
    Derived Hash (512b): e7207738d45fab02928b...31f57484af1751f9f676 (64 byte Hex, MASKED)
    Plaintext Password : [REDACTED / DIRAHSIAKAN / TIDAK PERNAH DISIMPAN]
    Status Verifikasi  : Validasi Konstan-Waktu (crypto.timingSafeEqual) PASS

[2] Akun Uji Distributor:
    User ID            : USR-AGRO-DIST-01
    Peran (RBAC)       : distributor
    Algoritma          : Scrypt KDF (N=16384, r=8, p=1, maxmem=32MB)
    Salt Kriptografis  : b2d81e...90af (16 byte CSPRNG, MASKED)
    Derived Hash (512b): 8f3c1a9904e287fa01cc...59d3e8401cbb109a24ef (64 byte Hex, MASKED)
    Plaintext Password : [REDACTED / DIRAHSIAKAN / TIDAK PERNAH DISIMPAN]
    Status Verifikasi  : Validasi Konstan-Waktu (crypto.timingSafeEqual) PASS

[3] Akun Uji Pengawas:
    User ID            : USR-AGRO-PENGAWAS-01
    Peran (RBAC)       : pengawas
    Algoritma          : Scrypt KDF (N=16384, r=8, p=1, maxmem=32MB)
    Salt Kriptografis  : 91c4e7...33f8 (16 byte CSPRNG, MASKED)
    Derived Hash (512b): c34091abff891024de71...ab90431feec782019912 (64 byte Hex, MASKED)
    Plaintext Password : [REDACTED / DIRAHSIAKAN / TIDAK PERNAH DISIMPAN]
    Status Verifikasi  : Validasi Konstan-Waktu (crypto.timingSafeEqual) PASS
========================================================================================
```

---

## 4. Hasil Eksekusi Uji Otomatis Lengkap

Uji otomatis dijalankan langsung di mesin menggunakan Test Runner resmi Node.js (`node test/access-control.test.mjs`):

```bash
$ npm test

> agromarket@0.1.0 test
> node test/crypto.test.mjs && node test/access-control.test.mjs

✔ SKENARIO 1 (Positif): Enkripsi & Dekripsi Data Pribadi Pemesan (AES-256-GCM) (1.1812ms)
✔ SKENARIO 2 (Positif): Password Hashing & Verifikasi Kredensial Pengguna (Scrypt) (51.0913ms)
✔ SKENARIO 3 (Positif): Penandatanganan & Verifikasi Integritas Izin Edar Kementan (HMAC-SHA256) (0.365ms)
✔ SKENARIO 4 (Negatif / Uji Batas): Deteksi Manipulasi Data Ciphertext / Tampering (AES-GCM Auth Tag Failure) (0.5291ms)
✔ SKENARIO 5 (Negatif / Uji Batas): Penolakan Password Salah & Data Izin Edar Palsu (52.855ms)
ℹ tests 5 | pass 5 | fail 0 | duration_ms 111.2234

✔ POS-01: [Tamu] Akses katalog publik (GET /katalog) (2.012ms)
✔ POS-02: [Tamu] Melihat rincian produk (GET /katalog/1) (0.1176ms)
✔ POS-03: [Petani] Akses katalog belanja pertanian (GET /katalog) (0.0809ms)
✔ POS-04: [Petani] Mengirim ulasan & rating produk yang dibeli (POST /api/ulasan) (0.0939ms)
✔ POS-05: [Petani] Membuat pesanan pupuk resmi (POST /order) (0.113ms)
✔ POS-06: [Petani] Melihat data rekap pesanan miliknya sendiri (GET /order/ORD-001) (0.0753ms)
✔ POS-07: [Distributor] Mengakses formulir tambah produk (GET /katalog/tambah) (0.0707ms)
✔ POS-08: [Distributor] Menerbitkan produk sarana tani berizin (POST /katalog/tambah) (0.0651ms)
✔ POS-09: [Distributor] Mengupdate stok produk miliknya sendiri (PUT /katalog/101) (0.1034ms)
✔ POS-10: [Pengawas] Mengakses log audit forensik keamanan (GET /api/security/audit-log) (0.1374ms)
✔ POS-11: [Pengawas] Memverifikasi nomor izin edar Kementan (POST /api/katalog/101/verifikasi) (0.0926ms)
✔ POS-12: [Pengawas] Membekukan/karantina obat racun ilegal tanpa izin (POST /api/katalog/999/karantina) (0.0884ms)
✔ NEG-01: [Tamu] Menambah produk tanpa login ditolak 401 (POST /katalog/tambah) [Ref: T-10] (0.1533ms)
✔ NEG-02: [Tamu] Checkout pesanan B3 tanpa identitas ditolak 401 (POST /order) [Ref: T-02] (0.0896ms)
✔ NEG-03: [Tamu] Akses audit log keamanan tanpa sesi ditolak 401 (GET /api/security/audit-log) [Ref: R-02] (0.0484ms)
✔ NEG-04: [Petani] Menerbitkan produk ke katalog nasional ditolak 403 (POST /katalog/tambah) [Ref: T-10] (0.0421ms)
✔ NEG-05: [Petani] Mengubah harga/stok produk distributor ditolak 403 (PUT /katalog/101) [Ref: R-01] (0.0704ms)
✔ NEG-06: [Petani] Menyetujui izin edar Kementan ditolak 403 (POST /api/katalog/101/verifikasi) [Ref: R-03] (0.0619ms)
✔ NEG-07: [Petani] IDOR Attack: Membuka pesanan/PII petani lain ditolak 403 (GET /order/ORD-002) [Ref: R-02] (0.0605ms)
✔ NEG-08: [Distributor] Rekayasa ulasan pada produk toko ditolak 403 (POST /api/ulasan) [Ref: T-03] (0.0372ms)
✔ NEG-09: [Distributor] Cross-Tenant IDOR: Mengubah produk distributor lain ditolak 403 (PUT /katalog/202) [Ref: R-01] (0.0417ms)
✔ NEG-10: [Distributor] Self-Approval izin edar sendiri ditolak 403 (POST /api/katalog/101/verifikasi) [Ref: R-03] (0.0307ms)
✔ NEG-11: [Distributor] Akses audit log forensik ditolak 403 (GET /api/security/audit-log) [Ref: R-02] (0.0278ms)
✔ NEG-12: [Pengawas] Separation of Duty: Akun dinas belanja saprotan ditolak 403 (POST /order) [Ref: T-10] (0.0309ms)
✔ HASH-01: Derivasi kata sandi lambat Scrypt menghasilkan hash 512-bit & salt CSPRNG 128-bit (76.3096ms)
✔ HASH-02: Mitigasi DoS CPU Flooding (R-04/T-09) dengan penolakan input > 72 karakter (0.428ms)
✔ HASH-03: Benchmark fungsi hash membuktikan komputasi lambat tahan brute-force (84.048ms)
ℹ tests 27 | pass 27 | fail 0 | duration_ms 170.2179
```

---

## 5. Kesimpulan Evaluasi Sub-CPMK 3 Bagian 1

1. **Seluruh akses tidak sah berhasil ditolak (100% Negative Pass)** dengan kode status HTTP `401 Unauthorized` atau `403 Forbidden`, membuktikan isolasi antar-pengguna dan pencegahan IDOR efektif.
2. **Keseimbangan Uji**: Uji negatif (12 kasus) sama banyaknya dengan uji positif (12 kasus), memenuhi kriteria pengujian komprehensif.
3. **Penyimpanan Kredensial Lambat Terbukti**: Menggunakan Scrypt KDF ($N=16384, r=8, p=1$), CSPRNG salt 16-byte, serta verifikasi waktu konstan, dibuktikan tanpa membuka plaintext kata sandi pengguna nyata.
