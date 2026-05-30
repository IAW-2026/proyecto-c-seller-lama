export function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#f6f1e7] p-8">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-5 w-36 bg-[#d8cfbd] rounded mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] overflow-hidden p-4 shadow-sm">
            <div className="aspect-square bg-[#f6f1e7] rounded-lg" />
          </div>

          <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-8 shadow-sm">
            <div className="h-9 w-3/4 bg-[#d8cfbd] rounded mb-8" />

            <div className="space-y-6">
              <div>
                <div className="h-4 w-20 bg-[#d8cfbd] rounded mb-2" />
                <div className="h-12 w-full bg-white rounded-lg border border-[#d8cfbd]" />
              </div>

              <div>
                <div className="h-4 w-28 bg-[#d8cfbd] rounded mb-2" />
                <div className="h-24 w-full bg-white rounded-lg border border-[#d8cfbd]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-4 w-20 bg-[#d8cfbd] rounded mb-2" />
                  <div className="h-12 w-full bg-white rounded-lg border border-[#d8cfbd]" />
                </div>
              </div>

              <div>
                <div className="h-4 w-20 bg-[#d8cfbd] rounded mb-2" />
                <div className="h-12 w-full bg-white rounded-lg border border-[#d8cfbd]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-4 w-16 bg-[#d8cfbd] rounded mb-2" />
                  <div className="h-12 w-full bg-white rounded-lg border border-[#d8cfbd]" />
                </div>

                <div>
                  <div className="h-4 w-32 bg-[#d8cfbd] rounded mb-2" />
                  <div className="h-12 w-full bg-white rounded-lg border border-[#d8cfbd]" />
                </div>
              </div>

              <div>
                <div className="h-4 w-36 bg-[#d8cfbd] rounded mb-2" />
                <div className="h-12 w-full bg-white rounded-lg border border-[#d8cfbd]" />
              </div>

              <div className="flex gap-4 pt-4">
                <div className="h-12 flex-1 bg-[#8fa18d] rounded-lg" />
                <div className="h-12 flex-1 bg-[#f6f1e7] rounded-lg border border-[#d8cfbd]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}