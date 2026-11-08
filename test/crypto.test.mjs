import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

/**
 * TEST SUITE: ENKRIPSI TERAUTENTIKASI (AEAD) & INTEGRITAS KRIPTOGRAFI
 * Mata Kuliah : Kriptografi & Keamanan Siber
 * Milestone    : Tugas 2 Kriptografi (Penanda v0.2)
 *
 * Kepatuhan Ketentuan Minimum:
 * - Minimal 4 skenario uji, minimal 3 berhasil
 * - Data atau tag yang dimodifikasi dan kunci yang salah ditolak (Fail-Closed)
 * - Parameter terdokumentasi: Kunci 256-bit, Nonce/IV 96-bit CSPRNG, AAD, Tag 128-bit
 * - Kunci disimpan di luar repositori dan diturunkan dengan HKDF (RFC 5869)
 */

// ============================================================================
// IMPLEMENTASI MANDIRI UNTUK TEST RUNNER NODE.JS
// ============================================================================

function generateSymmetricKey() {
  return crypto.randomBytes(32);
}

function deriveSubKey(masterKey, contextInfo, length = 32) {
  if (!masterKey || masterKey.length !== 32) throw new Error('Master key wajib 32 byte');
  return Buffer.from(
    crypto.hkdfSync('sha256', masterKey, Buffer.alloc(0), Buffer.from(contextInfo, 'utf8'), length)
  );
}

function encryptAEAD(plaintext, key, aad) {
  if (typeof plaintext !== 'string' || plaintext.trim() === '') throw new Error('Plaintext kosong');
  if (!Buffer.isBuffer(key) || key.length !== 32) throw new Error('Kunci wajib 32 byte');

  const iv = crypto.randomBytes(12); // 96-bit CSPRNG IV
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  if (aad && typeof aad === 'string') {
    cipher.setAAD(Buffer.from(aad, 'utf8'));
  }

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return {
    ciphertext: encrypted,
    iv: iv.toString('hex'),
    authTag: cipher.getAuthTag().toString('hex'),
    aad,
    algorithm: 'aes-256-gcm',
  };
}

function decryptAEAD(payload, key) {
  if (!payload || !payload.ciphertext || !payload.iv || !payload.authTag) {
    throw new Error('Payload tidak lengkap');
  }
  if (!Buffer.isBuffer(key) || key.length !== 32) {
    throw new Error('Kunci tidak valid');
  }

  const iv = Buffer.from(payload.iv, 'hex');
  const authTag = Buffer.from(payload.authTag, 'hex');

  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    if (payload.aad && typeof payload.aad === 'string') {
      decipher.setAAD(Buffer.from(payload.aad, 'utf8'));
    }

    let decrypted = decipher.update(payload.ciphertext, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    throw new Error('Dekripsi AEAD gagal: Integritas data, tag autentikasi, AAD, atau kunci tidak valid (Fail-Closed).');
  }
}

function hashPassword(password) {
  if (!password || password.length < 8) throw new Error('Password terlalu pendek');
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return { salt, hash: derivedKey.toString('hex') };
}

function verifyPassword(password, salt, originalHash) {
  const derivedKey = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return crypto.timingSafeEqual(Buffer.from(derivedKey.toString('hex'), 'hex'), Buffer.from(originalHash, 'hex'));
}

function signProductLicense(licenseData, secretKey) {
  return crypto.createHmac('sha256', secretKey).update(licenseData).digest('hex');
}

function verifyProductLicense(licenseData, secretKey, signature) {
  const expected = signProductLicense(licenseData, secretKey);
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
}

// ============================================================================
// SKENARIO UJI 1 S/D 4: SKENARIO BERHASIL (MINIMAL 3 BERHASIL TERPENUHI)
// ============================================================================

test('SKENARIO 1 (Berhasil): Enkripsi & Dekripsi AEAD AES-256-GCM dengan AAD Konteks Transaksi', () => {
  const key = generateSymmetricKey();
  const samplePII = 'Nama: Budi Santoso | NIK Tani: 3201019012830001 | Lahan: Desa Sukamaju Blok B-12';
  const transactionAAD = 'orderId=ORD-AGRO-2026-001;userId=USR-PETANI-01;timestamp=2026-11-08T12:00:00Z';

  const encrypted = encryptAEAD(samplePII, key, transactionAAD);

  assert.ok(encrypted.ciphertext, 'Ciphertext harus berhasil terbentuk');
  assert.equal(encrypted.iv.length, 24, 'Panjang IV wajib 24 karakter hex (12 byte / 96-bit)');
  assert.equal(encrypted.authTag.length, 32, 'Panjang Auth Tag wajib 32 karakter hex (16 byte / 128-bit)');
  assert.notEqual(encrypted.ciphertext, samplePII, 'Ciphertext tidak boleh sama dengan plaintext');

  const decrypted = decryptAEAD(encrypted, key);
  assert.equal(decrypted, samplePII, 'Hasil dekripsi AEAD harus identik dengan data asli pemesan');
});

test('SKENARIO 2 (Berhasil): Derivasi Kunci Hirarkis Menggunakan HKDF (RFC 5869)', () => {
  const masterKey = generateSymmetricKey();

  const subKeyOrder = deriveSubKey(masterKey, 'AgroMarket-Order-Encryption-v1', 32);
  const subKeyLicense = deriveSubKey(masterKey, 'AgroMarket-License-HMAC-v1', 32);

  assert.equal(subKeyOrder.length, 32, 'Sub-kunci order harus berukuran 32 byte (256-bit)');
  assert.equal(subKeyLicense.length, 32, 'Sub-kunci license harus berukuran 32 byte (256-bit)');
  assert.notDeepEqual(subKeyOrder, subKeyLicense, 'Domain separation: Sub-kunci untuk tujuan berbeda wajib berlainan');
});

