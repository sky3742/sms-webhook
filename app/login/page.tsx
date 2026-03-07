import { LoginForm } from "@/lib/components/LoginForm";
import { getSession } from "@/lib/services/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_28px_70px_-42px_rgba(16,33,58,0.45)] backdrop-blur sm:p-7">
        <p className="text-xs font-semibold tracking-[0.22em] text-[#0e5cad] uppercase">
          Secure Access
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#10213a]">Sign in</h1>
        <p className="mt-2 text-sm text-[#52617b]">
          Authenticate to view sensitive SMS messages.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
