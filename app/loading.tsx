export default function Loading() {
  return (
    <div className="mx-auto max-w-md px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
        <div className="flex gap-3">
          <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse py-3">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-2 h-3 w-full rounded bg-gray-200" />
            <div className="mt-1 h-3 w-3/4 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
