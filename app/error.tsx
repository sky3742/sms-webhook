"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="text-sm text-gray-500">Something went wrong</p>
      <p className="mt-2 text-xs text-gray-400">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-xl bg-[#0e5cad] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a4b8f]"
      >
        Try again
      </button>
    </div>
  );
}
