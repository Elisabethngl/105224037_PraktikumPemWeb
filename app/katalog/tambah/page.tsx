import { redirect } from "next/navigation";
import type { Metadata } from "next";
import FormItem from "@/components/FormItem";
import { bacaSesi } from "@/lib/sesi";
import { keluar } from "@/app/masuk/actions";

export const metadata: Metadata = {
  title: "Tambah Item Sarana Pertanian | AgroMarket",
  description: "Formulir pendaftaran produk pupuk, obat hama, dan sarana pertanian baru terdaftar Kementan RI",
};

export default async function HalamanTambahItem() {
  const sesi = await bacaSesi();
  if (!sesi) redirect("/masuk");

  return (
    <main id="konten" className="mx-auto max-w-2xl p-6 bg-white rounded-lg shadow-sm border border-gray-100 my-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Item Katalog</h1>
          <p className="mt-1 text-sm text-gray-600">
            Masuk sebagai: <span className="font-semibold text-green-700">{sesi.email}</span>
          </p>
        </div>
        <form action={keluar}>
          <button
            type="submit"
            className="rounded border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            Keluar
          </button>
        </form>
      </div>
      <FormItem />
    </main>
  );
}
