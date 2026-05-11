import { ProductCardSkeleton } from '@/components/ui/skeletons/ProductCardSkeleton';
import { PageContainer } from '@/components/ui/PageContainer';

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f6f1e7]">
      <PageContainer>
        <div className="py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </PageContainer>
    </main>
  );
}