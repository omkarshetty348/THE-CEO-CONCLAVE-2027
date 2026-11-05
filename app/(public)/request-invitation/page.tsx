"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  "CEO / Business Leader",
  "Entrepreneur / Startup Founder",
  "Corporate Professional",
  "MBA / BBA Student",
  "Investor / Industry Representative",
  "Other",
];

const DAYS = ["Day 1", "Day 2", "Both"];

export default function RequestInvitationPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    organisation: "",
    designation: "",
    audienceCategory: "",
    city: "",
    daysAttending: "",
    linkedinUrl: "",
    whyAttend: "",
    studentIdOrCollege: "",
    privacyConsent: false,
    termsConsent: false,
    mediaConsent: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/invitation/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setReferenceId(data.referenceId);
      setMessage(data.message || "Request submitted successfully.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="glass-card p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-3xl text-green-400">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-white">Request Received</h1>
          <p className="mt-3 text-zinc-400">{message}</p>
          <p className="mt-4 text-sm text-zinc-500">
            Your reference ID:{" "}
            <span className="font-mono text-purple-300">{referenceId}</span>
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Save this ID. You can check your status anytime.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/request-status" className="btn-glow">
              Check Status
            </Link>
            <Link href="/" className="text-sm text-zinc-400 hover:text-white">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="text-center mb-10">
        <span className="badge-invite mb-4 inline-block">Invitation Only</span>
        <h1 className="text-3xl font-bold text-white">Request Invitation</h1>
        <p className="mt-2 text-zinc-400">
          Submit your request to attend THE CEO CONCLAVE 2027. All fields marked * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Mobile Number *
            </label>
            <input
              type="tel"
              name="mobile"
              required
              value={form.mobile}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              City
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Bengaluru"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Organisation / Company *
            </label>
            <input
              type="text"
              name="organisation"
              required
              value={form.organisation}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Designation *
            </label>
            <input
              type="text"
              name="designation"
              required
              value={form.designation}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Audience Category *
            </label>
            <select
              name="audienceCategory"
              required
              value={form.audienceCategory}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Days Attending *
            </label>
            <select
              name="daysAttending"
              required
              value={form.daysAttending}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Select days</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {form.audienceCategory === "MBA / BBA Student" && (
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Student ID or College Name
            </label>
            <input
              type="text"
              name="studentIdOrCollege"
              value={form.studentIdOrCollege}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            LinkedIn Profile URL
          </label>
          <input
            type="url"
            name="linkedinUrl"
            value={form.linkedinUrl}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Why do you want to attend?
          </label>
          <textarea
            name="whyAttend"
            rows={3}
            value={form.whyAttend}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="Brief reason (optional)"
          />
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 text-sm text-zinc-400">
            <input
              type="checkbox"
              name="privacyConsent"
              required
              checked={form.privacyConsent}
              onChange={handleChange}
              className="mt-1 rounded border-white/20 bg-black/50 text-purple-500 focus:ring-purple-500"
            />
            <span>
              I agree to the{" "}
              <Link href="/privacy" className="text-purple-400 hover:underline">
                Privacy Policy
              </Link>{" "}
              *
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-zinc-400">
            <input
              type="checkbox"
              name="termsConsent"
              required
              checked={form.termsConsent}
              onChange={handleChange}
              className="mt-1 rounded border-white/20 bg-black/50 text-purple-500 focus:ring-purple-500"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-purple-400 hover:underline">
                Terms and Conditions
              </Link>{" "}
              *
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-zinc-400">
            <input
              type="checkbox"
              name="mediaConsent"
              checked={form.mediaConsent}
              onChange={handleChange}
              className="mt-1 rounded border-white/20 bg-black/50 text-purple-500 focus:ring-purple-500"
            />
            <span>I consent to photography and media coverage (optional)</span>
          </label>
        </div>

        {status === "error" && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-glow w-full disabled:opacity-60"
        >
          {status === "loading" ? "Submitting..." : "Submit Invitation Request"}
        </button>
      </form>
    </div>
  );
}
