import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { dataAwal } from "./data-awal";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  for (const data of dataAwal) {
    const item = await prisma.item.upsert({
      where: { judul: data.judul },
      update: {},
      create: data,
    });

    await prisma.ulasan.upsert({
      where: { itemId_nama: { itemId: item.id, nama: "Petani Uji" } },
      update: {},
      create: {
        itemId: item.id,
        nama: "Petani Uji",
        nilai: 5,
        komentar: "Ulasan sintetis pengujian efektivitas produk sarana pertanian di lahan.",
      },
    });
  }

  const jItem = await prisma.item.count();
  const jUlasan = await prisma.ulasan.count();
  console.log(`Seed selesai: ${jItem} item, ${jUlasan} ulasan`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
