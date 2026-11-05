"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"check" | "form" | "done" | "error">("check");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetch("/api/setup/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.setupCompleted) {
          setStep("done");
          setMessage("Setup has already been completed. Redirecting to admin login...");
          setTimeout(() => router.push("/admin/login"), 2000);
        } else {
          setStep("form");
        }
      })
      .catch(() => {
        setStep("form");
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Setup failed");
        setLoading(false);
        return;
      }

      setStep("done");
      setMessage("Setup complete! You can now log in to the admin dashboard.");
      setTimeout(() => router.push("/admin/login"), 2500);
    } catch {
      setMessage("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (step === "check") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <p className="text-zinc-400">Checking setup status...</p>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="glass-card p-8 max-w-md text-center">
          <div className="text-4xl text-green-400 mb-4">✓</div>
          <h1 className="text-xl font-bold text-white">Setup Complete</h1>
          <p className="mt-2 text-zinc-400">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            CEO Conclave 2027 Setup
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Create the first Super Admin account. This page will lock after setup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          {message && (
            <p className="text-sm text-red-400">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full disabled:opacity-60"
          >
            {loading ? "Setting up..." : "Create Super Admin & Finish Setup"}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-zinc-600">
          Make sure DATABASE_URL and AUTH_SECRET are set in Vercel environment variables before running setup.
        </p>
      </div>
    </div>
  );
}
