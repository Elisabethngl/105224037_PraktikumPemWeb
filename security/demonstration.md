# Panduan Demonstrasi & Keterkaitan Register Risiko — AgroMarket

**Mata Kuliah**: Keamanan Siber (Pekan 6 — Sub-CPMK 3: Kontrol Akses & System Hardening)  
**Produk**: AgroMarket (Marketplace Terpadu Sarana Pertanian, Pupuk, Bibit & Obat Racun Hama)  
**Mahasiswa**: Elisabeth Nainggolan (NIM: 105224037)  
**Penanda Rilis (Tag)**: `sec-0.2`  
**Basis Tugas 1**: Register Risiko `sec-0.1` (Commit `daefbf58da29fa118107edd26c6728bddfb376e7`)  

---

## 1. Arsitektur Lingkungan Uji (Test Environment)

Seluruh pengujian kontrol akses, hardening sistem, dan verifikasi kerentanan dijalankan pada lingkungan laboratorium terstandarisasi:

* **Sistem Host & Runtime**: Windows / Linux Environment, Node.js v24.21.0, npm v11.19.0.
* **Virtual Machine (VM)**: Ubuntu Server 22.04 LTS (Kernel 5.15 x86_64), OpenSSH Server 8.9p1, Lynis v3.0.9.
* **Container Runtime**: Docker Engine 26.1 / Compose v2.27, OCI Image spec, Base Image `node:20-alpine3.20`.
* **Database Backend**: PostgreSQL 18 Server / Prisma ORM v7.10.1 (DS-01 Order Store & DS-02 Catalog Store).
* **Vulnerability & SBOM Scanner**: Trivy v0.56.0, CycloneDX Specification v1.5 standard.

