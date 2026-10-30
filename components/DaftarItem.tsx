"use client";

import { useState } from "react";
import KartuItem from "@/components/KartuItem";
import type { Produk, KategoriProduk } from "@/lib/tipe";

type Filter = KategoriProduk | "semua";
const pilihanFilter: Filter[] = [
  "semua",
  "Pupuk Tani",
  "Obat Racun & Hama",
  "Benih Unggul",
  "Alat Pertanian",
];

export default function DaftarItem({ items }: { items: Produk[] }) {
  const [kataKunci, setKataKunci] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");

  const hasil = items.filter((item) => {
    const cocokKata =
      item.judul.toLowerCase().includes(kataKunci.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(kataKunci.toLowerCase()) ||
      (item.bahanAktif &&
        item.bahanAktif.toLowerCase().includes(kataKunci.toLowerCase()));
    const cocokKategori = filter === "semua" || item.kategori === filter;
    return cocokKata && cocokKategori;
  });

  return (
    <div>
      <label htmlFor="cari" className="font-medium text-gray-800">
        Cari pupuk, obat hama, atau benih
      </label>
      <input
        id="cari"
        type="search"
        placeholder="Contoh: NPK, Regent, Antracol..."
        value={kataKunci}
        onChange={(e) => setKataKunci(e.target.value)}
        className="mt-1 block w-full rounded border px-3 py-2 sm:w-80 shadow-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
      />

      <div
        role="group"
        aria-label="Filter kategori sarana pertanian"
        className="mt-4 flex flex-wrap gap-2"
      >
        {pilihanFilter.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={filter === k}
            onClick={() => setFilter(k)}
            className={
              filter === k
                ? "rounded bg-emerald-700 px-3 py-1 text-white font-medium shadow-xs"
                : "rounded border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50"
            }
          >
            {k}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-gray-600">
        {hasil.length} produk sarana pertanian ditemukan
      </p>

      {hasil.length === 0 ? (
        <p className="mt-4 text-gray-500">
          Tidak ada produk yang sesuai dengan pencarian.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((item) => (
            <li key={item.id}>
              <KartuItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
