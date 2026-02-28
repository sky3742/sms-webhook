"use client";

import { useRouter } from "next/navigation";

export const RefreshButton = () => {
  const { refresh } = useRouter();
  return (
    <button
      onClick={refresh}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm whitespace-nowrap text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
    >
      Refresh
    </button>
  );
};
