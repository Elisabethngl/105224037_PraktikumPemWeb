'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '../types/product';
import { Badge } from './Badge';
import { Star, ShieldCheck, ShoppingCart, Info } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
            {product.isRegistered && (
              <Badge variant="green" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Kementan RI
              </Badge>
            )}
            {product.isOrganic && (
              <Badge variant="amber" size="sm">
                🌱 100% Organik
              </Badge>
            )}
          </div>
          
          <Link
            href={`/detail?id=${product.id}`}
            className="absolute bottom-2.5 right-2.5 bg-white/90 hover:bg-white text-gray-800 text-xs px-2.5 py-1.5 rounded-lg shadow font-medium backdrop-blur-sm transition flex items-center gap-1"
            aria-label={`Lihat detail produk ${product.name}`}
          >
            <Info className="w-3.5 h-3.5 text-emerald-700" /> Detail
          </Link>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block mb-1">
            {product.category}
          </span>
          
          <Link
            href={`/detail?id=${product.id}`}
            className="font-bold text-gray-900 text-sm hover:text-emerald-700 transition cursor-pointer line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          <div className="mt-2 text-[11px] text-gray-600 bg-emerald-50/70 p-2 rounded-xl border border-emerald-100 flex flex-col gap-0.5">
            <span className="font-semibold text-emerald-900 truncate">
              🧪 Bahan Aktif: {product.activeIngredient}
            </span>
            <span className="text-gray-500 text-[10px]">
              📍 Asal: {product.origin}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span className="text-amber-500 font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              {product.rating}
            </span>
            <span>Terjual {product.sold}+ {product.unit}</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 block">Harga per {product.unit}</span>
          <span className="text-base font-extrabold text-emerald-950">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
        </div>
        
        <Link
          href={`/order?id=${product.id}`}
          className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition shadow-md hover:scale-105 active:scale-95 flex items-center justify-center"
          title="Beli Produk Sekarang"
          aria-label={`Pesan ${product.name}`}
        >
          <ShoppingCart className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
};