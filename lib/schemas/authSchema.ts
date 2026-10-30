import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Format email tidak valid"),
  kataSandi: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter"),
});

export type AuthSchemaType = z.infer<typeof authSchema>;
