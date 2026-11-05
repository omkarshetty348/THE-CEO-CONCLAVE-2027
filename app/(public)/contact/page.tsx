"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Failed");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white">Contact</h1>
        <p className="mt-2 text-zinc-400">Get in touch with the organising team</p>
      </div>

      {status === "success" ? (
        <div className="glass-card p-8 text-center">
          <p className="text-green-400 text-lg">Message sent</p>
          <p className="mt-2 text-zinc-400 text-sm">We will respond as soon as possible.</p>
          <Link href="/" className="mt-6 inline-block text-sm text-purple-400">
            Back to Home
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Message *</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}
          <button type="submit" disabled={status === "loading"} className="btn-glow w-full disabled:opacity-60">
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
