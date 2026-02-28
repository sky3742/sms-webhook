"use client";

import { useRouter } from "next/navigation";

export const RefreshButton = () => {
  const { refresh } = useRouter();
  return (
    <button
      onClick={refresh}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
    >
      Refresh
    </button>
  );
};
