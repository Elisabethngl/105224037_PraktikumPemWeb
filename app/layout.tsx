import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AgroMarket - Solusi Pupuk, Pestisida & Peralatan Pertanian',
  description: 'Marketplace penyedia pupuk pertanian, obat racun hama terdaftar, benih unggul, dan peralatan pertanian berkualitas langsung dari distributor resmi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-[#f8faf9] text-gray-800 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}