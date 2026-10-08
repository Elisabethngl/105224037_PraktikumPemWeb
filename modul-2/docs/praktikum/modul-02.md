# Dokumen Teknis Modul 2 – HTML Semantik, Tailwind CSS, dan Aksesibilitas

Nama         : Elisabeth Nainggolan 
Nim          : 105224037
Repositori   : https://github.com/Elisabethngl/105224037_PraktikumPemWeb


## 1. Struktur Semantik

### Kerangka Landmark dan Hierarki Judul Halaman Utama

Elemen semantik yang digunakan pada halaman `latihan-audit`:

| Elemen | Fungsi |
|---|---|
| `<main>` | Menandai konten utama halaman agar dapat dikenali screen reader |
| `<label>` | Menghubungkan teks keterangan dengan elemen input form |
| `<button>` | Elemen interaktif untuk aksi pencarian |

Hierarki judul:
- Tidak ada `<h1>` — judul menggunakan `<div>` dengan kelas `text-2xl font-bold`

### Tangkapan Layar Pohon Aksesibilitas pada DevTools

- [Gambar 1 - Pohon Aksesibilitas DevTools](../hasil%20screenshot/gambar%201.png)

---

## 2. Tata Letak Responsif

### Tangkapan Layar pada Tiga Ukuran Layar

- [Gambar 2 360px ](../hasil%20screenshot/gambar%202%20(360%20px).png)
- [Gambar 3 768px ](../hasil%20screenshot/gambar%203%20(768%20px).png)
- [Gambar 4 1280px](../hasil%20screenshot/gambar%204%20(1280%20px).png)

### Kelas Flexbox, Grid, dan Breakpoint yang Digunakan

Kelas Tailwind CSS yang digunakan pada halaman `latihan-audit`:

| Kelas | Fungsi | Alasan Pemilihan |
|---|---|---|
| `p-8` | Padding 2rem di semua sisi | Memberikan ruang agar konten tidak terlalu mepet ke tepi |
| `text-2xl font-bold` | Ukuran teks besar dan tebal | Menandai judul utama secara visual |
| `border p-2` | Border dan padding pada input/button | Membuat elemen form terlihat jelas |
| `ml-2` | Margin kiri pada button | Memberi jarak antara input dan button pencarian |
| `sr-only` | Menyembunyikan label secara visual | Label tetap ada untuk screen reader tapi tidak mengganggu tampilan |
| `text-gray-600` | Warna teks abu-abu gelap | Memenuhi rasio kontras minimum WCAG (menggantikan `text-gray-300` yang terlalu terang) |

---

## 3. Audit Aksesibilitas

### Tabel Skor Lighthouse

| Halaman | Skor Sebelum | Skor Sesudah |
|---|---|---|
| Halaman Latihan (`/latihan-audit`) | 75 | 100 |
| Halaman Utama (`/`) | 100 | 100 |

- [Gambar 5 - Lighthouse Sebelum Perbaikan (skor 75)](../hasil%20screenshot/gambar%205%20(sebelum%20lighthouse).png)
- [Gambar 6 - Lighthouse Sesudah Perbaikan (skor 100)](../hasil%20screenshot/gambar%206%20(setelah%20lighthouse).png)

### Daftar Audit yang Gagal, Penyebab, dan Perbaikannya

| Masalah | Penyebab | Perbaikan |
|---|---|---|
| Buttons do not have an accessible name | Elemen `<button>` hanya berisi ikon SVG tanpa teks | Menambahkan atribut `aria-label="Cari"` pada `<button>` |
| Image elements do not have `[alt]` attributes | Elemen `<img>` tidak memiliki atribut `alt` | Menambahkan `alt="Next.js Logo"` pada elemen gambar |
| Form elements do not have associated labels | Elemen `<input>` tidak terhubung ke `<label>` | Menambahkan `<label htmlFor="search">` dan `id="search"` pada input |
| Background and foreground colors do not have sufficient contrast ratio | Kelas `text-gray-300` menghasilkan warna teks terlalu terang | Mengubah ke `text-gray-600` yang memiliki kontras lebih tinggi |
| Document does not have a main landmark | Seluruh konten dibungkus `<div>` biasa tanpa landmark | Mengubah `<div>` terluar menjadi `<main>` |

### Hasil Pemeriksaan Manual dengan Papan Ketik (Keyboard)

Urutan fokus saat menekan tombol `Tab`:
1. Input pencarian (`<input id="search">`)
2. Tombol cari (`<button aria-label="Cari">`)

- [Gambar 7 - Uji Keyboard (garis fokus)](../hasil%20screenshot/gambar%207.png)

---

## 4. Kendala dan Penyelesaian

| Kendala | Penyelesaian |
|---|---|
| Skor Lighthouse tidak akurat karena cache browser | Menjalankan audit di jendela Incognito Chrome |
| Button dengan ikon SVG tidak dikenali screen reader | Menambahkan atribut `aria-label` pada elemen `<button>` |
| Warna teks `text-gray-300` dianggap kurang kontras | Mengganti ke `text-gray-600` yang memenuhi standar WCAG |
| Input form tidak terhubung ke label | Menambahkan `<label htmlFor>` dan atribut `id` yang sesuai pada input |
| Halaman tidak memiliki landmark utama | Mengganti `<div>` terluar dengan elemen semantik `<main>` |

---

## 5. Penggunaan AI
- **Alat:** Antigravity (Google Deepmind)
- **Perintah utama yang digunakan:** Meminta penjelasan tentang setiap masalah aksesibilitas yang ditemukan Lighthouse dan cara memperbaikinya di kode Next.js/JSX
- **Bagian yang dibantu AI:** Penjelasan perbaikan untuk setiap isu aksesibilitas (aria-label, alt, label htmlFor, main landmark, kontras warna)
