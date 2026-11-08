"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { skemaMasuk } from "@/lib/skema";
import { buatSesi, hapusSesi } from "@/lib/sesi";
import type { StatusForm } from "@/lib/status-form";

export async function masuk(
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const hasil = skemaMasuk.safeParse(Object.fromEntries(formData));
  if (!hasil.success) {
    return { galat: z.flattenError(hasil.error).fieldErrors };
  }
  const { email, kataSandi } = hasil.data;
  const demoEmail = process.env.DEMO_EMAIL || "pengelola@agromarket.com";

  // Kata sandi disimpan sebagai hash lambat Scrypt KDF dengan Salt CSPRNG (Tugas 2)
  const storedSalt = process.env.DEMO_HASH_SALT || "4a7f9c2e1b8d3a6f5e0c7b2a9d4f8e1c";
  const storedHash =
    process.env.DEMO_PASSWORD_HASH ||
    "e7207738d45fab02928bcbbeecca4dd8d09a0529e6a20f9c986799d294f7ff2fc9d4d21e39bd716464cca1d54e587c1b0ee6b9aeb37c31f57484af1751f9f676";

  const { verifyPassword } = await import("@/lib/agroCrypto");
  const isMatch = verifyPassword(kataSandi, storedSalt, storedHash);

  if (email !== demoEmail || !isMatch) {
    return { pesan: "Email atau kata sandi salah." };
  }
  await buatSesi(email);
  redirect("/katalog/tambah");
}

export async function keluar() {
  await hapusSesi();
  redirect("/");
}
