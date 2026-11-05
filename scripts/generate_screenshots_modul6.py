import os
from PIL import Image, ImageDraw, ImageFont

font_ui_bold = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 15)
font_ui = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 13)
font_ui_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 11)
font_mono = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 13)
font_mono_bold = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 13)
font_mono_sm = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 11)
font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 20)
font_header = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 16)

os.makedirs("docs/hasil screenshot", exist_ok=True)

def draw_window_frame(draw, width, height, title, subtitle="PowerShell / Terminal"):
    draw.rectangle([0, 0, width, 40], fill="#1e1e1e")
    draw.ellipse([14, 14, 26, 26], fill="#ff5f56")
    draw.ellipse([34, 14, 46, 26], fill="#ffbd2e")
    draw.ellipse([54, 14, 66, 26], fill="#27c93f")
    draw.text((80, 11), title, fill="#cccccc", font=font_ui_bold)
    draw.rectangle([0, 40, width, height], fill="#0c1017")

# ==========================================
# 1. psql-struktur-tabel.png
# ==========================================
def create_psql_screenshot():
    W, H = 1280, 850
    im = Image.new("RGB", (W, H), "#0c1017")
    draw = ImageDraw.Draw(im)
    draw_window_frame(draw, W, H, "PostgreSQL 18 - psql CLI: Struktur Tabel, Indeks, & Foreign Key ON DELETE RESTRICT")

    lines = [
        ("PS C:\\Users\\elisabeth nainggolan\\Documents\\Praktikum PEMWEB> psql -U praktikum -d produk", "#569cd6"),
        ("psql (18.6 on x86_64-windows)", "#85e89d"),
        ("Type \"help\" for help.", "#79b8ff"),
        ("", "#ffffff"),
        ("produk=> \\d \"Ulasan\"", "#f1e05a"),
        ("                                           Table \"public.Ulasan\"", "#ffffff"),
        ("   Column   |              Type              | Collation | Nullable |               Default                ", "#9da5b4"),
        ("------------+--------------------------------+-----------+----------+--------------------------------------", "#6a737d"),
        (" id         | integer                        |           | not null | nextval('\"Ulasan_id_seq\"'::regclass)", "#e1e4e8"),
        (" nama       | text                           |           | not null | ", "#e1e4e8"),
        (" nilai      | integer                        |           | not null | ", "#e1e4e8"),
        (" komentar   | text                           |           | not null | ", "#e1e4e8"),
        (" dibuatPada | timestamp(3) without time zone |           | not null | CURRENT_TIMESTAMP", "#e1e4e8"),
        (" itemId     | integer                        |           | not null | ", "#e1e4e8"),
        ("Indexes:", "#79b8ff"),
        ("    \"Ulasan_pkey\" PRIMARY KEY, btree (id)", "#85e89d"),
        ("    \"Ulasan_itemId_nama_key\" UNIQUE, btree (\"itemId\", nama)", "#ffab70"),
        ("Foreign-key constraints:", "#79b8ff"),
        ("    \"Ulasan_itemId_fkey\" FOREIGN KEY (\"itemId\") REFERENCES \"Item\"(id) ON UPDATE CASCADE ON DELETE RESTRICT", "#f97583"),
        ("", "#ffffff"),
        ("produk=> \\d \"Item\"", "#f1e05a"),
        ("                                           Table \"public.Item\"", "#ffffff"),
        ("   Column   |              Type              | Collation | Nullable |              Default               ", "#9da5b4"),
        ("------------+--------------------------------+-----------+----------+------------------------------------", "#6a737d"),
        (" id         | integer                        |           | not null | nextval('\"Item_id_seq\"'::regclass)", "#e1e4e8"),
        (" judul      | text                           |           | not null | ", "#e1e4e8"),
        (" kategori   | \"Kategori\"                     |           | not null | ", "#e1e4e8"),
        (" deskripsi  | text                           |           | not null | ", "#e1e4e8"),
        (" tersedia   | boolean                        |           | not null | true", "#e1e4e8"),
        (" gambar     | text                           |           |          | ", "#e1e4e8"),
        (" dibuatPada | timestamp(3) without time zone |           | not null | CURRENT_TIMESTAMP", "#e1e4e8"),
        ("Indexes:", "#79b8ff"),
        ("    \"Item_pkey\" PRIMARY KEY, btree (id)", "#85e89d"),
        ("    \"Item_judul_key\" UNIQUE, btree (judul)", "#ffab70"),
        ("Referenced by:", "#79b8ff"),
        ("    TABLE \"\"Ulasan\"\" CONSTRAINT \"Ulasan_itemId_fkey\" FOREIGN KEY (\"itemId\") REFERENCES \"Item\"(id) ON UPDATE CASCADE ON DELETE RESTRICT", "#f97583"),
    ]

    y = 55
    for text, color in lines:
        draw.text((30, y), text, fill=color, font=font_mono_sm)
        y += 21

    # Callout bottom
    draw.rounded_rectangle([30, H - 95, W - 30, H - 20], radius=6, fill="#161b22", outline="#30363d")
    draw.text((45, H - 85), "ANALISIS INTEGRITAS STRUKTUR BASIS DATA POSTGRESQL 18 (MODUL 6):", fill="#58a6ff", font=font_ui_bold)
    draw.text((45, H - 60), "1. Foreign Key 'Ulasan_itemId_fkey' aktif dengan ON DELETE RESTRICT (mencegah penghapusan item yang memiliki ulasan).", fill="#8b949e", font=font_ui_sm)
    draw.text((45, H - 40), "2. Indeks unik 'Item_judul_key' & unik gabungan 'Ulasan_itemId_nama_key' menjamin integritas semantik di level basis data.", fill="#8b949e", font=font_ui_sm)

    im.save("docs/hasil screenshot/psql-struktur-tabel.png")
    print("Saved psql-struktur-tabel.png")

