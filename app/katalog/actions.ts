"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { skemaItem } from "@/lib/skema";
import { judulSudahAda, tambahItem } from "@/lib/data";
import { bacaSesi } from "@/lib/sesi";
import type { StatusForm } from "@/lib/status-form";

export async function simpanItem(
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  // 1. Pemeriksaan sesi pengguna
  if (!(await bacaSesi())) {
    return { pesan: "Silakan masuk terlebih dahulu." };
  }

  const mentah = Object.fromEntries(formData);
  const nilai = {
    judul: String(mentah.judul ?? ""),
    kategori: String(mentah.kategori ?? ""),
    deskripsi: String(mentah.deskripsi ?? ""),
  };

  // 2. Validasi bentuk sintaksis (Zod schema)
  const hasil = skemaItem.safeParse(mentah);
  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir.",
      nilai,
    };
  }

  // 3. Validasi semantik (aturan keunikan judul di basis data)
  if (judulSudahAda(hasil.data.judul)) {
    return {
      galat: { judul: ["Judul sudah dipakai item lain"] },
      nilai,
    };
  }

  // 4. Mutasi data
  let id: number;
  try {
    id = tambahItem(hasil.data).id;
  } catch (e) {
    console.error("simpanItem gagal:", e);
    return { pesan: "Item gagal disimpan. Coba lagi.", nilai };
  }

  // 5. Revalidasi cache dan pengalihan rute (harus di luar blok try-catch)
  revalidatePath("/katalog");
  redirect(`/katalog/${id}`);
}
