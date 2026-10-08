export default function LatihanAudit() {
  return (
    <div className="p-8">
      <div className="text-2xl font-bold">Katalog Alat Laboratorium</div>
      <img src="/next.svg" width={120} height={24} />
      <p className="text-gray-300">Stok diperbarui setiap hari.</p>
      <input type="search" className="border p-2" />
      <button className="ml-2 border p-2">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="7" cy="7" r="5" stroke="currentColor" fill="none" />
        </svg>
      </button>
    </div>
  );
}