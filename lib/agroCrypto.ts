import crypto from 'node:crypto';

/**
 * AGROMARKET CRYPTOGRAPHY & AUTHENTICATION MODULE
 * Menggunakan standar industri modern:
 * 1. AES-256-GCM (Enkripsi Terotentikasi untuk Data Pribadi Pemesan / PII)
 * 2. Scrypt KDF (Fungsi Hash Lambat / Memory-Hard untuk Kata Sandi Pengguna)
 * 3. HMAC-SHA256 (Integritas Nomor Izin Kementan & Verifikasi Lisensi)
 *
 * Kepatuhan Rubrik Tugas 2 Keamanan Siber:
 * - Kata sandi disimpan dengan fungsi hash lambat (Scrypt KDF)
 * - Bukti hashing tanpa membuka data nyata pengguna (Data Masking)
 * - Rujukan Risiko Tugas 1:
 *   * R-02 / T-07: Kebocoran Data Pribadi Pemesan (AES-256-GCM)
 *   * R-03 / T-01: Verifikasi Izin Edar Kementan (HMAC-SHA256)
 *   * R-04 / T-09: Eksploitasi CPU Resource Exhaustion / Hash Bomb (Batas Input & Scrypt KDF)
 */

export interface EncryptedData {
  ciphertext: string; // Base64
  iv: string;         // Hex
  authTag: string;    // Hex
}

export interface PasswordHashResult {
  salt: string;
  hash: string;
  algorithm: string;
  params: {
    N: number;
    r: number;
    p: number;
    keyLen: number;
  };
}

export interface MaskedUserProof {
  userId: string;
  peran: string;
  algoritma: string;
  formatKriptografis: string;
  saltMasked: string;
  hashMasked: string;
  panjangBit: number;
  statusKerahasiaan: string;
}

// ============================================================================
// KOMPONEN 1: ENKRIPSI DATA PRIBADI PEMESAN (AES-256-GCM) [Ref: R-02 / T-07]
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

  const iv = crypto.randomBytes(12); // 96-bit nonce standar GCM
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
// KOMPONEN 2: HASHING KATA SANDI DENGAN FUNGSI LAMBAT (SCRYPT) [Ref: R-04 / T-09]
// ============================================================================

// Parameter Scrypt yang direkomendasikan RFC 7914 / OWASP:
// N = 16384 (CPU/memory cost parameter), r = 8 (block size), p = 1 (parallelization)
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64; // 512-bit derived key
const MAX_PASSWORD_LENGTH = 72; // Proteksi terhadap DoS string raksasa (R-04)

export function hashPassword(password: string): PasswordHashResult {
  if (!password || password.length < 8) {
    throw new Error('Kata sandi minimal harus 8 karakter untuk memenuhi standar keamanan.');
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`Kata sandi melebihi batas aman (${MAX_PASSWORD_LENGTH} karakter). Ditolak untuk mitigasi DoS.`);
  }

  // Generate 16-byte cryptographically secure pseudorandom salt
  const salt = crypto.randomBytes(16).toString('hex');

  // Derivasi kunci lambat menggunakan scryptSync dengan parameter memory-hard
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: 32 * 1024 * 1024, // 32 MB limit
  });

  return {
    salt,
    hash: derivedKey.toString('hex'),
    algorithm: 'scrypt',
    params: {
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P,
      keyLen: SCRYPT_KEYLEN,
    },
  };
}

export function verifyPassword(password: string, salt: string, originalHash: string): boolean {
  if (!password || !salt || !originalHash) {
    return false;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return false;
  }

  try {
    const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, {
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P,
      maxmem: 32 * 1024 * 1024,
    });

    const derivedBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
    const originalBuffer = Buffer.from(originalHash, 'hex');

    if (derivedBuffer.length !== originalBuffer.length) {
      return false;
    }

    // Wajib konstan waktu (constant-time comparison) untuk mencegah Side-Channel Timing Attack (Ref: RSK-12 / THR-09)
    return crypto.timingSafeEqual(derivedBuffer, originalBuffer);
  } catch {
    return false;
  }
}

/**
 * Memproduksi Bukti Verifikasi Hash Kata Sandi Tanpa Membuka Data Nyata Pengguna
 * (Zero-Knowledge Masked Evidence)
 */
export function generateMaskedProof(
  userId: string,
  peran: string,
  salt: string,
  hash: string
): MaskedUserProof {
  const saltMasked = salt.substring(0, 6) + '...' + salt.substring(salt.length - 6);
  const hashMasked = hash.substring(0, 10) + '...' + hash.substring(hash.length - 10);
  const formatModular = `$scrypt$ln=${Math.log2(SCRYPT_N)},r=${SCRYPT_R},p=${SCRYPT_P}$${saltMasked}$${hashMasked}`;

  return {
    userId,
    peran,
    algoritma: `Scrypt KDF (N=${SCRYPT_N}, r=${SCRYPT_R}, p=${SCRYPT_P})`,
    formatKriptografis: formatModular,
    saltMasked,
    hashMasked,
    panjangBit: hash.length * 4, // 512 bits
    statusKerahasiaan: 'TERLINDUNGI (Plaintext kata sandi tidak pernah disimpan / direkam)',
  };
}

/**
 * Benchmark Waktu Eksekusi Fungsi Hash Lambat (Scrypt vs Fast Hash)
 */
export function benchmarkHashExecution(): {
  scryptAvgMs: number;
  sha256AvgMs: number;
  md5AvgMs: number;
  rasioKetahananBruteForce: string;
} {
  const samplePass = 'KombinasiRahasiaPetani2026!#';
  const salt = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';

  // Benchmark MD5 (Fast / Insecure)
  const startMd5 = performance.now();
  for (let i = 0; i < 200; i++) {
    crypto.createHash('md5').update(samplePass + salt).digest();
  }
  const endMd5 = performance.now();
  const md5Avg = (endMd5 - startMd5) / 200;

  // Benchmark SHA-256 (Fast / Insecure untuk password)
  const startSha = performance.now();
  for (let i = 0; i < 200; i++) {
    crypto.createHash('sha256').update(samplePass + salt).digest();
  }
  const endSha = performance.now();
  const shaAvg = (endSha - startSha) / 200;

  // Benchmark Scrypt (Slow / Memory-Hard KDF)
  const scryptRuns = 5;
  const startScrypt = performance.now();
  for (let i = 0; i < scryptRuns; i++) {
    crypto.scryptSync(samplePass, salt, 64, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  }
  const endScrypt = performance.now();
  const scryptAvg = (endScrypt - startScrypt) / scryptRuns;

  const rasio = Math.round(scryptAvg / shaAvg);

  return {
    scryptAvgMs: Number(scryptAvg.toFixed(2)),
    sha256AvgMs: Number(shaAvg.toFixed(4)),
    md5AvgMs: Number(md5Avg.toFixed(4)),
    rasioKetahananBruteForce: `Scrypt ${rasio.toLocaleString()}x lebih lambat dari SHA-256 (Tahan GPU/ASIC Brute-Force)`,
  };
}

// ============================================================================
// KOMPONEN 3: VERIFIKASI INTEGRITAS NOMOR IZIN KEMENTAN (HMAC-SHA256) [Ref: R-03 / T-01]
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