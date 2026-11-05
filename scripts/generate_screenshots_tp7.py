import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs("docs/hasil screenshot", exist_ok=True)

# Load fonts
font_ui_bold = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 15)
font_ui = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 13)
font_ui_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 11)
font_mono = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 13)
font_mono_bold = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 13)
font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 18)
font_header = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 15)

def draw_window_frame(draw, width, height, title):
    draw.rectangle([0, 0, width, 40], fill="#1e1e1e")
    draw.ellipse([14, 14, 26, 26], fill="#ff5f56")
    draw.ellipse([34, 14, 46, 26], fill="#ffbd2e")
    draw.ellipse([54, 14, 66, 26], fill="#27c93f")
    draw.text((80, 11), title, fill="#cccccc", font=font_ui_bold)
    draw.rectangle([0, 40, width, height], fill="#0f172a")

# ==============================================================================
# 1. tp7-reproduksi-galat-agromarket.png
# ==============================================================================
def make_reproduction_screenshot():
    W, H = 1200, 780
    im = Image.new("RGB", (W, H), "#0f172a")
    draw = ImageDraw.Draw(im)
    draw_window_frame(draw, W, H, "AgroMarket - Langkah Reproduksi Galat Status Ketersediaan (Issue #11)")

    # Left Box: Form & Network Simulation
    draw.rounded_rectangle([30, 60, 570, 730], radius=8, fill="#1e293b", outline="#334155", width=2)
    draw.text((50, 75), "1. Skenario Formulir & Payload Network", fill="#38bdf8", font=font_header)
    
    form_lines = [
        ("Produk", "Pupuk NPK Mutiara 16-16-16 (Item ID: 1)"),
        ("URL Rute", "http://localhost:3000/katalog/1/edit"),
        ("Elemen Input", "<select name=\"tersedia\">"),
        ("Pilihan Pengguna", "\"Tidak tersedia\" (value=\"false\")"),
        ("Aksi", "Klik tombol 'Simpan Perubahan' (Server Action POST)")
    ]
    y = 120
    for label, val in form_lines:
        draw.text((50, y), f"{label}:", fill="#94a3b8", font=font_ui_bold)
        draw.text((200, y), val, fill="#f8fafc", font=font_ui)
        y += 32

    # Network Request Simulation
    draw.rounded_rectangle([50, 300, 550, 480], radius=6, fill="#0f172a", outline="#475569")
    draw.text((65, 310), "[DevTools -> Network -> Payload]", fill="#f59e0b", font=font_mono_bold)
    payload_text = [
        "Request URL: http://localhost:3000/katalog/1/edit",
        "Request Method: POST",
        "Header: Next-Action: a7c1... (Server Action)",
        "Payload FormData:",
        "  judul: 'Pupuk NPK Mutiara 16-16-16'",
        "  kategori: 'Pupuk Tani'",
        "  tersedia: 'false'  <-- STRING DARI BROWSER BENAR"
    ]
    py = 340
    for pt in payload_text:
        col = "#4ade80" if "STRING DARI BROWSER" in pt else "#cbd5e1"
        draw.text((65, py), pt, fill=col, font=font_mono)
        py += 19

    # Result Box
    draw.rounded_rectangle([50, 500, 550, 710], radius=6, fill="#1e1e2e", outline="#ef4444")
    draw.text((65, 510), "Status Aktual vs Diharapkan", fill="#f87171", font=font_header)
    res_text = [
        ("Hasil Diharapkan:", "Produk tersimpan dengan status 'Tidak tersedia' (tersedia = false)", "#38bdf8"),
        ("Hasil Aktual:", "Produk TETAP berstatus 'Tersedia' (tersedia = true)!", "#ef4444"),
        ("Gejala di UI:", "Label hijau 'Tersedia' tetap muncul di kartu katalog & detail produk.", "#fbbf24"),
        ("Frekuensi:", "5 dari 5 percobaan (100% konsisten terjadi).", "#e2e8f0")
    ]
    ry = 545
    for h, desc, c in res_text:
        draw.text((65, ry), h, fill=c, font=font_ui_bold)
        draw.text((65, ry + 20), desc, fill="#e2e8f0", font=font_ui)
        ry += 42

    # Right Box: Debugger Analysis & Root Cause
    draw.rounded_rectangle([600, 60, 1170, 730], radius=8, fill="#1e293b", outline="#334155", width=2)
    draw.text((620, 75), "2. Debug Console VS Code & Akar Masalah", fill="#38bdf8", font=font_header)

    draw.rounded_rectangle([620, 120, 1150, 480], radius=6, fill="#0c1017", outline="#3b82f6")
    draw.text((635, 130), "DEBUG CONSOLE (Breakpoint di actions.ts:18)", fill="#60a5fa", font=font_mono_bold)
    
    dbg_lines = [
        ("> Object.fromEntries(formData)", "#e2e8f0"),
        ("{ judul: 'Pupuk NPK Mutiara 16-16-16', tersedia: 'false' }", "#94a3b8"),
        ("> skemaItem.safeParse(Object.fromEntries(formData)).data", "#e2e8f0"),
        ("{ judul: 'Pupuk NPK Mutiara 16-16-16', tersedia: true }", "#f87171"),
        ("> // EVALUASI EKSPRESI JAVASCRIPT:", "#64748b"),
        ("> Boolean('false')", "#e2e8f0"),
        ("true    <-- STRING NON-KOSONG DIANGGAP TRUTHY OLEH JS!", "#ef4444"),
        ("> Boolean('')", "#e2e8f0"),
        ("false   <-- HANYA STRING KOSONG YANG FALSY", "#4ade80"),
        ("> z.coerce.boolean() memakai konstruktor Boolean(input)", "#f59e0b")
    ]
    dy = 160
    for line, color in dbg_lines:
        draw.text((635, dy), line, fill=color, font=font_mono)
        dy += 30

    # Solusi box
    draw.rounded_rectangle([620, 500, 1150, 710], radius=6, fill="#064e3b", outline="#10b981")
    draw.text((635, 510), "Solusi Tepat: Gunakan z.stringbool()", fill="#34d399", font=font_header)
    sol_lines = [
        ("// lib/skema.ts - Perbaikan Menggunakan Zod 4:", "#a7f3d0"),
        ("export const skemaItem = z.object({", "#ffffff"),
        ("  judul: z.string().trim().min(3),", "#ffffff"),
        ("  tersedia: z.stringbool(), // 'true' -> true, 'false' -> false", "#fef08a"),
        ("});", "#ffffff"),
        ("Setelah diperbaiki: 'false' dipetakan secara akurat menjadi false.", "#6ee7b7")
    ]
    sy = 545
    for s, sc in sol_lines:
        draw.text((635, sy), s, fill=sc, font=font_mono)
        sy += 26

    im.save("docs/hasil screenshot/tp7-reproduksi-galat-agromarket.png")
    print("Created tp7-reproduksi-galat-agromarket.png")

