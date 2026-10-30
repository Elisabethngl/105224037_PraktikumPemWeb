import { z } from "zod";

export const skemaItem = z.object({
  judul: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter")
    .max(80, "Judul maksimal 80 karakter"),
  kategori: z.enum(
    [
      "Pupuk Tani",
      "Obat Racun & Hama",
      "Benih Unggul",
      "Alat Pertanian",
    ],
    {
      error: "Pilih salah satu kategori",
    }
  ),
  deskripsi: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(300, "Deskripsi maksimal 300 karakter"),
  tersedia: z.stringbool().default(false),
});

export type MasukanItem = z.infer<typeof skemaItem>;

export const skemaMasuk = z.object({
  email: z.string().trim().email("Format email tidak valid"),
  kataSandi: z.string().min(8, "Kata sandi minimal 8 karakter"),
});

export type MasukanMasuk = z.infer<typeof skemaMasuk>;

// Re-export untuk kompatibilitas folder lib/schemas/
export { skemaItem as productSchema, skemaMasuk as authSchema };
export type { MasukanItem as ProductSchemaType, MasukanMasuk as AuthSchemaType };
