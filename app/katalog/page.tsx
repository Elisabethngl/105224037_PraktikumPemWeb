import type { Metadata } from "next";
import Link from "next/link";
import Bagian from "@/components/Bagian";
import DaftarItem from "@/components/DaftarItem";
import { daftarItem } from "@/lib/data";

export const metadata: Metadata = {
  title: "Katalog Sarana Pertanian | AgroMarket",
  description: "Daftar lengkap pupuk subsidi & non-subsidi, obat pengendali hama, benih tanaman, dan alat pertanian.",
};

export default function HalamanKatalog() {
  return (
    <main id="konten" className="mx-auto max-w-6xl p-4 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Katalog Sarana Pertanian</h1>
          <p className="mt-1 text-sm text-gray-600">
            Jelajahi pupuk organik/anorganik, pestisida terdaftar Kementan RI, dan perlengkapan semprot modern.
          </p>
        </div>
        <Link
          href="/katalog/tambah"
          className="inline-flex items-center gap-2 rounded bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition shadow-sm"
        >
          + Tambah Item
        </Link>
      </div>

      <Bagian id="daftar" judul="Daftar Sarana Pertanian Unggulan">
        <DaftarItem items={daftarItem} />
      </Bagian>
    </main>
  );
}