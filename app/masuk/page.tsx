import type { Metadata } from "next";
import FormMasuk from "@/components/FormMasuk";

export const metadata: Metadata = {
  title: "Masuk Akun Pengelola | AgroMarket",
  description: "Autentikasi pengelola sarana pertanian terpadu AgroMarket",
};

export default function HalamanMasuk() {
  return (
    <main id="konten" className="mx-auto max-w-md p-6 bg-white rounded-lg shadow-sm border border-gray-100 my-8">
      <div className="mb-4 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Masuk Akun Pengelola</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gunakan kredensial akun terverifikasi untuk mengelola katalog produk AgroMarket.
        </p>
      </div>
      <FormMasuk />
    </main>
  );
}
