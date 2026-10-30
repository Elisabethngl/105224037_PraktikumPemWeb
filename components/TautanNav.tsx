"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type Tautan = { href: string; label: string };

export default function TautanNav({ tautan }: { tautan: Tautan[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-2 sm:flex-row sm:gap-6">
      {tautan.map((t) => {
        const aktif =
          t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <li key={t.href}>
            <Link
              href={t.href}
              aria-current={aktif ? "page" : undefined}
              className={aktif ? "font-semibold underline" : undefined}
            >
              {t.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