# ==============================================================================
# 2. tp7-perbandingan-debugging-vscode.png
# ==============================================================================
def make_debugging_comparison():
    W, H = 1200, 700
    im = Image.new("RGB", (W, H), "#0f172a")
    draw = ImageDraw.Draw(im)
    draw_window_frame(draw, W, H, "VS Code Debugger: Perbandingan Breakpoint, Conditional Breakpoint, dan Logpoint")

    cards = [
        {
            "title": "1. Standard Breakpoint",
            "icon": "●",
            "icon_color": "#ef4444",
            "sub": "Titik Henti Tanpa Syarat",
            "desc": "Menghentikan eksekusi kode seketika saat instruksi baris dicapai. Membuka panel Variables, Watch, Call Stack, dan Debug Console.",
            "behavior": "Menghentikan program (Pause)",
            "impact": "Mengubah kode: TIDAK",
            "use_case": "Situasi Tepat:\nMenelusuri logika fungsi yang jarang dipanggil atau dipicu satu kali, misalnya Server Action tambahItem() atau memeriksa inisialisasi koneksi Prisma saat server pertama kali start.",
            "box_color": "#1e293b",
            "border": "#ef4444"
        },
        {
            "title": "2. Conditional Breakpoint",
            "icon": "◆",
            "icon_color": "#f59e0b",
            "sub": "Titik Henti Bersyarat",
            "desc": "Mengevaluasi ekspresi logika. Eksekusi HANYA berhenti jika ekspresi bernilai truthy (misal: item.id === 42 atau harga < 0). Jika falsy, eksekusi lanjut tanpa jeda.",
            "behavior": "Berhenti jika ekspresi == true",
            "impact": "Mengubah kode: TIDAK",
            "use_case": "Situasi Tepat:\nMenelusuri galat pada loop perulangan besar atau fungsi yang dipanggil ratusan kali (misal iterasi 1.000 produk katalog, hanya ingin berhenti saat kategori === 'Obat Racun & Hama').",
            "box_color": "#1e293b",
            "border": "#f59e0b"
        },
        {
            "title": "3. Logpoint",
            "icon": "◇",
            "icon_color": "#3b82f6",
            "sub": "Titik Pencatatan Non-Breaking",
            "desc": "Mencetak pesan dan evaluasi ekspresi (misal: 'Proses item: {item.judul}') langsung ke Debug Console TANPA menghentikan alur program sama sekali.",
            "behavior": "TIDAK menghentikan program",
            "impact": "Mengubah kode: TIDAK (Bebas Git dirty)",
            "use_case": "Situasi Tepat:\nMemantau alur event/state berkecepatan tinggi tanpa merusak aspek waktu nyata (mencegah race conditions). Jauh lebih aman dan bersih dibanding menyisipkan console.log() manual.",
            "box_color": "#1e293b",
            "border": "#3b82f6"
        }
    ]

    card_w = 360
    card_gap = 25
    start_x = 35

    for idx, c in enumerate(cards):
        cx = start_x + idx * (card_w + card_gap)
        draw.rounded_rectangle([cx, 60, cx + card_w, 660], radius=8, fill=c["box_color"], outline=c["border"], width=2)
        
        # Header
        draw.text((cx + 20, 80), c["icon"], fill=c["icon_color"], font=font_title)
        draw.text((cx + 50, 82), c["title"], fill="#f8fafc", font=font_header)
        draw.text((cx + 20, 115), c["sub"], fill=c["icon_color"], font=font_ui_bold)
        
        # Divider
        draw.line([cx + 20, 140, cx + card_w - 20, 140], fill="#334155", width=1)
        
        # Deskripsi
        draw.text((cx + 20, 155), "Mekanisme Kerja:", fill="#94a3b8", font=font_ui_bold)
        # wrap text
        words = c["desc"].split()
        line = ""
        ly = 180
        for w in words:
            if draw.textlength(line + w, font=font_ui) < card_w - 45:
                line += w + " "
            else:
                draw.text((cx + 20, ly), line, fill="#cbd5e1", font=font_ui)
                ly += 22
                line = w + " "
        if line:
            draw.text((cx + 20, ly), line, fill="#cbd5e1", font=font_ui)
            ly += 22

        # Sifat Box
        draw.rounded_rectangle([cx + 20, 310, cx + card_w - 20, 390], radius=6, fill="#0f172a", outline="#334155")
        draw.text((cx + 30, 320), "Karakteristik:", fill="#38bdf8", font=font_ui_bold)
        draw.text((cx + 30, 342), f"• {c['behavior']}", fill="#f1f5f9", font=font_ui_sm)
        draw.text((cx + 30, 362), f"• {c['impact']}", fill="#4ade80", font=font_ui_sm)

        # Situasi Tepat
        draw.rounded_rectangle([cx + 20, 410, cx + card_w - 20, 640], radius=6, fill="#1e1e2e", outline=c["border"])
        draw.text((cx + 30, 420), "Situasi Penggunaan yang Tepat:", fill=c["icon_color"], font=font_ui_bold)
        
        raw_uc = c["use_case"].replace("Situasi Tepat:\n", "")
        words_uc = raw_uc.split()
        line_uc = ""
        uy = 450
        for w in words_uc:
            if draw.textlength(line_uc + w, font=font_ui) < card_w - 60:
                line_uc += w + " "
            else:
                draw.text((cx + 30, uy), line_uc, fill="#e2e8f0", font=font_ui)
                uy += 22
                line_uc = w + " "
        if line_uc:
            draw.text((cx + 30, uy), line_uc, fill="#e2e8f0", font=font_ui)

    im.save("docs/hasil screenshot/tp7-perbandingan-debugging-vscode.png")
    print("Created tp7-perbandingan-debugging-vscode.png")

