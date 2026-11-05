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
run_title = p_title.add_run("TUGAS PENDAHULUAN MODUL 6\nPOSTGRESQL DAN PRISMA ORM")
run_title.font.name = "Calibri"
run_title.font.size = Pt(16)
run_title.font.bold = True
run_title.font.color.rgb = RGBColor(20, 83, 45) # Dark green

p_sub = doc.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_sub = p_sub.add_run("Praktikum Pengembangan Aplikasi Web (052356) – Semester 5\nProgram Studi Ilmu Komputer – Fakultas Sains dan Ilmu Komputer – Universitas Pertamina")
run_sub.font.name = "Calibri"
run_sub.font.size = Pt(10.5)
run_sub.font.italic = True
run_sub.font.color.rgb = RGBColor(100, 116, 139)

doc.add_paragraph().paragraph_format.space_after = Pt(4)

# Identity Card Table
tbl_id = doc.add_table(rows=4, cols=2)
tbl_id.alignment = WD_TABLE_ALIGNMENT.CENTER
identitas = [
    ("Nama Lengkap / NIM", "Elisabeth Nainggolan / 105224037"),
    ("Mata Kuliah / Kelas", "Praktikum Pengembangan Aplikasi Web (052356) / CS2"),
    ("Produk Aplikasi Web", "AgroMarket (Marketplace Sarana Pertanian, Pupuk & Obat Hama Berizin Kementan RI)"),
    ("Tautan Repositori GitHub", "https://github.com/Elisabethngl/105224037_PraktikumPemWeb")
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
add_heading_box("1. Diagram Dua Entitas Produk AgroMarket yang Berelasi 1:N")

p1_desc = doc.add_paragraph()
p1_desc.paragraph_format.space_after = Pt(6)
p1_desc.add_run(
    "Pada aplikasi AgroMarket, dirancang dua entitas yang saling berelasi satu-ke-banyak (1:N), yaitu entitas "
    "Item (merepresentasikan produk pupuk, obat racun hama, benih unggul, atau alat pertanian) dan entitas Ulasan "
    "(merepresentasikan penilaian, skor bintang, dan ulasan teknis dari mitra tani di lapangan). "
    "Satu produk Item dapat memiliki banyak baris Ulasan, sedangkan setiap Ulasan wajib terikat secara tepat pada satu produk Item melalui foreign key itemId."
)

# Embed Diagram Image
diagram_img = "docs/hasil screenshot/diagram-relasi-agromarket.png"
if os.path.exists(diagram_img):
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(6)
    p_img.paragraph_format.space_after = Pt(4)
    p_img.add_run().add_picture(diagram_img, width=Inches(6.2))
    p_caption = doc.add_paragraph()
    p_caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cap = p_caption.add_run("Gambar 1: Diagram Relasi Entitas (ERD 1:N) Item dan Ulasan pada Produk AgroMarket")
    r_cap.font.name = "Calibri"
    r_cap.font.size = Pt(9.5)
    r_cap.font.italic = True
    r_cap.font.color.rgb = RGBColor(71, 85, 105)

# Schema Prisma Snippet in text
p_skema = doc.add_paragraph()
p_skema.paragraph_format.space_after = Pt(6)
p_skema.add_run("Potongan Definisi schema.prisma untuk Kedua Entitas:\n").font.bold = True
code_skema = (
    'model Item {\n'
    '  id          Int       @id @default(autoincrement())\n'
    '  judul       String    @unique // Constraint unik: mencegah duplikasi nama merek sarana tani\n'
    '  kategori    Kategori  // Enum: "Pupuk Tani" | "Obat Racun & Hama" | "Benih Unggul" | "Alat Pertanian"\n'
    '  deskripsi   String\n'
    '  tersedia    Boolean   @default(true)\n'
    '  gambar      String?\n'
    '  dibuatPada  DateTime  @default(now())\n'
    '  ulasan      Ulasan[]  // Relasi 1:N ke entitas Ulasan\n'
    '}\n\n'
    'model Ulasan {\n'
    '  id          Int       @id @default(autoincrement())\n'
    '  nama        String    // Nama petani / pengulas produk\n'
    '  nilai       Int       // Skor rating 1 s.d. 5\n'
    '  komentar    String    // Ulasan efektivitas aplikasi di lahan\n'
    '  dibuatPada  DateTime  @default(now())\n'
    '  itemId      Int       // Foreign key merujuk ke Item.id\n'
    '  item        Item      @relation(fields: [itemId], references: [id], onDelete: Restrict)\n'
    '  @@unique([itemId, nama]) // Constraint unik komposit: 1 pengguna hanya boleh mengulas 1 kali per produk\n'
    '}'
)
p_code = doc.add_paragraph()
p_code.paragraph_format.left_indent = Inches(0.2)
r_c = p_code.add_run(code_skema)
r_c.font.name = "Consolas"
r_c.font.size = Pt(8.5)
r_c.font.color.rgb = RGBColor(30, 41, 59)

# Summary of keys and constraints
p_kunci = doc.add_paragraph()
p_kunci.paragraph_format.space_after = Pt(8)
r_kunci = p_kunci.add_run("Rincian Kunci dan Constraint:\n")
r_kunci.font.bold = True
p_kunci.add_run(
    "1. Primary Key: Item.id (@id) menghasilkan kolom SERIAL dengan indeks Item_pkey; Ulasan.id (@id) menghasilkan Ulasan_pkey.\n"
    "2. Foreign Key: Ulasan.itemId merujuk ke Item.id dengan aturan onDelete: Restrict (constraint Ulasan_itemId_fkey).\n"
    "3. Constraint Unik 1: Item.judul (@unique) menghasilkan indeks unik Item_judul_key untuk menjamin tidak ada dua produk bermerek identik.\n"
    "4. Constraint Unik 2 (Komposit): @@unique([itemId, nama]) pada tabel Ulasan menghasilkan indeks unik Ulasan_itemId_nama_key guna menjamin satu petani/nama tidak dapat mengirim ulasan ganda pada produk yang sama."
)

# ==========================================
# SOAL 2
# ==========================================
add_heading_box("2. Aturan Penghapusan Relasi (onDelete: RESTRICT) dan Alasannya")

p2 = doc.add_paragraph()
p2.paragraph_format.space_after = Pt(8)
p2.add_run("Aturan Penghapusan yang Dipilih: ").font.bold = True
p2.add_run("RESTRICT (onDelete: Restrict)\n\n").font.bold = True
p2.add_run(
    "Alasan Pemilihan dari Sudut Pandang Nilai Data Produk AgroMarket:\n"
    "1. Akuntabilitas dan Perlindungan Rekam Jejak Keamanan Pertanian:\n"
    "   AgroMarket memperdagangkan sarana produksi pertanian resmi yang berizin Kementerian Pertanian RI, termasuk bahan kimia aktif seperti insektisida, fungisida, dan herbisida sistemik beracun. Data ulasan dari petani bukan sekadar komentar umum, melainkan catatan krusial mengenai efektivitas dosis, kompatibilitas tanah, hingga potensi komplain keracunan tanaman akibat salah aplikasi.\n"
    "   Jika aturan CASCADE digunakan, penghapusan produk secara sengaja maupun tidak sengaja akan langsung menghapus seluruh ulasan petani secara otomatis dan diam-diam tanpa peringatan. Hal ini akan menghilangkan bukti historis pengaduan konsumen dan merugikan audit transparansi platform.\n\n"
    "2. Menghindari Data Yatim (Orphan Records) pada Opsi SetNull:\n"
    "   Jika aturan SET NULL diterapkan, kolom foreign key itemId pada ulasan akan dikosongkan (menjadi NULL) saat produk dihapus. Akibatnya, baris ulasan kehilangan relasi induknya dan menjadi ulasan yatim tanpa konteks jelas mengenai produk pertanian apa yang sebenarnya dinilai, sehingga menurunkan integritas data basis data.\n\n"
    "3. Mewajibkan Prosedur Penghapusan Sadar Melalui Transaksi Atomik:\n"
    "   Dengan aturan RESTRICT, basis data PostgreSQL bertindak sebagai garda pengaman terakhir yang secara tegas menolak penghapusan produk jika masih memiliki riwayat ulasan aktif. Pengelola dipaksa melakukan penghapusan secara sadar dan eksplisit melalui transaksi terkoordinasi (prisma.$transaction) atau melakukan pengarsipan status (tersedia: false) tanpa menghilangkan riwayat ulasan petani."
)

# ==========================================
# SOAL 3
# ==========================================
add_heading_box("3. Daftar 10 Skenario Uji (8 CRUD dan 2 Relasi)")

p3 = doc.add_paragraph()
p3.paragraph_format.space_after = Pt(6)
p3.add_run(
    "Berikut adalah rancangan 10 skenario pengujian komprehensif yang mencakup 8 pengujian operasi CRUD (Create, Read, Update, Delete) "
    "dan 2 pengujian relasi transaksional untuk entitas Item dan Ulasan pada AgroMarket:"
)

# 10 Test cases table
tbl_test = doc.add_table(rows=11, cols=4)
tbl_test.alignment = WD_TABLE_ALIGNMENT.CENTER
headers_t = ["No", "Skenario Uji", "Langkah Pengujian", "Hasil yang Diharapkan"]
col_widths = [Inches(0.4), Inches(1.8), Inches(2.2), Inches(2.1)]

for c_idx, h_text in enumerate(headers_t):
    cell = tbl_test.rows[0].cells[c_idx]
    cell.width = col_widths[c_idx]
    set_cell_background(cell, "166534") # dark green
    set_cell_margins(cell, 80, 80, 80, 80)
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(h_text)
    r.font.name = "Calibri"
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(255, 255, 255)

tests_data = [
    ("1", "Create Item Sah", "Kirim formulir tambah item dengan judul unik 'Pupuk Silika Cair', kategori 'Pupuk Tani', deskripsi > 10 karakter, tersedia: true.", "Item berhasil disimpan ke PostgreSQL, cache /katalog direvalidasi, dialihkan ke detail /katalog/[id]."),
    ("2", "Create Item Judul Ganda", "Kirim formulir tambah item dengan judul 'Pupuk NPK Mutiara 16-16-16 Biru' yang sudah ada di basis data.", "Ditolak oleh constraint unik PostgreSQL (kode P2002), Server Action menampilkan pesan galat kolom: 'Judul item sudah terdaftar'."),
    ("3", "Create Item Judul Kosong (Bypass Klien)", "Suntikkan atribut novalidate di form, kosongkan kolom judul, lalu kirim formulir.", "Ditolak skema Zod di Server Action dengan galat 'Judul minimal 3 karakter'. Tidak ada kueri SQL yang dieksekusi ke PostgreSQL."),
    ("4", "Read Detail Item & Relasi Ulasan", "Akses rute /katalog/1 pada peramban.", "Halaman memuat data produk beserta seluruh ulasannya dalam 1 kueri efisien via include/select bertingkat (bebas pola N+1)."),
    ("5", "Read Item Tidak Ditemukan", "Akses URL rute yang tidak terdaftar, misalnya /katalog/99999 atau /katalog/abc.", "Fungsi ambilItem() mengembalikan null, Next.js mengeksekusi notFound() dan menampilkan halaman 404 tanpa galat server."),
    ("6", "Update Item Sah", "Buka formulir ubah pada produk ID 1, perbarui deskripsi takaran dosis aplikasi, lalu simpan.", "Perubahan tersimpan via prisma.item.update, cache halaman diperbarui, detail menampilkan deskripsi terbaru."),
    ("7", "Update Item yang Sudah Dihapus", "Kirim aksi ubahItem pada ID produk yang telah dihapus oleh pengguna lain.", "Prisma melempar galat P2025 (Record to update not found), Server Action menangkap dan menampilkan 'Item tidak ditemukan atau sudah dihapus'."),
    ("8", "Delete Item Langsung Ditolak (RESTRICT)", "Panggil perintah langsung prisma.item.delete pada produk yang masih memiliki data ulasan.", "Ditolak oleh constraint foreign key PostgreSQL ON DELETE RESTRICT (eksepsi P2003). Data produk dan ulasan tetap utuh."),
    ("9", "Relasi: Ulasan Ganda Pengguna yang Sama", "Pengulas bernama 'Pak Subur' mengirim ulasan kedua kalinya pada produk yang sama.", "Ditolak oleh constraint unik komposit @@unique([itemId, nama]) (P2002), menampilkan 'Nama ini sudah mengulas item ini'."),
    ("10", "Relasi: Transaksi Hapus & Bukti Rollback", "Jalankan prisma.$transaction untuk hapus ulasan lalu hapus item, namun buat perintah kedua sengaja gagal (ID salah).", "Perintah kedua gagal melempar P2025, seluruh transaksi di-rollback secara atomik. Ulasan yang sempat dihapus kembali utuh."),
]

for row_idx, data in enumerate(tests_data):
    row_cells = tbl_test.rows[row_idx + 1].cells
    bg_color = "F8FAFC" if (row_idx % 2 == 1) else "FFFFFF"
    for c_idx, val in enumerate(data):
        cell = row_cells[c_idx]
        cell.width = col_widths[c_idx]
        set_cell_background(cell, bg_color)
        set_cell_margins(cell, 60, 60, 80, 80)
        p = cell.paragraphs[0]
        if c_idx == 0:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(val)
        r.font.name = "Calibri"
        r.font.size = Pt(8.5)

doc.add_paragraph().paragraph_format.space_after = Pt(8)

# ==========================================
# SOAL 4
# ==========================================
add_heading_box("4. Urutan Perintah Prisma 7 Setelah Perubahan Skema dan Alasan Eksekusi Eksplisit")

p4 = doc.add_paragraph()
p4.paragraph_format.space_after = Pt(8)
p4.add_run("Urutan Perintah Prisma 7 Setelah schema.prisma Mengalami Perubahan:\n").font.bold = True
p4.add_run(
    "1. npx prisma migrate dev --name <nama_migrasi>\n"
    "   Perintah ini membandingkan skema lokal dengan basis data, membuat berkas migrasi SQL baru di dalam direktori prisma/migrations/<stempel>_<nama>/migration.sql, lalu menerapkannya secara langsung ke basis data PostgreSQL pengembangan.\n\n"
    "2. npx prisma generate\n"
    "   Perintah ini membaca definisi skema terbaru dan menghasilkan artefak Prisma Client bertipe (type-safe TypeScript client) ke folder output yang dikonfigurasi (pada Modul 6 ke generated/prisma).\n\n"
    "3. npx prisma db seed\n"
    "   Perintah ini mengeksekusi skrip pengisian data awal (prisma/seed.ts melalui runner tsx) sebagaimana didefinisikan pada prisma.config.ts untuk mengisi data sintetis awal yang konsisten ke dalam tabel basis data.\n\n"
)
p4.add_run("Alasan generate dan seed Harus Dijalankan Secara Eksplisit pada Prisma 7:\n").font.bold = True
p4.add_run(
    "• Perubahan Arsitektur pada Prisma 7 (Pemisahan Tanggung Jawab):\n"
    "  Pada versi Prisma sebelumnya (Prisma 5 dan 6), perintah prisma migrate dev secara otomatis menjalankan prisma generate dan prisma db seed di latar belakang. Namun pada rilis Prisma 7, perilaku otomatis ini dihilangkan agar setiap perkakas memiliki fokus tunggal (decoupled).\n\n"
    "• Alasan generate Eksplisit:\n"
    "  Pemisahan ini memberikan kendali penuh kepada pengembang atau proses CI/CD untuk menentukan kapan kode sumber klien dikompilasi ulang. Pada arsitektur monorepo atau kontainer Docker, proses migrasi skema basis data sering kali dijalankan di lingkungan terpisah dari proses build kode TypeScript. Tanpa menjalankan npx prisma generate secara eksplisit, kode aplikasi Next.js akan tetap membaca tipe lama pada generated/prisma, menyebabkan galat TypeScript (TS2339/TS2322) karena model atau kolom baru belum terdaftar.\n\n"
    "• Alasan seed Eksplisit:\n"
    "  Seeding data hanya diperlukan pada instalasi awal atau penyiapan data pengujian lokal, bukan setiap kali skema kolom kecil diubah. Jika seed dipicu otomatis pada setiap migrasi skema, basis data akan dibebani kueri pengisian berulang dan berisiko menimpa atau mengacaukan data uji yang sedang aktif digunakan."
)

# ==========================================
# SOAL 5
# ==========================================
add_heading_box("5. Alasan Seed Berbasis upsert Dapat Dijalankan Ulang Sedangkan create Biasa Gagal")

p5 = doc.add_paragraph()
p5.paragraph_format.space_after = Pt(8)
p5.add_run(
    "Perbedaan mendasar terletak pada sifat Idempotensi (Idempotency) operasi basis data:\n\n"
    "1. Karakteristik Operasi upsert (Dapat Dijalankan Berulang / Idempoten):\n"
    "   Perintah upsert merupakan gabungan cerdas antara operasi Update dan Insert:\n"
    "   await prisma.item.upsert({\n"
    "     where: { judul: data.judul },\n"
    "     update: {},\n"
    "     create: data,\n"
    "   });\n"
    "   Saat seed dijalankan, Prisma terlebih dahulu memeriksa klausa where apakah judul produk sudah ada di basis data PostgreSQL. Apabila data sudah ada (pada eksekusi seed kedua dan seterusnya), Prisma hanya mengeksekusi blok update (yang disetel kosong {} sehingga tidak mengubah apa pun). Apabila data belum ada (pada eksekusi seed pertama), Prisma mengeksekusi blok create.\n"
    "   Dengan demikian, npx prisma db seed dapat dipanggil puluhan kali tanpa menghasilkan data ganda dan tanpa menimbulkan galat error.\n\n"
    "2. Karakteristik Operasi create Biasa (Gagal Saat Dijalankan Ulang):\n"
    "   Perintah create biasa (misalnya await prisma.item.create({ data })) selalu mengirimkan kueri SQL INSERT INTO ke tabel basis data tanpa memeriksa keberadaan data sebelumnya.\n"
    "   Pada eksekusi pertama, kueri berhasil. Namun pada eksekusi kedua, basis data PostgreSQL mendeteksi pelanggaran constraint unik (@unique pada judul Item atau @@unique([itemId, nama]) pada Ulasan). Akibatnya, PostgreSQL menolak kueri dan Prisma melempar eksepsi PrismaClientKnownRequestError dengan kode P2002 (Unique constraint failed). Eksekusi script seed langsung terhenti secara paksa (crash) dan menyisakan basis data dalam kondisi tidak konsisten."
)

# ==========================================
# CATATAN PEMANFAATAN AI
# ==========================================
add_heading_box("Catatan Pemanfaatan Kecerdasan Artifisial (AI)")

tbl_ai = doc.add_table(rows=4, cols=2)
tbl_ai.alignment = WD_TABLE_ALIGNMENT.CENTER
ai_notes = [
    ("Alat / Perkakas AI", "Antigravity AI Pair Programmer & Gemini Code Assist"),
    ("Perintah Utama (Prompt)", "1. 'Bantu rancang diagram ERD 1:N dua entitas produk AgroMarket (Item dan Ulasan) dengan constraint unik dan foreign key onDelete: Restrict.'\n2. 'Susun 10 skenario uji (8 CRUD dan 2 relasi) untuk pengujian PostgreSQL dan Prisma 7.'\n3. 'Jelaskan perbedaan alur perintah Prisma 7 dan sifat idempoten upsert vs create.'"),
    ("Bagian yang Dibantu", "Perancangan skema relasi Item-Ulasan, penyusunan tabel 10 skenario pengujian CRUD/transaksi, formulasi penjelasan arsitektur decoupled Prisma 7 dan idempocency upsert, serta pembuatan visualisasi diagram relasi entitas."),
    ("Cara Memverifikasi Hasil", "Memeriksa kesesuaian atribut skema dengan modul 6 dan lib/tipe.ts AgroMarket, memvalidasi aturan PostgreSQL ON DELETE RESTRICT pada dokumentasi resmi, memverifikasi perilaku Prisma 7 CLI migrate dev, generate, dan db seed, serta memastikan seluruh kunci constraint unik telah terakomodasi secara tepat.")
]
for idx, (label, val) in enumerate(ai_notes):
    c0 = tbl_ai.rows[idx].cells[0]
    c1 = tbl_ai.rows[idx].cells[1]
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

out_docx = "C:/Users/elisabeth nainggolan/Downloads/105224037_Elisabeth Nainggolan_Tugas Pendahuluan Modul 6.docx"
doc.save(out_docx)
print("Saved Word document to", out_docx)

# Also save in project folder for backup
doc.save("docs/praktikum/105224037_Elisabeth Nainggolan_Tugas Pendahuluan Modul 6.docx")
print("Saved backup in docs/praktikum/")
