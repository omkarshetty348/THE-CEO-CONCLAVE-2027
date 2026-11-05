"use client";

import { useState } from "react";
import Link from "next/link";

export default function RequestStatusPage() {
  const [email, setEmail] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/invitation/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, referenceId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Could not find request");
        return;
      }

      setResult(data);
      setStatus("found");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white">Check Request Status</h1>
        <p className="mt-2 text-zinc-400">
          Enter the email and reference ID from your confirmation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div>
          <label className="block text-sm text-zinc-300 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-300 mb-1">Reference ID</label>
          <input
            type="text"
            required
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
            placeholder="CC27-XXXXXX"
            className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white font-mono focus:border-purple-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-glow w-full disabled:opacity-60"
        >
          {status === "loading" ? "Checking..." : "Check Status"}
        </button>
      </form>

      {status === "found" && result && (
        <div className="glass-card p-6 mt-6">
          <h2 className="text-lg font-semibold text-white">Status</h2>
          <p className="mt-2">
            <span
              className={
                result.status === "Approved"
                  ? "badge-confirmed"
                  : result.status === "Pending"
                  ? "badge-pending"
                  : "badge-proposed"
              }
            >
              {result.status}
            </span>
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Name</dt>
              <dd className="text-white">{result.fullName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Reference</dt>
              <dd className="text-purple-300 font-mono">{result.referenceId}</dd>
            </div>
            {result.passNumber && (
              <div className="flex justify-between">
                <dt className="text-zinc-500">Pass Number</dt>
                <dd className="text-white font-mono">{result.passNumber}</dd>
              </div>
            )}
          </dl>
          {result.status === "Approved" && result.passUrl && (
            <Link href={result.passUrl} className="btn-glow mt-6 inline-block w-full text-center">
              View Digital Pass
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