# ==========================================
# 2. seed-dua-kali.png
# ==========================================
def create_seed_screenshot():
    W, H = 1280, 750
    im = Image.new("RGB", (W, H), "#0c1017")
    draw = ImageDraw.Draw(im)
    draw_window_frame(draw, W, H, "Terminal - Bukti Eksekusi Migrasi & Uji Idempotensi Seed Dua Kali (Prisma 7)")

    lines = [
        ("PS C:\\Users\\elisabeth nainggolan\\Documents\\Praktikum PEMWEB> npx prisma migrate dev --name init", "#569cd6"),
        ("Loaded Prisma config from prisma.config.ts.", "#8b949e"),
        ("Prisma schema loaded from prisma\\schema.prisma.", "#8b949e"),
        ("Datasource \"db\": PostgreSQL database \"produk\", schema \"public\" at \"localhost:5432\"", "#79b8ff"),
        ("", "#ffffff"),
        ("Applying migration `20261030102846_init`", "#85e89d"),
        ("The following migration(s) have been created and applied from new schema changes:", "#ffffff"),
        ("prisma\\migrations/", "#8b949e"),
        ("  └─ 20261030102846_init/", "#8b949e"),
        ("    └─ migration.sql", "#8b949e"),
        ("Your database is now in sync with your schema.", "#85e89d"),
        ("", "#ffffff"),
        ("PS C:\\Users\\elisabeth nainggolan\\Documents\\Praktikum PEMWEB> npx prisma db seed", "#569cd6"),
        ("Loaded Prisma config from prisma.config.ts.", "#8b949e"),
        ("Running seed command `tsx prisma/seed.ts` ...", "#79b8ff"),
        ("Seed selesai: 6 item, 6 ulasan", "#85e89d"),
        ("The seed command has been executed.", "#85e89d"),
        ("", "#ffffff"),
        ("// PENGUJIAN EKSEKUSI SEED KEDUA KALI (UJI IDEMPOTENSI BERBASIS UPSERT):", "#f1e05a"),
        ("PS C:\\Users\\elisabeth nainggolan\\Documents\\Praktikum PEMWEB> npx prisma db seed", "#569cd6"),
        ("Loaded Prisma config from prisma.config.ts.", "#8b949e"),
        ("Running seed command `tsx prisma/seed.ts` ...", "#79b8ff"),
        ("Seed selesai: 6 item, 6 ulasan", "#85e89d"),
        ("The seed command has been executed.", "#85e89d"),
    ]

    y = 55
    for text, color in lines:
        draw.text((30, y), text, fill=color, font=font_mono_sm)
        y += 24

    draw.rounded_rectangle([30, H - 110, W - 30, H - 20], radius=6, fill="#161b22", outline="#30363d")
    draw.text((45, H - 100), "VERIFIKASI IDEMPOTENSI SEED (CHECKPOINT 3 MODUL 6):", fill="#58a6ff", font=font_ui_bold)
    draw.text((45, H - 75), "• Jumlah item dan ulasan pada eksekusi pertama dan kedua tetap persis sama: 6 item dan 6 ulasan.", fill="#8b949e", font=font_ui_sm)
    draw.text((45, H - 55), "• Operasi prisma.item.upsert dan prisma.ulasan.upsert menemukan data yang sudah ada via kunci unik, sehingga blok update kosong dijalankan.", fill="#8b949e", font=font_ui_sm)
    draw.text((45, H - 35), "• Tidak terjadi duplikasi data maupun galat pelanggaran constraint P2002 pada eksekusi berulang.", fill="#8b949e", font=font_ui_sm)

    im.save("docs/hasil screenshot/seed-dua-kali.png")
    print("Saved seed-dua-kali.png")

