import Link from "next/link";
import { notFound } from "next/navigation";
import { cariItem, daftarItem } from "@/lib/data";

export function generateStaticParams() {
  return daftarItem.map((item) => ({ id: String(item.id) }));
}

export default async function HalamanDetailItem({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();

  const item = cariItem(Number(id));
  if (!item) notFound();

  return (
    <main id="konten" className="space-y-6">
      <div className="border-b pb-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          {item.kategori}
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-gray-900">{item.judul}</h1>
        <p className="mt-2 text-2xl font-bold text-emerald-700">
          Rp {item.harga.toLocaleString("id-ID")}{" "}
          <span className="text-sm font-normal text-gray-500">/{item.satuan}</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <section>
            <h2 className="text-base font-semibold text-gray-800">Deskripsi Produk</h2>
            <p className="mt-1 text-gray-700 leading-relaxed">{item.deskripsi}</p>
          </section>

          {item.bahanAktif && (
            <section>
              <h2 className="text-base font-semibold text-gray-800">Komposisi & Bahan Aktif</h2>
              <p className="mt-1 font-mono text-sm text-gray-700 bg-gray-50 p-2.5 rounded border">
                {item.bahanAktif}
              </p>
            </section>
          )}

          {item.aturanDosis && (
            <section>
              <h2 className="text-base font-semibold text-gray-800">Panduan Dosis & Takaran Aplikasi</h2>
              <p className="mt-1 text-sm text-gray-700 bg-emerald-50/50 p-3 rounded border border-emerald-200">
                {item.aturanDosis}
              </p>
            </section>
          )}
        </div>

        <div className="space-y-4">
          {item.peringatanBahaya && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-900">
              <h2 className="font-bold flex items-center gap-2">⚠️ Peringatan Keamanan & SOP</h2>
              <p className="mt-1 text-xs leading-relaxed">{item.peringatanBahaya}</p>
            </div>
          )}

          <div className="rounded-lg border p-4 bg-gray-50 space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Nomor Registrasi:</span>{" "}
              <strong className="text-gray-800">{item.nomorRegistrasi ?? "Terdaftar Resmi Kementan"}</strong>
            </div>
            <div>
              <span className="text-gray-500">Asal Distributor:</span>{" "}
              <span className="text-gray-800">{item.asalDaerah ?? "Distributor Resmi"}</span>
            </div>
            <div>
              <span className="text-gray-500">Status Stok:</span>{" "}
              {item.tersedia ? (
                <strong className="text-emerald-700">Tersedia untuk Pengiriman</strong>
              ) : (
                <strong className="text-red-700">Sementara Tidak Tersedia</strong>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-semibold underline"
        >
          ← Kembali ke Katalog AgroMarket
        </Link>
      </div>
    </main>
  );
}
