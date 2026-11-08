# AI LOG: Catatan Penggunaan Alat Bantu AI

* **Nama Produk**: AgroMarket
* **Mata Kuliah**: Kriptografi (Terintegrasi Pengembangan Aplikasi Web)
* **Tugas**: Tugas 1 — Fondasi dan Komponen Dasar Kriptografi
* **Pekan**: Pekan 3 (Tag v0.1)

---

## 1. Alat AI yang Digunakan
* **Model AI**: Antigravity Assistant (Google DeepMind)
* **Tujuan**: Konsultasi perancangan arsitektur kebutuhan keamanan data produk, penentuan standar algoritma kriptografi modern (rekomendasi NIST/OWASP), dan pembuatan skenario pengujian otomatis.

---

## 2. Rincian Prompt dan Interaksi

### Sesi 1: Analisis Kebutuhan Kriptografi Produk
* **Prompt Mahasiswa**:  
  *"Bantu saya menetapkan kebutuhan kriptografi untuk marketplace pertanian AgroMarket, mencakup data pribadi pemesan, password akun, dan nomor registrasi pupuk/pestisida Kementan."*
* **Hasil Saran AI**:  
  AI merekomendasikan tabel kebutuhan dengan 3 data kritis:
  1. Data Pribadi Pemesan (Confidentiality & Integrity) $\rightarrow$ AES-256-GCM.
  2. Password Pengguna (Authentication) $\rightarrow$ Scrypt KDF dengan Salt CSPRNG 16-byte.
  3. Nomor Registrasi Izin Kementan (Integrity & Non-repudiation) $\rightarrow$ HMAC-SHA256.
* **Tindakan & Validasi Mandiri**:  
  Mahasiswa memeriksa kesesuaian algoritma tersebut dengan silabus perkuliahan dan memastikan tidak memakai sandi klasik (seperti Caesar/Vigenere) untuk perlindungan data produk.

### Sesi 2: Perancangan Kode & Pengujian Otomatis
* **Prompt Mahasiswa**:  
  *"Buatkan rancangan komponen kriptografi menggunakan pustaka resmi Node.js crypto beserta minimal 4 skenario uji otomatis dengan minimal 1 uji negatif/batas."*
* **Hasil Saran AI**:  
  AI menyusun fungsi `encryptCustomerData`, `decryptCustomerData`, `hashPassword`, `verifyPassword`, dan `signProductLicense` serta 5 skenario test runner.
* **Tindakan & Validasi Mandiri**:  
  Mahasiswa menguji langsung pada terminal menggunakan perintah `npm test` dan memverifikasi bahwa pengujian negatif berhasil menangkap *tampered ciphertext* melalui Galois Authentication Tag failure.

---

## 3. Kebijakan Privasi dan Kunci Rahasia
* **Bebas Data Sensitif Nyata**: Tidak ada kunci privat asli, token produksi, kata sandi pengguna nyata, maupun data pribadi yang disimpan di dalam repositori ini.
* **Data Sintetis**: Seluruh data nama petani, alamat pengiriman, dan nomor lisensi yang digunakan dalam modul pengujian merupakan data tiruan (sintetis).

---

### Sesi 3: Pemodelan Ancaman STRIDE & Register Risiko (Tugas Keamanan Komputasi dan Siber)
* **Prompt saya**:  
  *"Bantu saya melakukan analisis ancaman STRIDE pada produk marketplace pertanian AgroMarket, membuat DFD dengan 2 trust boundary dan aset kriptografi, serta menyusun register risiko dengan 5 risiko prioritas dan rencana kontrol terpetakan ke Tugas 2/3."*
* **Saran dari AI**:  
  AI menyusun dokumen `asset-inventory.md`, diagram `dfd.md` (format Mermaid dengan TB-01 dan TB-02), 10 ancaman STRIDE spesifik produk di `threat-model.md`, serta penilaian risiko L×I dan rencana kontrol di `risk-register.md`.
* **Tindakan & Validasi Mandiri**:  
  Mahasiswa memastikan setiap ancaman mengacu pada elemen DFD dan aset riil AgroMarket (tidak menggunakan ancaman generik), memvalidasi keterkaitan kontrol dengan modul kriptografi AES/HMAC yang telah dibuat, serta memastikan repositori tidak memuat kunci rahasia nyata.

---

### Sesi 4: Enkripsi Terautentikasi (AEAD) AES-256-GCM, HKDF, dan Penyusunan KEPUTUSAN.md (Tugas 2 Kriptografi — Milestone v0.2)
* **Alat AI**: Antigravity Assistant (Google DeepMind)
* **Tujuan**:
  1. Merancang modul Enkripsi Terautentikasi (AEAD) menggunakan AES-256-GCM dengan AAD terikat konteks transaksi saprotan.
  2. Mengimplementasikan fungsi derivasi sub-kunci hirarkis HKDF (RFC 5869).
  3. Menyusun dokumen keputusan arsitektur `KEPUTUSAN.md` berformat *kebutuhan $\rightarrow$ mekanisme $\rightarrow$ alasan*.
  4. Merancang minimal 4 skenario uji (3 berhasil + kondisi tidak sah ditolak secara gagal tertutup).
  5. Menyiapkan panduan demonstrasi individual $\pm$ 3 menit pada pekan 6.
* **Ringkasan Perintah (Prompt Mahasiswa)**:
  *"Tolong selesaikan Tugas 2 Kriptografi untuk produk AgroMarket sesuai ketentuan minimum dan rubrik R2 (100 poin): buat dokumen KEPUTUSAN.md (kebutuhan -> mekanisme -> alasan), implementasikan AEAD AES-256-GCM dengan AAD dan HKDF RFC 5869, pastikan kunci disimpan di luar repo, buat minimal 4 skenario uji dengan respons gagal tertutup saat data/tag/kunci dimanipulasi, update AI_LOG.md, dan siapkan tag v0.2."*
* **Bagian yang Dipakai / Diubah**:
  1. `lib/agroCrypto.ts`: Penambahan fungsi `encryptAEAD`, `decryptAEAD` (dengan AAD & fail-closed error handling), dan `deriveSubKey` (HKDF RFC 5869).
  2. `test/crypto.test.mjs`: Pembaruan test suite menjadi 8 skenario pengujian komprehensif (4 uji positif berhasil + 4 uji negatif penolakan fail-closed pada modifikasi data, modifikasi AAD, manipulasi auth tag, dan kunci salah).
  3. `KEPUTUSAN.md`: Penyusunan dokumen ADR kriptografi lengkap dengan pohon keputusan, parameter formal (panjang kunci 256-bit, nonce 96-bit CSPRNG, tag 128-bit, AAD), dan mitigasi risiko produk riil.
  4. `DEMONSTRASI.md`: Panduan peragaan teknis $\pm$ 3 menit termasuk penunjukan lokasi kunci di `.env.local` dan eksekusi uji otomatis.
* **Cara Memeriksa & Validasi Mandiri**:
  1. Menjalankan test runner bawaan Node.js melalui perintah `npm test` di terminal lokal dan memastikan seluruh 8 skenario kriptografi lolos (`8 pass, 0 fail`).
  2. Memeriksa integritas berkas `.gitignore` untuk menjamin kunci master `.env*` tidak pernah terlacak (*untracked*) atau ter-commit ke dalam repositori GitHub.
  3. Menguji manual penolakan *fail-closed* saat byte ciphertext diubah secara lokal.
  4. Memverifikasi bahwa seluruh data identitas petani, alamat pengiriman, dan nomor lisensi yang digunakan dalam pengujian adalah data sintetis (bukan data pengguna nyata).