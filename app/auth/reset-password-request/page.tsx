"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const res = await fetch("/api/auth/send-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto pt-10 pb-10">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      {success ? (
        <p className="text-green-600">Check your email for a reset link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            className="bg-gray-900 text-white px-4 py-2 rounded w-full hover:bg-gray-800 transition cursor-pointer"
          >
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
}
