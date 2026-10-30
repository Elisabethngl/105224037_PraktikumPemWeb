import { z } from "zod";

export const productSchema = z.object({
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

export type ProductSchemaType = z.infer<typeof productSchema>;
