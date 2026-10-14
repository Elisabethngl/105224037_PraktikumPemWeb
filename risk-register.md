## 1. Matriks Penilaian Risiko
* **Kemungkinan (Likelihood - L)**: 1 (Sangat Jarang), 2 (Jarang), 3 (Mungkin), 4 (Sering), 5 (Sangat Sering).
* **Dampak (Impact - I)**: 1 (Tidak Signifikan), 2 (Minor), 3 (Moderat), 4 (Mayor), 5 (Bencana/Kritis).
* **Tingkat Risiko (Score = L × I)**: 
  * 1–5: Rendah (Low)
  * 6–11: Sedang (Medium)
  * 12–19: Tinggi (High)
  * 20–25: Kritis (Critical)

---

## 2. Tabel Register 5 Risiko Prioritas Produk

| ID Risiko | ID Threat Terkait | Skenario Risiko Prioritas | L (1-5) | I (1-5) | Skor Risiko | Alasan Penilaian Berdasarkan Kondisi Riil Produk |
| :---: | :---: | :--- | :---: | :---: | :---: | :--- |
| **R-01** | `T-03` | **Manipulasi Harga & Kuantitas Pesanan pada Form Sisi Klien** | 4 | 4 | **16 (Tinggi)** | **Likelihood (4)**: Validasi formulir AgroMarket saat ini baru berjalan di sisi klien (React state di browser), sehingga sangat mudah di-bypass menggunakan tools seperti Postman/cURL.<br>**Impact (4)**: Merugikan finansial distributor secara langsung jika barang dikirim dengan harga salah. |
| **R-02** | `T-07` | **Kebocoran Data Pribadi Pemesan (Nama, No. WA, Alamat Lahan)** | 3 | 5 | **15 (Tinggi)** | **Likelihood (3)**: Data dikumpulkan secara berkala di form transaksi.<br>**Impact (5)**: Dampak hukum fatal (denda pelanggaran UU Perlindungan Data Pribadi) dan ancaman kejahatan penipuan fisik terhadap kelompok tani di daerah. |
| **R-03** | `T-01` | **Peredaran Pupuk & Pestisida Palsu Tanpa Izin Kementan yang Sah** | 3 | 5 | **15 (Tinggi)** | **Likelihood (3)**: Maraknya sindikat pupuk oplosan di sentra agribisnis lokal.<br>**Impact (5)**: Kerusakan permanen pada lahan pertanian petani, gagal panen total, dan risiko pidana peredaran zat kimia beracun ilegal. |
| **R-04** | `T-09` | **Eksploitasi Resource Exhaustion / DoS pada Endpoint Otentikasi** | 4 | 3 | **12 (Tinggi)** | **Likelihood (4)**: Endpoint login dan form tidak memiliki rate limiting.<br>**Impact (3)**: Fungsi Scrypt KDF yang memory-hard menghabiskan daya komputasi server Node.js sehingga transaksi terhenti selama musim tanam. |
| **R-05** | `T-06` | **Penyangkalan Transaksi Pesanan & Pelanggaran SOP APD Pestisida** | 3 | 3 | **9 (Sedang)** | **Likelihood (3)**: Petani dapat membatalkan pesanan sepihak saat kurir tiba atau menyangkal telah membaca peringatan bahaya racun.<br>**Impact (3)**: Beban biaya logistik pengembalian barang dan risiko tuntutan hukum kecelakaan kerja akibat racun kimia. |

---

## 3. Rencana Kontrol & Pemetaan Implementasi

| ID Risiko | Rencana Kontrol Keamanan (Mitigasi) | Cara Kontrol Menurunkan Risiko | Pemetaan Rencana Tugas |
| :---: | :--- | :--- | :---: |
| **R-01** | **Server-Side Validation & Server Price Re-Calculation**: Mengimplementasikan skema validasi Zod di Next.js Server Action / API Route dan menghitung ulang total harga berdasarkan database resmi, bukan nilai kiriman klien. | Menurunkan **Likelihood** ke level 1, karena manipulasi variabel DOM di browser klien akan langsung ditolak oleh server backend. | **Tugas 2 (Keamanan Aplikasi Web / Server)** |
| **R-02** | **Enkripsi At-Rest Terotentikasi & Masking Log**: Menerapkan modul `encryptCustomerData` (AES-256-GCM) sebelum data disimpan ke database, serta melarang pencatatan data PII pada terminal log server. | Menurunkan **Impact** ke level 2, karena jika database bocor, penyerang hanya mendapatkan ciphertext Base64 yang tidak dapat dibaca tanpa kunci master. | **Tugas 2 (Perlindungan Data & Database)** |
| **R-03** | **HMAC-SHA256 Product License Verification & Digital Stamp**: Setiap produk pestisida wajib memiliki tanda tangan integritas `signProductLicense` dengan kunci rahasia distributor sebelum tayang di katalog. | Menurunkan **Likelihood** ke level 1, karena perubahan nomor pendaftaran sekecil apa pun akan memicu kegagalan verifikasi integritas. | **Tugas 3 (Integritas Data & Kriptografi Lanjutan)** |
| **R-04** | **Rate Limiting & Cloudflare DDoS Shielding**: Menerapkan algoritma Sliding Window Rate Limiting (maksimal 5 request per menit per IP untuk login/scrypt). | Menurunkan **Likelihood** ke level 1, membatasi beban CPU server dari serangan flood request serentak. | **Tugas 2 (Keamanan Jaringan & Infrastruktur)** |
| **R-05** | **Cryptographic Audit Trail & IP/Timestamp Binding**: Menyimpan bukti persetujuan SOP dalam bentuk hash digital yang mengikat ID Pesanan, Alamat IP pemesan, dan stempel waktu (ISO-8601). | Menurunkan **Impact** ke level 1, menyediakan bukti forensik digital hukum yang tidak dapat disangkal (*non-repudiation*) jika terjadi sengketa. | **Tugas 3 (Audit Forensik & Akuntabilitas)** |