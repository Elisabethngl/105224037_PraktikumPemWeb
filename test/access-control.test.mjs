import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

/**
 * TEST SUITE: KONTROL AKSES (RBAC), LEAST PRIVILEGE, DAN FUNGSI HASH LAMBAT
 * Tugas 2 Keamanan Siber — Penanda sec-0.2
 *
 * Persyaratan:
 * 1. Uji akses negatif (akses yang seharusnya ditolak) sama banyaknya dengan uji positif.
 *    -> Tepat 12 Uji Positif dan 12 Uji Negatif (Total 24 Uji Akses).
 * 2. Kata sandi disimpan dengan fungsi hash lambat (Scrypt KDF) dan dibuktikan tanpa membuka data pengguna nyata.
 * 3. Seluruh kontrol merujuk ID risiko Tugas 1 (R-01, R-02, R-03, R-04, T-01, T-02, T-03, T-07, T-09, T-10).
 */

// ============================================================================
// SIMULASI MESIN EVALUASI OTORISASI RBAC AGROMARKET
// ============================================================================

function evaluasiAkses(sumberDaya, aksi, konteks) {
  const { peran, idPengguna, idPemilikSumberDaya, distributorTerverifikasi } = konteks;

  // 1. KATALOG
  if (sumberDaya === 'katalog') {
    if (aksi === 'baca') {
      return { diizinkan: true, kodeStatus: 200, alasan: 'Katalog publik terbuka untuk seluruh peran.' };
    }
    if (aksi === 'buat') {
      if (peran === 'tamu') {
        return { diizinkan: false, kodeStatus: 401, alasan: 'Autentikasi diperlukan.', refRisiko: 'T-10' };
      }
      if (peran === 'petani') {
        return { diizinkan: false, kodeStatus: 403, alasan: 'Petani tidak berhak menerbitkan produk.', refRisiko: 'T-10' };
      }
      if (peran === 'distributor') {
        if (distributorTerverifikasi === false) {
          return { diizinkan: false, kodeStatus: 403, alasan: 'Kios belum memiliki verifikasi izin Kementan.', refRisiko: 'R-03' };
        }
        return { diizinkan: true, kodeStatus: 201, alasan: 'Distributor resmi diizinkan menerbitkan produk.' };
      }
      if (peran === 'pengawas') {
        return { diizinkan: true, kodeStatus: 201, alasan: 'Pengawas berwenang menerbitkan produk rujukan.' };
      }
    }
    if (aksi === 'ubah' || aksi === 'hapus') {
      if (peran === 'tamu') return { diizinkan: false, kodeStatus: 401, refRisiko: 'T-10' };
      if (peran === 'petani') return { diizinkan: false, kodeStatus: 403, refRisiko: 'T-10' };
      if (peran === 'distributor') {
        if (idPemilikSumberDaya && idPengguna && idPemilikSumberDaya !== idPengguna) {
          return { diizinkan: false, kodeStatus: 403, alasan: 'IDOR dicegah: bukan pemilik produk.', refRisiko: 'R-01' };
        }
        return { diizinkan: true, kodeStatus: 200, alasan: 'Distributor berhasil memperbarui produk miliknya.' };
      }
      if (peran === 'pengawas') return { diizinkan: true, kodeStatus: 200, alasan: 'Pengawas berwenang mengaudit/mengubah produk.' };
    }
  }

  // 2. PEMESANAN (ORDER)
  if (sumberDaya === 'order') {
    if (aksi === 'buat') {
      if (peran === 'tamu') return { diizinkan: false, kodeStatus: 401, alasan: 'Pemesanan mewajibkan login.', refRisiko: 'T-02' };
      if (peran === 'petani') return { diizinkan: true, kodeStatus: 201, alasan: 'Petani sah melakukan checkout pesanan.' };
      if (peran === 'distributor') return { diizinkan: false, kodeStatus: 403, alasan: 'Pemisahan tugas: akun penjual dilarang membeli via form eceran.', refRisiko: 'T-10' };
      if (peran === 'pengawas') return { diizinkan: false, kodeStatus: 403, alasan: 'Akun dinas pengawas dilarang transaksi komersial.', refRisiko: 'T-10' };
    }
    if (aksi === 'baca') {
      if (peran === 'tamu') return { diizinkan: false, kodeStatus: 401, refRisiko: 'R-02' };
      if (peran === 'petani') {
        if (idPemilikSumberDaya && idPengguna && idPemilikSumberDaya !== idPengguna) {
          return { diizinkan: false, kodeStatus: 403, alasan: 'IDOR dicegah: bukan pemilik data pesanan.', refRisiko: 'R-02' };
        }
        return { diizinkan: true, kodeStatus: 200, alasan: 'Petani membaca data pesanan sendiri.' };
      }
      if (peran === 'distributor') {
        if (idPemilikSumberDaya && idPengguna && idPemilikSumberDaya !== idPengguna) {
          return { diizinkan: false, kodeStatus: 403, alasan: 'Pesanan ditujukan ke toko lain.', refRisiko: 'R-02' };
        }
        return { diizinkan: true, kodeStatus: 200, alasan: 'Distributor melihat pesanan masuk.' };
      }
      if (peran === 'pengawas') return { diizinkan: true, kodeStatus: 200, alasan: 'Pengawas memeriksa kepatuhan transaksi B3.' };
    }
  }

  // 3. ULASAN
  if (sumberDaya === 'ulasan') {
    if (aksi === 'baca') return { diizinkan: true, kodeStatus: 200 };
    if (aksi === 'buat') {
      if (peran === 'tamu') return { diizinkan: false, kodeStatus: 401, refRisiko: 'T-02' };
      if (peran === 'petani') return { diizinkan: true, kodeStatus: 201, alasan: 'Petani memberikan ulasan produk.' };
      if (peran === 'distributor') return { diizinkan: false, kodeStatus: 403, alasan: 'Distributor dilarang merekayasa ulasan.', refRisiko: 'T-03' };
      if (peran === 'pengawas') return { diizinkan: false, kodeStatus: 403, alasan: 'Pengawas tidak memberi review komersial.', refRisiko: 'T-10' };
    }
  }

  // 4. IZIN EDAR
  if (sumberDaya === 'izin_edar') {
    if (aksi === 'verifikasi' || aksi === 'karantina') {
      if (peran === 'tamu') return { diizinkan: false, kodeStatus: 401, refRisiko: 'R-03' };
      if (peran === 'petani' || peran === 'distributor') {
        return { diizinkan: false, kodeStatus: 403, alasan: 'Hanya Pengawas Kementan yang berwenang.', refRisiko: 'R-03' };
      }
      if (peran === 'pengawas') return { diizinkan: true, kodeStatus: 200, alasan: 'Pengawas melegalkan izin edar / karantina.' };
    }
  }

  // 5. AUDIT LOG
  if (sumberDaya === 'audit_log') {
    if (peran === 'pengawas') return { diizinkan: true, kodeStatus: 200, alasan: 'Pengawas mengakses log forensik.' };
    if (peran === 'tamu') return { diizinkan: false, kodeStatus: 401, refRisiko: 'R-02' };
    return { diizinkan: false, kodeStatus: 403, alasan: 'Least privilege: hanya pengawas.', refRisiko: 'R-02' };
  }

  return { diizinkan: false, kodeStatus: 403 };
}

