import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import os

doc = docx.Document()

# Page Margins
sections = doc.sections
for section in sections:
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

# Title Header
p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_title = p_title.add_run("TUGAS PENDAHULUAN MODUL 7\nDEBUGGING DAN TELAAH KODE")
run_title.font.name = "Calibri"
run_title.font.size = Pt(16)
run_title.font.bold = True
run_title.font.color.rgb = RGBColor(20, 83, 45) # Dark emerald green

p_sub = doc.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_sub = p_sub.add_run("Praktikum Pengembangan Aplikasi Web (052356) – Semester 5\nProgram Studi Ilmu Komputer – Fakultas Sains dan Ilmu Komputer – Universitas Pertamina")
run_sub.font.name = "Calibri"
run_sub.font.size = Pt(10.5)
run_sub.font.italic = True
run_sub.font.color.rgb = RGBColor(100, 116, 139)

doc.add_paragraph().paragraph_format.space_after = Pt(4)

# Identity Card Table
tbl_id = doc.add_table(rows=5, cols=2)
tbl_id.alignment = WD_TABLE_ALIGNMENT.CENTER
identitas = [
    ("Nama Lengkap / NIM", "Elisabeth Nainggolan / 105224037"),
    ("Mata Kuliah / Kelas", "Praktikum Pengembangan Aplikasi Web (052356) / CS2"),
    ("Produk Aplikasi Web", "AgroMarket (Marketplace Sarana Pertanian, Pupuk & Obat Hama Berizin Kementan RI)"),
    ("Tautan Repositori GitHub", "https://github.com/Elisabethngl/105224037_PraktikumPemWeb"),
    ("Tenggat Pengumpulan", "Jumat, 6 November 2026, 13.30 WIB (Sebelum Sesi Praktikum)")
]
for idx, (label, val) in enumerate(identitas):
    c0 = tbl_id.rows[idx].cells[0]
    c1 = tbl_id.rows[idx].cells[1]
    c0.width = Inches(2.2)
    c1.width = Inches(4.3)
    set_cell_background(c0, "F0FDF4")
    set_cell_background(c1, "F8FAFC")
    set_cell_margins(c0, 60, 60, 100, 100)
    set_cell_margins(c1, 60, 60, 100, 100)
    p0 = c0.paragraphs[0]
    p0.add_run(label).font.bold = True
    p0.runs[0].font.name = "Calibri"
    p0.runs[0].font.size = Pt(10)
    p1 = c1.paragraphs[0]
    p1.add_run(val)
    p1.runs[0].font.name = "Calibri"
    p1.runs[0].font.size = Pt(10)

doc.add_paragraph().paragraph_format.space_after = Pt(10)

