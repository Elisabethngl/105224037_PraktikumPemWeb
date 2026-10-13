import React from 'react';
import { Sprout, ShieldAlert, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-14 pb-8 border-t border-emerald-900 mt-20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-900">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">AgroMarket</span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Platform e-marketplace penyedia sarana produksi pertanian terlengkap dan terverifikasi di Indonesia. Menjual pupuk resmi, pestisida terdaftar Kementan, dan benih bersertifikat.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Pedoman Pestisida
            </h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Seluruh produk obat racun dan pestisida wajib digunakan sesuai takaran anjuran label dan peraturan Kementan RI. Wajib gunakan APD (masker dan sarung tangan).
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
              Kategori Produk
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>Pupuk NPK & Organik</li>
              <li>Insektisida & Pembasmi Wereng</li>
              <li>Fungisida & Anti Patek</li>
              <li>Herbisida Pembasmi Gulma</li>
              <li>Sprayer & Alat Tani Modern</li>
            </ul>
          </div>

          <div className="space-y-2.5 text-xs text-emerald-200/80">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
              Hubungi Kami
            </h4>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sentra Agribisnis Indonesia, Jakarta</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>+62 812-3456-7890 (Layanan WhatsApp)</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>bantuan@agromarket.id</span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/70 gap-3">
          <p>© 2026 AgroMarket Indonesia. Seluruh Hak Cipta Dilindungi.</p>
          <p>Tugas Pengembangan Aplikasi Web - Next.js, React, TypeScript & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};