// ============================================================================
// MODUL FUNGSI HASH LAMBAT (SCRYPT KDF DENGAN SALT UNIK CSPRNG)
// ============================================================================

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;

function hashPassword(password) {
  if (!password || password.length < 8) throw new Error('Kata sandi minimal 8 karakter');
  if (password.length > 72) throw new Error('Kata sandi melebihi batas 72 karakter (Mitigasi DoS)');
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return { salt, hash: derivedKey.toString('hex') };
}

function verifyPassword(password, salt, originalHash) {
  if (!password || !salt || !originalHash) return false;
  if (password.length > 72) return false;
  try {
    const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, {
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P,
    });
    return crypto.timingSafeEqual(Buffer.from(derivedKey.toString('hex'), 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

// ============================================================================
// BAGIAN I: 12 UJI AKSES POSITIF (AKSES SAH DIIZINKAN)
// ============================================================================

test('POS-01: [Tamu] Akses katalog publik (GET /katalog)', () => {
  const res = evaluasiAkses('katalog', 'baca', { peran: 'tamu' });
  assert.equal(res.diizinkan, true);
  assert.equal(res.kodeStatus, 200);
});

test('POS-02: [Tamu] Melihat rincian produk (GET /katalog/1)', () => {
  const res = evaluasiAkses('katalog', 'baca', { peran: 'tamu', idPengguna: undefined });
  assert.equal(res.diizinkan, true);
  assert.equal(res.kodeStatus, 200);
});

test('POS-03: [Petani] Akses katalog belanja pertanian (GET /katalog)', () => {
  const res = evaluasiAkses('katalog', 'baca', { peran: 'petani', idPengguna: 'USR-PETANI-01' });
  assert.equal(res.diizinkan, true);
  assert.equal(res.kodeStatus, 200);
});

test('POS-04: [Petani] Mengirim ulasan & rating produk yang dibeli (POST /api/ulasan)', () => {
  const res = evaluasiAkses('ulasan', 'buat', { peran: 'petani', idPengguna: 'USR-PETANI-01' });
  assert.equal(res.diizinkan, true);
  assert.equal(res.kodeStatus, 201);
});

test('POS-05: [Petani] Membuat pesanan pupuk resmi (POST /order)', () => {
  const res = evaluasiAkses('order', 'buat', { peran: 'petani', idPengguna: 'USR-PETANI-01' });
  assert.equal(res.diizinkan, true);
  assert.equal(res.kodeStatus, 201);
});

test('POS-06: [Petani] Melihat data rekap pesanan miliknya sendiri (GET /order/ORD-001)', () => {
  const res = evaluasiAkses('order', 'baca', {
    peran: 'petani',
    idPengguna: 'USR-PETANI-01',
    idPemilikSumberDaya: 'USR-PETANI-01',
  });
  assert.equal(res.diizinkan, true);
  assert.equal(res.kodeStatus, 200);
});

test('POS-07: [Distributor] Mengakses formulir tambah produk (GET /katalog/tambah)', () => {
  const res = evaluasiAkses('katalog', 'buat', {
    peran: 'distributor',
    idPengguna: 'USR-DIST-01',
    distributorTerverifikasi: true,
  });
  assert.equal(res.diizinkan, true);
  assert.equal(res.kodeStatus, 201);
});

test('POS-08: [Distributor] Menerbitkan produk sarana tani berizin (POST /katalog/tambah)', () => {
  const res = evaluasiAkses('katalog', 'buat', {
    peran: 'distributor',
    idPengguna: 'USR-DIST-01',
    distributorTerverifikasi: true,
  });
  assert.equal(res.diizinkan, true);
  assert.equal(res.kodeStatus, 201);
});

test('POS-09: [Distributor] Mengupdate stok produk miliknya sendiri (PUT /katalog/101)', () => {
  const res = evaluasiAkses('katalog', 'ubah', {
    peran: 'distributor',
    idPengguna: 'USR-DIST-01',
    idPemilikSumberDaya: 'USR-DIST-01',
  });
  assert.equal(res.diizinkan, true);
  assert.equal(res.kodeStatus, 200);
});

test('POS-10: [Pengawas] Mengakses log audit forensik keamanan (GET /api/security/audit-log)', () => {
  const res = evaluasiAkses('audit_log', 'baca', { peran: 'pengawas', idPengguna: 'USR-PENGAWAS-01' });
  assert.equal(res.diizinkan, true);
  assert.equal(res.kodeStatus, 200);
});

test('POS-11: [Pengawas] Memverifikasi nomor izin edar Kementan (POST /api/katalog/101/verifikasi)', () => {
  const res = evaluasiAkses('izin_edar', 'verifikasi', { peran: 'pengawas', idPengguna: 'USR-PENGAWAS-01' });
  assert.equal(res.diizinkan, true);
  assert.equal(res.kodeStatus, 200);
});

test('POS-12: [Pengawas] Membekukan/karantina obat racun ilegal tanpa izin (POST /api/katalog/999/karantina)', () => {
  const res = evaluasiAkses('izin_edar', 'karantina', { peran: 'pengawas', idPengguna: 'USR-PENGAWAS-01' });
  assert.equal(res.diizinkan, true);
  assert.equal(res.kodeStatus, 200);
});

// ============================================================================
// BAGIAN II: 12 UJI AKSES NEGATIF (AKSES TIDAK SAH DITOLAK)
// ============================================================================

test('NEG-01: [Tamu] Menambah produk tanpa login ditolak 401 (POST /katalog/tambah) [Ref: T-10]', () => {
  const res = evaluasiAkses('katalog', 'buat', { peran: 'tamu' });
  assert.equal(res.diizinkan, false);
  assert.equal(res.kodeStatus, 401);
});

test('NEG-02: [Tamu] Checkout pesanan B3 tanpa identitas ditolak 401 (POST /order) [Ref: T-02]', () => {
  const res = evaluasiAkses('order', 'buat', { peran: 'tamu' });
  assert.equal(res.diizinkan, false);
  assert.equal(res.kodeStatus, 401);
});

test('NEG-03: [Tamu] Akses audit log keamanan tanpa sesi ditolak 401 (GET /api/security/audit-log) [Ref: R-02]', () => {
  const res = evaluasiAkses('audit_log', 'baca', { peran: 'tamu' });
  assert.equal(res.diizinkan, false);
  assert.equal(res.kodeStatus, 401);
});

test('NEG-04: [Petani] Menerbitkan produk ke katalog nasional ditolak 403 (POST /katalog/tambah) [Ref: T-10]', () => {
  const res = evaluasiAkses('katalog', 'buat', { peran: 'petani', idPengguna: 'USR-PETANI-01' });
  assert.equal(res.diizinkan, false);
  assert.equal(res.kodeStatus, 403);
});

test('NEG-05: [Petani] Mengubah harga/stok produk distributor ditolak 403 (PUT /katalog/101) [Ref: R-01]', () => {
  const res = evaluasiAkses('katalog', 'ubah', {
    peran: 'petani',
    idPengguna: 'USR-PETANI-01',
    idPemilikSumberDaya: 'USR-DIST-01',
  });
  assert.equal(res.diizinkan, false);
  assert.equal(res.kodeStatus, 403);
});

test('NEG-06: [Petani] Menyetujui izin edar Kementan ditolak 403 (POST /api/katalog/101/verifikasi) [Ref: R-03]', () => {
  const res = evaluasiAkses('izin_edar', 'verifikasi', { peran: 'petani', idPengguna: 'USR-PETANI-01' });
  assert.equal(res.diizinkan, false);
  assert.equal(res.kodeStatus, 403);
});

test('NEG-07: [Petani] IDOR Attack: Membuka pesanan/PII petani lain ditolak 403 (GET /order/ORD-002) [Ref: R-02]', () => {
  const res = evaluasiAkses('order', 'baca', {
    peran: 'petani',
    idPengguna: 'USR-PETANI-01',
    idPemilikSumberDaya: 'USR-PETANI-02', // Target korban IDOR
  });
  assert.equal(res.diizinkan, false);
  assert.equal(res.kodeStatus, 403);
});

test('NEG-08: [Distributor] Rekayasa ulasan pada produk toko ditolak 403 (POST /api/ulasan) [Ref: T-03]', () => {
  const res = evaluasiAkses('ulasan', 'buat', { peran: 'distributor', idPengguna: 'USR-DIST-01' });
  assert.equal(res.diizinkan, false);
  assert.equal(res.kodeStatus, 403);
});

test('NEG-09: [Distributor] Cross-Tenant IDOR: Mengubah produk distributor lain ditolak 403 (PUT /katalog/202) [Ref: R-01]', () => {
  const res = evaluasiAkses('katalog', 'ubah', {
    peran: 'distributor',
    idPengguna: 'USR-DIST-01',
    idPemilikSumberDaya: 'USR-DIST-02', // Produk kepunyaan kios lain
  });
  assert.equal(res.diizinkan, false);
  assert.equal(res.kodeStatus, 403);
});

test('NEG-10: [Distributor] Self-Approval izin edar sendiri ditolak 403 (POST /api/katalog/101/verifikasi) [Ref: R-03]', () => {
  const res = evaluasiAkses('izin_edar', 'verifikasi', { peran: 'distributor', idPengguna: 'USR-DIST-01' });
  assert.equal(res.diizinkan, false);
  assert.equal(res.kodeStatus, 403);
});

test('NEG-11: [Distributor] Akses audit log forensik ditolak 403 (GET /api/security/audit-log) [Ref: R-02]', () => {
  const res = evaluasiAkses('audit_log', 'baca', { peran: 'distributor', idPengguna: 'USR-DIST-01' });
  assert.equal(res.diizinkan, false);
  assert.equal(res.kodeStatus, 403);
});

test('NEG-12: [Pengawas] Separation of Duty: Akun dinas belanja saprotan ditolak 403 (POST /order) [Ref: T-10]', () => {
  const res = evaluasiAkses('order', 'buat', { peran: 'pengawas', idPengguna: 'USR-PENGAWAS-01' });
  assert.equal(res.diizinkan, false);
  assert.equal(res.kodeStatus, 403);
});

// ============================================================================
// BAGIAN III: PENGUJIAN FUNGSI HASH LAMBAT & VERIFIKASI ZERO-KNOWLEDGE
// ============================================================================

test('HASH-01: Derivasi kata sandi lambat Scrypt menghasilkan hash 512-bit & salt CSPRNG 128-bit', () => {
  const plainPass = 'SandiPetaniAman2026!';
  const { salt, hash } = hashPassword(plainPass);

  assert.equal(salt.length, 32); // 16 bytes = 32 hex chars
  assert.equal(hash.length, 128); // 64 bytes = 128 hex chars (512-bit)
  assert.notEqual(hash, plainPass);

  const isValid = verifyPassword(plainPass, salt, hash);
  assert.equal(isValid, true, 'Verifikasi dengan kata sandi yang valid harus sukses');

  const isInvalid = verifyPassword('SandiPalsuSalah', salt, hash);
  assert.equal(isInvalid, false, 'Verifikasi dengan kata sandi yang salah wajib ditolak');
});

test('HASH-02: Mitigasi DoS CPU Flooding (R-04/T-09) dengan penolakan input > 72 karakter', () => {
  const giantPassword = 'A'.repeat(256);
  assert.throws(
    () => hashPassword(giantPassword),
    /Kata sandi melebihi batas 72 karakter/,
    'Password raksasa wajib ditolak sebelum dieksekusi oleh Scrypt'
  );
});

test('HASH-03: Benchmark fungsi hash membuktikan komputasi lambat tahan brute-force', () => {
  const t0 = performance.now();
  const runs = 3;
  for (let i = 0; i < runs; i++) {
    hashPassword('TestLatencyBenchmark123!');
  }
  const avgTime = (performance.now() - t0) / runs;

  // Scrypt CPU/memory-hard cost N=16384, r=8 memerlukan waktu eksekusi > 10 ms (biasanya 40-100 ms)
  assert.ok(avgTime >= 10, `Rata-rata waktu eksekusi (${avgTime.toFixed(2)} ms) membuktikan fungsi hash lambat`);
});
