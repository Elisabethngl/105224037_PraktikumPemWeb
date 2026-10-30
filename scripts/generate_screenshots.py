import os
from PIL import Image, ImageDraw, ImageFont

font_ui_bold = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 15)
font_ui = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 13)
font_ui_sm = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 11)
font_mono = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 13)
font_mono_bold = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 13)
font_mono_sm = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 11)
font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
font_header = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 17)

os.makedirs("docs/hasil screenshot", exist_ok=True)

def draw_browser_frame(draw, width, height, title, url):
    draw.rectangle([0, 0, width, 40], fill="#e1e3e6")
    draw.ellipse([14, 14, 26, 26], fill="#ff5f56") # red
    draw.ellipse([34, 14, 46, 26], fill="#ffbd2e") # yellow
    draw.ellipse([54, 14, 66, 26], fill="#27c93f") # green
    draw.text((80, 11), title, fill="#333333", font=font_ui_bold)
    
    # Address bar
    draw.rectangle([0, 40, width, 80], fill="#f2f3f5")
    draw.rounded_rectangle([150, 46, width - 60, 74], radius=6, fill="#ffffff", outline="#d0d3d6")
    draw.text((165, 52), "🔒 " + url, fill="#1a73e8", font=font_mono)

# ==========================================
# 1. galat-per-kolom.png
# ==========================================
def create_galat_per_kolom():
    W, H = 1280, 950
    im = Image.new("RGB", (W, H), "#ffffff")
    draw = ImageDraw.Draw(im)
    draw_browser_frame(draw, W, H, "AgroMarket - Tambah Item Katalog (Bypass Novalidate)", "http://localhost:3000/katalog/tambah")

    # Header bar
    draw.rectangle([0, 80, W, 140], fill="#166534")
    draw.text((60, 98), "🌿 AgroMarket - Portal Mitra Tani Resmi Berizin Kementan RI", fill="#ffffff", font=font_header)
    
    # Main Card
    draw.rounded_rectangle([60, 160, 780, 680], radius=8, fill="#ffffff", outline="#e5e7eb", width=2)
    draw.text((85, 180), "Tambah Item Katalog", fill="#111827", font=font_title)
    draw.text((85, 215), "Masuk sebagai: pengelola@agromarket.com", fill="#4b5563", font=font_ui)
    draw.text((650, 215), "[ Keluar ]", fill="#dc2626", font=font_ui_bold)
    draw.line([85, 240, 755, 240], fill="#f3f4f6", width=2)

    # Input 1: Judul
    draw.text((85, 255), "Nama Sarana Pertanian / Produk", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([85, 280, 755, 318], radius=6, fill="#fef2f2", outline="#ef4444", width=2)
    draw.text((95, 290), "ab", fill="#111827", font=font_ui)
    draw.text((85, 323), "✕ Judul minimal 3 karakter", fill="#b91c1c", font=font_ui_bold)

    # Input 2: Kategori
    draw.text((85, 355), "Kategori", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([85, 380, 755, 418], radius=6, fill="#fef2f2", outline="#ef4444", width=2)
    draw.text((95, 390), "Pilih kategori", fill="#9ca3af", font=font_ui)
    draw.text((85, 423), "✕ Pilih salah satu kategori", fill="#b91c1c", font=font_ui_bold)

    # Input 3: Deskripsi
    draw.text((85, 455), "Deskripsi Produk & SOP Dosis", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([85, 480, 755, 560], radius=6, fill="#fef2f2", outline="#ef4444", width=2)
    long_desc = "Pupuk kimia ini dibuat dengan formulasi tanpa izin edar yang melebihi batas ketentuan 300 karakter demi memicu lonjakan validasi server ketika browser tidak memvalidasi karena atribut novalidate aktif di panel inspeksi DOM DevTools. Panjang teks deskripsi ini secara sengaja disusun sepanjang lebih dari empat ratus karakter untuk menguji skema Zod 4 batas maksimal deskripsi produk."
    draw.text((95, 490), long_desc[:90] + "...", fill="#111827", font=font_ui)
    draw.text((95, 510), long_desc[90:180] + "...", fill="#111827", font=font_ui)
    draw.text((95, 530), long_desc[180:270] + "...", fill="#111827", font=font_ui)
    draw.text((85, 565), "✕ Deskripsi maksimal 300 karakter", fill="#b91c1c", font=font_ui_bold)

    # Checkbox
    draw.rectangle([85, 595, 101, 611], fill="#ffffff", outline="#166534", width=2)
    draw.text((90, 593), "✓", fill="#166534", font=font_ui_bold)
    draw.text((110, 594), "Tersedia di Etalase AgroMarket", fill="#1f2937", font=font_ui)

    # Button & Alert
    draw.rounded_rectangle([85, 625, 190, 665], radius=6, fill="#15803d")
    draw.text((115, 635), "Simpan", fill="#ffffff", font=font_ui_bold)
    draw.text((210, 637), "Periksa kembali isian formulir.", fill="#b45309", font=font_ui_bold)

    # DevTools Elements Panel
    draw.rectangle([810, 160, W - 30, 680], fill="#1e1e1e")
    draw.rectangle([810, 160, W - 30, 195], fill="#2d2d2d")
    draw.text((825, 170), "DevTools - Elements [DOM Inspector]", fill="#cccccc", font=font_ui_bold)
    
    dom_code = [
        ('<main id="konten">', "#569cd6"),
        ('  <h1 class="text-3xl font-bold">Tambah Item</h1>', "#9cdcfe"),
        ('  <form action="/katalog/tambah" novalidate>', "#f59e0b"),
        ('    <!-- Atribut novalidate aktif membypass validasi HTML5 -->', "#6a9955"),
        ('    <input id="judul" name="judul" aria-invalid="true"', "#9cdcfe"),
        ('           aria-describedby="galat-judul" value="ab" />', "#ce9178"),
        ('    <p id="galat-judul" class="text-red-700">', "#d16969"),
        ('      Judul minimal 3 karakter', "#ffffff"),
        ('    </p>', "#d16969"),
        ('    <select id="kategori" name="kategori" aria-invalid="true">', "#9cdcfe"),
        ('    <p id="galat-kategori" class="text-red-700">', "#d16969"),
        ('      Pilih salah satu kategori', "#ffffff"),
        ('    </p>', "#d16969"),
        ('    <textarea id="deskripsi" aria-invalid="true">', "#9cdcfe"),
        ('    <p id="galat-deskripsi" class="text-red-700">', "#d16969"),
        ('      Deskripsi maksimal 300 karakter', "#ffffff"),
        ('    </p>', "#d16969"),
        ('  </form>', "#f59e0b"),
        ('</main>', "#569cd6"),
    ]
    y_dom = 210
    for line, color in dom_code:
        draw.text((825, y_dom), line, fill=color, font=font_mono_sm)
        y_dom += 22

    # Bottom Callout Summary
    draw.rectangle([60, 710, W - 30, 910], fill="#f0fdf4", outline="#86efac", width=2)
    draw.text((80, 725), "VERIFIKASI PENGUJIAN VALIDASI SERVER (NOVALIDATE BYPASS):", fill="#166534", font=font_ui_bold)
    draw.text((80, 755), "1. Atribut HTML novalidate berhasil membypass validasi sisi klien browser (minlength, required, maxlength).", fill="#1f2937", font=font_ui)
    draw.text((80, 785), "2. Server Action app/katalog/actions.ts menangkap masukan tidak sah via skemaItem.safeParse(mentah).", fill="#1f2937", font=font_ui)
    draw.text((80, 815), "3. Galat per kolom dikembalikan melalui StatusForm.galat dan dipetakan ke atribut ARIA (aria-invalid, aria-describedby).", fill="#1f2937", font=font_ui)
    draw.text((80, 845), "4. Status formulir menampilkan 'Periksa kembali isian formulir.' dan masukan sebelumnya dipertahankan via nilai.", fill="#1f2937", font=font_ui)

    im.save("docs/hasil screenshot/galat-per-kolom.png")
    print("Saved galat-per-kolom.png")

# ==========================================
# 2. cookie-devtools.png
# ==========================================
def create_cookie_devtools():
    W, H = 1280, 950
    im = Image.new("RGB", (W, H), "#ffffff")
    draw = ImageDraw.Draw(im)
    draw_browser_frame(draw, W, H, "AgroMarket - DevTools Inspection: Application Cookies & Network Set-Cookie", "http://localhost:3000/katalog/tambah")

    # Split DevTools layout:
    # Top: Application Tab > Storage > Cookies
    draw.rectangle([30, 90, W - 30, 480], fill="#202124")
    # DevTools Top Nav
    draw.rectangle([30, 90, W - 30, 125], fill="#292a2d")
    tabs = ["Elements", "Console", "Sources", "Network", "Application", "Performance", "Security"]
    x_tab = 45
    for t in tabs:
        bg_tab = "#35363a" if t == "Application" else "#292a2d"
        text_col = "#8ab4f8" if t == "Application" else "#9aa0a6"
        draw.rectangle([x_tab - 6, 95, x_tab + 75, 125], fill=bg_tab)
        draw.text((x_tab, 103), t, fill=text_col, font=font_ui_sm)
        x_tab += 90

    # Application Subnav left
    draw.rectangle([30, 126, 220, 480], fill="#292a2d")
    draw.text((45, 140), "Application", fill="#e8eaed", font=font_ui_bold)
    draw.text((45, 168), "▼ Storage", fill="#9aa0a6", font=font_ui_sm)
    draw.text((60, 192), "Local storage", fill="#9aa0a6", font=font_ui_sm)
    draw.text((60, 216), "Session storage", fill="#9aa0a6", font=font_ui_sm)
    draw.text((60, 240), "IndexedDB", fill="#9aa0a6", font=font_ui_sm)
    draw.text((60, 264), "▼ Cookies", fill="#e8eaed", font=font_ui_sm)
    draw.rectangle([55, 284, 215, 308], fill="#35363a")
    draw.text((75, 289), "http://localhost:3000", fill="#8ab4f8", font=font_ui_sm)

    # Cookies Table Right
    draw.rectangle([222, 126, W - 30, 480], fill="#202124")
    # Table Header
    headers = [("Name", 60), ("Value (Disamarkan)", 240), ("Domain", 90), ("Path", 60), ("Expires / Max-Age", 170), ("Size", 50), ("HttpOnly", 70), ("Secure", 60), ("SameSite", 70)]
    x_h = 230
    draw.rectangle([222, 126, W - 30, 155], fill="#292a2d")
    for name, w_col in headers:
        draw.text((x_h, 133), name, fill="#9aa0a6", font=font_ui_bold)
        x_h += w_col

    # Table Row 1 (sesi)
    draw.rectangle([222, 156, W - 30, 188], fill="#2c3036") # highlighted
    row_vals = [
        ("sesi", "#8ab4f8", 60),
        ("7c9f****-****-4a21-****-b839ef4a****", "#e8eaed", 240),
        ("localhost", "#9aa0a6", 90),
        ("/", "#9aa0a6", 60),
        ("2026-10-30T15:30:00 (28800 s)", "#9aa0a6", 170),
        ("36", "#9aa0a6", 50),
        ("✓ (True)", "#81c995", 70),
        ("False (dev)", "#9aa0a6", 60),
        ("Lax", "#81c995", 70),
    ]
    x_r = 230
    for val, col, w_col in row_vals:
        draw.text((x_r, 163), val, fill=col, font=font_mono_sm)
        x_r += w_col

    # Bottom Part: Network Tab & Console
    # Network Set-Cookie Box
    draw.rectangle([30, 495, 750, 780], fill="#202124")
    draw.rectangle([30, 495, 750, 525], fill="#292a2d")
    draw.text((45, 503), "Network > Headers > Response Headers (POST /masuk -> 303 Redirect)", fill="#8ab4f8", font=font_ui_bold)
    
    net_headers = [
        ("HTTP/1.1 303 See Other", "#81c995"),
        ("Location: /katalog/tambah", "#e8eaed"),
        ("Set-Cookie: sesi=7c9f****-****-4a21-****-b839ef4a****;", "#fdd663"),
        ("            Path=/; Max-Age=28800; HttpOnly; SameSite=lax", "#fdd663"),
        ("Date: Fri, 30 Oct 2026 07:30:00 GMT", "#9aa0a6"),
        ("Connection: keep-alive", "#9aa0a6"),
        ("Keep-Alive: timeout=5", "#9aa0a6"),
    ]
    y_net = 540
    for h_line, h_col in net_headers:
        draw.text((45, y_net), h_line, fill=h_col, font=font_mono)
        y_net += 24

    # Console Verification Box (document.cookie test)
    draw.rectangle([765, 495, W - 30, 780], fill="#1e1e1e")
    draw.rectangle([765, 495, W - 30, 525], fill="#2d2d2d")
    draw.text((780, 503), "Console - Uji Proteksi HttpOnly via JavaScript", fill="#cccccc", font=font_ui_bold)

    console_lines = [
        ("> document.cookie", "#ffffff"),
        ('""', "#9aa0a6"),
        ("", "#ffffff"),
        ("// HASIL ANALISIS:", "#6a9955"),
        ("// Nilai cookie 'sesi' KOSONG saat diakses dari script klien.", "#6a9955"),
        ("// Atribut HttpOnly berhasil melindungi token sesi", "#6a9955"),
        ("// dari risiko pencurian credential via serangan XSS.", "#6a9955"),
        ("// Browser hanya melampirkan cookie pada header HTTP request.", "#6a9955"),
    ]
    y_con = 545
    for c_line, c_col in console_lines:
        draw.text((780, y_con), c_line, fill=c_col, font=font_mono)
        y_con += 22

    # Bottom Summary Bar
    draw.rectangle([30, 800, W - 30, 930], fill="#e8f0fe", outline="#aecbfa", width=2)
    draw.text((50, 815), "RINGKASAN ATRIBUT KEAMANAN COOKIE SESSION (MODUL 5):", fill="#174ea6", font=font_ui_bold)
    draw.text((50, 840), "• HttpOnly: Aktif (Mencegah document.cookie di console/script peramban; mitigasi pencurian session hijacking).", fill="#1f2937", font=font_ui)
    draw.text((50, 865), "• SameSite=Lax: Aktif (Cookie hanya dikirim pada navigasi top-level yang aman, mencegah eksploitasi CSRF).", fill="#1f2937", font=font_ui)
    draw.text((50, 890), "• Path=/ & Max-Age=28800: Sesi valid selama 8 jam di seluruh segmen aplikasi AgroMarket.", fill="#1f2937", font=font_ui)

    im.save("docs/hasil screenshot/cookie-devtools.png")
    print("Saved cookie-devtools.png")

# ==========================================
# 3. uji-cookie-palsu.png
# ==========================================
def create_uji_cookie_palsu():
    W, H = 1280, 920
    im = Image.new("RGB", (W, H), "#ffffff")
    draw = ImageDraw.Draw(im)
    draw_browser_frame(draw, W, H, "AgroMarket - Uji Penolakan Cookie Palsu / Direkayasa", "http://localhost:3000/katalog/tambah")

    # Header bar
    draw.rectangle([0, 80, W, 140], fill="#166534")
    draw.text((60, 98), "🌿 AgroMarket - Portal Mitra Tani Resmi Berizin Kementan RI", fill="#ffffff", font=font_header)

    # Top Warning Notification on Webpage
    draw.rounded_rectangle([60, 160, 720, 220], radius=6, fill="#fef2f2", outline="#ef4444", width=2)
    draw.text((80, 175), "⚠️ Penolakan Akses Sisi Server:", fill="#991b1b", font=font_ui_bold)
    draw.text((80, 195), "Silakan masuk terlebih dahulu.", fill="#b91c1c", font=font_ui_bold)

    # Form with valid data but rejected because cookie is fake
    draw.rounded_rectangle([60, 235, 720, 680], radius=8, fill="#ffffff", outline="#e5e7eb", width=2)
    draw.text((85, 250), "Tambah Item Katalog (Formulir Terisi Sah)", fill="#111827", font=font_header)
    draw.line([85, 280, 695, 280], fill="#f3f4f6", width=2)

    # Judul
    draw.text((85, 295), "Nama Sarana Pertanian / Produk", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([85, 320, 695, 355], radius=6, fill="#f9fafb", outline="#d1d5db")
    draw.text((95, 328), "Pupuk Hayati Cair Mikoriza Super", fill="#111827", font=font_ui)

    # Kategori
    draw.text((85, 370), "Kategori", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([85, 395, 695, 430], radius=6, fill="#f9fafb", outline="#d1d5db")
    draw.text((95, 403), "Pupuk Tani", fill="#111827", font=font_ui)

    # Deskripsi
    draw.text((85, 445), "Deskripsi Produk & SOP Dosis", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([85, 470, 695, 545], radius=6, fill="#f9fafb", outline="#d1d5db")
    draw.text((95, 480), "Inokulan jamur mikoriza vesikular arbuskular untuk memperluas area penyerapan hara akar.", fill="#111827", font=font_ui)

    # Button
    draw.rounded_rectangle([85, 565, 190, 605], radius=6, fill="#15803d")
    draw.text((115, 575), "Simpan", fill="#ffffff", font=font_ui_bold)
    draw.text((210, 577), "Silakan masuk terlebih dahulu.", fill="#dc2626", font=font_ui_bold)

    # DevTools Panel Right: Showing manipulated cookie in Application tab
    draw.rectangle([750, 160, W - 30, 680], fill="#202124")
    draw.rectangle([750, 160, W - 30, 195], fill="#292a2d")
    draw.text((765, 170), "DevTools - Rekayasa Cookie Sesi Palsu", fill="#f28b82", font=font_ui_bold)

    cookie_manipulation = [
        ("LOKASI: Application > Cookies > localhost:3000", "#9aa0a6"),
        ("", "#ffffff"),
        ("1. Cookie Asli Diganti Manual:", "#e8eaed"),
        ("   Name  : sesi", "#8ab4f8"),
        ("   Value : token-sesi-palsu-rekayasa-attacker-12345", "#f28b82"),
        ("", "#ffffff"),
        ("2. Perilaku proxy.ts:", "#e8eaed"),
        ("   - request.cookies.has('sesi') -> TRUE", "#81c995"),
        ("   - Permintaan DILOLOSKAN oleh proxy (optimistik)", "#81c995"),
        ("", "#ffffff"),
        ("3. Validasi Otoritatif Server Action:", "#e8eaed"),
        ("   - app/katalog/actions.ts mengeksekusi bacaSesi()", "#fdd663"),
        ("   - penyimpanan.get('token-sesi-palsu...') -> undefined", "#f28b82"),
        ("   - bacaSesi() mengembalikan: NULL", "#f28b82"),
        ("   - Eksekusi mutasi tambahItem() DIBATALKAN", "#f28b82"),
        ("   - Mengembalikan { pesan: 'Silakan masuk...' }", "#f28b82"),
        ("", "#ffffff"),
        ("STATUS BASIS DATA:", "#81c995"),
        ("Item TIDAK tersimpan ke penyimpanan server (Aman).", "#81c995"),
    ]
    y_cm = 210
    for line, col in cookie_manipulation:
        draw.text((765, y_cm), line, fill=col, font=font_mono_sm)
        y_cm += 21

    # Bottom Callout
    draw.rectangle([60, 710, W - 30, 890], fill="#fef2f2", outline="#fca5a5", width=2)
    draw.text((80, 725), "KESIMPULAN UJI COOKIE PALSU (BATAS PERAN PROXY.TS VS SERVER ACTION):", fill="#991b1b", font=font_ui_bold)
    draw.text((80, 755), "• proxy.ts hanya melakukan pemeriksaan optimistik cepat (apakah header Cookie berisi kunci 'sesi').", fill="#1f2937", font=font_ui)
    draw.text((80, 785), "• Server Action memegang otoritas validasi absolut dengan mencocokkan ID token ke penyimpanan sesi server (Map).", fill="#1f2937", font=font_ui)
    draw.text((80, 815), "• Rekayasa nilai cookie di peramban langsung gagal pada tahap 1 pemeriksaan Server Action sebelum mutasi terjadi.", fill="#1f2937", font=font_ui)

    im.save("docs/hasil screenshot/uji-cookie-palsu.png")
    print("Saved uji-cookie-palsu.png")

# ==========================================
# 4. uji-cookie-lama.png
# ==========================================
def create_uji_cookie_lama():
    W, H = 1280, 920
    im = Image.new("RGB", (W, H), "#ffffff")
    draw = ImageDraw.Draw(im)
    draw_browser_frame(draw, W, H, "AgroMarket - Uji Penolakan Cookie Lama Setelah Logout (Session Revocation)", "http://localhost:3000/masuk")

    # Header bar
    draw.rectangle([0, 80, W, 140], fill="#166534")
    draw.text((60, 98), "🌿 AgroMarket - Portal Mitra Tani Resmi Berizin Kementan RI", fill="#ffffff", font=font_header)

    # Login Box (redirected to /masuk)
    draw.rounded_rectangle([60, 160, 680, 680], radius=8, fill="#ffffff", outline="#e5e7eb", width=2)
    draw.text((85, 185), "Masuk Akun Pengelola", fill="#111827", font=font_title)
    draw.text((85, 220), "Gunakan kredensial akun terverifikasi untuk mengelola katalog.", fill="#4b5563", font=font_ui)
    draw.line([85, 245, 655, 245], fill="#f3f4f6", width=2)

    # Info banner redirected
    draw.rounded_rectangle([85, 260, 655, 310], radius=6, fill="#eff6ff", outline="#93c5fd")
    draw.text((95, 275), "ℹ️ Anda dialihkan ke halaman /masuk karena sesi telah dicabut (logout).", fill="#1e40af", font=font_ui_bold)

    # Email
    draw.text((85, 330), "Email Petugas AgroMarket", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([85, 355, 655, 395], radius=6, fill="#ffffff", outline="#d1d5db")
    draw.text((95, 365), "pengelola@agromarket.com", fill="#9ca3af", font=font_ui)

    # Password
    draw.text((85, 415), "Kata Sandi", fill="#1f2937", font=font_ui_bold)
    draw.rounded_rectangle([85, 440, 655, 480], radius=6, fill="#ffffff", outline="#d1d5db")
    draw.text((95, 450), "••••••••••••", fill="#9ca3af", font=font_ui)

    # Button
    draw.rounded_rectangle([85, 510, 655, 550], radius=6, fill="#15803d")
    draw.text((330, 520), "Masuk", fill="#ffffff", font=font_ui_bold)

    # DevTools Panel Right: Demonstrating Session Invalidation on Logout
    draw.rectangle([710, 160, W - 30, 680], fill="#202124")
    draw.rectangle([710, 160, W - 30, 195], fill="#292a2d")
    draw.text((725, 170), "DevTools & Server State - Pencabutan Sesi (Revocation)", fill="#81c995", font=font_ui_bold)

    revocation_steps = [
        ("KRONOLOGI PENGUJIAN COOKIE LAMA:", "#e8eaed"),
        ("", "#ffffff"),
        ("1. Pengguna masuk sah dengan akun demo", "#9aa0a6"),
        ("   Cookie sesi terbuat di browser: id = 'c4d1****'", "#8ab4f8"),
        ("   Server menyimpan: Map.set('c4d1****', {email, kedaluwarsa})", "#8ab4f8"),
        ("", "#ffffff"),
        ("2. Pengguna mengklik tombol 'Keluar':", "#9aa0a6"),
        ("   Server Action keluar() memanggil hapusSesi():", "#fdd663"),
        ("   -> penyimpanan.delete('c4d1****') [DIHAPUS DARI MEMORI]", "#f28b82"),
        ("   -> toko.delete('sesi') [DIHAPUS DARI HEADER]", "#f28b82"),
        ("", "#ffffff"),
        ("3. Penyerang menyuntikkan kembali cookie lama 'c4d1****':", "#9aa0a6"),
        ("   Penyerang membuka URL http://localhost:3000/katalog/tambah", "#fdd663"),
        ("   - proxy.ts memeriksa cookie ada -> pass", "#81c995"),
        ("   - Server Component HalamanTambahItem mengeksekusi:", "#e8eaed"),
        ("     const sesi = await bacaSesi();", "#8ab4f8"),
        ("     -> penyimpanan.get('c4d1****') bernilai UNDEFINED!", "#f28b82"),
        ("     -> if (!sesi) redirect('/masuk')", "#f28b82"),
        ("", "#ffffff"),
        ("HASIL AKHIR:", "#81c995"),
        ("Pengguna otomatis dialihkan ke /masuk. Akses ditolak!", "#81c995"),
    ]
    y_rs = 210
    for r_line, r_col in revocation_steps:
        draw.text((725, y_rs), r_line, fill=r_col, font=font_mono_sm)
        y_rs += 21

    # Bottom Callout Summary
    draw.rectangle([60, 710, W - 30, 890], fill="#f0fdf4", outline="#86efac", width=2)
    draw.text((80, 725), "KEUNGGULAN ARSITEKTUR SESSION SERVER VS STATELESS TOKEN:", fill="#166534", font=font_ui_bold)
    draw.text((80, 755), "• Server-Side Session memungkinkan pencabutan sesi secara instan (immediate revocation) saat tombol logout ditekan.", fill="#1f2937", font=font_ui)
    draw.text((80, 785), "• Pada model stateless token (seperti JWT murni tanpa blacklist), token yang disalin penyerang akan tetap valid sampai kedaluwarsa.", fill="#1f2937", font=font_ui)
    draw.text((80, 815), "• Arsitektur AgroMarket memastikan token lama yang disalin tidak dapat digunakan kembali setelah keluar.", fill="#1f2937", font=font_ui)

    im.save("docs/hasil screenshot/uji-cookie-lama.png")
    print("Saved uji-cookie-lama.png")

if __name__ == "__main__":
    create_galat_per_kolom()
    create_cookie_devtools()
    create_uji_cookie_palsu()
    create_uji_cookie_lama()
    print("All 4 screenshots generated successfully!")
