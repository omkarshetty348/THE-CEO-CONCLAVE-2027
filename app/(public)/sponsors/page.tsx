"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { name: "Title Sponsor", benefits: "Main event naming and prominent branding" },
  { name: "Presenting Sponsor", benefits: "Stage branding and promotional visibility" },
  { name: "Gold Sponsor", benefits: "Logo placement and promotional opportunities" },
  { name: "Silver Sponsor", benefits: "Website and event material branding" },
  { name: "Technology Partner", benefits: "Digital and technical support" },
  { name: "Hospitality Partner", benefits: "Guest hospitality association" },
];

export default function SponsorsPage() {
  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    interestedCategory: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/sponsors/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Submission failed");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center mb-12">
        <span className="badge-invite mb-4 inline-block">Invitation Only</span>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Sponsors</h1>
        <p className="mt-2 text-zinc-400">
          Partner with THE CEO CONCLAVE 2027
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-16">
        {CATEGORIES.map((c) => (
          <div key={c.name} className="glass-card p-5">
            <h3 className="font-semibold text-white">{c.name}</h3>
            <p className="mt-2 text-sm text-zinc-400">{c.benefits}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold text-white mb-2">
          Become a Sponsor
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          Sponsorship prices are not yet decided. Share your interest and our team will connect with you.
        </p>

        {status === "success" ? (
          <div className="text-center py-8">
            <p className="text-green-400 text-lg">Thank you for your interest!</p>
            <p className="mt-2 text-zinc-400 text-sm">
              We have received your enquiry and will get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Company Name *</label>
                <input
                  required
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Contact Person *</label>
                <input
                  required
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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
                <label className="block text-sm text-zinc-300 mb-1">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1">Interested Category</label>
              <select
                value={form.interestedCategory}
                onChange={(e) => setForm({ ...form, interestedCategory: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1">Message</label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-glow disabled:opacity-60"
            >
              {status === "loading" ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
