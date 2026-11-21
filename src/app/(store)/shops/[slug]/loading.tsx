export default function ShopDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FC]">
      {/* Header placeholder */}
      <div className="h-16 bg-[#021838]" />

      <main className="flex-1">
        {/* Hero banner skeleton */}
        <div className="relative h-48 sm:h-64 lg:h-80 w-full bg-gray-300 animate-pulse" />

        {/* Shop info card skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10">
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-200 animate-pulse shrink-0" />
                <div className="space-y-3">
                  <div className="h-6 w-48 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-3 w-64 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-3 w-56 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-36 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-10 w-28 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Products grid skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-6 flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-3 w-48 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="h-9 w-56 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 w-full bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
                  <div className="h-3 w-full bg-gray-200 rounded-full" />
                  <div className="h-5 w-24 bg-gray-200 rounded-full" />
                  <div className="h-9 w-full bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
