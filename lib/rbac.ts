/**
 * MODUL SISTEM KONTROL AKSES BERBASIS PERAN (RBAC) & LEAST PRIVILEGE — AGROMARKET
 * Tugas 2 Keamanan Siber (Penanda sec-0.2)
 *
 * Mengimplementasikan pemisahan hak akses ketat (Separation of Duty) dan pencegahan
 * eskalasi hak istimewa (Anti-IDOR & Anti-Privilege Escalation) untuk produk AgroMarket.
 *
 * Pemetaan Risiko Tugas 1:
 * - R-01 / T-03: Manipulasi kuantitas & harga pesanan
 * - R-02 / T-07: Kebocoran PII lahan & data transaksi petani
 * - R-03 / T-01: Peredaran pupuk/pestisida palsu tanpa izin resmi
 * - T-10: Elevation of Privilege melalui manipulasi role pengguna
 */

export type PeranPengguna = 'tamu' | 'petani' | 'distributor' | 'pengawas';

export type SumberDaya =
  | 'katalog'
  | 'order'
  | 'ulasan'
  | 'izin_edar'
  | 'audit_log';

export type Aksi =
  | 'baca'
  | 'buat'
  | 'ubah'
  | 'hapus'
  | 'verifikasi'
  | 'karantina';

export interface KonteksAkses {
  idPengguna?: string;
  peran: PeranPengguna;
  idPemilikSumberDaya?: string;
  distributorTerverifikasi?: boolean;
  termasukBahanBerbahayaB3?: boolean;
}

export interface HasilEvaluasiAkses {
  diizinkan: boolean;
  alasan: string;
  kodeStatus: 200 | 201 | 401 | 403;
  idRisikoTerkait?: string;
}

/**
 * Matriks Otorisasi Utama AgroMarket
 */
