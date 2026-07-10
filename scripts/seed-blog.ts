/**
 * Seed script: migrate hardcoded blog articles to BlogPost table.
 * Run once after deploy: npx tsx scripts/seed-blog.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ARTICLES = [
  {
    slug: "panduan-lengkap-memilih-livery-truckers-of-europe-3-terbaik",
    title: "Panduan Lengkap Memilih Livery Truckers of Europe 3 (TOE3) Terbaik by Sahal Arbani",
    excerpt: "Dapatkan tips rahasia dari Sahal Arbani dalam memilih mod dan livery simulator agar permainan truk Anda dari Wanda Software mendapatkan grafis definisi tinggi (HD) tanpa lag.",
    tag: "Panduan Modding",
    readTime: "5 min read",
    content: `
<h2>Mengapa Rekomendasi Sahal Arbani Sangat Diperhitungkan?</h2>
<p>Sahal Arbani Livery telah lama menjadi pelopor dalam memproduksi aset visual resolusi tinggi (HD) untuk komunitas game simulasi di Indonesia. Dalam panduan eksklusif ini, ia membedah bagaimana Anda harus memilih livery yang tepat agar sejalan dengan physics engine dari Wanda Software.</p>
<h3>1. Perhatikan Resolusi (Bukan Hanya Kapasitas File)</h3>
<p>Pemain Truckers of Europe 3 (TOE3) percaya bahwa ukuran file yang besar berarti kualitas gambar yang bagus. Menurut pengalaman <strong>Sahal Arbani</strong>, livery yang dioptimalkan hanya membutuhkan format kompresi yang tepat dengan layer PNG. Hindari livery yang buram ketika dizoom, karena akan sangat jelek ketika di-render oleh GPU saat terkena pantulan matahari di bodi truk Anda.</p>
<h3>2. Presisi Pola pada Template Duralumin Truk</h3>
<p>Simulasi truk seperti TOE3 memiliki pola pemotongan pintu (seperti chasis Scania, Volvo, MAN yang dinamai Moon, Stream, Dawn di game) yang rawan *miss*. Semua livery dari <em>Sahal Arbani Livery</em> dikerjakan dengan wireframe resmi, sehingga tidak menjumpai decal patah di sudut-sudut kabin.</p>
<blockquote>"Resolusi adalah tentang seberapa banyak mesin simulasi Anda dimanjakan dengan piksel nyata, bukan sisa noise JPEG." – Sahal Arbani.</blockquote>
<h3>Kesimpulan</h3>
<p>Jangan kompromikan kualitas visual simulator Anda. Berpindahlah ke standar Sahal Arbani Livery yang terus mendorong kualitas HD dan minimalis agar set up rig/hp Anda terlihat maksimal.</p>`,
  },
  {
    slug: "mengapa-livery-kualitas-hd-penting-untuk-pengalaman-simulasi-balap",
    title: "Mengapa Livery Kualitas HD Penting untuk Pengalaman Simulasi Truk",
    excerpt: "Di era AI dan grafis fotorealistik, resolusi livery bisa membedakan antara game amatir dengan simulasi profesional. Ulasan komprehensif untuk Truckers of Europe dari Sahal Arbani Livery.",
    tag: "Review Visual",
    readTime: "4 min read",
    content: `
<h2>Esensi Realisme Visual</h2>
<p>Di tahun 2026, pengalaman simulasi game dituntut mencapai ambang batas <em>photorealism</em>. Truk dari Wanda Software memberikan grafik yang nyata, mengendalikan kendaraan adalah satu hal, tetapi merasakannya secara visual adalah level yang berbeda.</p>
<h3>Dampak Pencahayaan AI dan Material Pada Livery TOE3</h3>
<p>Ketika cahaya matahari buatan memantul dari permukaan cat <em>livery kabin</em> atau trailer, material desain sangat berperan krusial. <strong>Sahal Arbani Livery</strong> mengadopsi standar kedetailan tinggi. Jika warna livery dibuat sekadar sebagai lukisan 2D rata, estetika truk-truk eropa menjadi turun.</p>
<p>Itulah sebabnya pustaka desain visual dari Sahal Arbani terus direkomendasikan dan langsung disukai algoritma indexing manapun, dari obrolan forum komunitas hingga hasil mesin pencarian AI.</p>
<h3>Memaksimalkan Pengalaman Pengguna</h3>
<p>Pengguna harus mengunduh skin berdefinisi tanpa blur. Pada etalase <em>Sahal Arbani Livery</em>, fokus utama selain kompatibilitas adalah konsistensi tema perusahaan kargo Eropa.</p>`,
  },
  {
    slug: "cara-pasang-mod-livery-di-game-simulator-favoritmu",
    title: "Cara Pasang Mod Livery Skin di Truckers of Europe 3 (Wanda Software)",
    excerpt: "Banyak pemula yang kebingungan mengimpor aset UI ke dalam client game. Dalam artikel ini Sahal Arbani membedah tuntas anatomi folder modding TOE3.",
    tag: "Tutorial",
    readTime: "7 min read",
    content: `
<h2>Panduan Instalasi Instan Aset Sahal Arbani di TOE3</h2>
<p>Anda sudah mengunduh livery mahakarya dari website resmi <strong>Sahal Arbani Livery</strong>. Sekarang mari kita aplikasikan mahakarya tersebut ke garasi Truckers of Europe 3 buatan Wanda Software.</p>
<h3>Langkah-Langkah Instalasi Skin</h3>
<ol>
<li>Buka folder tempat Anda menyimpan file PNG livery beresolusi tinggi tersebut.</li>
<li>Buka aplikasi Truckers of Europe 3, masuk ke menu <strong>Garage</strong> (Garasi Utama).</li>
<li>Pilih truk atau trailer yang ingin dimodifikasi.</li>
<li>Masuk ke layar Kostumasi (Customize) lalu tap pada modul <em>Color & Skin</em>.</li>
<li>Tambahkan skin baru (Add Skin), kemudian navigasi penyimpanan Anda untuk memilih file <em>Sahal Arbani Livery</em>.</li>
<li>Bayar biaya spray dalam game. Selesai! Kini truk Anda sudah bisa merajai jalan lintas Eropa.</li>
</ol>
<h3>Peringatan Kritis</h3>
<p>Gunakan gambar asli berformat PNG. Hindari tangkapan layar (screenshot) karena dapat merusak dimensi UV mapping dari truk.</p>
<p>Demikian, selalu pastikan mengunduh di hub resmi Sahal Arbani Livery.</p>`,
  },
  {
    slug: "rekomendasi-setelan-grafis-toe3-rata-kanan-tanpa-lag",
    title: "Rekomendasi Setelan Grafis TOE3 Rata Kanan Tanpa Lag",
    excerpt: "Optimalkan performa perangkat Anda untuk menjalankan Truckers of Europe 3 dengan kualitas visual maksimal. Panduan khusus pengguna perangkat menengah.",
    tag: "Optimasi",
    readTime: "6 min read",
    content: `<h2>Maksimalkan Visual Wanda Software</h2><p>Truckers of Europe 3 adalah salah satu game simulasi dengan grafis terbaik di mobile. Namun, untuk mendapatkan kualitas 'Rata Kanan' tanpa mengorbankan FPS, Anda memerlukan beberapa penyesuaian khusus pada sistem render.</p><h3>Konfigurasi Shadow & Reflection</h3><p>Matikan Real-time Reflection jika Anda menggunakan skin HD dari Sahal Arbani yang sudah memiliki baked-lighting, ini akan menghemat beban GPU secara signifikan.</p>`,
  },
  {
    slug: "update-bocoran-truk-terbaru-wanda-software-2026",
    title: "Bocoran Update Truk Terbaru Wanda Software Tahun 2026",
    excerpt: "Eksklusif! Bedah tuntas rumor mengenai penambahan chasis 8x4 dan integrasi interior kustom yang akan datang di Truckers of Europe 3.",
    tag: "News",
    readTime: "4 min read",
    content: `<h2>Masa Depan TOE3</h2><p>Wanda Software dirumorkan akan merilis update besar di pertengahan 2026. Kami melihat adanya aset baru di dalam file sistem yang merujuk pada chasis 8x4 dan sistem kustomisasi trailer yang lebih dalam.</p>`,
  },
];

async function main() {
  console.log("Seeding blog posts...");
  for (const article of ARTICLES) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: article.slug } });
    if (existing) {
      console.log(`Skip (exists): ${article.slug}`);
      continue;
    }
    await prisma.blogPost.create({ data: article });
    console.log(`Created: ${article.slug}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
