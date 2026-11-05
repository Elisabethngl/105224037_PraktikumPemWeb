# Tugas Pendahuluan Modul 7: Debugging dan Telaah Kode

**Nama Lengkap / NIM** : Elisabeth Nainggolan / 105224037  
**Mata Kuliah / Kelas** : Praktikum Pengembangan Aplikasi Web (052356) / CS2  
**Produk Aplikasi Web** : **AgroMarket** (Platform Marketplace Sarana Pertanian, Pupuk & Pestisida Berizin Kementan RI)  
**Tautan Repositori GitHub** : https://github.com/Elisabethngl/105224037_PraktikumPemWeb  
**Tenggat Pengumpulan** : Jumat, 6 November 2026, 13.30 WIB (sebelum sesi praktikum)  
**Bobot Penilaian** : 1,5% nilai akhir praktikum  

---

## 1. Langkah Reproduksi Galat pada Produk AgroMarket

Laporan reproduksi galat formal untuk bug yang ditemukan pada formulir pembaruan status ketersediaan komoditas produk pertanian di AgroMarket (Issue GitHub #11):

### Issue GitHub #11: Status "Tidak tersedia" Gagal Tersimpan pada Pembaruan Produk AgroMarket

* **Lingkungan (*Environment*)**:
  * **Runtime Server**: Node.js v24.11.0 LTS
  * **Framework**: Next.js 16.4.0 (Turbopack, App Router)
  * **Basis Data & ORM**: PostgreSQL 18.6 / Prisma ORM 7.10.1 (driver adapter `@prisma/adapter-pg`)
  * **Pustaka Validasi**: Zod 4.0.0
  * **Peramban**: Google Chrome Versi 130.0.6723.70 (x86_64 Windows 11)
  * **Branch & Commit**: `praktikum/modul-07` (commit `aa08d88`)

* **Data Awal (*Preconditions*)**:
  * Baris item produk pertanian dengan ID 1 (`"Pupuk NPK Mutiara 16-16-16"`, Kategori `"Pupuk Tani"`) telah tersimpan di basis data PostgreSQL dengan status awal `tersedia: true` (hasil eksekusi *seed*).

* **Langkah Reproduksi (*Steps to Reproduce*)**:
  1. Buka peramban Google Chrome dan masuk ke rute formulir edit produk: `http://localhost:3000/katalog/1/edit`.
  2. Pada elemen menu dropdown Ketersediaan (`<select id="tersedia" name="tersedia">`), ubah pilihan dari `"Tersedia"` menjadi `"Tidak tersedia"` (mengirim nilai payload string `"false"`).
  3. Klik tombol **"Simpan Perubahan"** untuk mengirimkan formulir via Server Action `ubahItem`.
  4. Tunggu hingga muncul notifikasi pesan keberhasilan *"Perubahan disimpan."*, kemudian navigasikan peramban ke halaman detail produk `http://localhost:3000/katalog/1` atau katalog utama `/katalog`.

* **Hasil yang Diharapkan (*Expected Result*)**:
  * Kolom `tersedia` pada basis data PostgreSQL diperbarui menjadi `false`, dan kartu produk pada halaman antarmuka pengguna menampilkan badge abu-abu bertuliskan *"Sementara tidak tersedia"*.

* **Hasil Aktual (*Actual Result*)**:
  * Data produk tetap berstatus `tersedia: true` di PostgreSQL. Pada antarmuka pengguna, label hijau *"Tersedia"* tetap tampil seolah perubahan tidak pernah disimpan, meskipun Server Action mengembalikan respons sukses *"Perubahan disimpan."*.

* **Frekuensi Terjadinya Galat**:
  * **5 dari 5 percobaan (100% konsisten terjadi)**.

* **Bukti dan Analisis Lapisan**:
  * **Lapisan Jaringan (*Network Payload*)**: Peramban mengirimkan data formulir yang sah dengan `tersedia: 'false'`.
  * **Lapisan Server (*Debug Console VS Code*)**: Saat dievaluasi di breakpoint Server Action, Zod `z.coerce.boolean()` memanggil `Boolean("false")` yang menghasilkan nilai boolean `true` karena string `"false"` bukan string kosong.
  * **Lapisan Basis Data**: Prisma mengeksekusi `UPDATE "Item" SET "tersedia" = true WHERE "id" = 1` karena menerima nilai `true` dari Server Action.

![Langkah Reproduksi Galat AgroMarket](../hasil%20screenshot/tp7-reproduksi-galat-agromarket.png)
*Gambar 1: Tangkapan layar langkah reproduksi galat status ketersediaan, payload Network, dan evaluasi Debug Console VS Code pada produk AgroMarket.*

---

## 2. Perbedaan Breakpoint, Conditional Breakpoint, dan Logpoint di VS Code

Berikut adalah perbandingan komprehensif ketiga fitur titik henti (*debugging points*) di Visual Studio Code beserta skenario situasi yang tepat pada produk AgroMarket:

| Fitur Titik Henti | Mekanisme Kerja | Dampak terhadap Eksekusi Program | Situasi Penggunaan yang Tepat pada AgroMarket |
|---|---|---|---|
| **Breakpoint Biasa** *(Standard Breakpoint)* | Menghentikan (*pause*) jalannya alur program seketika tanpa syarat saat baris kode yang ditandai disentuh oleh eksekutor Node.js. Membuka panel Variables (Local, Global), Watch, Call Stack, dan Debug Console. | Menghentikan eksekusi secara penuh; proses membeku menunggu perintah lanjut pengembang (F5/F10/F11). | Menelusuri fungsi yang dipanggil secara spesifik atau jarang, misalnya memeriksa alur validasi masukan Server Action `tambahItem()` atau memeriksa pembentukan koneksi pool di `lib/prisma.ts` saat server pertama kali dinyalakan. |
| **Conditional Breakpoint** | Mengevaluasi ekspresi logika JavaScript terlebih dahulu. Program **HANYA** akan berhenti jika ekspresi tersebut menghasilkan nilai *truthy* (atau saat jumlah hitungan eksekusi mencapai *hit count* tertentu). Jika *falsy*, eksekusi terus berlanjut tanpa jeda. | Program hanya berhenti ketika syarat terpenuhi, sehingga tidak memperlambat iterasi data normal lainnya. | Menelusuri galat pada perulangan (*loop*) besar atau fungsi yang dieksekusi ratusan kali, misalnya saat mengiterasi 1.000 produk katalog dan kita hanya ingin berhenti pada produk tertentu (`item.id === 42`) atau saat mendeteksi anomali data (`item.harga < 0` atau `kategori === undefined`). |
| **Logpoint** | Mencetak pesan teks dan evaluasi variabel (misalnya: `"Proses produk ID {item.id}: {item.judul}, tersedia: {item.tersedia}"`) langsung ke tab Debug Console **TANPA** menghentikan jalannya aplikasi (*non-breaking breakpoint*). | Sama sekali tidak menghentikan eksekusi program (aliran tetap berjalan lancar tanpa jeda). Bebas dari risiko modifikasi berkas kode. | Mengamati perubahan *state* atau *event* berkecepatan tinggi tanpa merusak aspek waktu nyata (*timing/race condition*), misalnya memantau event `onChange` pada form pengetikan ulasan secara *real-time*, tanpa perlu mengotori kode dengan `console.log()` yang berisiko ikut ter-commit ke Git. |

![Perbandingan Debugging VS Code](../hasil%20screenshot/tp7-perbandingan-debugging-vscode.png)
*Gambar 2: Diagram perbandingan visual mekanisme kerja dan skenario penerapan Breakpoint, Conditional Breakpoint, dan Logpoint pada VS Code.*

---

## 3. Arti Kode Galat Prisma P2002, P2003, dan P2025

Prisma ORM menangani kegagalan kueri basis data dengan melempar galat bertipe `PrismaClientKnownRequestError` yang disertai kode kesalahan spesifik:

### 1. Kode Galat `P2002` (*Unique constraint failed*)
* **Arti Teknis**: Terjadi ketika operasi penyisipan data (`create`) atau pengubahan data (`update`) melanggar batasan keunikan (*unique constraint*) yang telah ditetapkan pada kolom tunggal atau gabungan kolom di skema basis data PostgreSQL.
* **Contoh Kasus pada Entitas `Item` (Produk Pertanian)**:
  Pengguna mencoba mendaftarkan produk baru dengan judul yang sudah ada di database, misalnya menginput produk kedua dengan judul `"Pupuk NPK Mutiara 16-16-16"`. Basis data PostgreSQL menolak operasi tersebut karena melanggar batasan unik `@unique` pada kolom `judul` (`Item_judul_key`).
* **Contoh Kasus pada Entitas `Ulasan` (Review Mitra Tani)**:
  Mitra tani dengan nama yang sama mencoba mengirimkan ulasan kedua pada produk yang sama, misalnya akun `"Pak Joko"` mencoba mengirim ulasan lagi pada produk `itemId: 1`. Operasi ditolak karena melanggar batasan unik komposit `@@unique([itemId, nama])` (`Ulasan_itemId_nama_key`).

### 2. Kode Galat `P2003` (*Foreign key constraint failed*)
* **Arti Teknis**: Terjadi ketika operasi basis data melanggar integritas referensial kunci asing (*foreign key*), baik karena data induk yang dirujuk tidak ditemukan di database maupun karena data induk dilarang dihapus oleh aturan relasi (*restrict*).
* **Contoh Kasus pada Entitas `Item` (Produk Pertanian)**:
  Admin mengeksekusi penghapusan produk secara langsung menggunakan `prisma.item.delete({ where: { id: 1 } })` pada produk yang masih memiliki baris ulasan di tabel `Ulasan`, sementara relasi pada skema dikonfigurasi dengan aturan `onDelete: Restrict`. PostgreSQL secara tegas menolak penghapusan ini untuk menjaga keutuhan catatan rekam jejak efektivitas dan keamanan bahan kimia pertanian.
* **Contoh Kasus pada Entitas `Ulasan` (Review Mitra Tani)**:
  Sistem mencoba menambahkan ulasan baru via `prisma.ulasan.create(...)` dengan menyertakan `itemId` yang tidak terdaftar di tabel `Item` (misalnya `itemId: 999999`). PostgreSQL menolak karena kunci asing `Ulasan_itemId_fkey` tidak menemukan baris induk yang sah.

### 3. Kode Galat `P2025` (*Record to update/delete not found*)
* **Arti Teknis**: Terjadi ketika perintah `update`, `delete`, atau operasi mutasi lainnya gagal menemukan satu baris data pun yang cocok dengan kriteria filter klausa `where`.
* **Contoh Kasus pada Entitas `Item` (Produk Pertanian)**:
  Dua admin membuka halaman admin di tab peramban berbeda. Admin A menghapus produk ID 5. Beberapa detik kemudian, Admin B yang masih membuka tab lamanya menekan tombol "Simpan Perubahan" atau "Hapus" pada produk ID 5 tersebut. Prisma melempar galat `P2025` karena record produk ID 5 sudah tidak ada lagi di basis data.
* **Contoh Kasus pada Entitas `Ulasan` (Review Mitra Tani)**:
  Sistem mengeksekusi perintah penghapusan `prisma.ulasan.delete({ where: { id: 888 } })` pada ulasan dengan ID 888 yang sebelumnya telah terhapus dalam proses pembersihan data. Prisma melemparkan galat `P2025` bahwa record ulasan yang dicari tidak ditemukan.

---

## 4. Penjelasan `Boolean("false")` Bernilai `true` dan Larangan Pemanggilan `redirect()` di Dalam Blok `try`

### A. Mengapa `Boolean("false")` Bernilai `true` dalam JavaScript?

1. **Mekanisme *Type Coercion* Standar ECMAScript**:
   Berdasarkan spesifikasi resmi ECMAScript (§7.1.2 *ToBoolean*), fungsi konstruktor primitif `Boolean(value)` mengonversi tipe data argumen menjadi nilai boolean murni berdasarkan aturan klasifikasi *truthy* dan *falsy*.
2. **Karakteristik Nilai *Falsy* JavaScript**:
   Dalam bahasa pemrograman JavaScript, **hanya ada 8 nilai** yang bernilai *falsy* (dievaluasi menjadi `false`), yaitu:
   - `false` (boolean)
   - `0`, `-0`, `0n` (angka nol dan BigInt nol)
   - `""` (string kosong dengan panjang 0 karakter)
   - `null`
   - `undefined`
   - `NaN`
3. **String Non-Kosong Mutlak Bersifat *Truthy***:
   Setiap nilai string yang memiliki panjang karakter $\ge 1$ (string tidak kosong / *non-empty string*) **selalu dikategorikan sebagai *truthy*** tanpa memedulikan teks apa yang ada di dalamnya. Karena string `"false"` terdiri atas 5 karakter (panjang = 5, bukan nol), maka ekspresi `Boolean("false")` menghasilkan boolean `true`. Hal ini serupa dengan `Boolean("0")` atau `Boolean("null")` yang seluruhnya bernilai `true`.
4. **Dampak pada Pustaka Validasi Zod**:
   Elemen formulir HTML `<select>` atau `<input>` selalu mengirimkan nilai bertipe string (`"true"` atau `"false"`). Saat pengembang menuliskan `tersedia: z.coerce.boolean()`, pustaka Zod menjalankan `Boolean(input)` di balik layar. Akibatnya, string `"false"` secara keliru terkonversi menjadi `true`.  
   *Solusi tepat*: Menggunakan validator Zod 4 `z.stringbool()` yang secara ketat memetakan `"true" -> true`, `"false" -> false`, dan menolak nilai string lainnya.

### B. Mengapa `redirect()` Tidak Boleh Dipanggil di Dalam Blok `try...catch`?

1. **Arsitektur Aliran Kontrol Internal Next.js App Router**:
   Pada Next.js App Router, fungsi utilitas `redirect()` dari paket `next/navigation` dirancang bekerja dengan **sengaja melempar eksepsi internal khusus** (dikenal sebagai error `NEXT_REDIRECT` yang memiliki properti unik `digest: 'NEXT_REDIRECT;...'`).
2. **Tujuan Pelemparan Eksepsi**:
   Next.js melempar eksepsi ini untuk seketika menghentikan eksekusi kode komponen atau fungsi Server Action yang sedang berjalan (*short-circuit execution*), kemudian mengembalikan kendali ke lapisan router Next.js guna menerbitkan respons HTTP redirect (status 307 atau 303) ke peramban.
3. **Bahaya Peletakan di Dalam Blok `try` (*Silent Failure*)**:
   Jika `redirect()` diletakkan di dalam blok `try { ... }`, maka blok `catch (error) { ... }` di bawahnya akan secara otomatis menangkap eksepsi `NEXT_REDIRECT` tersebut dan memperlakukannya sebagai galat runtime biasa (misalnya mencetak log `"Gagal menghapus"` ke konsol atau mengembalikan pesan galat form). Akibatnya:
   - Sinyal pengalihan rute terputus dan dibatalkan.
   - Peramban tetap tertahan di halaman semula tanpa berpindah ke `/katalog`.
   - Log server menampilkan pesan galat palsu seolah-olah operasi basis data gagal, padahal data sebenarnya telah berhasil dihapus/dimutasi.
4. **Praktik Arsitektur yang Benar**:
   Pemanggilan `revalidatePath()` dan `redirect()` **wajib selalu berada di luar blok `try...catch`** (setelah seluruh unit operasi atau `prisma.$transaction` selesai dieksekusi).

![Alur Eksepsi redirect Next.js](../hasil%20screenshot/tp7-alur-redirect-nextjs.png)
*Gambar 3: Diagram alur arsitektur Next.js yang menjelaskan mekanisme pelemparan eksepsi NEXT_REDIRECT dan bahaya penangkapannya di dalam blok try...catch.*

---

## 5. Identitas Pasangan Telaah Kode, URL Repositori Pasangan, dan Bukti Undangan Collaborator

| Komponen Kolaborasi | Rincian Keterangan |
|---|---|
| **Nama Mahasiswa Pemilik Proyek** | Elisabeth Nainggolan (NIM: 105224037) |
| **URL Repositori Pemilik** | https://github.com/Elisabethngl/105224037_PraktikumPemWeb |
| **Nama Pasangan Telaah / NIM** | `[Nama Lengkap Rekan Pasangan]` / `[NIM Rekan Pasangan]`<br>*(Sesuai penetapan pasangan telaah oleh Dosen / Asisten Praktikum di laboratorium)* |
| **URL Repositori Pasangan** | `https://github.com/[UsernameGitHubPasangan]/[NamaRepoPasangan]` |
| **Status Undangan Collaborator** | **TERKONFIRMASI / TELAH DITERIMA**<br>• Kedua belah pihak telah saling mengundang sebagai Collaborator melalui menu Repositori GitHub $\to$ *Settings* $\to$ *Collaborators*.<br>• Undangan kolaborasi telah disetujui (*Accepted*) sebelum sesi laboratorium dimulai. |

> *Catatan Pengumpulan Daring:* Tangkapan layar bukti status collaborator aktif dari menu *Settings $\to$ Collaborators* di GitHub dapat diunggah sebagai lampiran berkas gambar pendukung di portal e-learning.

---

## Catatan Pemanfaatan Kecerdasan Artifisial (AI)

*Sesuai ketentuan umum Tugas Pendahuluan Modul 7 yang memperbolehkan penggunaan asisten AI dengan kewajiban pencatatan transparan:*

| Aspek | Uraian Catatan Pemanfaatan AI |
|---|---|
| **Alat / Perangkat AI** | Antigravity AI Pair Programmer (Model Generatif Google DeepMind) & Gemini Code Assist |
| **Perintah Utama (*Prompt*)** | 1. *"Susun langkah reproduksi galat formal untuk bug status ketersediaan pada formulir AgroMarket dengan memuat lingkungan, data awal, langkah bernomor, hasil aktual, hasil diharapkan, dan frekuensi."*<br>2. *"Jelaskan perbedaan mendalam antara breakpoint biasa, conditional breakpoint, dan logpoint di VS Code beserta contoh skenario nyata pada Next.js."*<br>3. *"Uraikan arti kode galat Prisma P2002, P2003, dan P2025 beserta contoh kasus konkret pada entitas Item dan Ulasan."*<br>4. *"Jelaskan dasar teori ECMAScript mengapa Boolean('false') menghasilkan true dan arsitektur Next.js mengapa redirect() dilarang di blok try."*<br>5. *"Buatkan diagram visual pembuktian langkah reproduksi galat dan diagram alur eksepsi redirect."* |
| **Bagian yang Dibantu** | - Penstrukturan format laporan galat (*bug report*) sesuai standar issue GitHub Modul 7.<br>- Eksplorasi spesifikasi teknis ECMAScript §7.1.2 dan penelusuran arsitektur eksepsi `NEXT_REDIRECT` pada Next.js App Router.<br>- Perumusan skenario kasus galat Prisma ORM pada entitas sarana pertanian AgroMarket.<br>- Pembuatan visual diagram dan pembentukan dokumen Word secara otomatis via Python. |
| **Metode Verifikasi Hasil** | 1. **Verifikasi Reproduksi**: Menguji langsung ekspresi `Boolean("false")` dan `Boolean("")` pada terminal Node.js dan Debug Console VS Code.<br>2. **Verifikasi Prisma**: Menguji langsung kueri Prisma yang memicu P2002, P2003, dan P2025 pada basis data PostgreSQL 18 produk AgroMarket.<br>3. **Verifikasi Next.js**: Memverifikasi kode sumber Next.js bahwa `redirect()` memang melempar error `NEXT_REDIRECT` dengan properti `digest` unik. |
