// Server Component: tanpa "use client", tanpa useState dan useEffect
import Link from "next/link";
import { daftarItem } from "@/lib/data";

export default function ItemTerbaru() {
  const terbaru = daftarItem.slice(0, 3);
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {terbaru.map((item) => (
        <li
          key={item.id}
          className="rounded-xl border border-gray-200 p-5 bg-white shadow-xs hover:border-emerald-600 transition"
        >
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            {item.kategori}
          </span>
          <h3 className="mt-2 text-base font-bold text-gray-900">
            <Link
              href={`/katalog/${item.id}`}
              className="hover:underline hover:text-emerald-700"
            >
              {item.judul}
            </Link>
          </h3>
          <p className="mt-2 text-xs text-gray-600 line-clamp-2">
            {item.deskripsi}
          </p>
          <p className="mt-4 text-sm font-bold text-emerald-700">
            Rp {item.harga.toLocaleString("id-ID")}
            <span className="text-xs font-normal text-gray-500">
              /{item.satuan}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}
