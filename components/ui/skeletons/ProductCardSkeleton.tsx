export function ProductCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#d8cfbd]/70 overflow-hidden animate-pulse shadow-[0_2px_12px_rgba(55,65,61,0.06)]">
      {/* Image area */}
      <div className="aspect-[4/5] bg-gradient-to-br from-[#ede6d8] to-[#d8cfbd]/60 relative">
        {/* Category pill skeleton */}
        <div className="absolute top-3 left-3">
          <div className="h-5 w-16 rounded-lg bg-white/50" />
        </div>
        {/* Badge skeleton */}
        <div className="absolute top-3 right-3">
          <div className="h-5 w-14 rounded-full bg-white/50" />
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 md:p-5">
        {/* Title */}
        <div className="h-4 w-full bg-[#d8cfbd]/60 rounded-md mb-2" />
        <div className="h-4 w-2/3 bg-[#d8cfbd]/60 rounded-md mb-4" />

        {/* Detail pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <div className="h-5 w-16 bg-[#d8cfbd]/40 rounded-md" />
          <div className="h-5 w-14 bg-[#d8cfbd]/40 rounded-md" />
          <div className="h-5 w-12 bg-[#d8cfbd]/40 rounded-md" />
        </div>

        {/* Price */}
        <div className="pt-3 border-t border-[#d8cfbd]/40">
          <div className="h-6 w-24 bg-[#d8cfbd]/60 rounded-md" />
        </div>
      </div>
    </div>
  );
}