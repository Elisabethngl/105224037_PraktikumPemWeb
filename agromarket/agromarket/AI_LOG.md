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