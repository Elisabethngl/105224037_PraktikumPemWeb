"use client";

import { useActionState } from "react";
import { simpanItem } from "@/app/katalog/actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const kolom = "mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600";

export default function FormItem() {
  const [status, aksi, pending] = useActionState(simpanItem, awal);
  const g = status.galat;
  const n = status.nilai;

  return (
    <form action={aksi} className="mt-6 space-y-4">
      <div>
        <label htmlFor="judul" className="font-medium text-gray-800">
          Nama Sarana Pertanian / Produk
        </label>
        <input
          id="judul"
          name="judul"
          required
          minLength={3}
          maxLength={80}
          defaultValue={n?.judul}
          className={kolom}
          aria-invalid={!!g?.judul}
          aria-describedby="galat-judul"
        />
        <p id="galat-judul" className="mt-1 text-sm text-red-600 font-medium">
          {g?.judul?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="kategori" className="font-medium text-gray-800">
          Kategori
        </label>
        <select
          id="kategori"
          name="kategori"
          required
          key={n?.kategori ?? "awal"}
          defaultValue={n?.kategori ?? ""}
          className={kolom}
          aria-invalid={!!g?.kategori}
          aria-describedby="galat-kategori"
        >
          <option value="" disabled>
            Pilih kategori
          </option>
          <option value="Pupuk Tani">Pupuk Tani</option>
          <option value="Obat Racun & Hama">Obat Racun & Hama</option>
          <option value="Benih Unggul">Benih Unggul</option>
          <option value="Alat Pertanian">Alat Pertanian</option>
        </select>
        <p id="galat-kategori" className="mt-1 text-sm text-red-600 font-medium">
          {g?.kategori?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="deskripsi" className="font-medium text-gray-800">
          Deskripsi Produk & SOP Dosis
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          required
          minLength={10}
          maxLength={300}
          rows={4}
          defaultValue={n?.deskripsi}
          className={kolom}
          aria-invalid={!!g?.deskripsi}
          aria-describedby="galat-deskripsi"
        />
        <p id="galat-deskripsi" className="mt-1 text-sm text-red-600 font-medium">
          {g?.deskripsi?.[0]}
        </p>
      </div>

      <label className="flex items-center gap-2 cursor-pointer text-gray-800 font-medium">
        <input
          type="checkbox"
          name="tersedia"
          defaultChecked
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        Tersedia di Etalase AgroMarket
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-green-700 px-5 py-2.5 font-medium text-white hover:bg-green-800 disabled:opacity-60 transition shadow-sm"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>

      <p role="status" aria-live="polite" className="text-sm font-semibold text-amber-700">
        {status.pesan}
      </p>
    </form>
  );
}
