# Data Flow Diagram (DFD) - AgroMarket

Diagram Aliran Data Level 1 menggambarkan alur data produk AgroMarket yang sedang berjalan, pembagian *trust boundary*, serta aset data yang dilindungi kriptografi.

## 1. Daftar Elemen DFD
* **Entitas Eksternal (External Entity)**:
  * `E-01`: Pembeli / Petani (Web Browser Client)
  * `E-02`: Distributor / Kios Pertanian Resmi
* **Proses (Process)**:
  * `P-01`: Client-Side UI & Validation Handler (`/order`, Form Validation)
  * `P-02`: Application Server & Order Processing Engine (Next.js Server API)
  * `P-03`: Cryptographic Engine (`lib/agroCrypto.ts` - AES-GCM, Scrypt, HMAC)
  * `P-04`: Market Price & Catalog Engine (`/`, `/detail`)
* **Penyimpanan Data (Data Store)**:
  * `DS-01`: Database Pesanan & Data Pribadi Pemesan *(Dilindungi Kriptografi: AES-256-GCM)*
  * `DS-02`: Database Kredensial Pengguna *(Dilindungi Kriptografi: Scrypt Hash & Salt)*
  * `DS-03`: Database Katalog Produk & Izin Kementan *(Dilindungi Kriptografi: HMAC-SHA256)*
* **Aliran Data (Data Flow)**:
  * `DF-01`: Input data pemesanan & data pribadi pemesan [A-01, A-04]
  * `DF-02`: Permintaan enkripsi data pribadi pemesan [A-01]
  * `DF-03`: Penyimpanan ciphertext pesanan terenkripsi [A-01, A-04]
  * `DF-04`: Input kredensial login akun petani [A-02]
  * `DF-05`: Verifikasi hash password pengguna [A-02]
  * `DF-06`: Verifikasi integritas lisensi nomor izin Kementan [A-03]
  * `DF-07`: Query katalog pupuk & harga pasar harian [A-05]

---

## 2. Batas Kepercayaan (Trust Boundaries)
1. **TB-01 (Client-to-Server Perimeter)**:  
   Memisahkan lingkungan pengguna eksternal (`E-01`, `E-02`) yang tidak terpercaya di jaringan publik/internet dengan server internal aplikasi web (`P-02`). Rentan terhadap intersepsi data, Man-in-the-Middle (MitM), dan manipulasi DOM di sisi browser.
2. **TB-02 (Application-to-Storage & Crypto Perimeter)**:  
   Memisahkan server pemroses aplikasi web (`P-02`) dengan mesin kriptografi internal (`P-03`) dan basis data sensitif (`DS-01`, `DS-02`). Membatasi akses langsung ke data at-rest dan kunci kriptografi `A-06`.

---

## 3. Diagram Aliran Data (Mermaid)

```mermaid
flowchart TD
    %% Entitas Eksternal
    subgraph ZONE_UNTRUSTED["Zona Pengguna (Untrusted Environment)"]
        E01["E-01: Petani / Pembeli (Browser)"]
        E02["E-02: Distributor Resmi Kementan"]
    end

    %% Trust Boundary 1
    TB01["--- TRUST BOUNDARY 1 (TB-01: Internet / Public Network) ---"]

    %% Proses Aplikasi
    subgraph ZONE_APP["Zona Aplikasi (Trusted Application Server)"]
        P01["P-01: Client Form & Validation (/order)"]
        P02["P-02: Next.js Server & Order Engine"]
        P04["P-04: Catalog & Market Price Engine"]
    end

    %% Trust Boundary 2
    TB02["--- TRUST BOUNDARY 2 (TB-02: Internal Secure Storage Perimeter) ---"]

    %% Mesin Kriptografi dan Data Store
    subgraph ZONE_SECURE["Zona Keamanan & Data (Crypto & Storage)"]
        P03["P-03: Crypto Engine (lib/agroCrypto.ts)"]
        DS01[("DS-01: Orders & Customer PII<br/>🔒 DILINDUNGI: AES-256-GCM [A-01]")]
        DS02[("DS-02: User Credentials<br/>🔒 DILINDUNGI: Scrypt + Salt [A-02]")]
        DS03[("DS-03: Catalog & Kementan Licenses<br/>🔒 DILINDUNGI: HMAC-SHA256 [A-03]")]
    end

    %% Relasi Aliran Data
    E01 -->|"DF-01: Input Order & PII"| P01
    P01 -->|"DF-01: Validated Payload"| P02
    E01 <-->|"DF-07: Jelajah Katalog & Harga"| P04
    P04 <-->|"DF-07: Query Produk"| DS03
    E02 -->|"DF-04: Login & Registrasi Produk"| P02
    
    P02 <-->|"DF-02: Enkripsi/Dekripsi PII"| P03
    P02 <-->|"DF-05: Hash & Verifikasi Password"| P03
    P02 <-->|"DF-06: Verifikasi Izin Kementan"| P03
    
    P02 -->|"DF-03: Simpan Ciphertext Pesanan"| DS01
    P02 <-->|"DF-05: Baca Hash Password"| DS02
    P02 <-->|"DF-06: Validasi Lisensi Produk"| DS03

    %% Styling
    style TB01 stroke:#f59e0b,stroke-width:2px,stroke-dasharray: 5 5,color:#b45309
    style TB02 stroke:#dc2626,stroke-width:2px,stroke-dasharray: 5 5,color:#b91c1c
    style DS01 fill:#f0fdf4,stroke:#15803d,stroke-width:2px
    style DS02 fill:#f0fdf4,stroke:#15803d,stroke-width:2px
    style DS03 fill:#f0fdf4,stroke:#15803d,stroke-width:2px