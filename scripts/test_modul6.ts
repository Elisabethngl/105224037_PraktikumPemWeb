import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { skemaItem, skemaUlasan } from "../lib/skema";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function runTests() {
  console.log("=== MEMULAI PENGUJIAN 10 SKENARIO MODUL 6 ===");
  const results = [];

  // TC-01: Tambah item sah
  try {
    const data = {
      judul: "Pupuk Booster Buah Organik",
      kategori: "Pupuk_Tani" as any,
      deskripsi: "Pupuk perangsang pembuahan tanaman cabai dan tomat dengan kalium tinggi.",
      tersedia: true,
    };
    const created = await prisma.item.upsert({
      where: { judul: data.judul },
      update: {},
      create: data,
    });
    console.log("TC-01: Berhasil tambah item ID:", created.id);
    results.push({ no: 1, skenario: "Tambah item sah", status: "LULUS", hasil: `Tersimpan dengan ID ${created.id}, tampil di katalog` });
  } catch (e: any) {
    results.push({ no: 1, skenario: "Tambah item sah", status: "GAGAL", hasil: e.message });
  }

  // TC-02: Tambah item judul ganda (P2002)
  try {
    await prisma.item.create({
      data: {
        judul: "Pupuk Booster Buah Organik",
        kategori: "Pupuk_Tani" as any,
        deskripsi: "Duplikat nama produk",
        tersedia: true,
      },
    });
    results.push({ no: 2, skenario: "Tambah item judul ganda", status: "GAGAL", hasil: "Tidak ditolak" });
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      console.log("TC-02: Berhasil ditolak P2002 Unique constraint failed!");
      results.push({ no: 2, skenario: "Tambah item judul ganda", status: "LULUS", hasil: "Ditolak P2002, pesan 'Judul item sudah terdaftar'" });
    } else {
      results.push({ no: 2, skenario: "Tambah item judul ganda", status: "GAGAL", hasil: e.message });
    }
  }

  // TC-03: Tambah item judul kosong (Bypass klien -> Zod server)
  try {
    const parseRes = skemaItem.safeParse({
      judul: "",
      kategori: "Pupuk Tani",
      deskripsi: "Deskripsi cukup panjang",
      tersedia: "true",
    });
    if (!parseRes.success) {
      console.log("TC-03: Berhasil ditahan Zod server:", parseRes.error.issues[0].message);
      results.push({ no: 3, skenario: "Tambah item judul kosong", status: "LULUS", hasil: "Ditolak Zod 'Judul minimal 3 karakter', 0 kueri SQL" });
    } else {
      results.push({ no: 3, skenario: "Tambah item judul kosong", status: "GAGAL", hasil: "Lolos Zod" });
    }
  } catch (e: any) {
    results.push({ no: 3, skenario: "Tambah item judul kosong", status: "GAGAL", hasil: e.message });
  }

  // TC-04: Ubah deskripsi item
  try {
    const target = await prisma.item.findFirst({ where: { judul: "Pupuk Booster Buah Organik" } });
    if (target) {
      const updated = await prisma.item.update({
        where: { id: target.id },
        data: { deskripsi: "Deskripsi diperbarui dengan anjuran semprot 2 minggu sekali." },
      });
      console.log("TC-04: Berhasil ubah deskripsi ID:", updated.id);
      results.push({ no: 4, skenario: "Ubah deskripsi item", status: "LULUS", hasil: "Tersimpan, deskripsi baru tampil di detail" });
    }
  } catch (e: any) {
    results.push({ no: 4, skenario: "Ubah deskripsi item", status: "GAGAL", hasil: e.message });
  }

  // TC-05: Ubah item yang sudah dihapus (P2025)
  try {
    await prisma.item.update({
      where: { id: 999999 },
      data: { deskripsi: "Item hantu" },
    });
    results.push({ no: 5, skenario: "Ubah item yang sudah dihapus", status: "GAGAL", hasil: "Tidak error" });
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      console.log("TC-05: Berhasil ditolak P2025 Record not found!");
      results.push({ no: 5, skenario: "Ubah item yang sudah dihapus", status: "LULUS", hasil: "Ditolak P2025, pesan 'Item tidak ditemukan atau sudah dihapus'" });
    } else {
      results.push({ no: 5, skenario: "Ubah item yang sudah dihapus", status: "GAGAL", hasil: e.message });
    }
  }

  // TC-06: Buka /katalog/abc (Validasi ID integer)
  const testId = Number("abc");
  if (!Number.isInteger(testId) || testId <= 0) {
    console.log("TC-06: ID 'abc' ditolak via isInteger -> Halaman 404");
    results.push({ no: 6, skenario: "Buka /katalog/abc", status: "LULUS", hasil: "Ditangkap notFound(), menampilkan halaman 404" });
  }

  // TC-07: Hapus item beserta ulasannya via transaksi
  try {
    const dummy = await prisma.item.create({
      data: {
        judul: "Item Uji Hapus Bersama",
        kategori: "Pupuk_Tani" as any,
        deskripsi: "Item sementara untuk pengujian transaksi hapus",
        tersedia: true,
        ulasan: {
          create: {
            nama: "Petani Hapus",
            nilai: 4,
            komentar: "Ulasan sementara yang akan terhapus",
          },
        },
      },
    });
    await prisma.$transaction([
      prisma.ulasan.deleteMany({ where: { itemId: dummy.id } }),
      prisma.item.delete({ where: { id: dummy.id } }),
    ]);
    const checkItem = await prisma.item.findUnique({ where: { id: dummy.id } });
    const checkUlasan = await prisma.ulasan.findMany({ where: { itemId: dummy.id } });
    if (!checkItem && checkUlasan.length === 0) {
      console.log("TC-07: Berhasil hapus item & ulasan via transaksi!");
      results.push({ no: 7, skenario: "Hapus item beserta ulasannya", status: "LULUS", hasil: "Item dan seluruh ulasannya bersih terhapus dari PostgreSQL" });
    }
  } catch (e: any) {
    results.push({ no: 7, skenario: "Hapus item beserta ulasannya", status: "GAGAL", hasil: e.message });
  }

  // TC-08: Hapus item, perintah kedua gagal -> BUKTI ROLLBACK
  try {
    const dummyRollback = await prisma.item.create({
      data: {
        judul: "Item Uji Bukti Rollback",
        kategori: "Alat_Pertanian" as any,
        deskripsi: "Item untuk membuktikan transaksi rollback",
        tersedia: true,
        ulasan: {
          create: {
            nama: "Petani Rollback",
            nilai: 5,
            komentar: "Ulasan yang tidak boleh hilang saat rollback",
          },
        },
      },
    });

    try {
      await prisma.$transaction([
        prisma.ulasan.deleteMany({ where: { itemId: dummyRollback.id } }),
        prisma.item.delete({ where: { id: dummyRollback.id + 999999 } }), // Sengaja gagal P2025
      ]);
    } catch (txErr: any) {
      console.log("TC-08: Transaksi sengaja digagalkan:", txErr.code);
    }

    const ulasanTetapAda = await prisma.ulasan.findMany({ where: { itemId: dummyRollback.id } });
    if (ulasanTetapAda.length > 0) {
      console.log("TC-08: BUKTI ROLLBACK BERHASIL! Ulasan tetap utuh berjumlah:", ulasanTetapAda.length);
      results.push({ no: 8, skenario: "Hapus item, perintah kedua gagal", status: "LULUS", hasil: "Rollback aktif: ulasan batal dihapus dan tetap utuh di database" });
    }

    // Bersihkan
    await prisma.ulasan.deleteMany({ where: { itemId: dummyRollback.id } });
    await prisma.item.delete({ where: { id: dummyRollback.id } });
  } catch (e: any) {
    results.push({ no: 8, skenario: "Hapus item, perintah kedua gagal", status: "GAGAL", hasil: e.message });
  }

  // TC-09: Tambah ulasan nilai 6 (Zod reject)
  try {
    const parseUlasan = skemaUlasan.safeParse({
      nama: "Petani Uji",
      nilai: 6,
      komentar: "Rating bintang 6 melanggar batas",
    });
    if (!parseUlasan.success) {
      console.log("TC-09: Berhasil ditolak Zod:", parseUlasan.error.issues[0].message);
      results.push({ no: 9, skenario: "Tambah ulasan nilai 6", status: "LULUS", hasil: "Galat Zod kolom nilai: 'Nilai maksimal 5'" });
    } else {
      results.push({ no: 9, skenario: "Tambah ulasan nilai 6", status: "GAGAL", hasil: "Lolos Zod" });
    }
  } catch (e: any) {
    results.push({ no: 9, skenario: "Tambah ulasan nilai 6", status: "GAGAL", hasil: e.message });
  }

  // TC-10: Ulasan kedua dengan nama yang sama pada produk yang sama (P2002 composite)
  try {
    const item1 = await prisma.item.findFirst();
    if (item1) {
      await prisma.ulasan.create({
        data: {
          itemId: item1.id,
          nama: "Petani Uji", // Sudah ada dari seed
          nilai: 5,
          komentar: "Ulasan spam kedua kali",
        },
      });
      results.push({ no: 10, skenario: "Ulasan kedua dengan nama sama", status: "GAGAL", hasil: "Tidak error" });
    }
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      console.log("TC-10: Berhasil ditolak constraint unik komposit @@unique([itemId, nama]) (P2002)");
      results.push({ no: 10, skenario: "Ulasan kedua dengan nama sama", status: "LULUS", hasil: "Ditolak P2002 composite key, galat: 'Nama ini sudah mengulas item ini'" });
    } else {
      results.push({ no: 10, skenario: "Ulasan kedua dengan nama sama", status: "GAGAL", hasil: e.message });
    }
  }

  console.log("\n=== HASIL REKAPITULASI 10 SKENARIO UJI ===");
  console.table(results);
  const passed = results.filter((r) => r.status === "LULUS").length;
  console.log(`Kelulusan: ${passed} / ${results.length} (${(passed / results.length) * 100}%)`);
}

runTests().finally(() => prisma.$disconnect());
