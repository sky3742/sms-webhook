"use client";

import { useRouter } from "next/navigation";

export const RefreshButton = () => {
  const { refresh } = useRouter();
  return (
    <button
      onClick={refresh}
      className="px-4 py-2 bg-gray-100 rounded-md text-gray-700"
    >
      Refresh
    </button>
  );
};
