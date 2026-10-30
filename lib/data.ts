import "server-only";
import type { Produk } from "./tipe";
import type { MasukanItem } from "./skema";

export const daftarItem: Produk[] = [
  {
    id: 1,
    judul: "Pupuk NPK Mutiara 16-16-16 Biru",
    kategori: "Pupuk Tani",
    deskripsi:
      "Pupuk majemuk NPK lengkap dengan komposisi seimbang Nitrogen, Fosfat, dan Kalium untuk memacu pertumbuhan vegetatif dan pembungaan tanaman hortikultura.",
    harga: 18500,
    satuan: "kg",
    tersedia: true,
    bahanAktif: "N 16%, P2O5 16%, K2O 16%",
    aturanDosis:
      "Kocorkan 1-2 sendok makan per 10 liter air seminggu sekali pada pangkal tanaman.",
    peringatanBahaya:
      "Simpan di tempat kering dan tertutup rapat, jauhkan dari jangkauan anak-anak.",
    nomorRegistrasi: "KEMTAN RI No. 01.01.2021.145",
    asalDaerah: "Gresik, Jawa Timur",
  },
  {
    id: 2,
    judul: "Insektisida Regent 50 SC Red",
    kategori: "Obat Racun & Hama",
    deskripsi:
      "Insektisida sistemik racun kontak dan lambung untuk membasmi hama wereng coklat, sundep/beluk pada padi, serta thrips pada tanaman cabai.",
    harga: 85000,
    satuan: "100 ml",
    tersedia: true,
    bahanAktif: "Fipronil 50 g/l",
    aturanDosis:
      "1.5 - 2 ml per liter air. Semprotkan saat intensitas serangan hama mencapai ambang kendali.",
    peringatanBahaya:
      "PERINGATAN BAHAN RACUN: Gunakan masker dan sarung tangan saat menyemprot. Jangan mencemari sumber mata air.",
    nomorRegistrasi: "RI. 01010119951234",
    asalDaerah: "Jakarta, Distributor Resmi",
  },
  {
    id: 3,
    judul: "Pupuk Organik Cair (POC) Bio-Hayati Urin Kelinci",
    kategori: "Pupuk Tani",
    deskripsi:
      "Pupuk hayati organik hasil fermentasi urin kelinci dan bakteri pengurai EM4. Kaya hormon auksin dan giberelin untuk kesuburan daun dan akar.",
    harga: 32000,
    satuan: "1 Liter",
    tersedia: true,
    bahanAktif: "Mikroba Pelarut Fosfat & Nitrogen Hayati",
    aturanDosis:
      "Encerkan 10 ml POC ke dalam 1 liter air bersih, semprotkan pada daun pagi hari.",
    peringatanBahaya:
      "Bahan 100% alami dan ramah lingkungan tanpa efek samping residu kimia.",
    nomorRegistrasi: "KEMTAN RI No. 03.02.2023.089",
    asalDaerah: "Batu, Malang",
  },
  {
    id: 4,
    judul: "Fungisida Antracol 70 WP Anti Jamur",
    kategori: "Obat Racun & Hama",
    deskripsi:
      "Fungisida kontak berspektrum luas yang bekerja protektif untuk mengendalikan busuk daun phytophthora, bercak daun, dan patek (antraknosa) pada cabai.",
    harga: 68000,
    satuan: "250 gram",
    tersedia: true,
    bahanAktif: "Propineb 70%",
    aturanDosis:
      "1.5 - 2 gram per liter air pada tanaman musim penghujan.",
    peringatanBahaya:
      "Kenakan kacamata pelindung dan jangan merokok/makan selama aplikasi.",
    nomorRegistrasi: "RI. 0102011974112",
    asalDaerah: "Bandung, Jawa Barat",
  },
  {
    id: 5,
    judul: "Herbisida Sistemik Pembasmi Gulma Roundup 486 SL",
    kategori: "Obat Racun & Hama",
    deskripsi:
      "Herbisida purna tumbuh untuk membasmi alang-alang dan rumput liar hingga ke perakaran tanpa perlu membakar lahan.",
    harga: 98000,
    satuan: "1 Liter",
    tersedia: true,
    bahanAktif: "Isopropilamina Glifosat 486 g/l",
    aturanDosis:
      "3 - 5 tutup botol per tangki 16 liter air pada gulma yang sedang tumbuh aktif.",
    peringatanBahaya:
      "HINDARI KONTAK DENGAN TANAMAN UTAMA. Berbahaya bagi ekosistem perairan.",
    nomorRegistrasi: "RI. 0103012000156",
    asalDaerah: "Semarang, Jawa Tengah",
  },
  {
    id: 6,
    judul: "Sprayer Elektrik Pertanian Swan 16 Liter",
    kategori: "Alat Pertanian",
    deskripsi:
      "Tangki semprot punggung otomatis bertenaga baterai lithium rechargeable untuk efisiensi penyemprotan pupuk cair dan pestisida di lahan sawah.",
    harga: 475000,
    satuan: "Unit",
    tersedia: false,
    bahanAktif: "Baterai 12V 8Ah + Pompa Diafragma Tekanan Tinggi",
    aturanDosis:
      "Isi daya penuh 4-6 jam sebelum penyemprotan. Bilas tangki setelah selesai aplikasi pestisida.",
    peringatanBahaya:
      "Gunakan APD lengkap: masker respirator, sarung tangan karet, dan sepatu bot.",
    nomorRegistrasi: "SNI Pertanian No. 04.11.2020",
    asalDaerah: "Surabaya, Jawa Timur",
  },
];

export function cariItem(id: number): Produk | undefined {
  return daftarItem.find((item) => item.id === id);
}

export function judulSudahAda(judul: string): boolean {
  const dicari = judul.trim().toLowerCase();
  return daftarItem.some((i) => i.judul.trim().toLowerCase() === dicari);
}

export function tambahItem(masukan: MasukanItem): Produk {
  const id = Math.max(0, ...daftarItem.map((i) => i.id)) + 1;
  const item: Produk = {
    id,
    judul: masukan.judul,
    kategori: masukan.kategori,
    deskripsi: masukan.deskripsi,
    harga: ("harga" in masukan && typeof masukan.harga === "number") ? masukan.harga : 50000,
    satuan: ("satuan" in masukan && typeof masukan.satuan === "string") ? masukan.satuan : "unit",
    tersedia: Boolean(masukan.tersedia),
    nomorRegistrasi: "KEMTAN RI No. " + new Date().getFullYear() + "." + id.toString().padStart(4, "0"),
    asalDaerah: "Sentra Pertanian AgroMarket",
  };
  daftarItem.push(item);
  return item;
}

// Alias fungsi
export const cariProduk = cariItem;
export const daftarProduk = daftarItem;
