import { PageContainer } from '@/components/ui/PageContainer';

export function VentasSkeleton() {
  return (
    <main className="flex-1 bg-[#f6f1e7]">
      <PageContainer>
        <div className="py-8 md:py-12">
          
          {/* Header */}
          <div className="mb-10 animate-pulse">
            <div className="h-9 w-52 bg-[#d8cfbd] rounded mb-3" />
            <div className="h-5 w-96 max-w-full bg-[#d8cfbd] rounded" />
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-6 animate-pulse"
              >
                <div className="h-4 w-28 bg-[#d8cfbd] rounded mb-4" />
                <div className="h-9 w-20 bg-[#d8cfbd] rounded" />
              </div>
            ))}
          </div>

          {/* Tabla Skeleton */}
          <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] overflow-hidden animate-pulse">
            
            {/* Header tabla */}
            <div className="border-b border-[#d8cfbd] bg-[#e5dccd] px-6 py-4">
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-4 bg-[#d8cfbd] rounded"
                  />
                ))}
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#d8cfbd]">
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="px-6 py-5"
                >
                  <div className="grid grid-cols-7 gap-4 items-center">
                    
                    <div className="h-4 w-20 bg-[#d8cfbd] rounded" />
                    
                    <div className="h-4 w-32 bg-[#d8cfbd] rounded" />
                    
                    <div className="h-4 w-16 bg-[#d8cfbd] rounded" />

                    <div className="h-7 w-24 bg-[#d8cfbd] rounded-full" />

                    <div className="h-7 w-20 bg-[#d8cfbd] rounded-full" />

                    <div className="h-7 w-20 bg-[#d8cfbd] rounded-full" />

                    <div className="h-4 w-24 bg-[#d8cfbd] rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </PageContainer>
    </main>
  );
}