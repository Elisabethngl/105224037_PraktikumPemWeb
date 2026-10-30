import "server-only";
import { cookies } from "next/headers";

type Sesi = { email: string; kedaluwarsa: number };
const DELAPAN_JAM = 60 * 60 * 8; // 28.800 detik (8 jam)

// Penyimpanan sementara di memori server; diganti pustaka autentikasi pada Modul 10
const g = globalThis as unknown as { sesiTiruan?: Map<string, Sesi> };
const penyimpanan = (g.sesiTiruan ??= new Map<string, Sesi>());

export async function buatSesi(email: string) {
  const id = crypto.randomUUID();
  penyimpanan.set(id, {
    email,
    kedaluwarsa: Date.now() + DELAPAN_JAM * 1000,
  });
  const toko = await cookies();
  toko.set("sesi", id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DELAPAN_JAM,
  });
}

export async function bacaSesi() {
  const toko = await cookies();
  const id = toko.get("sesi")?.value;
  const sesi = id ? penyimpanan.get(id) : undefined;
  if (!sesi || sesi.kedaluwarsa < Date.now()) return null;
  return sesi;
}

export async function hapusSesi() {
  const toko = await cookies();
  const id = toko.get("sesi")?.value;
  if (id) penyimpanan.delete(id);
  toko.delete("sesi");
}
