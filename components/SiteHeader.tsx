import { Suspense } from "react";
import Link from "next/link";
import TautanNav, { type Tautan } from "@/components/TautanNav";

interface SiteHeaderProps {
  namaProduk: string;
  tautan: Tautan[];
}

export default function SiteHeader({ namaProduk, tautan }: SiteHeaderProps) {
  return (
    <header className="border-b">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex max-w-6xl flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <Link href="/" className="text-lg font-bold">
          {namaProduk}
        </Link>
        <Suspense fallback={<TautanPolos tautan={tautan} />}>
          <TautanNav tautan={tautan} />
        </Suspense>
      </nav>
    </header>
  );
}

// Fallback: tautan yang sama tanpa penanda halaman aktif
function TautanPolos({ tautan }: { tautan: Tautan[] }) {
  return (
    <ul className="flex flex-col gap-2 sm:flex-row sm:gap-6">
      {tautan.map((t) => (
        <li key={t.href}>
          <Link href={t.href}>{t.label}</Link>
        </li>
      ))}
    </ul>
  );
}
