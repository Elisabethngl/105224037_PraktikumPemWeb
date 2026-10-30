import Link from "next/link";

export default function ItemTidakDitemukan() {
  return (
    <main id="konten">
      <h1 className="text-2xl font-bold">Item tidak ditemukan</h1>
      <p className="mt-2">Periksa alamat atau pilih item dari katalog.</p>
      <Link href="/katalog" className="mt-4 inline-block underline">
        Kembali ke katalog
      </Link>
    </main>
  );
}
