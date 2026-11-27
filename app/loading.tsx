import { SkeletonCard, SkeletonBox } from "@/components/Skeleton";

// Fallback navigasi: skeleton yang meniru layout homepage (hero +
// grid kartu), bukan spinner fullscreen. Ditampilkan Next.js saat
// pindah halaman sementara data halaman tujuan dimuat.
export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-dark pt-32 pb-24 px-6" aria-label="Loading">
      <div className="max-w-5xl mx-auto text-center">
        <SkeletonBox className="mx-auto h-8 w-48 rounded-full" />
        <SkeletonBox className="mx-auto mt-8 h-14 w-3/4" />
        <SkeletonBox className="mx-auto mt-4 h-14 w-1/2" />
        <SkeletonBox className="mx-auto mt-8 h-5 w-2/3" />
      </div>
      <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
