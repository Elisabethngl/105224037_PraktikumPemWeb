"use client";

import { useActionState } from "react";
import { tambahUlasan } from "@/app/katalog/ulasan-actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const kolom = "mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600";

export default function FormUlasan({ itemId }: { itemId: number }) {
  const [status, aksi, pending] = useActionState(
    tambahUlasan.bind(null, itemId),
    awal
  );
  const g = status.galat;

  return (
    <form action={aksi} className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-5 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900">Beri Ulasan Produk</h3>
      <p className="text-xs text-gray-500">
        Bagikan pengalaman Anda mengenai kualitas dosis, keamanan, dan efektivitas sarana tani ini di lahan.
      </p>

      <div>
        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
          Nama Petani / Pengulas
        </label>
        <input
          id="nama"
          name="nama"
          required
          minLength={2}
          maxLength={60}
          placeholder="Contoh: Pak Joko (Kelompok Tani Subur)"
          className={kolom}
          aria-invalid={!!g?.nama}
          aria-describedby="galat-ulasan-nama"
        />
        <p id="galat-ulasan-nama" className="mt-1 text-xs text-red-600 font-medium">
          {g?.nama?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="nilai" className="block text-sm font-medium text-gray-700">
          Nilai Kepuasan (Rating)
        </label>
        <select
          id="nilai"
          name="nilai"
          required
          defaultValue="5"
          className={kolom}
          aria-invalid={!!g?.nilai}
          aria-describedby="galat-ulasan-nilai"
        >
          <option value="5">⭐⭐⭐⭐⭐ 5 - Sangat Efektif</option>
          <option value="4">⭐⭐⭐⭐ 4 - Efektif & Memuaskan</option>
          <option value="3">⭐⭐⭐ 3 - Cukup Baik</option>
          <option value="2">⭐⭐ 2 - Kurang Efektif</option>
          <option value="1">⭐ 1 - Tidak Efektif / Masalah</option>
        </select>
        <p id="galat-ulasan-nilai" className="mt-1 text-xs text-red-600 font-medium">
          {g?.nilai?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="komentar" className="block text-sm font-medium text-gray-700">
          Komentar Ulasan Lapangan
        </label>
        <textarea
          id="komentar"
          name="komentar"
          required
          minLength={5}
          maxLength={500}
          rows={3}
          placeholder="Tuliskan hasil aplikasi di sawah, dosis semprot yang digunakan, dan kondisi tanaman..."
          className={kolom}
          aria-invalid={!!g?.komentar}
          aria-describedby="galat-ulasan-komentar"
        />
        <p id="galat-ulasan-komentar" className="mt-1 text-xs text-red-600 font-medium">
          {g?.komentar?.[0]}
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-800 disabled:opacity-60 transition"
      >
        {pending ? "Mengirim Ulasan..." : "Kirim Ulasan"}
      </button>

      {status.pesan && (
        <p role="status" aria-live="polite" className="text-sm font-medium text-amber-700">
          {status.pesan}
        </p>
      )}
    </form>
  );
}