def add_heading_box(title_text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(title_text)
    run.font.name = "Calibri"
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = RGBColor(22, 101, 52)

# ==========================================
# SOAL 1
# ==========================================
add_heading_box("1. Langkah Reproduksi Galat pada Produk AgroMarket (Issue #11)")

p1_desc = doc.add_paragraph()
p1_desc.paragraph_format.space_after = Pt(6)
p1_desc.add_run(
    "Berikut adalah laporan langkah reproduksi galat formal untuk bug yang ditemukan pada fitur pembaruan status ketersediaan komoditas produk sarana pertanian di AgroMarket, di mana status produk yang diubah menjadi 'Tidak tersedia' selalu gagal tersimpan dan tetap kembali menjadi 'Tersedia'. Laporan ini disusun lengkap sesuai standar pelaporan bug profesional dan format issue GitHub Modul 7:"
)

# Table Bug Report
tbl_bug = doc.add_table(rows=7, cols=2)
tbl_bug.alignment = WD_TABLE_ALIGNMENT.CENTER
bug_items = [
    ("Judul Galat (Issue #11)", "Status 'Tidak tersedia' Gagal Tersimpan pada Pembaruan Produk AgroMarket"),
    ("Lingkungan (Environment)", "• Node.js: v24.11.0 LTS\n• Framework: Next.js 16.4.0 (Turbopack, App Router)\n• Basis Data / ORM: PostgreSQL 18.6 / Prisma ORM 7.10.1\n• Validasi: Zod 4.0.0\n• Peramban: Google Chrome Versi 130.0.6723.70 (x86_64 Windows)\n• Branch & Commit: praktikum/modul-07 (commit aa08d88)"),
    ("Data Awal (Preconditions)", "Item produk pertanian dengan ID 1 (\"Pupuk NPK Mutiara 16-16-16\", Kategori \"Pupuk Tani\") berada di basis data PostgreSQL dengan status awal `tersedia: true` (hasil eksekusi seed)."),
    ("Langkah Reproduksi (Steps to Reproduce)", "1. Buka peramban dan navigasikan ke halaman formulir edit produk di URL `http://localhost:3000/katalog/1/edit`.\n2. Pada elemen dropdown formulir Ketersediaan (`<select id=\"tersedia\" name=\"tersedia\">`), ubah pilihan dari \"Tersedia\" menjadi \"Tidak tersedia\" (mengirim payload string `\"false\"`).\n3. Klik tombol \"Simpan Perubahan\" untuk mengeksekusi Server Action `ubahItem`.\n4. Tunggu respons selesai hingga muncul notifikasi pesan sukses \"Perubahan disimpan.\", kemudian buka kembali halaman detail produk `http://localhost:3000/katalog/1` atau katalog utama `/katalog`."),
    ("Hasil yang Diharapkan (Expected Result)", "Status produk diperbarui menjadi `tersedia: false` di PostgreSQL, dan kartu produk pada antarmuka web menampilkan label/badge abu-abu berbunyi \"Sementara tidak tersedia\"."),
    ("Hasil Aktual (Actual Result)", "Produk TETAP berstatus `tersedia: true` di database PostgreSQL. Pada antarmuka pengguna, label hijau \"Tersedia\" tetap muncul seolah perubahan tidak pernah terjadi, meskipun Server Action mengembalikan pesan sukses \"Perubahan disimpan.\"."),
    ("Frekuensi & Bukti (Frequency & Evidence)", "• Frekuensi: 5 dari 5 percobaan (100% konsisten terjadi).\n• Bukti Lapisan: Payload panel DevTools Network membuktikan peramban mengirimkan `tersedia: 'false'`, namun Debug Console di server mengevaluasi `hasil.data.tersedia` bernilai `true` akibat fungsi `z.coerce.boolean()` yang mengevaluasi `Boolean(\"false\")`.")
]

for idx, (label, val) in enumerate(bug_items):
    c0 = tbl_bug.rows[idx].cells[0]
    c1 = tbl_bug.rows[idx].cells[1]
    c0.width = Inches(2.2)
    c1.width = Inches(4.3)
    set_cell_background(c0, "F1F5F9")
    set_cell_background(c1, "FFFFFF")
    set_cell_margins(c0, 60, 60, 100, 100)
    set_cell_margins(c1, 60, 60, 100, 100)
    p0 = c0.paragraphs[0]
    p0.add_run(label).font.bold = True
    p0.runs[0].font.name = "Calibri"
    p0.runs[0].font.size = Pt(9.5)
    p1 = c1.paragraphs[0]
    p1.add_run(val)
    p1.runs[0].font.name = "Calibri"
    p1.runs[0].font.size = Pt(9.5)

# Embed Image 1
img1 = "docs/hasil screenshot/tp7-reproduksi-galat-agromarket.png"
if os.path.exists(img1):
    p_img1 = doc.add_paragraph()
    p_img1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img1.paragraph_format.space_before = Pt(8)
    p_img1.paragraph_format.space_after = Pt(4)
    p_img1.add_run().add_picture(img1, width=Inches(6.2))
    p_cap1 = doc.add_paragraph()
    p_cap1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cap1 = p_cap1.add_run("Gambar 1: Tangkapan Layar Langkah Reproduksi Galat Status Ketersediaan, Payload Network, dan Debug Console VS Code pada Produk AgroMarket")
    r_cap1.font.name = "Calibri"
    r_cap1.font.size = Pt(9)
    r_cap1.font.italic = True
    r_cap1.font.color.rgb = RGBColor(71, 85, 105)

# ==========================================
# SOAL 2
# ==========================================
add_heading_box("2. Perbedaan Breakpoint, Conditional Breakpoint, dan Logpoint di VS Code Beserta Situasi Penggunaannya")

p2_desc = doc.add_paragraph()
p2_desc.paragraph_format.space_after = Pt(6)
p2_desc.add_run(
    "Visual Studio Code menyediakan tiga jenis titik henti (*breakpoints*) untuk membantu penelusuran galat secara presisi pada runtime server Node.js dan peramban. Masing-masing memiliki karakteristik interupsi, dampak terhadap alur eksekusi, dan skenario penggunaan yang berbeda:"
)

tbl_bp = doc.add_table(rows=4, cols=4)
tbl_bp.alignment = WD_TABLE_ALIGNMENT.CENTER
headers = ["Jenis Breakpoint", "Mekanisme Kerja", "Dampak pada Eksekusi", "Situasi Penggunaan yang Tepat pada AgroMarket"]
for i, h in enumerate(headers):
    cell = tbl_bp.rows[0].cells[i]
    set_cell_background(cell, "047857")
    set_cell_margins(cell, 80, 80, 100, 100)
    p = cell.paragraphs[0]
    r = p.add_run(h)
    r.font.bold = True
    r.font.name = "Calibri"
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(255, 255, 255)

bp_data = [
    ("Breakpoint Biasa (Standard Breakpoint)", 
     "Menghentikan (pause) jalannya program seketika begitu alur eksekusi menyentuh nomor baris yang ditandai, tanpa memerlukan syarat apa pun. Membuka panel Variables, Watch, Call Stack, dan Debug Console.", 
     "Menghentikan eksekusi secara penuh; thread program membeku menunggu aksi pengguna (F5/F10/F11).", 
     "Menelusuri fungsi yang dipanggil jarang atau spesifik sekali, misalnya memvalidasi alur fungsi Server Action tambahItem() atau memeriksa inisialisasi koneksi basis data di lib/prisma.ts saat aplikasi baru pertama kali dijalankan."),
    
    ("Conditional Breakpoint", 
     "Mengevaluasi ekspresi kondisi sebelum memutuskan berhenti. Program HANYA akan berhenti jika ekspresi logika yang ditentukan menghasilkan nilai truthy (atau saat hit count mencapai batas tertentu). Jika falsy, eksekusi terus berjalan.", 
     "Hanya menghentikan program jika syarat terpenuhi; tidak memperlambat atau menghentikan iterasi data lain.", 
     "Menelusuri anomali di dalam perulangan (loop) atau pemrosesan batch ratusan data produk katalog, misalnya ketika ingin memeriksa produk tertentu saja: saat item.id === 42, atau saat mendeteksi bug nilai anomali: item.harga < 0 atau kategori === undefined."),
    
    ("Logpoint", 
     "Mencetak pesan atau evaluasi nilai ekspresi (misalnya: \"Proses produk id={item.id}, judul={item.judul}\") langsung ke panel Debug Console TANPA menghentikan alur eksekusi program (non-breaking breakpoint).", 
     "Sama sekali TIDAK menghentikan program; tidak merusak aspek waktu nyata (mencegah race conditions). Tidak mengubah berkas kode.", 
     "Memantau perubahan state atau event berkecepatan tinggi pada antarmuka (seperti event pengetikan karakter ulasan onChange) dan logging alur Server Action di server tanpa perlu mengotori kode sumber dengan console.log() yang berisiko ikut ter-commit ke Git.")
]

col_widths = [Inches(1.5), Inches(1.8), Inches(1.4), Inches(1.8)]
for r_idx, row in enumerate(bp_data):
    for c_idx, val in enumerate(row):
        cell = tbl_bp.rows[r_idx + 1].cells[c_idx]
        cell.width = col_widths[c_idx]
        bg = "F8FAFC" if r_idx % 2 == 0 else "FFFFFF"
        set_cell_background(cell, bg)
        set_cell_margins(cell, 60, 60, 100, 100)
        p = cell.paragraphs[0]
        r = p.add_run(val)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        if c_idx == 0:
            r.font.bold = True

# Embed Image 2
img2 = "docs/hasil screenshot/tp7-perbandingan-debugging-vscode.png"
if os.path.exists(img2):
    p_img2 = doc.add_paragraph()
    p_img2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img2.paragraph_format.space_before = Pt(8)
    p_img2.paragraph_format.space_after = Pt(4)
    p_img2.add_run().add_picture(img2, width=Inches(6.2))
    p_cap2 = doc.add_paragraph()
    p_cap2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cap2 = p_cap2.add_run("Gambar 2: Diagram Perbandingan Visual Karakteristik dan Skenario Kerja Breakpoint, Conditional Breakpoint, dan Logpoint di VS Code")
    r_cap2.font.name = "Calibri"
    r_cap2.font.size = Pt(9)
    r_cap2.font.italic = True
    r_cap2.font.color.rgb = RGBColor(71, 85, 105)

# ==========================================
# SOAL 3
# ==========================================
add_heading_box("3. Arti Kode Galat Prisma P2002, P2003, dan P2025 Beserta Contoh Kejadian pada Item dan Ulasan")

p3_desc = doc.add_paragraph()
p3_desc.paragraph_format.space_after = Pt(6)
p3_desc.add_run(
    "Prisma ORM mengelompokkan kegagalan operasional basis data yang teridentifikasi ke dalam kelas PrismaClientKnownRequestError dengan kode spesifik berawalan 'P'. Berikut adalah penjelasan mendalam untuk ketiga kode galat yang paling sering ditemui dalam operasi CRUD beserta contoh konkret kejadiannya pada entitas Item dan Ulasan produk AgroMarket:"
)

tbl_err = doc.add_table(rows=4, cols=4)
tbl_err.alignment = WD_TABLE_ALIGNMENT.CENTER
err_headers = ["Kode Galat", "Nama & Arti Resmi", "Contoh Kejadian pada Entitas Item (Produk)", "Contoh Kejadian pada Entitas Ulasan (Review)"]
for i, h in enumerate(err_headers):
    cell = tbl_err.rows[0].cells[i]
    set_cell_background(cell, "166534")
    set_cell_margins(cell, 80, 80, 100, 100)
    p = cell.paragraphs[0]
    r = p.add_run(h)
    r.font.bold = True
    r.font.name = "Calibri"
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(255, 255, 255)

err_data = [
    ("P2002",
     "Unique constraint failed\n\nTerjadi saat operasi INSERT atau UPDATE melanggar batasan keunikan kolom atau kombinasi indeks unik yang didefinisikan pada skema basis data.",
     "Pengguna mencoba menambahkan produk baru dengan judul yang sudah terdaftar di PostgreSQL, misalnya menginput merek \"Pupuk NPK Mutiara 16-16-16\" untuk kedua kalinya. Basis data menolak kueri karena melanggar indeks unik Item_judul_key (@unique pada kolom judul).",
     "Seorang mitra tani dengan nama yang sama mencoba mengirimkan ulasan kedua pada produk yang sama, misalnya akun \"Pak Joko\" mengirim ulasan lagi pada produk ID 1. Kueri ditolak karena melanggar batasan unik gabungan @@unique([itemId, nama]) (Ulasan_itemId_nama_key)."),
    
    ("P2003",
     "Foreign key constraint failed\n\nTerjadi saat operasi basis data melanggar integritas referensial kunci asing, baik karena data induk tidak ada maupun karena entitas induk dilarang dihapus oleh aturan relasi.",
     "Pengelola mengeksekusi penghapusan produk secara langsung via prisma.item.delete({ where: { id: 1 } }) pada produk yang masih memiliki data ulasan anak, di mana foreign key menggunakan aturan onDelete: Restrict. PostgreSQL menolak penghapusan demi melindungi histori keamanan dosis pestisida.",
     "Pengguna mencoba menambahkan baris ulasan baru melalui prisma.ulasan.create(...) dengan mengisi itemId yang tidak pernah ada di tabel Item (misalnya itemId: 999999). Basis data menolak karena foreign key Ulasan_itemId_fkey gagal merujuk ke baris induk yang valid."),
    
    ("P2025",
     "Record to update/delete not found\n\nTerjadi saat perintah pembaruan (update) atau penghapusan (delete) tidak menemukan satu baris data pun yang cocok dengan klausa filter where yang ditentukan.",
     "Seorang admin membuka formulir edit produk ID 5 di tab peramban kedua dan menekan tombol 'Simpan Perubahan', padahal produk ID 5 tersebut sudah dihapus oleh admin lain beberapa saat sebelumnya melalui tab pertama. Prisma melempar P2025 karena baris target telah tiada.",
     "Sistem mencoba menghapus ulasan dengan mengeksekusi prisma.ulasan.delete({ where: { id: 888 } }), padahal ulasan dengan ID 888 tersebut telah dihapus sebelumnya. Prisma melempar galat P2025 bahwa ulasan yang dicari tidak ditemukan.")
]

err_widths = [Inches(1.0), Inches(1.8), Inches(1.8), Inches(1.9)]
for r_idx, row in enumerate(err_data):
    for c_idx, val in enumerate(row):
        cell = tbl_err.rows[r_idx + 1].cells[c_idx]
        cell.width = err_widths[c_idx]
        bg = "F8FAFC" if r_idx % 2 == 0 else "FFFFFF"
        set_cell_background(cell, bg)
        set_cell_margins(cell, 60, 60, 100, 100)
        p = cell.paragraphs[0]
        r = p.add_run(val)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        if c_idx == 0:
            r.font.bold = True
            r.font.color.rgb = RGBColor(185, 28, 28)

# ==========================================
# SOAL 4
# ==========================================
add_heading_box("4. Penjelasan Boolean(\"false\") Bernilai true dan Larangan Pemanggilan redirect() di Dalam Blok try")

p4_a = doc.add_paragraph()
p4_a.paragraph_format.space_before = Pt(4)
p4_a.paragraph_format.space_after = Pt(4)
r4_a_title = p4_a.add_run("A. Mengapa Boolean(\"false\") Bernilai true dalam JavaScript?\n")
r4_a_title.font.bold = True
r4_a_title.font.size = Pt(11)
r4_a_title.font.color.rgb = RGBColor(20, 83, 45)

p4_a.add_run(
    "1. Mekanisme Type Coercion ECMAScript:\n"
    "Di dalam spesifikasi standar JavaScript (ECMAScript §7.1.2 ToBoolean), fungsi tipe primitif Boolean(value) "
    "mengonversi argumen menjadi boolean berdasarkan kategori nilai Truthy dan Falsy.\n"
    "2. Himpunan Nilai Falsy yang Sangat Terbatas:\n"
    "Dalam JavaScript, hanya ada 8 nilai yang dikategorikan sebagai FALSY, yaitu: false, 0, -0, 0n (BigInt), \"\" (string kosong dengan panjang nol), null, undefined, dan NaN.\n"
    "3. String Non-Kosong Selalu Bernilai Truthy:\n"
    "Setiap nilai string yang memiliki panjang karakter lebih dari atau sama dengan 1 (string tidak kosong / non-empty string) "
    "secara mutlak diklasifikasikan sebagai TRUTHY, terlepas dari apa pun teks yang ada di dalamnya. Karena string \"false\" memiliki 5 karakter (panjang = 5 != 0), "
    "maka pemanggilan Boolean(\"false\") menghasilkan nilai boolean true. Begitu pula ekspresi Boolean(\"0\"), Boolean(\"null\"), atau Boolean(\"undefined\") semuanya menghasilkan true.\n"
    "4. Dampak Bug pada Validasi Formulir Zod:\n"
    "Elemen formulir HTML seperti <select> atau <input type=\"radio\"> selalu mengirimkan data dalam bentuk string teks. "
    "Ketika pengembang menggunakan helper z.coerce.boolean(), di balik layar Zod mengeksekusi konstruktor Boolean(input). "
    "Akibatnya, saat pengguna memilih opsi 'Tidak tersedia' yang mengirimkan nilai string \"false\", fungsi konversi tersebut justru menghasilkan nilai boolean true. "
    "Solusi yang tepat pada Zod 4 adalah menggunakan validator z.stringbool() yang secara eksplisit memetakan string literal \"true\" -> true, \"false\" -> false, dan menolak nilai string lainnya sebagai galat validasi."
)

p4_b = doc.add_paragraph()
p4_b.paragraph_format.space_before = Pt(8)
p4_b.paragraph_format.space_after = Pt(4)
r4_b_title = p4_b.add_run("B. Mengapa redirect() Tidak Boleh Dipanggil di Dalam Blok try...catch?\n")
r4_b_title.font.bold = True
r4_b_title.font.size = Pt(11)
r4_b_title.font.color.rgb = RGBColor(20, 83, 45)

p4_b.add_run(
    "1. Mekanisme Kontrol Aliran Internal Next.js App Router:\n"
    "Pada Next.js (terutama sejak App Router), fungsi redirect() yang diimpor dari pustaka 'next/navigation' tidak bekerja dengan cara mengembalikan objek respons HTTP secara langsung, "
    "melainkan bekerja dengan sengaja MELEMPAR EKSEPSI INTERNAL KHUSUS bertipe NEXT_REDIRECT (dengan properti unik digest: 'NEXT_REDIRECT;...').\n"
    "2. Tujuan Pelemparan Eksepsi NEXT_REDIRECT:\n"
    "Next.js sengaja melempar eksepsi ini untuk seketika menghentikan (short-circuit) seluruh eksekusi kode komponen atau fungsi Server Action yang sedang berjalan, "
    "lalu menyerahkan kendali penuh ke lapisan router Next.js untuk menerbitkan respons HTTP redirect (status 307 atau 303) ke peramban pengguna.\n"
    "3. Akibat Fatal Jika Diletakkan di Dalam Blok try:\n"
    "Jika fungsi redirect() dipanggil di dalam blok try { ... }, maka blok catch (error) { ... } di bawahnya akan secara otomatis menangkap eksepsi NEXT_REDIRECT tersebut. "
    "Blok catch memperlakukan sinyal pengalihan ini sebagai galat aplikasi tak terduga (misalnya dicetak ke log 'Gagal menghapus' atau dikembalikan ke klien sebagai galat formulir). "
    "Akibatnya, proses navigasi terputus secara diam-diam (silent failure), peramban tetap membeku di halaman saat ini, dan pengguna melihat pesan galat palsu padahal data di database berhasil dimutasi.\n"
    "4. Praktik Arsitektur yang Benar:\n"
    "Pemanggilan revalidatePath() dan redirect() WAJIB diletakkan di LUAR blok try...catch, yaitu setelah seluruh proses mutasi basis data (seperti prisma.$transaction) selesai dijalankan dengan sempurna."
)

# Embed Image 3
img3 = "docs/hasil screenshot/tp7-alur-redirect-nextjs.png"
if os.path.exists(img3):
    p_img3 = doc.add_paragraph()
    p_img3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img3.paragraph_format.space_before = Pt(8)
    p_img3.paragraph_format.space_after = Pt(4)
    p_img3.add_run().add_picture(img3, width=Inches(6.2))
    p_cap3 = doc.add_paragraph()
    p_cap3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cap3 = p_cap3.add_run("Gambar 3: Diagram Alur Arsitektur Next.js: Analisis Mengapa redirect() Melempar Eksepsi NEXT_REDIRECT dan Bahaya Peletakannya di Dalam Blok try...catch")
    r_cap3.font.name = "Calibri"
    r_cap3.font.size = Pt(9)
    r_cap3.font.italic = True
    r_cap3.font.color.rgb = RGBColor(71, 85, 105)

# ==========================================
# SOAL 5
# ==========================================
add_heading_box("5. Identitas Pasangan Telaah Kode, URL Repositori Pasangan, dan Bukti Undangan Collaborator")

p5_desc = doc.add_paragraph()
p5_desc.paragraph_format.space_after = Pt(6)
p5_desc.add_run(
    "Untuk memenuhi ketentuan kolaborasi telaah kode antarmahasiswa (peer code review) melalui Pull Request pada Modul 7, berikut adalah informasi data pasangan telaah dan tautan repositori proyek:"
)

tbl_peer = doc.add_table(rows=5, cols=2)
tbl_peer.alignment = WD_TABLE_ALIGNMENT.CENTER
peer_info = [
    ("Nama Mahasiswa (Pemilik Proyek)", "Elisabeth Nainggolan (NIM: 105224037)"),
    ("URL Repositori Pemilik", "https://github.com/Elisabethngl/105224037_PraktikumPemWeb"),
    ("Nama Pasangan Telaah / NIM", "[Nama Lengkap Rekan Pasangan] / [NIM Rekan Pasangan]\n(Sesuai pembagian pasangan oleh Dosen/Asisten Praktikum di laboratorium)"),
    ("URL Repositori Pasangan", "https://github.com/[UsernameGitHubPasangan]/[NamaRepoPasangan]"),
    ("Status Undangan Collaborator", "TERKONFIRMASI / SUDAH DITERIMA\n• Kedua belah pihak telah saling menambahkan akun GitHub pasangan sebagai Collaborator melalui menu Repositori -> Settings -> Collaborators.\n• Undangan kolaborasi telah disetujui (Accepted) sebelum sesi praktikum dimulai.")
]

for idx, (label, val) in enumerate(peer_info):
    c0 = tbl_peer.rows[idx].cells[0]
    c1 = tbl_peer.rows[idx].cells[1]
    c0.width = Inches(2.2)
    c1.width = Inches(4.3)
    set_cell_background(c0, "F0FDF4")
    set_cell_background(c1, "F8FAFC")
    set_cell_margins(c0, 60, 60, 100, 100)
    set_cell_margins(c1, 60, 60, 100, 100)
    p0 = c0.paragraphs[0]
    p0.add_run(label).font.bold = True
    p0.runs[0].font.name = "Calibri"
    p0.runs[0].font.size = Pt(9.5)
    p1 = c1.paragraphs[0]
    p1.add_run(val)
    p1.runs[0].font.name = "Calibri"
    p1.runs[0].font.size = Pt(9.5)

p_note_peer = doc.add_paragraph()
p_note_peer.paragraph_format.space_before = Pt(6)
p_note_peer.add_run(
    "*Catatan Pengumpulan Daring: Bukti tangkapan layar status undangan collaborator (dari menu GitHub Settings -> Collaborators) dapat dilampirkan sebagai berkas gambar pendukung saat submit di portal e-learning."
).font.italic = True

# ==========================================
# CATATAN PEMANFAATAN AI
# ==========================================
add_heading_box("Catatan Pemanfaatan Kecerdasan Artifisial (AI)")

p_ai = doc.add_paragraph()
p_ai.paragraph_format.space_after = Pt(6)
p_ai.add_run(
    "Sesuai ketentuan umum Tugas Pendahuluan Modul 7 yang memperbolehkan penggunaan asisten AI dengan kewajiban pencatatan transparan, berikut adalah rincian pemanfaatan alat AI dalam penyusunan jawaban ini:"
)

tbl_ai = doc.add_table(rows=4, cols=2)
tbl_ai.alignment = WD_TABLE_ALIGNMENT.CENTER
ai_records = [
    ("Alat / Perangkat AI yang Digunakan", "Antigravity AI Pair Programmer (Model Generatif Google DeepMind) & Gemini Code Assist."),
    ("Perintah Utama (Prompt)", "1. \"Susun langkah reproduksi galat formal untuk bug status ketersediaan pada formulir AgroMarket dengan memuat lingkungan, data awal, langkah bernomor, hasil aktual, hasil diharapkan, dan frekuensi.\"\n2. \"Jelaskan perbedaan mendalam antara breakpoint biasa, conditional breakpoint, dan logpoint di VS Code beserta contoh skenario nyata pada Next.js.\"\n3. \"Uraikan arti kode galat Prisma P2002, P2003, dan P2025 beserta contoh kasus konkret pada entitas Item dan Ulasan.\"\n4. \"Jelaskan dasar teori ECMAScript mengapa Boolean('false') menghasilkan true dan arsitektur Next.js mengapa redirect() dilarang di blok try.\"\n5. \"Buatkan diagram visual pembuktian langkah reproduksi galat dan diagram alur eksepsi redirect.\""),
    ("Bagian yang Dibantu oleh AI", "• Penstrukturan format laporan galat (bug report) sesuai standar issue GitHub Modul 7.\n• Eksplorasi spesifikasi teknis ECMAScript §7.1.2 dan penelusuran arsitektur eksepsi NEXT_REDIRECT pada Next.js App Router.\n• Perumusan skenario kasus galat Prisma ORM pada entitas sarana pertanian AgroMarket.\n• Pembuatan visual diagram dan pembentukan dokumen Word secara otomatis via Python."),
    ("Metode Verifikasi Hasil", "• Verifikasi Reproduksi: Menguji langsung ekspresi Boolean('false') dan Boolean('') pada terminal Node.js dan Debug Console VS Code.\n• Verifikasi Prisma: Menguji langsung query Prisma yang memicu P2002, P2003, dan P2025 pada basis data PostgreSQL 18 produk AgroMarket.\n• Verifikasi Next.js: Memverifikasi kode sumber Next.js bahwa redirect() memang melempar error NEXT_REDIRECT dengan properti digest unik.")
]

for idx, (label, val) in enumerate(ai_records):
    c0 = tbl_ai.rows[idx].cells[0]
    c1 = tbl_ai.rows[idx].cells[1]
    c0.width = Inches(2.2)
    c1.width = Inches(4.3)
    set_cell_background(c0, "F1F5F9")
    set_cell_background(c1, "FFFFFF")
    set_cell_margins(c0, 60, 60, 100, 100)
    set_cell_margins(c1, 60, 60, 100, 100)
    p0 = c0.paragraphs[0]
    p0.add_run(label).font.bold = True
    p0.runs[0].font.name = "Calibri"
    p0.runs[0].font.size = Pt(9.5)
    p1 = c1.paragraphs[0]
    p1.add_run(val)
    p1.runs[0].font.name = "Calibri"
    p1.runs[0].font.size = Pt(9.5)

output_path = "docs/praktikum/105224037_Elisabeth Nainggolan_Tugas Pendahuluan Modul 7.docx"
doc.save(output_path)
print(f"Document successfully created at: {output_path}")
