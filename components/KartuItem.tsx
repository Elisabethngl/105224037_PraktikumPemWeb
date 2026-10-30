import Link from "next/link";
import type { Produk, KategoriProduk } from "@/lib/tipe";

const badgeWarna: Record<KategoriProduk, string> = {
  "Pupuk Tani": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Obat Racun & Hama": "bg-red-100 text-red-800 border-red-300",
  "Benih Unggul": "bg-amber-100 text-amber-800 border-amber-300",
  "Alat Pertanian": "bg-blue-100 text-blue-800 border-blue-300",
};

export default function KartuItem({ item }: { item: Produk }) {
  const badgeClass =
    badgeWarna[item.kategori] ?? "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <article className="h-full rounded-lg border p-6 shadow-xs flex flex-col justify-between bg-white">
      <div>
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}
        >
          {item.kategori}
        </span>
        <h3 className="mt-2 text-lg font-bold text-gray-900">
          <Link href={`/katalog/${item.id}`} className="hover:underline hover:text-emerald-700">
            {item.judul}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.deskripsi}</p>
      </div>

      <div className="mt-4 pt-3 border-t flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-500">Harga Satuan:</span>
          <p className="text-base font-bold text-emerald-700">
            Rp {item.harga.toLocaleString("id-ID")} <span className="text-xs font-normal text-gray-500">/{item.satuan}</span>
          </p>
        </div>
        <div>
          {item.tersedia ? (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              Stok Tersedia
            </span>
          ) : (
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
              Habis
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
