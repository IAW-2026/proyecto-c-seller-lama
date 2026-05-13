import { PageContainer } from '@/components/ui/PageContainer';

export function DashboardSkeleton() {
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
                <div className="h-4 w-32 bg-[#d8cfbd] rounded mb-4" />
                <div className="h-9 w-16 bg-[#d8cfbd] rounded" />
              </div>
            ))}
          </div>

          {/* Acceso rápido */}
          <div className="space-y-4 mb-12">
            <div className="h-6 w-36 bg-[#d8cfbd] rounded animate-pulse" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-6 md:p-8 animate-pulse"
                >
                  <div className="w-10 h-10 bg-[#d8cfbd] rounded-lg mb-4" />

                  <div className="h-5 w-40 bg-[#d8cfbd] rounded mb-3" />
                  <div className="h-4 w-full bg-[#d8cfbd] rounded mb-2" />
                  <div className="h-4 w-2/3 bg-[#d8cfbd] rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}