'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_PRODUCTS, MOCK_MARKET_PRICES } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { TrendingUp, RefreshCw, AlertTriangle, ShieldCheck, Filter, Search } from 'lucide-react';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Semua Produk' },
    { id: 'Pupuk Tani', label: '🌿 Pupuk Tani' },
    { id: 'Obat Racun & Hama', label: '🧪 Obat Racun & Hama' },
    { id: 'Benih Unggul', label: '🌱 Benih Unggul' },
    { id: 'Alat Pertanian', label: '🚜 Alat Pertanian' },
  ];

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (selectedSort === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (selectedSort === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <main className="space-y-12">
      {/* HERO BANNER */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-agro-dark text-white py-14 lg:py-20 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600 text-emerald-200 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pusat Pupuk & Obat Racun Hama Resmi Terpercaya</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Tingkatkan Hasil Panen dengan <br />
                <span className="bg-gradient-to-r from-emerald-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                  Pupuk Asli & Obat Tani Terdaftar
                </span>
              </h1>

              <p className="text-emerald-100 text-sm sm:text-base max-w-2xl leading-relaxed">
                Jaminan keaslian sarana produksi pertanian 100%. Dapatkan pupuk NPK, pupuk organik, fungisida, dan herbisida langsung dari distributor terverifikasi dengan panduan dosis tepat.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById('katalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Belanja Sarana Pertanian
                </Button>
                <Link href="/order">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-white border-emerald-500 hover:bg-emerald-900 w-full sm:w-auto"
                  >
                    Formulir Pemesanan Cepat
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-emerald-900/60 p-6 rounded-3xl border border-emerald-700 backdrop-blur-sm shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>SOP Keselamatan Obat Racun Pertanian</span>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Kami mengawasi ketat peredaran obat racun pertanian. Seluruh pestisida dan herbisida yang tersedia memiliki nomor pendaftaran resmi Kementan RI dan wajib diaplikasikan dengan standar perlindungan diri.
                </p>
                <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800 text-[11px] text-emerald-200">
                  ✅ <strong>Bebas Produk Palsu:</strong> Uji keaslian kemasan & segel distributor resmi.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WIDGET HARGA PASAR */}
      <section id="price-tracker" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" /> Informasi Komoditas Harian
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mt-1">Cek Harga Pupuk & Hasil Panen</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Pembaruan: Hari ini 08:00 WIB</span>
              <button
                className="p-1.5 bg-gray-100 hover:bg-emerald-100 rounded-lg text-emerald-800 transition"
                title="Perbarui Harga"
                aria-label="Refresh Harga Pasar"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MOCK_MARKET_PRICES.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-xs text-gray-500 block truncate font-medium">{item.name}</span>
                <span className="text-sm font-extrabold text-emerald-950 block mt-1">{item.price}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
                  item.status === 'up' ? 'text-red-700 bg-red-100' : item.status === 'down' ? 'text-emerald-700 bg-emerald-100' : 'text-gray-600 bg-gray-200'
                }`}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KATALOG UTAMA */}
      <section id="katalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Kolom Pencarian */}
        <div className="max-w-md">
          <div className="relative flex items-center bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pupuk, racun hama, benih..."
              className="w-full text-xs px-3.5 py-2.5 focus:outline-none"
            />
            <div className="px-3 text-gray-400">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Katalog Sarana Pertanian</h2>
            <p className="text-xs text-gray-500 mt-0.5">Pilih pupuk, pestisida, benih, atau alat pertanian yang Anda butuhkan.</p>
          </div>

          {/* Filter Kategori Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition border ${
                  activeCategory === c.id
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Urutan */}
        <div className="flex justify-between items-center text-xs text-gray-600 bg-white p-3.5 rounded-xl border border-gray-200">
          <span>Menampilkan <strong>{filteredProducts.length}</strong> produk pertanian</span>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="default">Urutkan: Rekomendasi</option>
              <option value="price-low">Harga: Terendah</option>
              <option value="price-high">Harga: Tertinggi</option>
              <option value="rating">Rating Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Grid Produk */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-sm font-medium">Tidak ada produk yang cocok dengan pencarian Anda.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedSort('default');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-emerald-700 font-bold underline"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}