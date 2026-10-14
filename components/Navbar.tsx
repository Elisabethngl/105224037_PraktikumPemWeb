'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, ShoppingBasket, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-emerald-950 text-white shadow-lg border-b border-emerald-800">
      <div className="bg-emerald-900/80 text-emerald-200 text-xs py-1.5 px-4 text-center border-b border-emerald-800 flex justify-between items-center">
        <div className="hidden md:flex items-center space-x-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Produk Asli & Terdaftar Kementan RI
          </span>
        </div>
        <div className="mx-auto md:mx-0">
          <span>🌱 Layanan Konsultasi Obat Pertanian & Pemesanan Pupuk Terpercaya</span>
        </div>
        <div className="hidden md:block text-xs text-amber-300 font-semibold">
          Kirim ke Seluruh Indonesia
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg border border-emerald-300/30">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-amber-200 bg-clip-text text-transparent">
                AgroMarket
              </span>
              <span className="block text-[10px] tracking-widest text-emerald-300 font-semibold uppercase -mt-1">
                Pupuk & Pestisida Resmi
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4" aria-label="Navigasi Utama">
            <Link
              href="/"
              className="text-xs font-semibold px-3 py-2 rounded-lg text-emerald-200 hover:text-white transition hover:bg-emerald-900"
            >
              Beranda & Katalog
            </Link>

            <Link
              href="/order"
              className="text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 bg-amber-500 text-gray-900 font-bold hover:bg-amber-400"
            >
              <ShoppingBasket className="w-4 h-4 text-gray-950" />
              <span>Formulir Pesanan</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};