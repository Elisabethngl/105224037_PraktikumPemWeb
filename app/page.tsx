import Link from "next/link";


const fitur = [
  { judul: "Fitur pertama", deskripsi: "Manfaat fitur bagi pengguna." },
  { judul: "Fitur kedua", deskripsi: "Manfaat fitur bagi pengguna." },
  { judul: "Fitur ketiga", deskripsi: "Manfaat fitur bagi pengguna." },
];

const kolom =
  "rounded border px-3 py-2 focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-blue-700";
export default function Beranda() {
  return (
    <>
      <a href="#konten"  className="sr-only focus:not-sr-only focus:p-2"> // screen reader only, untuk yang disabilitas
        Lewati ke konten utama
      </a>
      <header className="border-b">
        <nav className="mx-auto flex max-w-6xl flex-col gap-3 p-4
                sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-lg font-bold">NamaProduk</Link>
            <ul className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <li><a href="#fitur">Fitur</a></li>
            <li><a href="#kontak">Kontak</a></li>

          </ul>
        </nav>
      </header>
 
      <main id="konten" className =  "max-w-6xl p-4 ">
        <section aria-labelledby="judul-utama">
          <h1 id="judul-utama">Kalimat nilai utama produk</h1>
          <p>Penjelasan singkat permasalahan dan solusi produk.</p>
        </section>
 
        <section id="fitur" aria-labelledby="judul-fitur">
          <h2 id="judul-fitur">Fitur Utama</h2>
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {fitur.map((f) => (
      <li key={f.judul}>
      <article className="h-full rounded-lg border p-6">
        <h3 className="text-lg font-semibold">{f.judul}</h3>
        <p className="mt-2 text-gray-700">{f.deskripsi}</p>
      </article>
    </li>
  ))}
</ul>
        </section>
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]"></div>
        <section id="kontak" aria-labelledby="judul-kontak">
          <h2 id="judul-kontak">Hubungi Kami</h2>
          <form className="mt-4 grid max-w-xl gap-4">
  <div className="flex flex-col gap-1">
    <label htmlFor="nama" className="font-medium">Nama lengkap</label>
    <input id="nama" name="nama" type="text" required
      autoComplete="name" className={kolom} />
  </div>
 
  <div className="flex flex-col gap-1">
    <label htmlFor="email" className="font-medium">Surel</label>
    <input id="email" name="email" type="email" required
      autoComplete="email" aria-describedby="email-bantuan"
      className={kolom} />
    <p id="email-bantuan" className="text-sm text-gray-600">
      Gunakan alamat surel yang aktif.
    </p>
  </div>
 
  <fieldset className="flex flex-col gap-1">
    <legend className="font-medium">Peran</legend>
    <label>
      <input type="radio" name="peran" value="pengguna" /> Pengguna
    </label>
    <label>
      <input type="radio" name="peran" value="mitra" /> Mitra
    </label>
  </fieldset>
 
  <div className="flex flex-col gap-1">
    <label htmlFor="pesan" className="font-medium">Pesan</label>
    <textarea id="pesan" name="pesan" rows={4} className={kolom} />
  </div>
 
  <button type="submit"
    className={kolom + " bg-blue-700 font-semibold text-white"}>
    Kirim
  </button>
</form>
        </section>
        <div className="grid gap-8 grid-cols-[2fr_1fr]">
  <section aria-labelledby="judul-cara">
    <h2 id="judul-cara">Cara Kerja</h2>
    ...
  </section>
  <aside aria-label="Informasi tambahan"
         className="rounded-lg bg-gray-100 p-6">
    ...
  </aside>
</div>
      </main>
 
      <footer className="border-t">
        <p>© 2026 Nama Produk</p>
      </footer>
    </>
  );
}