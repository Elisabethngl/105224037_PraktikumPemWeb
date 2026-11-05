import { notFound } from "next/navigation";
import Link from "next/link";
import { ambilItem } from "@/lib/data";
import { hapusItem } from "@/app/katalog/actions";
import { hapusUlasan } from "@/app/katalog/ulasan-actions";
import FormUlasan from "@/components/FormUlasan";

export default async function DetailItem({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const item = await ambilItem(id);
  if (!item) notFound();

  return (
    <main id="konten" className="mx-auto max-w-3xl p-4 space-y-6">
      <div className="border-b pb-4 flex justify-between items-start gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            {item.kategori}
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">{item.judul}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Status: {item.tersedia ? "Tersedia di Etalase" : "Stok Habis"}
          </p>
        </div>
        <form action={hapusItem.bind(null, item.id)}>
          <button
            type="submit"
            className="rounded bg-red-700 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-red-800 shadow-sm transition"
          >
            Hapus Item
          </button>
        </form>
      </div>

      <div className="rounded-lg border p-4 bg-gray-50 text-gray-700 leading-relaxed">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
          Deskripsi & SOP Aplikasi Produk
        </h2>
        <p>{item.deskripsi}</p>
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-bold text-gray-900">
          Ulasan Petani & Mitra Tani ({item.ulasan?.length ?? 0})
        </h2>

        {item.ulasan && item.ulasan.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {item.ulasan.map((u) => (
              <li
                key={u.id}
                className="rounded-lg border bg-white p-4 shadow-sm flex justify-between items-start gap-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {u.nama} ·{" "}
                    <span className="text-amber-600 font-bold">
                      {u.nilai}/5 ⭐
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {u.komentar}
                  </p>
                </div>
                <form action={hapusUlasan.bind(null, u.id, item.id)}>
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:text-red-800 underline font-medium"
                  >
                    Hapus ulasan
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500 italic">
            Belum ada ulasan untuk produk ini.
          </p>
        )}

        <FormUlasan itemId={item.id} />
      </div>

      <div className="pt-4 border-t">
        <Link
          href="/katalog"
          className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-sm"
        >
          ← Kembali ke Katalog AgroMarket
        </Link>
      </div>
    </main>
  );
}
