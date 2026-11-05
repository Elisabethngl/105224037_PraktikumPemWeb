import "server-only";
import { prisma } from "@/lib/prisma";
import type { Item } from "@/lib/tipe";

const kolomItem = {
  id: true,
  judul: true,
  kategori: true,
  deskripsi: true,
  tersedia: true,
  gambar: true,
} as const;

export async function ambilDaftarItem(): Promise<Item[]> {
  return prisma.item.findMany({
    select: kolomItem,
    orderBy: { dibuatPada: "desc" },
  });
}

export async function ambilItem(id: number) {
  return prisma.item.findUnique({
    where: { id },
    select: {
      ...kolomItem,
      ulasan: {
        select: { id: true, nama: true, nilai: true, komentar: true },
        orderBy: { dibuatPada: "desc" },
      },
    },
  });
}

// Alias untuk kompatibilitas
export const cariItem = ambilItem;
export const cariProduk = ambilItem;
export const ambilProduk = ambilItem;
export const ambilDaftarProduk = ambilDaftarItem;
