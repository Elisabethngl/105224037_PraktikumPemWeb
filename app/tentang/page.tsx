import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang | AgroMarket - Sarana Pertanian & Obat Racun Hama",
};

export default function HalamanTentang() {
  return (
    <main id="konten" className="mx-auto max-w-3xl p-4 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900">Tentang AgroMarket</h1>
      
      <p className="text-lg text-gray-700 leading-relaxed">
        <strong>AgroMarket</strong> adalah platform marketplace sarana produksi pertanian modern yang menghubungkan petani secara langsung dengan distributor resmi pupuk, benih unggul, dan obat racun hama (pestisida/fungisida/herbisida) berizin edar resmi Kementerian Pertanian RI.
      </p>

      <div className="grid gap-4 mt-6">
        <div className="p-4 rounded-lg border bg-emerald-50/40 border-emerald-200">
          <h2 className="font-bold text-emerald-900">1. Pemberantasan Pupuk & Pestisida Oplosan</h2>
          <p className="text-sm text-gray-700 mt-1">
            Menjamin keamanan budidaya petani dengan memverifikasi legalitas nomor pendaftaran Kementan RI pada setiap produk yang diperjualbelikan.
          </p>
        </div>

        <div className="p-4 rounded-lg border bg-blue-50/40 border-blue-200">
          <h2 className="font-bold text-blue-900">2. Edukasi Takaran Dosis & SOP Keamanan APD</h2>
          <p className="text-sm text-gray-700 mt-1">
            Menyediakan panduan takaran semprot terstandar dan peringatan bahaya bahan kimia beracun untuk melindungi kesehatan petani dan ekosistem perairan.
          </p>
        </div>

        <div className="p-4 rounded-lg border bg-amber-50/40 border-amber-200">
          <h2 className="font-bold text-amber-900">3. Transparansi Harga Komoditas & Pupuk</h2>
          <p className="text-sm text-gray-700 mt-1">
            Menyajikan informasi harga pupuk dan sarana produksi yang wajar tanpa markup perantara, mewujudkan kedaulatan pangan nasional yang berkelanjutan.
          </p>
        </div>
      </div>
    </main>
  );
}
