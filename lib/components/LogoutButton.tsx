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
      className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      onClick={handleLogout}
      type="button"
    >
      Sign out
    </button>
  );
};
