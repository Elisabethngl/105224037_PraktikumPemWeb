# AgroMarket - Platform Marketplace Sarana Pertanian, Pupuk & Pestisida Terpadu

Proyek aplikasi web terintegrasi untuk mata kuliah **Pengembangan Aplikasi Web**, **Kriptografi**, dan **Keamanan Siber**.

* **Nama Mahasiswa**: Elisabeth Nainggolan
* **NIM**: 105224037
* **Repository**: [105224037_PraktikumPemWeb](https://github.com/Elisabethngl/105224037_PraktikumPemWeb.git)
* **Versi Rilis / Tag Kriptografi**: `v0.2` (Tugas 1: `v0.1`)
* **Versi Rilis / Tag Keamanan Siber**: `sec-0.2` (Tugas 1: `sec-0.1`)

---

## 1. DESKRIPSI PRODUK
**AgroMarket** adalah ekosistem marketplace sarana produksi pertanian modern yang menghubungkan petani secara langsung dengan distributor resmi pupuk, benih unggul, dan obat racun hama (pestisida/fungisida/herbisida) berizin edar resmi Kementerian Pertanian RI.

### Masalah yang Diselesaikan:
1. **Peredaran Pupuk & Pestisida Oplosan/Palsu**: Memastikan hanya produk terdaftar Kementan RI yang dapat diperjualbelikan dengan verifikasi nomor registrasi.
2. **Minimnya Edukasi Takaran Dosis & Bahaya Kimia**: Menyediakan panduan takaran dosis aplikasi semprot dan peringatan APD di setiap halaman produk.
3. **Ketimpangan Harga**: Menyediakan widget transparansi harga komoditas dan pupuk harian secara real-time.

---

## 2. FITUR UTAMA & ARSITEKTUR 3 HALAMAN (MILESTONE 1 PEMWEB)
Aplikasi dibangun menggunakan **Next.js (App Router), React, TypeScript, dan Tailwind CSS** dengan arsitektur 3 halaman utama:

1. **Halaman Beranda & Katalog (`/`)**:
   - Hero banner promosi dan edukasi SOP keselamatan pestisida.
   - Ticker pantau harga pasar komoditas harian (NPK, Urea, Cabai, Bawang, Gabah).
   - Pencarian instan dan filter kategori (Pupuk Tani, Obat Racun & Hama, Benih Unggul, Alat Pertanian).
   - Grid kartu produk modular.
2. **Halaman Detail Produk & Dosis Keamanan (`/detail`)**:
   - Informasi teknis produk, nomor izin pendaftaran Kementan RI, dan asal daerah.
   - Panduan takaran dosis aplikasi semprot dan bahan aktif.
   - Kotak peringatan bahaya bahan kimia beracun.
3. **Halaman Formulir Pemesanan & Validasi (`/order`)**:
   - Pemilihan produk dinamis dan penghitungan subtotal harga otomatis.
   - **Client-Side Validation (Validasi Sisi Klien)**: Validasi ketat pada nama lengkap, format email valid, nomor WhatsApp aktif Indonesia, kelengkapan alamat minimal 10 karakter, serta batas kuantitas stok.
   - Kotak persetujuan wajib kepatuhan SOP pestisida pertanian.
   - Modal konfirmasi hasil verifikasi pesanan.

---

## 3. KOMPONEN REUSABLE
Aplikasi mengembangkan **6 komponen antarmuka yang dapat digunakan ulang**:
1. `Navbar`: Header navigasi semantik, logo, pencarian, dan keranjang belanja.
2. `Footer`: Informasi kontak, panduan legalitas, dan SOP racun pertanian.
3. `ProductCard`: Kartu produk modular dengan badge legalitas, foto, harga, rating, dan tombol aksi.
4. `Badge`: Label status fleksibel multi-warna (Organik, Terdaftar Kementan, Promo).
5. `Button`: Komponen tombol terstandar dengan ragam varian (`primary`, `secondary`, `outline`, `danger`).
6. `InputField`: Input formulir aksesibel (`aria-invalid`, `aria-describedby`) dengan penanda error dinamis.

---

## 4. FONDASI DAN KOMPONEN KRIPTOGRAFI (TUGAS 1 KRIPTOGRAFI - TAG v0.1)

### A. Tabel Kebutuhan Kriptografi Produk
Sesuai analisis ancaman keamanan pada produk AgroMarket, ditetapkan 3 data kritis yang dilindungi:

| No | Data Kritis Produk | Tujuan Keamanan (CIA Triad) | Algoritma Kriptografi Modern | Prioritas |
| :---: | :--- | :--- | :--- | :---: |
| 1 | **Data Pribadi Pemesan** (Nama Lengkap, Nomor Telepon, Alamat Pengiriman Lahan) | **Confidentiality & Integrity** | **AES-256-GCM** (CSPRNG IV 12-byte, 128-bit Auth Tag) | **Tinggi (High)** |
| 2 | **Kredensial Akun** (Password Akun Petani & Kios Distributor) | **Authentication & Integrity** | **Scrypt KDF** (N=16384, r=8, p=1, Salt CSPRNG 16-byte) | **Kritis (Critical)** |
| 3 | **Izin Edar Pestisida** (Nomor Registrasi Kementan RI) | **Integrity & Authenticity** | **HMAC-SHA256** (Secret key distributor) | **Tinggi (High)** |

---

## 5. ENKRIPSI TERAUTENTIKASI (AEAD), INTEGRITAS & HKDF (TUGAS 2 KRIPTOGRAFI - TAG v0.2)

Pada milestone **`v0.2`**, seluruh arsitektur kriptografi diperkuat sesuai standar **NIST SP 800-38D**, **RFC 5869 (HKDF)**, dan prinsip **Gagal Tertutup (*Fail-Closed*)**.

### A. Matriks Keputusan: Kebutuhan $\rightarrow$ Mekanisme $\rightarrow$ Alasan
Dokumentasi lengkap tertuang pada [KEPUTUSAN.md](KEPUTUSAN.md):
* **Data Pesanan & PII Petani** $\rightarrow$ **AEAD AES-256-GCM dengan AAD**: Mengikat metadata transaksi (`orderId`, `userId`, `timestamp`) ke dalam tag autentikasi untuk mematikan serangan *Context Transposition* dan *Replay Attack*.
* **Izin Edar Pupuk/Pestisida** $\rightarrow$ **HMAC-SHA256**: Membuktikan keaslian asal dan mencegah pemalsuan formula racun kimia berbahaya tanpa terkena *Length Extension Attack*.
* **Manajemen Kunci Terpusat** $\rightarrow$ **HKDF (RFC 5869)**: Menghindari celah *key reuse* dengan menurunkan sub-kunci domain pesanan dan lisensi dari satu Master Key luar.
* **Penyimpanan Kredensial Tahan Brute-Force** $\rightarrow$ **Scrypt KDF (Slow Hash)**: Memory-hard ($N=16384$) menghentikan serangan kamus berbasis GPU/ASIC.

### B. Parameter Terdokumentasi
* **Panjang Kunci**: 256-bit (32 byte) CSPRNG.
* **Nonce / IV**: 96-bit (12 byte) unik per enkripsi.
* **Additional Authenticated Data (AAD)**: Mengikat metadata konteks transaksi.
* **Authentication Tag**: 128-bit (16 byte) Galois Field GMAC tag.
* **Penyimpanan Kunci di Luar Repositori**: Disimpan pada berkas `.env.local` (variabel `AGROMARKET_MASTER_KEY`), dilindungi `.gitignore` sehingga bebas dari kunci rahasia publik di GitHub.

### C. Bukti Pengujian Otomatis (8 Skenario Lengkap: 4 Berhasil + 4 Fail-Closed Ditolak)

Jalankan perintah pengujian:
```bash
npm test
```

![Bukti Pengujian Kriptografi AEAD v0.2](docs/hasil%20screenshot/uji-kriptografi-aead-v0.2.png)

| Skenario | Kategori | Kondisi Pengujian | Hasil | Respons Keamanan |
| :---: | :---: | :--- | :---: | :--- |
| **SKENARIO 1** | Berhasil | Enkripsi & Dekripsi AEAD AES-256-GCM + AAD Konteks Transaksi | **PASS** | Ciphertext terdekripsi sempurna (1.37ms) |
| **SKENARIO 2** | Berhasil | Derivasi Sub-Kunci Hirarkis Menggunakan HKDF (RFC 5869) | **PASS** | Domain separation kunci order & lisensi berhasil |
| **SKENARIO 3** | Berhasil | Verifikasi Integritas Izin Edar Kementan (HMAC-SHA256) | **PASS** | Nomor izin edar asli tervalidasi sah (0.24ms) |
| **SKENARIO 4** | Berhasil | Password Hashing Scrypt KDF & Verifikasi Waktu Konstan | **PASS** | Kredensial terotentikasi konstan waktu |
| **SKENARIO 5** | Ditolak | **Modifikasi Ciphertext (Tampering)** | **PASS** | Ditolak keras (Auth Tag Mismatch - Fail-Closed) |
| **SKENARIO 6** | Ditolak | **Manipulasi Metadata AAD Konteks Transaksi** | **PASS** | Ditolak keras (Integritas konteks gagal) |
| **SKENARIO 7** | Ditolak | **Dekripsi dengan Kunci yang Salah (Wrong Key)** | **PASS** | Ditolak tanpa kebocoran plaintext |
| **SKENARIO 8** | Ditolak | **Pemalsuan / Kerusakan Auth Tag Galois** | **PASS** | Ditolak seketika oleh cipher engine |

*Panduan peragaan ujian lisan ±3 menit tersedia pada [DEMONSTRASI.md](DEMONSTRASI.md).*

---

## 6. KONTROL AKSES (RBAC) & SYSTEM HARDENING (TUGAS 2 KEAMANAN SIBER - TAG sec-0.2)

1. **Matriks Akses & Uji Akses**: 12 Uji Positif dan 12 Uji Negatif (seimbang 50%-50%) mendeteksi dan menolak seluruh akses ilegal serta serangan IDOR ([security/access-tests.md](security/access-tests.md)).
2. **Penyimpanan Hash Lambat**: Scrypt KDF terbukti 3.700× lebih lambat dari SHA-256, disajikan dengan *Zero-Knowledge Masking* tanpa membuka plaintext data pengguna nyata.
3. **Hardening VM Ubuntu**: `PasswordAuthentication no`, `PermitRootLogin no`, dan Indeks Lynis mencapai skor **78 / 100** ([lynis-after.txt](lynis-after.txt)).
4. **Hardening Container**: Non-root user (`UID 10001: nextjs`), `cap_drop: ALL`, read-only root, serta **port `app` (3000) dan `db` (5432) tidak dipublikasikan ke host**.
5. **Pemindaian Kerentanan**: Laporan Trivy mencatat **0 kerentanan CRITICAL** ([image-scan-after.txt](image-scan-after.txt)) dan SBOM standar CycloneDX 1.5 JSON ([sbom.cdx.json](sbom.cdx.json)).