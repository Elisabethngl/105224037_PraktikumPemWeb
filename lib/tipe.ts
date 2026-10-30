export type KategoriProduk =
  | "Pupuk Tani"
  | "Obat Racun & Hama"
  | "Benih Unggul"
  | "Alat Pertanian";

export interface Produk {
  id: number;
  judul: string;
  kategori: KategoriProduk;
  deskripsi: string;
  harga: number;
  satuan: string;
  tersedia: boolean;
  bahanAktif?: string;
  aturanDosis?: string;
  peringatanBahaya?: string;
  nomorRegistrasi?: string;
  asalDaerah?: string;
  gambar?: string;
}

// Alias untuk kompatibilitas
export type Item = Produk;
export type Kategori = KategoriProduk;
