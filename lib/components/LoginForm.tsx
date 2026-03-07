"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export const LoginForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message || "Invalid credentials");
      setIsSubmitting(false);
      return;
    }

    router.replace("/");
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label
        className="block text-sm font-medium text-[#243f61]"
        htmlFor="email"
      >
        Email
      </label>
      <input
        autoComplete="email"
        className="w-full rounded-xl border border-[#bfd0ea] bg-white px-3 py-2 text-[#10213a] ring-[#0e5cad] outline-none focus:ring-2"
        id="email"
        name="email"
        required
        type="email"
      />

      <label
        className="block text-sm font-medium text-[#243f61]"
        htmlFor="password"
      >
        Password
      </label>
      <input
        autoComplete="current-password"
        className="w-full rounded-xl border border-[#bfd0ea] bg-white px-3 py-2 text-[#10213a] ring-[#0e5cad] outline-none focus:ring-2"
        id="password"
        minLength={12}
        name="password"
        required
        type="password"
      />

      {errorMessage ? (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        className="w-full rounded-xl bg-[#0e5cad] px-4 py-2 font-medium text-white shadow-[0_14px_28px_-16px_rgba(14,92,173,0.8)] transition hover:bg-[#0a4b8f] disabled:cursor-not-allowed disabled:bg-[#8ba5c7]"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};
