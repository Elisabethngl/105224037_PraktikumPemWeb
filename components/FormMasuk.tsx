"use client";

import { useActionState } from "react";
import { masuk } from "@/app/masuk/actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const kolom = "mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600";

export default function FormMasuk() {
  const [status, aksi, pending] = useActionState(masuk, awal);
  const g = status.galat;

  return (
    <form action={aksi} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="block font-medium text-gray-800">
          Email Petugas AgroMarket
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="pengelola@agromarket.com"
          className={kolom}
          aria-invalid={!!g?.email}
          aria-describedby="galat-email"
        />
        <p id="galat-email" className="mt-1 text-sm text-red-600 font-medium">
          {g?.email?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="kataSandi" className="block font-medium text-gray-800">
          Kata Sandi
        </label>
        <input
          id="kataSandi"
          name="kataSandi"
          type="password"
          autoComplete="current-password"
          placeholder="Minimal 8 karakter"
          className={kolom}
          aria-invalid={!!g?.kataSandi}
          aria-describedby="galat-sandi"
        />
        <p id="galat-sandi" className="mt-1 text-sm text-red-600 font-medium">
          {g?.kataSandi?.[0]}
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-green-700 px-4 py-2.5 font-medium text-white hover:bg-green-800 disabled:opacity-60 transition shadow-sm"
      >
        {pending ? "Memverifikasi..." : "Masuk"}
      </button>

      <p role="status" aria-live="polite" className="text-sm font-semibold text-center text-red-600">
        {status.pesan}
      </p>
    </form>
  );
}
