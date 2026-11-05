"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { skemaUlasan } from "@/lib/skema";
import type { StatusForm } from "@/lib/status-form";

export async function tambahUlasan(
  itemId: number,
  _prev: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const hasil = skemaUlasan.safeParse(Object.fromEntries(formData));
  if (!hasil.success) {
    return { galat: z.flattenError(hasil.error).fieldErrors };
  }
  try {
    await prisma.ulasan.create({ data: { ...hasil.data, itemId } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return { galat: { nama: ["Nama ini sudah mengulas item ini"] } };
      }
      if (e.code === "P2003") {
        return { pesan: "Item tidak ditemukan." };
      }
    }
    console.error("tambahUlasan gagal:", e);
    return { pesan: "Gagal menyimpan ulasan. Coba lagi." };
  }
  revalidatePath(`/katalog/${itemId}`);
  return { pesan: "Ulasan tersimpan." };
}

export async function hapusUlasan(id: number, itemId: number) {
  await prisma.ulasan.deleteMany({ where: { id, itemId } });
  revalidatePath(`/katalog/${itemId}`);
}