test('SKENARIO 3 (Berhasil): Penandatanganan & Verifikasi Integritas Izin Edar Kementan (HMAC-SHA256)', () => {
  const secretKey = 'DistributorKiosTaniSecret2026';
  const licensePayload = 'KEMTAN RI No. 01.01.2026.889 - Fungisida Sistemik Bahan Aktif Difenokonazol 250 g/l';

  const signature = signProductLicense(licensePayload, secretKey);
  assert.equal(signature.length, 64, 'Panjang signature HMAC-SHA256 harus 64 karakter hex');

  const isValid = verifyProductLicense(licensePayload, secretKey, signature);
  assert.equal(isValid, true, 'Nomor izin edar asli wajib tervalidasi sah');
});

test('SKENARIO 4 (Berhasil): Password Hashing dengan Fungsi Lambat Scrypt KDF dan Verifikasi Waktu Konstan', () => {
  const rawPassword = 'PasswordTaniKuat2026!#';
  const { salt, hash } = hashPassword(rawPassword);

  assert.equal(salt.length, 32, 'Salt CSPRNG harus berukuran 16 byte (32 hex chars)');
  assert.equal(hash.length, 128, 'Hash Scrypt harus 64 byte (128 hex chars / 512-bit)');

  const isMatch = verifyPassword(rawPassword, salt, hash);
  assert.equal(isMatch, true, 'Verifikasi dengan kata sandi yang cocok harus bernilai true');
});

// ============================================================================
// SKENARIO UJI 5 S/D 8: KONDISI TIDAK SAH DITOLAK (GAGAL TERTUTUP / FAIL-CLOSED)
// ============================================================================

test('SKENARIO 5 (Kondisi Tidak Sah / Ditolak): Modifikasi Ciphertext Ditolak (Auth Tag Mismatch)', () => {
  const key = generateSymmetricKey();
  const samplePII = 'Data Pengiriman Pupuk Urea Bersubsidi 500 kg';
  const aad = 'orderId=ORD-999';

  const encrypted = encryptAEAD(samplePII, key, aad);

  // SIMULASI SERANGAN TAMPERING: Penyerang memodifikasi 4 byte terakhir ciphertext
  const tamperedCiphertext =
    encrypted.ciphertext.substring(0, encrypted.ciphertext.length - 4) + 'ZZZZ';
  const tamperedPayload = { ...encrypted, ciphertext: tamperedCiphertext };

  // Sistem wajib gagal tertutup dan menolak membuka data
  assert.throws(
    () => decryptAEAD(tamperedPayload, key),
    /Dekripsi AEAD gagal: Integritas data, tag autentikasi, AAD, atau kunci tidak valid/,
    'Modifikasi ciphertext wajib ditolak oleh Galois Authentication Tag'
  );
});

test('SKENARIO 6 (Kondisi Tidak Sah / Ditolak): Manipulasi AAD Konteks Transaksi Ditolak Keras', () => {
  const key = generateSymmetricKey();
  const samplePII = 'Alamat Pengiriman Pestisida Golongan B3: Gudang Tani Karawang';
  const originalAAD = 'orderId=ORD-101;buyer=USR-PETANI-ASLI';

  const encrypted = encryptAEAD(samplePII, key, originalAAD);

  // SIMULASI SERANGAN CONTEXT TRANSPOSITION: Penyerang mencoba mengalihkan pesanan ke akun lain
  const tamperedPayload = {
    ...encrypted,
    aad: 'orderId=ORD-101;buyer=USR-PENYERANG-HACKER',
  };

  assert.throws(
    () => decryptAEAD(tamperedPayload, key),
    /Dekripsi AEAD gagal: Integritas data, tag autentikasi, AAD, atau kunci tidak valid/,
    'Perubahan metadata AAD wajib menggagalkan verifikasi integritas AEAD'
  );
});

test('SKENARIO 7 (Kondisi Tidak Sah / Ditolak): Dekripsi Menggunakan Kunci yang Salah Ditolak', () => {
  const correctKey = generateSymmetricKey();
  const wrongKey = generateSymmetricKey(); // Kunci penyerang yang berlainan
  const sampleData = 'Catatan Transaksi Rahasia Petani';

  const encrypted = encryptAEAD(sampleData, correctKey, 'context=secret');

  assert.throws(
    () => decryptAEAD(encrypted, wrongKey),
    /Dekripsi AEAD gagal: Integritas data, tag autentikasi, AAD, atau kunci tidak valid/,
    'Kunci yang salah wajib ditolak tanpa membocorkan plaintext apapun'
  );
});

test('SKENARIO 8 (Kondisi Tidak Sah / Ditolak): Auth Tag Dipalsukan / Rusak Ditolak', () => {
  const key = generateSymmetricKey();
  const sampleData = 'Data Formula Pupuk Organik Cair Kementan';
  const encrypted = encryptAEAD(sampleData, key);

  // SIMULASI SERANGAN: Pemalsuan nilai Galois Authentication Tag
  const fakeTag = crypto.randomBytes(16).toString('hex');
  const corruptedPayload = { ...encrypted, authTag: fakeTag };

  assert.throws(
    () => decryptAEAD(corruptedPayload, key),
    /Dekripsi AEAD gagal: Integritas data, tag autentikasi, AAD, atau kunci tidak valid/,
    'Auth Tag palsu wajib langsung memicu penolakan tertutup'
  );
});