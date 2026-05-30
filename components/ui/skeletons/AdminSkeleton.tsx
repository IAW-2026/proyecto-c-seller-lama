import { PageContainer } from '@/components/ui/PageContainer';

function AdminTableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="bg-[#ede6d8] border border-[#d8cfbd] rounded-xl p-6 md:p-8 mb-10 animate-pulse">
      <div className="h-7 w-40 bg-[#d8cfbd] rounded mb-6" />

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-6 gap-4 border-b border-[#d8cfbd] pb-4 mb-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-4 bg-[#d8cfbd] rounded"
              />
            ))}
          </div>

          <div className="divide-y divide-[#d8cfbd]">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-6 gap-4 py-4"
              >
                <div className="h-4 w-32 bg-[#d8cfbd] rounded" />
                <div className="h-4 w-40 bg-[#d8cfbd] rounded" />
                <div className="h-4 w-20 bg-[#d8cfbd] rounded" />
                <div className="h-4 w-24 bg-[#d8cfbd] rounded" />
                <div className="h-4 w-28 bg-[#d8cfbd] rounded" />
                <div className="h-4 w-24 bg-[#d8cfbd] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <main className="flex-1 bg-[#f6f1e7]">
      <PageContainer>
        <div className="py-8 md:py-12">
          {/* Header */}
          <div className="mb-10 animate-pulse">
            <div className="h-9 w-72 bg-[#d8cfbd] rounded mb-3" />
            <div className="h-5 w-[520px] max-w-full bg-[#d8cfbd] rounded" />
          </div>

          <AdminTableSkeleton rows={4} />
          <AdminTableSkeleton rows={5} />
          <AdminTableSkeleton rows={4} />
        </div>
      </PageContainer>
    </main>
  );
}