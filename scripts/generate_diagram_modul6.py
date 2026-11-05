import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1350, 780
im = Image.new("RGB", (W, H), "#f8fafc")
draw = ImageDraw.Draw(im)

font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
font_subtitle = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
font_th = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 16)
font_td_bold = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 13)
font_td = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 13)
font_mono = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 12)
font_mono_bold = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 12)
font_badge = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 11)

# Title Header
draw.rectangle([0, 0, W, 80], fill="#14532d") # Dark green
draw.text((40, 16), "DIAGRAM ENTITY-RELATIONSHIP (1:N) - PRODUK AGROMARKET", fill="#ffffff", font=font_title)
draw.text((40, 48), "Relasi Entitas Item (Sarana Pertanian) dan Ulasan dengan Aturan onDelete: RESTRICT | PostgreSQL 18 & Prisma ORM 7", fill="#bbf7d0", font=font_subtitle)

# Table 1: Item (Left)
# Position: x=60, y=120, width=540, height=520
x1, y1, w1, h1 = 60, 120, 550, 520
draw.rounded_rectangle([x1, y1, x1 + w1, y1 + h1], radius=10, fill="#ffffff", outline="#cbd5e1", width=2)
# Table Header
draw.rounded_rectangle([x1, y1, x1 + w1, y1 + 55], radius=10, fill="#166534")
draw.rectangle([x1, y1 + 30, x1 + w1, y1 + 55], fill="#166534") # flatten bottom corners
draw.text((x1 + 20, y1 + 16), "TABEL: Item (Sarana Pertanian)", fill="#ffffff", font=font_th)
draw.text((x1 + 380, y1 + 20), "Primary Entity (1)", fill="#bbf7d0", font=font_badge)

# Item Columns
cols_item = [
    ("id", "Int", "PK, AutoIncrement", "#1e3a8a", "#dbeafe"),
    ("judul", "String", "Unique (Item_judul_key)", "#991b1b", "#fee2e2"),
    ("kategori", "Enum (Kategori)", "Pupuk / Pestisida / Benih / Alat", "#166534", "#dcfce7"),
    ("deskripsi", "String", "Deskripsi teknis & dosis Kementan", "#374151", "#f3f4f6"),
    ("tersedia", "Boolean", "Default: true", "#374151", "#f3f4f6"),
    ("gambar", "String?", "Nullable (kolom opsional)", "#6b7280", "#f3f4f6"),
    ("dibuatPada", "DateTime", "Default: now()", "#374151", "#f3f4f6"),
    ("ulasan", "Ulasan[]", "Relasi 1:N (Virtual Prisma Field)", "#0f766e", "#ccfbf1"),
]

y_row = y1 + 70
for name, typ, desc, col_b, bg_b in cols_item:
    draw.rectangle([x1 + 15, y_row - 4, x1 + w1 - 15, y_row + 42], fill="#f8fafc" if (cols_item.index((name, typ, desc, col_b, bg_b)) % 2 == 1) else "#ffffff")
    draw.text((x1 + 25, y_row + 4), name, fill="#0f172a", font=font_td_bold)
    draw.text((x1 + 140, y_row + 5), typ, fill="#475569", font=font_mono)
    # Badge description
    badge_w = draw.textlength(desc, font=font_badge) + 16
    draw.rounded_rectangle([x1 + 270, y_row + 2, x1 + 270 + badge_w, y_row + 26], radius=4, fill=bg_b)
    draw.text((x1 + 278, y_row + 6), desc, fill=col_b, font=font_badge)
    draw.line([x1 + 15, y_row + 44, x1 + w1 - 15, y_row + 44], fill="#f1f5f9", width=1)
    y_row += 52

# Item Constraints Box
draw.rounded_rectangle([x1 + 15, y1 + h1 - 85, x1 + w1 - 15, y1 + h1 - 15], radius=6, fill="#f0fdf4", outline="#86efac", width=1)
draw.text((x1 + 25, y1 + h1 - 78), "Constraint Unik & Kunci:", fill="#166534", font=font_td_bold)
draw.text((x1 + 25, y1 + h1 - 56), "• PRIMARY KEY (id) -> Indeks SERIAL Item_pkey", fill="#334155", font=font_td)
draw.text((x1 + 25, y1 + h1 - 36), "• UNIQUE (judul) -> Indeks unik Item_judul_key (mencegah nama ganda)", fill="#334155", font=font_td)

# Table 2: Ulasan (Right)
# Position: x=740, y=120, width=550, height=520
x2, y2, w2, h2 = 740, 120, 550, 520
draw.rounded_rectangle([x2, y2, x2 + w2, y2 + h2], radius=10, fill="#ffffff", outline="#cbd5e1", width=2)
# Table Header
draw.rounded_rectangle([x2, y2, x2 + w2, y2 + 55], radius=10, fill="#1e40af") # Dark Blue
draw.rectangle([x2, y2 + 30, x2 + w2, y2 + 55], fill="#1e40af")
draw.text((x2 + 20, y2 + 16), "TABEL: Ulasan (Rating Petani)", fill="#ffffff", font=font_th)
draw.text((x2 + 380, y2 + 20), "Dependent Entity (N)", fill="#dbeafe", font=font_badge)

