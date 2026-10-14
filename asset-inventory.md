# Asset Inventory - AgroMarket

Dokumentasi inventaris aset kritis pada sistem marketplace pertanian AgroMarket, mencakup data, komponen pemroses, dan infrastruktur yang beroperasi.

| ID Aset | Nama Aset | Kategori Aset | Deskripsi & Lokasi | Perlindungan Kriptografi | Sensitivitas |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **A-01** | Data Pribadi Pemesan (PII) | Data At-Rest & In-Transit | Nama lengkap, nomor WhatsApp aktif, dan alamat pengiriman lahan pertanian dari formulir `/order`. | **Ya** (AES-256-GCM) | **Tinggi (Confidential)** |
| **A-02** | Kredensial Akun Pengguna | Data At-Rest | Password akun petani, mitra kios, dan distributor resmi yang digunakan untuk autentikasi. | **Ya** (Scrypt KDF + Salt CSPRNG) | **Kritis (Restricted)** |
| **A-03** | Data Izin Edar Pestisida & Pupuk | Data At-Rest & In-Transit | Nomor pendaftaran Kementerian Pertanian RI, komposisi bahan aktif racun, dan sertifikasi efikasi produk. | **Ya** (HMAC-SHA256) | **Tinggi (Internal/Public Verified)** |
| **A-04** | Data Transaksi & Keranjang | Data In-Transit | Rincian pesanan, kuantitas sak/botol pupuk, total tagihan, metode pembayaran, dan bukti persetujuan SOP pestisida. | Tidak (Validasi Format) | **Sedang (Internal)** |
| **A-05** | Master Data Katalog Produk | Data At-Rest | Data nama pupuk/obat, kategori, panduan takaran dosis aplikasi semprot, harga resmi distributor, dan stok fisik. | Tidak (Integritas Basis Data) | **Rendah (Public)** |
| **A-06** | Kunci Rahasia Sistem (Secrets) | Konfigurasi Server | Kunci enkripsi simetris 256-bit dan Secret Key HMAC penandatangan lisensi yang dikelola di environment server. | N/A (Aset Kunci Kriptografi) | **Kritis (Strictly Secret)** |
| **A-07** | Antarmuka Aplikasi Klien | Software / UI | Source code antarmuka Next.js React, logika validasi form sisi klien, dan routing halaman aplikasi. | Tidak (Integritas Kode) | **Sedang (Proprietary)** |
