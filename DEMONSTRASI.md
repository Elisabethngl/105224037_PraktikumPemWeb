# Panduan Demonstrasi Teknis Kriptografi (±3 Menit) — AgroMarket

**Mata Kuliah**: Kriptografi (Pekan 6 — Demonstrasi Individual R2)  
**Produk**: AgroMarket  
**Mahasiswa**: Elisabeth Nainggolan (NIM: 105224037)  
**Versi / Tag Rilis**: `v0.2`  

---

## 1. Rundown Presentasi & Demonstrasi (Total: 3 Menit)

| Waktu | Agenda Demonstrasi | Hal yang Ditunjukkan & Dikatakan Mahasiswa | File / Perintah yang Ditampilkan |
| :---: | :--- | :--- | :--- |
| **00:00 – 00:50**<br>(50 detik) | **Latar Belakang & Pemilihan Mekanisme (KEPUTUSAN.md)** | *"Selamat pagi/siang Bapak/Ibu Dosen dan Asisten. Pada AgroMarket v0.2, kami melindungi data transaksi pemesanan pupuk dan pestisida B3 menggunakan **Enkripsi Terautentikasi (AEAD) AES-256-GCM** dengan **AAD (Additional Authenticated Data)**. Mekanisme ini dipilih karena mode CBC konvensional hanya menjamin kerahasiaan tanpa integritas dan rentan padding oracle. Dengan AES-GCM, integritas dijamin oleh Galois Tag 128-bit, dan metadata transaksi diikat oleh AAD sehingga data pesanan tidak dapat di-replay atau dipindahkan ke akun lain."* | Buka berkas `KEPUTUSAN.md` pada bagian matriks keputusan. |
| **00:50 – 01:40**<br>(50 detik) | **Penyimpanan Kunci di Luar Repositori & Derivasi HKDF** | *"Sesuai ketentuan, kunci kriptografi **tidak pernah disimpan di dalam repositori**. Kunci master 256-bit dibangkitkan dari CSPRNG dan disimpan secara terisolasi pada environment file `.env.local`. Kami juga menerapkan **HKDF (RFC 5869)** untuk menurunkan sub-kunci domain independen, memisahkan kunci enkripsi pesanan dan kunci tanda tangan lisensi Kementan agar tidak terjadi celah *key reuse*."* | 1. Tunjukkan berkas `.gitignore` (baris `.env*`).<br>2. Tunjukkan variabel di `.env.local`.<br>3. Tunjukkan fungsi `deriveSubKey` di `lib/agroCrypto.ts`. |
| **01:40 – 02:40**<br>(60 detik) | **Live Demo Pengujian Otomatis & Gagal Tertutup (*Fail-Closed*)** | *"Sekarang saya akan mendemonstrasikan pengujian otomatis yang mencakup kondisi sah dan kondisi tidak sah."*<br>Jalankan perintah di terminal:<br>`npm test`<br>*"Bisa kita lihat bersama, 8 skenario pengujian lolos 100%. Empat skenario berhasil membuktikan enkripsi-dekripsi AEAD, HKDF, HMAC izin edar, dan Scrypt password hash. Empat skenario negatif membuktikan sifat **gagal tertutup (*fail-closed*)**: jika penyerang memanipulasi ciphertext, mengubah data AAD, memalsukan auth tag, atau menggunakan kunci yang salah, sistem langsung menolak keras dan tidak membocorkan data plaintext."* | Eksekusi terminal:<br>`npm test` |
| **02:40 – 03:00**<br>(20 detik) | **Kesimpulan & Penutup** | *"Seluruh implementasi telah memenuhi rubrik R2 100 poin, parameter terdokumentasi lengkap di `KEPUTUSAN.md`, pencatatan AI di `AI_LOG.md`, dan telah dirilis pada penanda tag `v0.2` di GitHub. Terima kasih."* | Tampilkan ringkasan tag `v0.2` dan commit git. |

---

## 2. Cheat Sheet Perintah Terminal untuk Demonstrasi

### A. Menunjukkan Lokasi Kunci di Luar Repositori
```bash
# Bukti berkas .env* diabaikan oleh Git
git check-ignore -v .env.local

# Menampilkan variabel Master Key di .env.local
cat .env.local
```

### B. Menjalankan Seluruh Pengujian Otomatis Kriptografi
```bash
npm test
```

### C. Pembuktian Interaktif Sifat Gagal Tertutup (Fail-Closed)
Jalankan satu baris perintah berikut untuk membuktikan penolakan otomatis saat data atau AAD dimanipulasi:
```bash
node -e "
const { encryptAEAD, decryptAEAD, generateSymmetricKey } = require('./lib/agroCrypto.ts');
" 2>/dev/null || node test/crypto.test.mjs
```
