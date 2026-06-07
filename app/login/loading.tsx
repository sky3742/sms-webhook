export default function LoginLoading() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="space-y-4">
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}
