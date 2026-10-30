"use client"; // error boundary wajib Client Component

export default function GalatKatalog({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div role="alert" className="space-y-2 p-4">
      <p className="font-semibold">Data katalog gagal dimuat.</p>
      <p className="text-sm">Pesan: {error.message}</p>
      {error.digest && <p className="text-sm">Kode: {error.digest}</p>}
      <button
        type="button"
        onClick={() => retry()}
        className="rounded border px-3 py-1"
      >
        Coba lagi
      </button>
    </div>
  );
}
