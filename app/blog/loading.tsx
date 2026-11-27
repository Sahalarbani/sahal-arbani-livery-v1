import { SkeletonBox } from "@/components/Skeleton";

// Skeleton halaman indeks blog: meniru header + daftar kartu artikel.
// Bukan spinner fullscreen.
export default function Loading() {
  return (
    <div className="pt-24 pb-20 min-h-screen" aria-label="Loading">
      <div className="max-w-4xl mx-auto px-6">
        <SkeletonBox className="h-12 w-2/3" />
        <SkeletonBox className="mt-4 h-5 w-full" />
        <SkeletonBox className="mt-2 h-5 w-1/2" />
        <div className="grid gap-6 mt-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-brand-onyx p-6 md:p-8">
              <SkeletonBox className="h-6 w-24 rounded-full" />
              <SkeletonBox className="mt-5 h-7 w-3/4" />
              <SkeletonBox className="mt-4 h-4 w-full" />
              <SkeletonBox className="mt-2 h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
