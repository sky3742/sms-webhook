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
        className="block text-sm font-medium text-gray-700"
        htmlFor="email"
      >
        Email
      </label>
      <input
        autoComplete="email"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 ring-blue-600 outline-none focus:ring-2"
        id="email"
        name="email"
        required
        type="email"
      />

      <label
        className="block text-sm font-medium text-gray-700"
        htmlFor="password"
      >
        Password
      </label>
      <input
        autoComplete="current-password"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 ring-blue-600 outline-none focus:ring-2"
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
        className="w-full rounded-md bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};
