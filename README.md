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

---

## 7. INTEGRASI LOGIKA SERVER & DATABASE PRODUK WEB (MILESTONE 2 PEMWEB - TAG v0.2)

### A. Deskripsi Produk & Evolusi Fitur (v0.1 ke v0.2)
* **Milestone 1 (v0.1)**: Membangun fondasi antarmuka 3 halaman utama (Beranda/Katalog, Detail Produk, Form Order), 6 komponen reusable, formulir dengan validasi klien, serta mock data berbasis array in-memory.
* **Milestone 2 (v0.2)**: Mengembangkan integrasi logika server penuh dan basis data persisten:
  1. **Migrasi Data Persisten**: Mengganti mock data dengan basis data relasional **PostgreSQL 18** yang dikelola melalui **Prisma ORM 7**.
  2. **Next.js App Router Server Actions**: Seluruh operasi manipulasi data (Create, Update, Delete) diimplementasikan secara aman di sisi server menggunakan Server Actions terpusat (`app/katalog/actions.ts` dan `app/katalog/ulasan-actions.ts`).
  3. **Pemodelan Data Relasional 1:N**: Menambahkan entitas anak `Ulasan` yang berelasi dengan entitas induk `Item` dengan aturan integritas referensial ketat `onDelete: Restrict`.
  4. **Validasi Sisi Server (Zod)**: Setiap masukan formulir divalidasi ketat di sisi server sebelum menyentuh basis data dengan penanganan galat spesifik per kolom.
  5. **Unit Transaksi Atomik**: Operasi penghapusan terkoordinasi menggunakan `prisma.$transaction` untuk menjamin konsistensi data (*ACID*).

### B. Tech Stack yang Digunakan
* **Framework**: Next.js 16.4.0 (App Router, Server Components & Server Actions)
* **User Interface**: React 19, Tailwind CSS v4, Lucide React
* **Basis Data**: PostgreSQL 18
* **ORM & Database Driver**: Prisma ORM 7.10.1 (`@prisma/client`, `@prisma/adapter-pg`, driver `pg`)
* **Validasi Skema**: Zod 4
* **Bahasa**: TypeScript 5

### C. Pemodelan Data & Skema Database (Prisma 7)
* **Entitas Induk (`Item`)**:
  - Kolom: `id` (PK, Int autoincrement), `judul` (String, `@unique`), `kategori` (Enum `Kategori`), `deskripsi` (String), `tersedia` (Boolean), `gambar` (String, nullable), `dibuatPada` (DateTime default now).
* **Entitas Anak (`Ulasan`)**:
  - Kolom: `id` (PK, Int autoincrement), `nama` (String), `nilai` (Int, 1-5), `komentar` (String), `dibuatPada` (DateTime default now), `itemId` (FK references `Item(id)`).
  - **Constraint Unik Komposit**: `@@unique([itemId, nama])` memastikan seorang pengulas hanya dapat memberikan satu ulasan per produk.
  - **Integritas Referensial**: `onDelete: Restrict` melindungi data historis ulasan efektivitas obat/pupuk pertanian agar tidak terhapus secara diam-diam.

```mermaid
erDiagram
    Item ||--o{ Ulasan : "1 : N (onDelete: Restrict)"
    Item {
        Int id PK "SERIAL, AutoIncrement"
        String judul UK "Unique"
        Kategori kategori "Enum ('Pupuk Tani', 'Obat Racun & Hama', dll)"
        String deskripsi "Deskripsi produk & takaran dosis"
        Boolean tersedia "Default: true"
        DateTime dibuatPada "Default: now()"
    }
    Ulasan {
        Int id PK "SERIAL, AutoIncrement"
        Int itemId FK "References Item(id) [ON DELETE RESTRICT]"
        String nama "Nama pengulas (2-60 char)"
        Int nilai "Skor kepuasan (1 s.d. 5)"
        String komentar "Ulasan efektivitas aplikasi (5-500 char)"
        DateTime dibuatPada "Default: now()"
    }
```