export function evaluasiAkses(
  sumberDaya: SumberDaya,
  aksi: Aksi,
  konteks: KonteksAkses
): HasilEvaluasiAkses {
  const { peran, idPengguna, idPemilikSumberDaya, distributorTerverifikasi, termasukBahanBerbahayaB3 } = konteks;

  // 1. SUMBER DAYA: KATALOG PRODUK
  if (sumberDaya === 'katalog') {
    // Membaca katalog dan detail produk terbuka untuk publik (Semua peran)
    if (aksi === 'baca') {
      return {
        diizinkan: true,
        alasan: 'Katalog publik dapat diakses oleh semua pengguna.',
        kodeStatus: 200,
      };
    }

    // Menambah produk baru ke katalog
    if (aksi === 'buat') {
      if (peran === 'tamu') {
        return {
          diizinkan: false,
          alasan: 'Autentikasi diperlukan. Pengunjung anonim tidak dapat menambah produk.',
          kodeStatus: 401,
          idRisikoTerkait: 'T-10',
        };
      }
      if (peran === 'petani') {
        return {
          diizinkan: false,
          alasan: 'Hak akses ditolak. Peran Petani tidak memiliki wewenang menerbitkan produk.',
          kodeStatus: 403,
          idRisikoTerkait: 'T-10',
        };
      }
      if (peran === 'distributor') {
        if (distributorTerverifikasi === false) {
          return {
            diizinkan: false,
            alasan: 'Kios belum memiliki verifikasi NIB/izin resmi Kementan.',
            kodeStatus: 403,
            idRisikoTerkait: 'R-03',
          };
        }
        return {
          diizinkan: true,
          alasan: 'Distributor resmi diizinkan menerbitkan produk sarana pertanian.',
          kodeStatus: 201,
        };
      }
      if (peran === 'pengawas') {
        return {
          diizinkan: true,
          alasan: 'Pengawas berwenang menerbitkan produk rujukan atau benih subsidi.',
          kodeStatus: 201,
        };
      }
    }

    // Mengubah atau Menghapus produk (Anti-IDOR & Cross-Tenant Protection)
    if (aksi === 'ubah' || aksi === 'hapus') {
      if (peran === 'tamu') {
        return {
          diizinkan: false,
          alasan: 'Akses ditolak: pengguna belum terautentikasi.',
          kodeStatus: 401,
          idRisikoTerkait: 'T-10',
        };
      }
      if (peran === 'petani') {
        return {
          diizinkan: false,
          alasan: 'Akses ditolak: Petani tidak dapat mengubah katalog toko.',
          kodeStatus: 403,
          idRisikoTerkait: 'T-10',
        };
      }
      if (peran === 'distributor') {
        // IDOR Check: Distributor hanya boleh mengubah produk miliknya sendiri
        if (idPemilikSumberDaya && idPengguna && idPemilikSumberDaya !== idPengguna) {
          return {
            diizinkan: false,
            alasan: 'Pelanggaran kepemilikan (IDOR): Anda tidak berhak mengubah produk milik distributor lain.',
            kodeStatus: 403,
            idRisikoTerkait: 'R-01',
          };
        }
        return {
          diizinkan: true,
          alasan: 'Distributor berhasil memperbarui produk miliknya sendiri.',
          kodeStatus: 200,
        };
      }
      if (peran === 'pengawas') {
        return {
          diizinkan: true,
          alasan: 'Pengawas Kementan memiliki hak pengawasan untuk mengubah atau membekukan produk.',
          kodeStatus: 200,
        };
      }
    }
  }

  // 2. SUMBER DAYA: PEMESANAN (ORDER / TRANSAKSI)
  if (sumberDaya === 'order') {
    if (aksi === 'buat') {
      if (peran === 'tamu') {
        return {
          diizinkan: false,
          alasan: 'Pemesanan memerlukan autentikasi identitas petani (KTP/NIK Tani).',
          kodeStatus: 401,
          idRisikoTerkait: 'T-02',
        };
      }
      if (peran === 'petani') {
        return {
          diizinkan: true,
          alasan: 'Petani terverifikasi diizinkan memesan saprotan.',
          kodeStatus: 201,
        };
      }
      if (peran === 'distributor') {
        return {
          diizinkan: false,
          alasan: 'Pemisahan tugas (Separation of Duty): Akun penjual tidak dapat membeli melalui form eceran petani.',
          kodeStatus: 403,
          idRisikoTerkait: 'T-10',
        };
      }
      if (peran === 'pengawas') {
        return {
          diizinkan: false,
          alasan: 'Integritas audit: Akun pengawas dinas dilarang melakukan transaksi komersial.',
          kodeStatus: 403,
          idRisikoTerkait: 'T-10',
        };
      }
    }

    if (aksi === 'baca') {
      if (peran === 'tamu') {
        return {
          diizinkan: false,
          alasan: 'Akses riwayat pesanan mewajibkan login.',
          kodeStatus: 401,
          idRisikoTerkait: 'R-02',
        };
      }
      if (peran === 'petani') {
        // IDOR Check: Petani hanya boleh melihat pesanan miliknya sendiri
        if (idPemilikSumberDaya && idPengguna && idPemilikSumberDaya !== idPengguna) {
          return {
            diizinkan: false,
            alasan: 'Pelanggaran privasi (IDOR): Dilarang mengakses data riwayat pesanan dan koordinat lahan petani lain.',
            kodeStatus: 403,
            idRisikoTerkait: 'R-02',
          };
        }
        return {
          diizinkan: true,
          alasan: 'Petani berhak membaca rincian pesanan miliknya.',
          kodeStatus: 200,
        };
      }
      if (peran === 'distributor') {
        // Distributor hanya boleh melihat pesanan yang masuk ke tokonya
        if (idPemilikSumberDaya && idPengguna && idPemilikSumberDaya !== idPengguna) {
          return {
            diizinkan: false,
            alasan: 'Akses ditolak: Pesanan ini ditujukan untuk distributor lain.',
            kodeStatus: 403,
            idRisikoTerkait: 'R-02',
          };
        }
        return {
          diizinkan: true,
          alasan: 'Distributor berhak melihat pesanan yang dialamatkan ke kiosnya.',
          kodeStatus: 200,
        };
      }
      if (peran === 'pengawas') {
        return {
          diizinkan: true,
          alasan: 'Pengawas Kementan berhak melakukan audit kepatuhan transaksi B3.',
          kodeStatus: 200,
        };
      }
    }
  }

  // 3. SUMBER DAYA: ULASAN PRODUK (REVIEW / RATING)
  if (sumberDaya === 'ulasan') {
    if (aksi === 'baca') {
      return {
        diizinkan: true,
        alasan: 'Ulasan publik dapat dibaca oleh seluruh pengunjung.',
        kodeStatus: 200,
      };
    }
    if (aksi === 'buat') {
      if (peran === 'tamu') {
        return {
          diizinkan: false,
          alasan: 'Memberi ulasan memerlukan autentikasi pembeli.',
          kodeStatus: 401,
          idRisikoTerkait: 'T-02',
        };
      }
      if (peran === 'petani') {
        return {
          diizinkan: true,
          alasan: 'Petani diizinkan memberikan ulasan dan rating produk.',
          kodeStatus: 201,
        };
      }
      if (peran === 'distributor') {
        return {
          diizinkan: false,
          alasan: 'Pencegahan konflik kepentingan: Penjual dilarang memanipulasi rating/ulasan produk.',
          kodeStatus: 403,
          idRisikoTerkait: 'T-03',
        };
      }
      if (peran === 'pengawas') {
        return {
          diizinkan: false,
          alasan: 'Akun pengawas netral tidak memberikan ulasan komersial.',
          kodeStatus: 403,
          idRisikoTerkait: 'T-10',
        };
      }
    }
  }

  // 4. SUMBER DAYA: VERIFIKASI IZIN EDAR KEMENTAN & KARANTINA B3
  if (sumberDaya === 'izin_edar') {
    if (aksi === 'verifikasi' || aksi === 'karantina') {
      if (peran === 'tamu') {
        return {
          diizinkan: false,
          alasan: 'Operasi regulasi memerlukan kredensial pengawas resmi.',
          kodeStatus: 401,
          idRisikoTerkait: 'R-03',
        };
      }
      if (peran === 'petani' || peran === 'distributor') {
        return {
          diizinkan: false,
          alasan: 'Hak istimewa ditolak: Hanya Pengawas Kementan yang berwenang memvalidasi izin edar atau membekukan produk.',
          kodeStatus: 403,
          idRisikoTerkait: 'R-03',
        };
      }
      if (peran === 'pengawas') {
        return {
          diizinkan: true,
          alasan: 'Pengawas resmi Kementan berhasil menandatangani verifikasi izin edar / karantina.',
          kodeStatus: 200,
        };
      }
    }
  }

  // 5. SUMBER DAYA: AUDIT LOG KEAMANAN & FORENSIK DIGITAL
  if (sumberDaya === 'audit_log') {
    if (peran === 'pengawas') {
      return {
        diizinkan: true,
        alasan: 'Pengawas berwenang menginspeksi log audit forensik dan keamanan sistem.',
        kodeStatus: 200,
      };
    }
    if (peran === 'tamu') {
      return {
        diizinkan: false,
        alasan: 'Akses audit log ditolak: Pengguna anonim.',
        kodeStatus: 401,
        idRisikoTerkait: 'R-02',
      };
    }
    return {
      diizinkan: false,
      alasan: 'Prinsip Hak Akses Terkecil (Least Privilege): Audit log hanya dapat diakses peran Pengawas.',
      kodeStatus: 403,
      idRisikoTerkait: 'R-02',
    };
  }

  // Default deny (Fail-safe security)
  return {
    diizinkan: false,
    alasan: 'Aksi tidak terdaftar atau tidak diizinkan oleh kebijakan keamanan.',
    kodeStatus: 403,
  };
}
