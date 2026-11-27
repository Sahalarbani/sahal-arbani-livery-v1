import { SkeletonBox, SkeletonListItem } from "@/components/Skeleton";

// Skeleton dashboard: meniru header + 3 kartu statistik + baris tabel.
// Bukan spinner fullscreen.
export default function Loading() {
  return (
    <div className="relative z-10" aria-label="Loading">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <SkeletonBox className="h-9 w-56" />
          <SkeletonBox className="mt-3 h-4 w-40" />
        </div>
        <SkeletonBox className="h-12 w-40 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SkeletonBox className="h-24 rounded-[24px]" />
        <SkeletonBox className="h-24 rounded-[24px]" />
        <SkeletonBox className="h-24 rounded-[24px]" />
      </div>
      <div className="space-y-4">
        <SkeletonListItem />
        <SkeletonListItem />
        <SkeletonListItem />
        <SkeletonListItem />
        <SkeletonListItem />
      </div>
    </div>
  );
}
