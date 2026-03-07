"use client";

import { useRouter } from "next/navigation";

export const RefreshButton = () => {
  const { refresh } = useRouter();
  return (
    <button
      onClick={refresh}
      className="rounded-xl bg-[#0e5cad] px-4 py-2 text-sm whitespace-nowrap text-white shadow-[0_14px_28px_-16px_rgba(14,92,173,0.8)] transition hover:bg-[#0a4b8f] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
    >
      Refresh
    </button>
  );
};
