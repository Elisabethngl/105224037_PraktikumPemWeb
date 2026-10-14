import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// Re-implementasi fungsional mandiri untuk eksekusi test runner Node.js
function generateSymmetricKey() {
  return crypto.randomBytes(32);
}

function encryptCustomerData(plaintext, key) {
  if (!plaintext || plaintext.trim() === '') throw new Error('Plaintext kosong');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return {
    ciphertext: encrypted,
    iv: iv.toString('hex'),
    authTag: cipher.getAuthTag().toString('hex'),
  };
}

function decryptCustomerData(data, key) {
  const iv = Buffer.from(data.iv, 'hex');
  const authTag = Buffer.from(data.authTag, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(data.ciphertext, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function hashPassword(password) {
  if (!password || password.length < 6) throw new Error('Password terlalu pendek');
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, originalHash) {
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(originalHash, 'hex'));
}

function signProductLicense(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

function verifyProductLicense(data, secret, signature) {
  const expected = signProductLicense(data, secret);
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
}

// ============================================================================
// SKENARIO UJI OTOMATIS (MINIMAL 4 SKENARIO: MINIMAL 3 BERHASIL + 1 NEGATIF)
// ============================================================================

test('SKENARIO 1 (Positif): Enkripsi & Dekripsi Data Pribadi Pemesan (AES-256-GCM)', () => {
  const masterKey = generateSymmetricKey();
  const sampleData = 'Nama: Pak Budi Santoso | Alamat: Desa Sukamaju RT 02/05 | Telp: 081234567890';

  const encrypted = encryptCustomerData(sampleData, masterKey);
  assert.ok(encrypted.ciphertext, 'Ciphertext harus terbuat');
  assert.notEqual(encrypted.ciphertext, sampleData, 'Ciphertext tidak boleh sama dengan plaintext');

  const decrypted = decryptCustomerData(encrypted, masterKey);
  assert.equal(decrypted, sampleData, 'Hasil dekripsi harus identik dengan data asli pemesan');
});

test('SKENARIO 2 (Positif): Password Hashing & Verifikasi Kredensial Pengguna (Scrypt)', () => {
  const passwordRahasia = 'PetaniSukses2026!';
  const { salt, hash } = hashPassword(passwordRahasia);

  assert.ok(salt, 'Salt harus dihasilkan dari CSPRNG');
  assert.ok(hash, 'Hash harus dihasilkan');
  assert.notEqual(hash, passwordRahasia, 'Password tidak boleh disimpan dalam plaintext');

  const isMatch = verifyPassword(passwordRahasia, salt, hash);
  assert.equal(isMatch, true, 'Verifikasi dengan password yang benar harus bernilai true');
});

test('SKENARIO 3 (Positif): Penandatanganan & Verifikasi Integritas Izin Edar Kementan (HMAC-SHA256)', () => {
  const secretKey = 'AgroMarketSecretDistributorKey2026';
  const licensePayload = 'KEMTAN RI No. 01.01.2021.145 - Pupuk NPK Mutiara 16-16-16';

  const signature = signProductLicense(licensePayload, secretKey);
  assert.ok(signature, 'Signature HMAC harus terbentuk');

  const isValid = verifyProductLicense(licensePayload, secretKey, signature);
  assert.equal(isValid, true, 'Nomor izin edar asli harus tervalidasi sah');
});

test('SKENARIO 4 (Negatif / Uji Batas): Deteksi Manipulasi Data Ciphertext / Tampering (AES-GCM Auth Tag Failure)', () => {
  const masterKey = generateSymmetricKey();
  const sampleData = 'Data Pembelian Pestisida Golongan I';

  const encrypted = encryptCustomerData(sampleData, masterKey);

  // SIMULASI SERANGAN: Penyerang memanipulasi ciphertext (tampered data)
  const tamperedCiphertext = encrypted.ciphertext.substring(0, encrypted.ciphertext.length - 4) + 'AAAA';
  const tamperedData = {
    ...encrypted,
    ciphertext: tamperedCiphertext,
  };

  // Harapannya: Sistem harus menolak dan melempar error otentikasi (Auth Tag Mismatch)
  assert.throws(
    () => {
      decryptCustomerData(tamperedData, masterKey);
    },
    /Unsupported state or unable to authenticate data/,
    'Dekripsi wajib gagal saat data dimanipulasi oleh penyerang'
  );
});

test('SKENARIO 5 (Negatif / Uji Batas): Penolakan Password Salah & Data Izin Edar Palsu', () => {
  const { salt, hash } = hashPassword('PasswordPetaniAsli123');

  // Uji batas 1: Password salah
  const isCorrect = verifyPassword('PasswordPalsuSalah', salt, hash);
  assert.equal(isCorrect, false, 'Password yang salah wajib ditolak');

  // Uji batas 2: Data lisensi dipalsukan nomor registrasinya
  const secret = 'SecretKeyKementan';
  const validSig = signProductLicense('KEMTAN-RESMI-12345', secret);
  const isLicenseValid = verifyProductLicense('KEMTAN-PALSU-99999', secret, validSig);
  assert.equal(isLicenseValid, false, 'Lisensi yang diubah wajib gagal verifikasi');
});