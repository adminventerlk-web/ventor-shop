export default function ProductDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      {/* Header placeholder */}
      <div className="h-16 bg-[#021838]" />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-56 bg-gray-200 rounded-full mb-6 animate-pulse" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image skeleton */}
            <div className="space-y-3">
              <div className="aspect-square w-full bg-gray-200 rounded-3xl animate-pulse" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>

            {/* Info skeleton */}
            <div className="space-y-5 py-2">
              <div className="h-3 w-24 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-6 w-32 bg-gray-200 rounded-xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded-full animate-pulse" />
                <div className="h-3 w-5/6 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-3 w-4/6 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="flex gap-3 pt-2">
                <div className="h-12 flex-1 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse" />
              </div>
              <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