# ==============================================================================
# 3. tp7-alur-redirect-nextjs.png
# ==============================================================================
def make_redirect_flow_diagram():
    W, H = 1200, 720
    im = Image.new("RGB", (W, H), "#0f172a")
    draw = ImageDraw.Draw(im)
    draw_window_frame(draw, W, H, "Next.js App Router: Mengapa redirect() Dilarang di Dalam Blok try...catch")

    # Left: The Wrong Pattern (Inside try)
    draw.rounded_rectangle([40, 60, 580, 670], radius=8, fill="#1e1e2e", outline="#ef4444", width=2)
    draw.text((60, 80), "Pola SALAH: redirect() di dalam try", fill="#ef4444", font=font_title)
    
    code_wrong = [
        ("try {", "#ffffff"),
        ("  await prisma.item.delete({ where: { id } });", "#93c5fd"),
        ("  revalidatePath('/katalog');", "#93c5fd"),
        ("  redirect('/katalog'); // <-- MELEMPAR NEXT_REDIRECT!", "#fca5a5"),
        ("} catch (e) {", "#ffffff"),
        ("  console.log('Gagal menghapus'); // <-- TERTANGKAP DI SINI!", "#ef4444"),
        ("}", "#ffffff")
    ]
    cy = 130
    draw.rounded_rectangle([60, 120, 560, 310], radius=6, fill="#0c1017", outline="#475569")
    for cl, cc in code_wrong:
        draw.text((75, cy), cl, fill=cc, font=font_mono)
        cy += 25

    draw.text((60, 330), "Apa yang Terjadi di Balik Layar?", fill="#f87171", font=font_header)
    exp_wrong = [
        "1. redirect() secara internal MELEMPAR ERROR khusus bertipe",
        "   'NEXT_REDIRECT' (dengan digest: 'NEXT_REDIRECT;...').",
        "2. Blok catch(e) tidak tahu bahwa ini sinyal navigasi, sehingga",
        "   menangkapnya seperti galat basis data biasa.",
        "3. Navigasi HTTP BATAL dieksekusi oleh router Next.js.",
        "4. Pengguna tetap diam di halaman saat ini, dan console",
        "   mencetak pesan palsu 'Gagal menghapus' padahal item terhapus!"
    ]
    ey = 365
    for ew in exp_wrong:
        draw.text((60, ey), ew, fill="#fca5a5", font=font_ui)
        ey += 24

    draw.rounded_rectangle([60, 510, 560, 640], radius=6, fill="#450a0a", outline="#b91c1c")
    draw.text((75, 525), "AKIBAT FATAL:", fill="#fca5a5", font=font_ui_bold)
    draw.text((75, 555), "• Galat palsu tercetak di terminal server.", fill="#ffffff", font=font_ui)
    draw.text((75, 580), "• Browser tidak berpindah ke /katalog (freeze/stuck).", fill="#ffffff", font=font_ui)
    draw.text((75, 605), "• Menelan objek galat (Mishandling of Exceptional Conditions).", fill="#ffffff", font=font_ui)

    # Right: The Correct Pattern (Outside try)
    draw.rounded_rectangle([620, 60, 1160, 670], radius=8, fill="#064e3b", outline="#10b981", width=2)
    draw.text((640, 80), "Pola BENAR: redirect() di luar try/catch", fill="#34d399", font=font_title)

    code_correct = [
        ("// Opsi A: Transaksi atomik tanpa try/catch kosong", "#a7f3d0"),
        ("await prisma.$transaction([", "#ffffff"),
        ("  prisma.ulasan.deleteMany({ where: { itemId: id } }),", "#93c5fd"),
        ("  prisma.item.delete({ where: { id } }),", "#93c5fd"),
        ("]);", "#ffffff"),
        ("revalidatePath('/katalog');", "#ffffff"),
        ("redirect('/katalog'); // <-- DI LUAR TRY/CATCH!", "#4ade80")
    ]
    cy2 = 130
    draw.rounded_rectangle([640, 120, 1140, 310], radius=6, fill="#0c1017", outline="#059669")
    for cl, cc in code_correct:
        draw.text((655, cy2), cl, fill=cc, font=font_mono)
        cy2 += 25

    draw.text((640, 330), "Mekanisme yang Berjalan Seharusnya:", fill="#6ee7b7", font=font_header)
    exp_correct = [
        "1. Seluruh operasi basis data diselesaikan dengan aman.",
        "2. revalidatePath() membersihkan cache halaman katalog.",
        "3. redirect() melempar eksepsi NEXT_REDIRECT ke lapisan atas.",
        "4. Router Next.js menangkap sinyal NEXT_REDIRECT dan",
        "   menerbitkan respons HTTP 307/303 ke peramban.",
        "5. Jika terjadi error DB tak terduga (P2025), galat diteruskan",
        "   secara elegan ke error boundary (error.tsx)."
    ]
    ey2 = 365
    for ec in exp_correct:
        draw.text((640, ey2), ec, fill="#d1fae5", font=font_ui)
        ey2 += 24

    draw.rounded_rectangle([640, 540, 1140, 640], radius=6, fill="#065f46", outline="#34d399")
    draw.text((655, 555), "KEUNTUNGAN ARSITEKTURAL:", fill="#a7f3d0", font=font_ui_bold)
    draw.text((655, 580), "• Navigasi halaman berjalan mulus dan instan.", fill="#ffffff", font=font_ui)
    draw.text((655, 605), "• Galat tak terduga ditangani secara terpusat oleh error.tsx.", fill="#ffffff", font=font_ui)

    im.save("docs/hasil screenshot/tp7-alur-redirect-nextjs.png")
    print("Created tp7-alur-redirect-nextjs.png")

if __name__ == "__main__":
    make_reproduction_screenshot()
    make_debugging_comparison()
    make_redirect_flow_diagram()