### D. Rute Aplikasi & Operasi CRUD
1. **Read (Daftar & Pencarian)**: `/katalog` — Menampilkan daftar komoditas sarana pertanian dengan filter kategori dan pencarian nama.
2. **Read (Detail & Relasi Ulasan)**: `/katalog/[id]` — Menampilkan detail komoditas pertanian beserta daftar ulasan mitra tani. Parameter ID divalidasi integer positif (mencegah error, menampilkan 404 jika tidak valid).
3. **Create (Tambah Item)**: `/katalog/tambah` — Form pembuatan item baru dengan validasi server Zod dan deteksi nama ganda (P2002).
4. **Update (Ubah Item)**: `/katalog/[id]/ubah` — Form pengubahan data komoditas yang terisi otomatis (*pre-filled*) dengan data terkini dari database.
5. **Delete (Hapus Item Berelasi)**: Tombol hapus dengan konfirmasi, dieksekusi secara aman melalui unit transaksi `prisma.$transaction` (menghapus ulasan anak terlebih dahulu sebelum menghapus item induk).
6. **CRUD Ulasan**: Formulir penambahan ulasan pada halaman detail produk dengan validasi skor rating (1 s.d. 5) dan pencegahan ulasan ganda (`@@unique([itemId, nama])`).

### E. Petunjuk Menjalankan Aplikasi
1. **Clone Repositori**:
   ```bash
   git clone https://github.com/Elisabethngl/105224037_PraktikumPemWeb.git
   cd 105224037_PraktikumPemWeb
   git checkout v0.2
   ```
2. **Instalasi Dependensi**:
   ```bash
   npm install
   ```
3. **Konfigurasi Environment**:
   Salin berkas `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Sesuaikan nilai `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/agromarket?schema=public"
   ```
4. **Migrasi Database & Generate Prisma Client**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. **Seeding Data Awal Sintetis (Idempoten)**:
   ```bash
   npx prisma db seed
   ```
6. **Menjalankan Server Aplikasi**:
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui peramban di `http://localhost:3000`.

7. **Menjalankan Pengujian Otomatis 10 Skenario**:
   ```bash
   npm run test:pemweb
   ```

### F. Hasil Pengujian 10 Skenario (10/10 LULUS - 100%)
* **8 Skenario CRUD + 2 Skenario Relasi Data**:
  - TC-01: Tambah item sah $\rightarrow$ **LULUS** (Tersimpan di PostgreSQL, tampil di katalog)
  - TC-02: Tambah item judul ganda $\rightarrow$ **LULUS** (Ditolak Prisma P2002: *"Judul item sudah terdaftar"*)
  - TC-03: Tambah item judul kosong $\rightarrow$ **LULUS** (Ditolak Zod: *"Judul minimal 3 karakter"*, 0 kueri SQL)
  - TC-04: Ubah deskripsi item $\rightarrow$ **LULUS** (Tersimpan, detail produk terbarui)
  - TC-05: Ubah item yang sudah dihapus $\rightarrow$ **LULUS** (Ditolak Prisma P2025: *"Item tidak ditemukan atau sudah dihapus"*)
  - TC-06: Akses parameter `/katalog/abc` $\rightarrow$ **LULUS** (Ditolak regex/isInteger, tampil halaman 404)
  - TC-07: Hapus item beserta ulasannya $\rightarrow$ **LULUS** (Transaksi atomik sukses membersihkan data berelasi)
  - TC-08: Hapus item gagal di langkah kedua $\rightarrow$ **LULUS** (Rollback aktif: ulasan anak batal dihapus dan tetap utuh)
  - TC-09: Tambah ulasan nilai 6 $\rightarrow$ **LULUS** (Ditolak Zod: *"Nilai maksimal 5"*)
  - TC-10: Ulasan kedua nama sama $\rightarrow$ **LULUS** (Ditolak constraint unik komposit P2002: *"Nama ini sudah mengulas item ini"*)
* **3 Bukti Validasi Server**:
  1. Penolakan Judul Kosong (Zod `safeParse`: *"Judul minimal 3 karakter"*).
  2. Penolakan Judul Duplikat (Prisma P2002: *"Judul item sudah terdaftar"*).
  3. Penolakan Nilai Rating > 5 (Zod: *"Nilai maksimal 5"*) & Duplikat Pengulas (Prisma P2002 komposit: *"Nama ini sudah mengulas item ini"*).
* Bukti Transaksi Atomik & Rollback saat terjadi kegagalan sistem.
* Dokumentasi teknis lengkap dan analisis mendalam dapat dilihat pada [docs/praktikum/modul-06.md](docs/praktikum/modul-06.md).