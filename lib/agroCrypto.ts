import crypto from 'node:crypto';

/**
 * AGROMARKET CRYPTOGRAPHY MODULE
 * Menggunakan pustaka resmi 'node:crypto' dengan standar industri modern:
 * 1. AES-256-GCM (Enkripsi Terotentikasi untuk Data Pribadi Pemesan)
 * 2. Scrypt / PBKDF2 (Password Hashing Kredensial Pengguna dengan Salt Unik)
 * 3. HMAC-SHA256 (Integritas Nomor Izin Kementan & Bukti Transaksi)
 */

export interface EncryptedData {
  ciphertext: string; // Base64
  iv: string;         // Hex
  authTag: string;    // Hex
}

// ============================================================================
// KOMPONEN 1: ENKRIPSI DATA PRIBADI PEMESAN (AES-256-GCM)
// Masukan : Plaintext (string), 256-bit Key (Buffer)
// Proses  : AES-256 terotentikasi Galois/Counter Mode dengan CSPRNG IV 12-byte
// Keluaran: Ciphertext (Base64), IV (Hex), Auth Tag (Hex)
// ============================================================================

export function generateSymmetricKey(): Buffer {
  return crypto.randomBytes(32); // 256-bit key dari CSPRNG
}

export function encryptCustomerData(plaintext: string, key: Buffer): EncryptedData {
  if (!plaintext || plaintext.trim() === '') {
    throw new Error('Plaintext data tidak boleh kosong.');
  }
  if (key.length !== 32) {
    throw new Error('Kunci enkripsi harus berukuran 32 byte (256-bit).');
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

export function decryptCustomerData(data: EncryptedData, key: Buffer): string {
  if (key.length !== 32) {
    throw new Error('Kunci enkripsi harus berukuran 32 byte (256-bit).');
  }

  const iv = Buffer.from(data.iv, 'hex');
  const authTag = Buffer.from(data.authTag, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(data.ciphertext, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// ============================================================================
// KOMPONEN 2: HASHING PASSWORD PENGGUNA (SCRYPT DENGAN SALT UNIK)
// Masukan : Password plaintext (string)
// Proses  : Fungsi derivasi kunci Scrypt (CPU/memory-hard) + CSPRNG Salt 16-byte
// Keluaran: Salt (Hex) dan Hashed Key (Hex)
// ============================================================================

export function hashPassword(password: string): { salt: string; hash: string } {
  if (!password || password.length < 6) {
    throw new Error('Password minimal harus 6 karakter.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);

  return {
    salt,
    hash: derivedKey.toString('hex'),
  };
}

export function verifyPassword(password: string, salt: string, originalHash: string): boolean {
  if (!password || !salt || !originalHash) {
    return false;
  }

  const derivedKey = crypto.scryptSync(password, salt, 64);
  const derivedBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
  const originalBuffer = Buffer.from(originalHash, 'hex');

  if (derivedBuffer.length !== originalBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(derivedBuffer, originalBuffer);
}

// ============================================================================
// KOMPONEN 3: VERIFIKASI INTEGRITAS NOMOR IZIN KEMENTAN (HMAC-SHA256)
// Masukan : Data Izin Produk (string), Secret Key (string)
// Proses  : Hash-based Message Authentication Code menggunakan SHA-256
// Keluaran: Checksum tanda tangan integritas (Hex)
// ============================================================================

export function signProductLicense(licenseData: string, secretKey: string): string {
  if (!licenseData || !secretKey) {
    throw new Error('Data izin dan secret key wajib diisi.');
  }
  return crypto.createHmac('sha256', secretKey).update(licenseData).digest('hex');
}

export function verifyProductLicense(licenseData: string, secretKey: string, signature: string): boolean {
  const expectedSignature = signProductLicense(licenseData, secretKey);
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const actualBuffer = Buffer.from(signature, 'hex');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}