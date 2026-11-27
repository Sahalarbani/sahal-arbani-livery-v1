// Skeleton shimmer (skill android-compose-builder, diterjemahkan ke web):
// saat data dimuat, tampilkan kerangka yang meniru layout asli, BUKAN
// spinner besar di tengah layar kosong. Dipakai sebagai fallback
// loading.tsx saat navigasi antar halaman.
export function SkeletonBox({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton-shimmer rounded-xl ${className}`} />;
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`rounded-2xl border border-white/5 bg-brand-onyx p-3 ${className}`}>
      <SkeletonBox className="aspect-[16/10] w-full" />
      <div className="px-2 pb-2 pt-3">
        <SkeletonBox className="h-5 w-3/4" />
        <SkeletonBox className="mt-3 h-3 w-full" />
        <SkeletonBox className="mt-2 h-3 w-2/3" />
        <div className="mt-6 flex items-center justify-between">
          <SkeletonBox className="h-4 w-12 rounded-full" />
          <SkeletonBox className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonListItem({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-4 rounded-2xl border border-white/5 bg-brand-onyx p-4 ${className}`}>
      <SkeletonBox className="h-12 w-16 shrink-0" />
      <div className="flex-1">
        <SkeletonBox className="h-4 w-1/2" />
        <SkeletonBox className="mt-2 h-3 w-1/3" />
      </div>
    </div>
  );
}