# Ulasan Columns
cols_ulasan = [
    ("id", "Int", "PK, AutoIncrement", "#1e3a8a", "#dbeafe"),
    ("itemId", "Int", "FK -> Item.id (onDelete: Restrict)", "#991b1b", "#fee2e2"),
    ("nama", "String", "Nama pengulas / mitra tani (2-60 char)", "#374151", "#f3f4f6"),
    ("nilai", "Int", "Skor kepuasan (1 s.d. 5)", "#166534", "#dcfce7"),
    ("komentar", "String", "Ulasan aplikasi lapangan (5-500 char)", "#374151", "#f3f4f6"),
    ("dibuatPada", "DateTime", "Default: now()", "#374151", "#f3f4f6"),
    ("item", "Item", "Relasi Induk (Virtual Prisma Field)", "#0f766e", "#ccfbf1"),
]

y_row2 = y2 + 70
for name, typ, desc, col_b, bg_b in cols_ulasan:
    draw.rectangle([x2 + 15, y_row2 - 4, x2 + w2 - 15, y_row2 + 42], fill="#f8fafc" if (cols_ulasan.index((name, typ, desc, col_b, bg_b)) % 2 == 1) else "#ffffff")
    draw.text((x2 + 25, y_row2 + 4), name, fill="#0f172a", font=font_td_bold)
    draw.text((x2 + 130, y_row2 + 5), typ, fill="#475569", font=font_mono)
    # Badge description
    badge_w = draw.textlength(desc, font=font_badge) + 16
    draw.rounded_rectangle([x2 + 235, y_row2 + 2, x2 + 235 + badge_w, y_row2 + 26], radius=4, fill=bg_b)
    draw.text((x2 + 243, y_row2 + 6), desc, fill=col_b, font=font_badge)
    draw.line([x2 + 15, y_row2 + 44, x2 + w2 - 15, y_row2 + 44], fill="#f1f5f9", width=1)
    y_row2 += 52

# Ulasan Constraints Box
draw.rounded_rectangle([x2 + 15, y2 + h2 - 110, x2 + w2 - 15, y2 + h2 - 15], radius=6, fill="#eff6ff", outline="#93c5fd", width=1)
draw.text((x2 + 25, y2 + h2 - 102), "Foreign Key & Constraint Unik Komposit:", fill="#1e40af", font=font_td_bold)
draw.text((x2 + 25, y2 + h2 - 80), "• FOREIGN KEY (itemId) REFERENCES Item(id) ON DELETE RESTRICT", fill="#334155", font=font_td)
draw.text((x2 + 25, y2 + h2 - 60), "• UNIQUE (itemId, nama) -> Indeks unik Ulasan_itemId_nama_key", fill="#334155", font=font_td)
draw.text((x2 + 25, y2 + h2 - 40), "  (Satu nama pengulas hanya dapat memberikan 1 ulasan per produk)", fill="#64748b", font=font_td)

# Connecting Arrow (Relationship)
# From Item (x1+w1 = 610) to Ulasan (x2 = 740) at y = 260
y_rel = 250
draw.line([x1 + w1, y_rel, x2, y_rel], fill="#dc2626", width=3)
# One marker (||) on Item side
draw.line([x1 + w1 + 15, y_rel - 12, x1 + w1 + 15, y_rel + 12], fill="#dc2626", width=3)
draw.line([x1 + w1 + 25, y_rel - 12, x1 + w1 + 25, y_rel + 12], fill="#dc2626", width=3)
# Many marker (Crow's foot <) on Ulasan side
draw.line([x2 - 25, y_rel - 12, x2 - 5, y_rel], fill="#dc2626", width=3)
draw.line([x2 - 25, y_rel + 12, x2 - 5, y_rel], fill="#dc2626", width=3)
draw.line([x2 - 28, y_rel - 12, x2 - 28, y_rel + 12], fill="#dc2626", width=3)

# Label on Connection Box
draw.rounded_rectangle([625, y_rel - 42, 725, y_rel - 12], radius=4, fill="#fee2e2", outline="#ef4444", width=1)
draw.text((642, y_rel - 36), "1 : N (Relasi)", fill="#991b1b", font=font_td_bold)

draw.rounded_rectangle([615, y_rel + 18, 735, y_rel + 48], radius=4, fill="#fef2f2", outline="#dc2626", width=1)
draw.text((622, y_rel + 24), "onDelete: Restrict", fill="#b91c1c", font=font_badge)

# Bottom Footer Info
draw.rectangle([0, H - 45, W, H], fill="#0f172a")
draw.text((40, H - 32), "Mahasiswa: Elisabeth Nainggolan | NIM: 105224037 | Universitas Pertamina - Praktikum PemWeb 2026", fill="#94a3b8", font=font_td)
draw.text((W - 380, H - 32), "Prisma 7 Schema Generator • PostgreSQL 18", fill="#94a3b8", font=font_td)

out_path = "docs/hasil screenshot/diagram-relasi-agromarket.png"
im.save(out_path)
print("Saved", out_path)

# Also copy to Downloads if available
downloads_dir = "C:/Users/elisabeth nainggolan/Downloads"
if os.path.exists(downloads_dir):
    im.save(os.path.join(downloads_dir, "105224037_Diagram_Relasi_Modul_6.png"))
    print("Saved to Downloads")
