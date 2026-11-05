import { Kategori } from "../generated/prisma/enums";

export type DataAwal = {
  judul: string;
  kategori: Kategori;
  deskripsi: string;
  tersedia: boolean;
  gambar?: string;
};

export const dataAwal: DataAwal[] = [
  {
    judul: "Pupuk NPK Mutiara 16-16-16 Biru",
    kategori: Kategori.Pupuk_Tani,
    deskripsi:
      "Pupuk majemuk NPK lengkap dengan komposisi seimbang Nitrogen, Fosfat, dan Kalium untuk memacu pertumbuhan vegetatif dan pembungaan tanaman hortikultura.",
    tersedia: true,
  },
  {
    judul: "Insektisida Regent 50 SC Red",
    kategori: Kategori.Obat_Racun_Hama,
    deskripsi:
      "Insektisida sistemik racun kontak dan lambung untuk membasmi hama wereng coklat, sundep/beluk pada padi, serta thrips pada tanaman cabai.",
    tersedia: true,
  },
  {
    judul: "Pupuk Organik Cair (POC) Bio-Hayati Urin Kelinci",
    kategori: Kategori.Pupuk_Tani,
    deskripsi:
      "Pupuk hayati organik hasil fermentasi urin kelinci dan bakteri pengurai EM4. Kaya hormon auksin dan giberelin untuk kesuburan daun dan akar.",
    tersedia: true,
  },
  {
    judul: "Fungisida Antracol 70 WP Anti Jamur",
    kategori: Kategori.Obat_Racun_Hama,
    deskripsi:
      "Fungisida kontak berspektrum luas yang bekerja protektif untuk mengendalikan busuk daun phytophthora, bercak daun, dan patek (antraknosa) pada cabai.",
    tersedia: true,
  },
  {
    judul: "Herbisida Sistemik Pembasmi Gulma Roundup 486 SL",
    kategori: Kategori.Obat_Racun_Hama,
    deskripsi:
      "Herbisida purna tumbuh untuk membasmi alang-alang dan rumput liar hingga ke perakaran tanpa perlu membakar lahan.",
    tersedia: true,
  },
  {
    judul: "Sprayer Elektrik Pertanian Swan 16 Liter",
    kategori: Kategori.Alat_Pertanian,
    deskripsi:
      "Tangki semprot punggung otomatis bertenaga baterai lithium rechargeable untuk efisiensi penyemprotan pupuk cair dan pestisida di lahan sawah.",
    tersedia: false,
  },
];
