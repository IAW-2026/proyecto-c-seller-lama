import { ProductCardSkeleton } from '@/components/ui/skeletons/ProductCardSkeleton';
import { PageContainer } from '@/components/ui/PageContainer';

export default function Loading() {
  return (
    <main className="flex-1 bg-gradient-to-b from-[#f6f1e7] via-[#f6f1e7] to-[#ede6d8]/40 relative overflow-hidden">
      {/* Spacer for fixed navbar */}
      <div className="h-14 md:h-[56px]" />

      {/* Ambient glows */}
      <div className="absolute top-20 -left-32 w-80 h-80 bg-[#8fa18d]/[0.07] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-0 w-64 h-64 bg-[#8fa18d]/[0.05] rounded-full blur-[80px] pointer-events-none" />

      <PageContainer>
        <div className="relative py-7 md:py-9 animate-pulse">
          {/* Header skeleton */}
          <div className="mb-7 md:mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#d8cfbd]" />
              <div className="h-3 w-16 bg-[#d8cfbd]/60 rounded" />
            </div>
            <div className="h-9 w-48 bg-[#d8cfbd]/60 rounded-lg mb-2" />
            <div className="h-4 w-80 bg-[#d8cfbd]/40 rounded" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#d8cfbd]/60 bg-white/50 p-5 md:p-6"
              >
                <div className="w-9 h-9 rounded-xl bg-[#d8cfbd]/40 mb-4" />
                <div className="h-3 w-20 bg-[#d8cfbd]/40 rounded mb-3" />
                <div className="h-8 w-12 bg-[#d8cfbd]/60 rounded mb-2" />
                <div className="h-2 w-24 bg-[#d8cfbd]/30 rounded" />
              </div>
            ))}
          </div>

          {/* Filters skeleton */}
          <div className="rounded-2xl border border-[#d8cfbd]/50 bg-white/40 p-5 md:p-6 mb-8">
            <div className="h-12 w-full bg-[#d8cfbd]/40 rounded-xl mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-[#d8cfbd]/30 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Product grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </PageContainer>
    </main>
  );
}