/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  // output: "standalone" dihapus — itu buat Docker, di Vercel bikin semua halaman SSR + zero caching.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // ✅ INI WAJIB ADA
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    // Batasi srcSet agar next/image tidak lagi membuat varian sampai 3840w.
    // Kartu skin tampil maksimal ~33vw, jadi 1080w sudah cukup.
    deviceSizes: [640, 750, 828, 1080],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 hari untuk gambar teroptimasi
  },
  async headers() {
    return [
      {
        // Aset statis Next.js: aman di-cache lama karena nama file berisi hash
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