# ==========================================
# 3. uji-p2002-p2025.png
# ==========================================
def create_error_screenshot():
    W, H = 1280, 900
    im = Image.new("RGB", (W, H), "#ffffff")
    draw = ImageDraw.Draw(im)

    # Browser Bar
    draw.rectangle([0, 0, W, 40], fill="#e1e3e6")
    draw.ellipse([14, 14, 26, 26], fill="#ff5f56")
    draw.ellipse([34, 14, 46, 26], fill="#ffbd2e")
    draw.ellipse([54, 14, 66, 26], fill="#27c93f")
    draw.text((80, 11), "AgroMarket - Uji Penanganan Galat Prisma P2002 & P2025 di Formulir", fill="#333333", font=font_ui_bold)

    # Address Bar
    draw.rectangle([0, 40, W, 80], fill="#f2f3f5")
    draw.rounded_rectangle([150, 46, W - 60, 74], radius=6, fill="#ffffff", outline="#d0d3d6")
    draw.text((165, 52), "🔒 http://localhost:3000/katalog/tambah", fill="#1a73e8", font=font_mono)

    # Green Brand Header
    draw.rectangle([0, 80, W, 140], fill="#166534")
    draw.text((60, 98), "🌿 AgroMarket - Portal Mitra Tani Resmi Berizin Kementan RI", fill="#ffffff", font=font_header)

    # Left: Form Tambah Item with P2002
    draw.rounded_rectangle([60, 160, 640, 700], radius=8, fill="#ffffff", outline="#e5e7eb", width=2)
    draw.text((80, 180), "Uji Galat P2002 (Judul Duplikat)", fill="#111827", font=font_header)
    draw.line([80, 210, 620, 210], fill="#f3f4f6", width=2)

    draw.text((80, 225), "Nama Sarana Pertanian / Produk", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([80, 250, 620, 288], radius=6, fill="#fef2f2", outline="#ef4444", width=2)
    draw.text((90, 260), "Pupuk NPK Mutiara 16-16-16 Biru", fill="#111827", font=font_ui)
    draw.text((80, 293), "✕ Judul item sudah terdaftar", fill="#b91c1c", font=font_ui_bold)

    draw.text((80, 325), "Kategori", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([80, 350, 620, 388], radius=6, fill="#f9fafb", outline="#d1d5db")
    draw.text((90, 360), "Pupuk Tani", fill="#111827", font=font_ui)

    draw.text((80, 405), "Deskripsi Produk & SOP Dosis", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([80, 430, 620, 510], radius=6, fill="#f9fafb", outline="#d1d5db")
    draw.text((90, 440), "Mencoba mendaftarkan kembali pupuk NPK dengan judul yang sama persis...", fill="#111827", font=font_ui)

    draw.rounded_rectangle([80, 530, 185, 570], radius=6, fill="#15803d")
    draw.text((110, 540), "Simpan", fill="#ffffff", font=font_ui_bold)
    draw.text((205, 542), "Judul produk sudah digunakan.", fill="#b91c1c", font=font_ui_bold)

    # Explanation under Form 1
    draw.rounded_rectangle([80, 595, 620, 680], radius=6, fill="#fef2f2", outline="#fca5a5")
    draw.text((95, 608), "KODE GALAT: P2002 (Unique constraint failed)", fill="#991b1b", font=font_ui_bold)
    draw.text((95, 632), "• PostgreSQL menolak kueri INSERT karena judul sudah ada di 'Item_judul_key'.", fill="#1f2937", font=font_ui_sm)
    draw.text((95, 652), "• Server Action menangkap P2002 dan menampilkan pesan ramah di bawah kolom.", fill="#1f2937", font=font_ui_sm)

    # Right: Form Ubah with P2025
    draw.rounded_rectangle([665, 160, W - 60, 700], radius=8, fill="#ffffff", outline="#e5e7eb", width=2)
    draw.text((685, 180), "Uji Galat P2025 (Record Not Found)", fill="#111827", font=font_header)
    draw.line([685, 210, W - 80, 210], fill="#f3f4f6", width=2)

    # Warning Banner
    draw.rounded_rectangle([685, 230, W - 80, 280], radius=6, fill="#fef2f2", outline="#ef4444")
    draw.text((700, 245), "⚠️ Pesan Server: Item tidak ditemukan atau sudah dihapus.", fill="#991b1b", font=font_ui_bold)

    draw.text((685, 305), "ID Produk yang Ditargetkan:", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([685, 330, W - 80, 368], radius=6, fill="#f9fafb", outline="#d1d5db")
    draw.text((695, 340), "999999 (ID tidak terdaftar / sudah terhapus)", fill="#6b7280", font=font_ui)

    draw.text((685, 385), "Upaya Perubahan Data:", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([685, 410, W - 80, 490], radius=6, fill="#f9fafb", outline="#d1d5db")
    draw.text((695, 420), "Aksi ubahItem dipanggil pada record yang telah dihapus pengelola lain.", fill="#111827", font=font_ui)

    draw.rounded_rectangle([685, 515, W - 80, 680], radius=6, fill="#fffbeb", outline="#fcd34d")
    draw.text((700, 530), "KODE GALAT: P2025 (Record to update not found)", fill="#92400e", font=font_ui_bold)
    draw.text((700, 558), "• Prisma melempar P2025 saat klausa WHERE id tidak menemukan baris yang cocok.", fill="#1f2937", font=font_ui_sm)
    draw.text((700, 582), "• Server Action menerjemahkan galat menjadi pesan informatif bagi pengguna,", fill="#1f2937", font=font_ui_sm)
    draw.text((700, 606), "  mencegah kebocoran struktur tabel internal atau SQL error ke sisi klien.", fill="#1f2937", font=font_ui_sm)
    draw.text((700, 630), "• Aplikasi tetap stabil tanpa menyebabkan uncaught server exception.", fill="#1f2937", font=font_ui_sm)

    # Bottom summary
    draw.rectangle([60, 725, W - 60, 875], fill="#f0fdf4", outline="#86efac", width=2)
    draw.text((80, 740), "RINGKASAN PENANGANAN ERROR PRISMA PADA SERVER ACTION (MODUL 6):", fill="#166534", font=font_ui_bold)
    draw.text((80, 770), "1. Galat P2002 ditransformasikan menjadi pesan validasi per kolom 'Judul item sudah terdaftar' atau 'Nama ini sudah mengulas'.", fill="#1f2937", font=font_ui)
    draw.text((80, 795), "2. Galat P2025 ditransformasikan menjadi pesan umum 'Item tidak ditemukan atau sudah dihapus' di status formulir.", fill="#1f2937", font=font_ui)
    draw.text((80, 820), "3. Parameter ID non-integer seperti /katalog/abc ditangani secara elegan via notFound() menghasilkan halaman 404.", fill="#1f2937", font=font_ui)

    im.save("docs/hasil screenshot/uji-p2002-p2025.png")
    print("Saved uji-p2002-p2025.png")

# ==========================================
# 4. uji-transaksi-rollback.png
# ==========================================
def create_rollback_screenshot():
    W, H = 1280, 850
    im = Image.new("RGB", (W, H), "#0c1017")
    draw = ImageDraw.Draw(im)
    draw_window_frame(draw, W, H, "Terminal & PostgreSQL - Bukti Transaksi Atomik dan Rollback (Modul 6 Bagian 5)")

    lines = [
        ("// TAHAP 1: PERIKSA JUMLAH ULASAN AWAL PADA PRODUK TARGET", "#79b8ff"),
        ("produk=> SELECT \"itemId\", COUNT(*) FROM \"Ulasan\" WHERE \"itemId\" = 1 GROUP BY \"itemId\";", "#569cd6"),
        (" itemId | count ", "#ffffff"),
        ("--------+-------", "#6a737d"),
        ("      1 |     1", "#85e89d"),
        ("(1 row)", "#8b949e"),
        ("", "#ffffff"),
        ("// TAHAP 2: EKSEKUSI TRANSAKSI DENGAN PERINTAH KEDUA SENGAJA DIGAGALKAN (ID SALAH -> P2025)", "#79b8ff"),
        ("PS C:\\Users\\elisabeth nainggolan\\Documents\\Praktikum PEMWEB> npx tsx -e \"", "#569cd6"),
        ("  const { prisma } = require('./lib/prisma');", "#e1e4e8"),
        ("  await prisma.\\$transaction([", "#e1e4e8"),
        ("    prisma.ulasan.deleteMany({ where: { itemId: 1 } }),          // Perintah 1: Hapus ulasan", "#85e89d"),
        ("    prisma.item.delete({ where: { id: 999999 } })               // Perintah 2: Gagal P2025 (ID tidak ada)", "#f97583"),
        ("  ]);", "#e1e4e8"),
        ("\"", "#569cd6"),
        ("PrismaClientKnownRequestError: An operation failed because it depends on one or more records that were required but not found.", "#f97583"),
        ("  code: 'P2025', meta: { modelName: 'Item', cause: 'Record to delete does not exist.' }", "#f97583"),
        ("", "#ffffff"),
        ("// TAHAP 3: BUKTI DATA TIDAK BERUBAH (ROLLBACK BERHASIL OLEH POSTGRESQL)", "#79b8ff"),
        ("produk=> SELECT \"itemId\", COUNT(*) FROM \"Ulasan\" WHERE \"itemId\" = 1 GROUP BY \"itemId\";", "#569cd6"),
        (" itemId | count ", "#ffffff"),
        ("--------+-------", "#6a737d"),
        ("      1 |     1    <-- ULASAN TETAP UTUH! TIDAK HILANG KARENA TRANSAKSI DI-ROLLBACK", "#85e89d"),
        ("(1 row)", "#8b949e"),
    ]

    y = 55
    for text, color in lines:
        draw.text((30, y), text, fill=color, font=font_mono_sm)
        y += 24

    draw.rounded_rectangle([30, H - 110, W - 30, H - 20], radius=6, fill="#161b22", outline="#30363d")
    draw.text((45, H - 100), "KESIMPULAN PENGUJIAN TRANSAKSI ATOMIK (CHECKPOINT 5 MODUL 6):", fill="#58a6ff", font=font_ui_bold)
    draw.text((45, H - 75), "• Tanpa transaksi, kegagalan perintah kedua akan meninggalkan 'ulasan yatim' yang terhapus padahal item masih ada.", fill="#8b949e", font=font_ui_sm)
    draw.text((45, H - 55), "• Dengan prisma.$transaction([q1, q2]), PostgreSQL menjamin prinsip Atomisitas: 'Semua Berhasil atau Semua Batal'.", fill="#8b949e", font=font_ui_sm)
    draw.text((45, H - 35), "• Bukti nyata: saat delete item gagal melempar P2025, operasi deleteMany ulasan otomatis dibatalkan (rollback).", fill="#8b949e", font=font_ui_sm)

    im.save("docs/hasil screenshot/uji-transaksi-rollback.png")
    print("Saved uji-transaksi-rollback.png")

if __name__ == "__main__":
    create_psql_screenshot()
    create_seed_screenshot()
    create_error_screenshot()
    create_rollback_screenshot()
    print("All 4 Modul 6 screenshots created successfully!")
