import { SkeletonBox, SkeletonListItem } from "@/components/Skeleton";

// Skeleton halaman detail skin: meniru layout aslinya (tombol kembali,
// gambar besar + 3 kotak statistik, panel detail + tombol download,
// lalu daftar komentar). Bukan spinner fullscreen.
export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-dark text-gray-200 pt-24 pb-12 px-4 sm:px-6" aria-label="Loading">
      <div className="max-w-5xl mx-auto">
        <SkeletonBox className="h-4 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <div className="space-y-6">
            <SkeletonBox className="aspect-video w-full rounded-3xl" />
            <div className="grid grid-cols-3 gap-4">
              <SkeletonBox className="h-20 rounded-2xl" />
              <SkeletonBox className="h-20 rounded-2xl" />
              <SkeletonBox className="h-20 rounded-2xl" />
            </div>
          </div>
          <div className="rounded-3xl border border-white/5 bg-brand-onyx p-8 lg:p-10">
            <SkeletonBox className="h-9 w-3/4" />
            <SkeletonBox className="mt-4 h-9 w-1/2" />
            <SkeletonBox className="mt-8 h-4 w-full" />
            <SkeletonBox className="mt-3 h-4 w-full" />
            <SkeletonBox className="mt-3 h-4 w-2/3" />
            <SkeletonBox className="mt-10 h-12 w-full rounded-full" />
          </div>
        </div>
        <div className="mt-12 pt-12 border-t border-white/5 space-y-6">
          <SkeletonBox className="h-6 w-48" />
          <SkeletonListItem />
          <SkeletonListItem />
        </div>
      </div>
    </div>
  );
}
