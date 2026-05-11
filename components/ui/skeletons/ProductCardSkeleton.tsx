export function ProductCardSkeleton() {
  return (
    <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] overflow-hidden animate-pulse">
      <div className="aspect-square bg-[#d8cfbd]" />

      <div className="p-4">
        <div className="h-4 w-20 bg-[#d8cfbd] rounded mb-3" />

        <div className="h-5 w-full bg-[#d8cfbd] rounded mb-2" />
        <div className="h-5 w-2/3 bg-[#d8cfbd] rounded mb-4" />

        <div className="space-y-2 mb-4">
          <div className="h-4 w-1/2 bg-[#d8cfbd] rounded" />
          <div className="h-4 w-1/3 bg-[#d8cfbd] rounded" />
          <div className="h-4 w-2/3 bg-[#d8cfbd] rounded" />
        </div>

        <div className="h-6 w-24 bg-[#d8cfbd] rounded" />
      </div>
    </div>
  );
}