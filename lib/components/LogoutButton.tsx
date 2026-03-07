"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <button
      className="rounded-xl border border-[#b8cae6] bg-white/70 px-3 py-2 text-sm font-medium text-[#244163] transition hover:bg-white"
      onClick={handleLogout}
      type="button"
    >
      Sign out
    </button>
  );
};