```
+---------------------------------------------------------------------------------------------------------+
|                                ARSITEKTUR KONTROL KEAMANAN AGROMARKET                                   |
+---------------------------------------------------------------------------------------------------------+
| [ Internet / Peramban Klien ]                                                                           |
|        |                                                                                                |
|        v                                                                                                |
| +-----------------------------------------------------------------------------------------------------+ |
| | VM SERVER HARDENED (Lynis Score: 78 | SSH Key-Only | PermitRootLogin no | UFW Active)                | |
| |                                                                                                     | |
| |   +-----------------------------------------------------------------------------------------------+ | |
| |   | CONTAINER HARDENED STACK (docker-compose.yml | Isolated Bridge Network: agro-internal-net)    | | |
| |   |                                                                                               | | |
| |   |   [ Service: app ] (UID 10001: nextjs | CapDrop: ALL | Read-Only Root | Port 3000 UNEXPOSED)   | | |
| |   |       |                                                                                       | | |
| |   |       +---> RBAC Middleware & Anti-IDOR Enforcement (`lib/rbac.ts`)                           | | |
| |   |       +---> Slow Password Hashing Engine (`lib/agroCrypto.ts` Scrypt N=16384, r=8, p=1)       | | |
| |   |       |                                                                                       | | |
| |   |       v (Internal Network Only: agro-internal-net / No Host Port Mapping)                    | | |
| |   |   [ Service: db ]  (UID 999: postgres | CapDrop: ALL | Port 5432 UNEXPOSED)                    | | |
| |   |                                                                                               | | |
| |   +-----------------------------------------------------------------------------------------------+ | |
| +-----------------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Pemetaan Komprehensif Kontrol Keamanan terhadap ID Risiko Tugas 1

Setiap kontrol teknis yang diterapkan pada **Tugas 2 (`sec-0.2`)** merujuk langsung ke **Register Risiko (`risk-register.md`)** dan **Model Ancaman STRIDE (`threat-model.md`)** yang telah disahkan pada **Tugas 1 (`sec-0.1`)**:

| ID Kontrol Tugas 2 | Komponen Kontrol yang Diimplementasikan | ID Risiko Tugas 1 | ID Ancaman STRIDE | Aset Terdampak | Cara Kontrol Menurunkan Risiko (*Risk Mitigation Rationale*) |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **CTRL-01** | **Matriks Akses RBAC & Anti-IDOR** (`lib/rbac.ts`, `security/access-tests.md`) | **`R-01`**, **`R-02`** | **`T-03`**, **`T-07`**, **`T-10`** | `A-01` (PII Petani), `A-04` (Data Pesanan) | Memvalidasi identitas sesi dan kepemilikan (`userId === ownerId`). Mencegah petani mengubah harga atau mengintip koordinat lahan petani lain. Menurunkan dampak ke level Rendah. |
| **CTRL-02** | **Fungsi Hash Lambat Scrypt KDF & Pembatasan Input** (`lib/agroCrypto.ts`) | **`R-04`** | **`T-09`** (DoS), **`THR-10`** | `A-02`, `A-06` (Server Resource & CPU) | Scrypt memakan memori & CPU yang disengaja ($N=16384$) sehingga kebal GPU brute-force. Batas string maks 72 karakter mencegah eksploitasi *Hash Bomb / ReDoS* yang melumpuhkan server. |
| **CTRL-03** | **Hardening VM: SSH Key-Only & Root Denied** (`security/harden-vm.sh`, `lynis-after.txt`) | **`R-02`**, **`T-08`** | **`T-08`** (Info Disclosure), **`T-10`** | `A-06` (Kunci Rahasia), `A-07` (Akses Root) | Menghilangkan celah *credential stuffing* SSH dengan mematikan login kata sandi dan akun root (`sshd -T`). Menjamin server tidak dapat dibobol botnet scanner publik. |
| **CTRL-04** | **Hardening Container: Non-Root, CapDrop ALL, Ports Unexposed** (`Dockerfile`, `docker-compose.yml`) | **`R-02`** | **`T-07`**, **`T-10`** (Privilege Escalation) | `DS-01` (Order Store / DB), `Host OS` | Menjalankan aplikasi sebagai non-root (UID 10001) dan membuang semua capabilities Linux (`cap_drop: ALL`) mencegah *container breakout*. Port app & db tidak diekspos ke host publik. |
| **CTRL-05** | **Pemindaian Kerentanan Bebas Critical & SBOM CycloneDX** (`image-scan-after.txt`, `sbom.cdx.json`) | **`R-01`**, **`R-04`** | **`T-04`**, **`T-09`** | `A-05` (Katalog), Runtime Application | Multi-stage build berbasis Alpine Linux 3.20 mengeliminasi seluruh kerentanan CRITICAL (0 CVE Critical). Inventarisasi dependensi terdaftar transparan di SBOM CycloneDX 1.5. |

---

## 3. Panduan Langkah Demi Langkah Demonstrasi Pengujian

Evaluator dan penguji dapat mereproduksi seluruh pengujian secara mandiri dengan langkah-langkah berikut:

### Demonstrasi 1: Uji Kontrol Akses RBAC & Anti-IDOR
Jalankan test suite kontrol akses resmi:
```bash
$ npm run test:security
```
**Hasil yang Ditampilkan**:
* **12 Uji Positif**: Seluruh hak akses sah diizinkan (`200 OK` / `201 Created`).
* **12 Uji Negatif**: Seluruh percobaan akses ilegal tertolak (`401 Unauthorized` / `403 Forbidden`).
* Termasuk penolakan serangan IDOR (Petani-1 mencoba mengintip pesanan Petani-2) dan Cross-Tenant IDOR (Distributor-A mencoba mengedit stok Distributor-B).
* Total 24 kasus uji akses lolos 100%.

### Demonstrasi 2: Pembuktian Penyimpanan Hash Lambat (Slow Hash Scrypt)
Jalankan benchmark dan verifikasi hash kata sandi:
```bash
$ node -e "
const crypto = require('crypto');
const { performance } = require('perf_hooks');
const pass = 'PasswordPetani2026!';
const salt = crypto.randomBytes(16).toString('hex');
const t0 = performance.now();
for(let i=0; i<100; i++) crypto.createHash('sha256').update(pass + salt).digest();
const tSha = (performance.now() - t0) / 100;
const t1 = performance.now();
for(let i=0; i<3; i++) crypto.scryptSync(pass, salt, 64, { N: 16384, r: 8, p: 1 });
const tScrypt = (performance.now() - t1) / 3;
console.log('SHA-256 Latency :', tSha.toFixed(4), 'ms (Fast Hash)');
console.log('Scrypt Latency  :', tScrypt.toFixed(2), 'ms (Slow Hash KDF)');
console.log('Rasio Ketahanan :', Math.round(tScrypt / tSha), 'x lebih tahan serangan brute-force');
"
```
**Hasil yang Ditampilkan**:
* Latensi Scrypt KDF terukur ~26 ms per hash, terbukti ribuan kali lebih lambat dari SHA-256 (0.0069 ms).
* Rekap audit menyajikan data tersamar (Zero-Knowledge Masked Proof) tanpa menampilkan plaintext kata sandi pengguna nyata di `security/access-tests.md`.

### Demonstrasi 3: Verifikasi VM Hardening & SSH
Jalankan perintah verifikasi konfigurasi SSH pada VM yang diperkeras:
```bash
$ sudo sshd -T | grep -E 'passwordauthentication|permitrootlogin'
```
**Hasil yang Ditampilkan**:
```
passwordauthentication no
permitrootlogin no
```
* Skor Audit Lynis meningkat drastis dari **58** (sebelum hardening di `lynis-before.txt`) menjadi **78** (sesudah hardening di `lynis-after.txt`), melampaui batas minimal rubrik (minimal 70).

### Demonstrasi 4: Verifikasi Container Hardening & Port Isolation
Inspeksi konfigurasi container AgroMarket:
1. **Verifikasi Pengguna Non-Root**:
   ```bash
   $ docker compose exec app id
   uid=10001(nextjs) gid=10001(nodejs) groups=10001(nodejs)
   ```
2. **Verifikasi Capabilities Dibatasi (CapDrop: ALL)**:
   ```bash
   $ docker compose exec app grep Cap /proc/1/status
   CapInh: 0000000000000000
   CapPrm: 0000000000000000
   CapEff: 0000000000000000
   CapBnd: 0000000000000000
   ```
3. **Verifikasi Port App dan DB Tidak Dipublikasikan ke Host**:
   ```bash
   $ docker port agromarket-app
   (Output Kosong - Tidak ada port forwarding ke host)

   $ docker port agromarket-db
   (Output Kosong - Port 5432 hanya terbuka di jaringan internal agro-internal-net)
   ```

### Demonstrasi 5: Verifikasi Pemindaian Kerentanan Bebas Critical & SBOM
1. Periksa laporan pemindaian akhir:
   ```bash
   $ cat security/image-scan-after.txt
   ```
   * Total Kerentanan CRITICAL: **0 (NOL)**.
   * Total Kerentanan HIGH: **0 (NOL)**.
2. Validasi struktur SBOM CycloneDX:
   ```bash
   $ head -n 30 sbom.cdx.json
   ```
   * Format valid CycloneDX 1.5 JSON memuat seluruh metadata komponen aplikasi dan dependensi.

---

## 4. Checklist Pra-Pengumpulan (Pre-Submission Checklist)

* [x] **Keseimbangan Pengujian**: Uji akses negatif (12 kasus) sama banyaknya dengan uji positif (12 kasus) di `security/access-tests.md`.
* [x] **Fungsi Hash Lambat**: Menggunakan Scrypt KDF ($N=16384, r=8, p=1$) dan bukti disajikan tanpa membuka data nyata pengguna.
* [x] **SSH Hardening**: Perintah `sudo sshd -T | grep -E 'passwordauthentication|permitrootlogin'` menghasilkan nilai `no`.
* [x] **Skor Lynis**: Indeks Lynis setelah perbaikan mencapai **78** (minimal syarat rubrik: 70).
* [x] **Container Hardening**: Layanan berjalan sebagai non-root (`UID 10001` & `UID 999`), capability dibuang (`cap_drop: ALL`), port app dan db tidak dipublikasikan ke host.
* [x] **Bebas Kerentanan Kritis**: Laporan Trivy akhir `image-scan-after.txt` mencatat **0 kerentanan CRITICAL**.
* [x] **SBOM Lengkap**: Berkas `sbom.cdx.json` berformat CycloneDX 1.5 valid tersedia.
* [x] **Rujukan ID Risiko**: Setiap kontrol merujuk ID risiko Tugas 1 (`R-01`, `R-02`, `R-03`, `R-04`, `T-01` s/d `T-10`).
* [x] **Penanda Git**: Penanda `sec-0.2` dibuat dan dipush ke remote repository.

---

## 5. Teks Daring Pengumpulan Resmi

Mahasiswa dapat menyalin format teks di bawah ini ke laman pengumpulan tugas daring (LMS):

```
TUGAS 2 KEAMANAN SIBER: KONTROL AKSES DAN SYSTEM HARDENING
Nama       : Elisabeth Nainggolan
NIM        : 105224037
Produk     : AgroMarket
Repository : https://github.com/Elisabethngl/105224037_PraktikumPemWeb
Penanda    : sec-0.2
Hash Commit: [HASH_COMMIT_TERBARU]
```
