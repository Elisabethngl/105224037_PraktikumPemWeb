import { z } from "zod";

export const orderSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Nama lengkap penerima minimal 3 karakter"),
  email: z
    .string()
    .trim()
    .email("Format alamat email tidak valid"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+62|62|0)[0-9]{9,13}$/, "Nomor WhatsApp/telepon tidak valid (minimal 10 digit angka aktif)"),
  address: z
    .string()
    .trim()
    .min(10, "Alamat pengiriman terlalu singkat, tuliskan detail minimal 10 karakter"),
  productId: z
    .coerce
    .number()
    .positive("Silakan pilih produk sarana pertanian yang valid"),
  quantity: z
    .coerce
    .number()
    .min(1, "Jumlah pesanan minimal 1 unit")
    .max(100, "Maksimal pemesanan per transaksi adalah 100 unit"),
  notes: z
    .string()
    .trim()
    .optional()
    .default(""),
  paymentMethod: z.enum(
    [
      "Transfer Bank (BCA/BRI)",
      "COD (Bayar di Tempat)",
      "E-Wallet (QRIS)",
    ],
    {
      error: "Pilih salah satu metode pembayaran yang tersedia",
    }
  ),
  agreedSOP: z
    .boolean()
    .refine((val) => val === true, {
      message: "Anda wajib menyetujui kepatuhan SOP pestisida & keselamatan APD",
    }),
});

export type OrderSchemaType = z.infer<typeof orderSchema>;
