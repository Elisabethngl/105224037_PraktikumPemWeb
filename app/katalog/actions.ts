"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { skemaItem } from "@/lib/skema";
import type { StatusForm } from "@/lib/status-form";

function bacaForm(formData: FormData) {
  const mentah = Object.fromEntries(formData);
  const hasil = skemaItem.safeParse({
    ...mentah,
    tersedia: formData.get("tersedia") === "on" || mentah.tersedia === "true",
  });
  return { hasil, mentah };
}

export async function tambahItem(
  _prev: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const { hasil, mentah } = bacaForm(formData);
  const nilai = {
    judul: String(mentah.judul ?? ""),
    kategori: String(mentah.kategori ?? ""),
    deskripsi: String(mentah.deskripsi ?? ""),
  };

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  let id: number;
  try {
    const item = await prisma.item.create({
      data: {
        judul: hasil.data.judul,
        kategori: hasil.data.kategori as any,
        deskripsi: hasil.data.deskripsi,
        tersedia: Boolean(hasil.data.tersedia),
      },
    });
    id = item.id;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return {
        galat: { judul: ["Judul item sudah terdaftar"] },
        pesan: "Judul produk sudah digunakan.",
        nilai,
      };
    }
    console.error("tambahItem gagal:", e);
    return { pesan: "Item gagal disimpan. Coba lagi.", nilai };
  }

  revalidatePath("/katalog");
  redirect(`/katalog/${id}`);
}

export const simpanItem = tambahItem;

export async function ubahItem(
  id: number,
  _prev: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const { hasil, mentah } = bacaForm(formData);
  const nilai = {
    judul: String(mentah.judul ?? ""),
    kategori: String(mentah.kategori ?? ""),
    deskripsi: String(mentah.deskripsi ?? ""),
  };

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  try {
    await prisma.item.update({
      where: { id },
      data: {
        judul: hasil.data.judul,
        kategori: hasil.data.kategori as any,
        deskripsi: hasil.data.deskripsi,
        tersedia: Boolean(hasil.data.tersedia),
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          galat: { judul: ["Judul item sudah terdaftar"] },
          pesan: "Judul sudah digunakan item lain.",
          nilai,
        };
      }
      if (e.code === "P2025") {
        return { pesan: "Item tidak ditemukan atau sudah dihapus." };
      }
    }
    console.error("ubahItem gagal:", e);
    return { pesan: "Perubahan gagal disimpan.", nilai };
  }

  revalidatePath("/katalog");
  revalidatePath(`/katalog/${id}`);
  return { pesan: "Perubahan disimpan." };
}

export async function hapusItem(id: number) {
  await prisma.$transaction([
    prisma.ulasan.deleteMany({ where: { itemId: id } }),
    prisma.item.delete({ where: { id } }),
  ]);

  revalidatePath("/katalog");
  redirect("/katalog");
}
