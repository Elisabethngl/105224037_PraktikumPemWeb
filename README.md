# AgroMarket - Platform Marketplace Sarana Pertanian, Pupuk & Pestisida Terpadu

Proyek aplikasi web terintegrasi untuk mata kuliah **Pengembangan Aplikasi Web** dan **Kriptografi**.

* **Nama Mahasiswa**: Elisabeth Nainggolan
* **NIM**: 105224037
* **Repository**: [105224037_PraktikumPemWeb](https://github.com/Elisabethngl/105224037_PraktikumPemWeb.git)
* **Versi Rilis / Tag Kriptografi**: `v0.1`

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
Sesuai analisis ancaman keamanan pada produk AgroMarket, ditetapkan 3 data kritis yang wajib dilindungi dengan kriptografi modern:

| No | Data Kritis Produk | Tujuan Keamanan (CIA Triad) | Algoritma Kriptografi Modern | Prioritas |
| :---: | :--- | :--- | :--- | :---: |
| 1 | **Data Pribadi Pemesan** (Nama Lengkap, Nomor Telepon, Alamat Pengiriman Lahan) | **Confidentiality & Integrity** (Kerahasiaan data pribadi petani agar tidak disalahgunakan pihak ketiga & deteksi sabotase rute pengiriman) | **AES-256-GCM** (Galois/Counter Mode terotentikasi, CSPRNG IV 12-byte, 128-bit Auth Tag) | **Tinggi (High)** |
| 2 | **Kredensial Akun** (Password Akun Petani & Kios Distributor) | **Authentication & Integrity** (Mencegah pencurian akun, serangan kamus, dan rainbow table attack) | **Scrypt KDF** (Memory-hard key derivation function, parameter N=16384, r=8, p=1, Salt CSPRNG 16-byte) | **Sangat Tinggi (Critical)** |
| 3 | **Izin Edar Pestisida** (Nomor Registrasi Kementan RI & Efikasi Pupuk) | **Integrity & Authenticity** (Membuktikan keaslian nomor registrasi produk dan mencegah manipulasi data efikasi racun) | **HMAC-SHA256** (Hash-based Message Authentication Code dengan secret key distributor) | **Tinggi (High)** |

> *Catatan*: Sandi klasik (seperti Caesar, Vigenère, atau Substitution cipher) **TIDAK DIGUNAKAN** karena rentan terhadap analisis frekuensi dan tidak memenuhi standar keamanan produk digital modern.

---

### B. Rancangan Komponen Kriptografi Dasar
Modul diimplementasikan pada file `lib/agroCrypto.ts` menggunakan pustaka resmi terpelihara **`node:crypto`** (OpenSSL engine):

1. **Masukan - Proses - Keluaran**:
   - **Enkripsi Data Pemesan**:
     - *Masukan*: Plaintext data pribadi (string) + Kunci Simetris 256-bit (Buffer).
     - *Proses*: Enkripsi simetris AES-256-GCM dengan *Initialization Vector* unik 12-byte dan kalkulasi Authentication Tag 16-byte.
     - *Keluaran*: Objek enkripsi berformat `{ ciphertext, iv, authTag }`.
   - **Password Hashing**: