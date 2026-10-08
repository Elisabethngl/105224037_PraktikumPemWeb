export default function LatihanAudit() {
  return (
    <main className="p-8">
      <div className="text-2xl font-bold">Katalog Alat Laboratorium</div>
      <img src="/next.svg" width={120} height={24} alt="Next.js Logo" />
      <p className="text-gray-600">Stok diperbarui setiap hari.</p>
      <label htmlFor="search" className="sr-only">Cari</label>
      <input type="search" id="search" className="border p-2" />
      <button className="ml-2 border p-2" aria-label="Cari">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="7" cy="7" r="5" stroke="currentColor" fill="none" />
        </svg>
      </button>
    </main>
  );
}