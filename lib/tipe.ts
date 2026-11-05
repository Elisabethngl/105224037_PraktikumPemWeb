export type KategoriProduk =
  | "Pupuk Tani"
  | "Obat Racun & Hama"
  | "Benih Unggul"
  | "Alat Pertanian";

export interface Ulasan {
  id: number;
  nama: string;
  nilai: number;
  komentar: string;
  dibuatPada?: Date;
  itemId: number;
}

export interface Produk {
  id: number;
  judul: string;
  kategori: KategoriProduk | string;
  deskripsi: string;
  harga?: number;
  satuan?: string;
  tersedia: boolean;
  bahanAktif?: string;
  aturanDosis?: string;
  peringatanBahaya?: string;
  nomorRegistrasi?: string;
  asalDaerah?: string;
  gambar: string | null;
  dibuatPada?: Date;
  ulasan?: Ulasan[];
}

// Alias untuk kompatibilitas
export type Item = Produk;
export type Kategori = KategoriProduk;
