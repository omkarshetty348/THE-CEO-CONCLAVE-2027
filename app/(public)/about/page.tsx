import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let event = null;
  try {
    event = await prisma.event.findFirst({ where: { isPublished: true } });
  } catch {}

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center mb-12">
        <span className="badge-invite mb-4 inline-block">Invitation Only</span>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">About the Event</h1>
      </div>

      <div className="space-y-10">
        <section className="glass-card p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
          <p className="text-zinc-400 leading-relaxed">
            {event?.aboutText ||
              "The CEO Conclave 2027 is an exclusive two-day business leadership event that brings together prominent CEOs, entrepreneurs, founders and industry experts from across India. It creates a platform where business leaders share experiences, discuss real-world management challenges, exchange ideas and explore strategies for sustainable growth."}
          </p>
        </section>

        <section className="glass-card p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Vision</h2>
          <p className="text-zinc-400 leading-relaxed">
            {event?.vision ||
              "To connect India's business leaders, encourage powerful discussions and inspire the next generation of entrepreneurs."}
          </p>
        </section>

        <section className="glass-card p-8">
          <h2 className="text-xl font-semibold text-white mb-4">What makes it different</h2>
          <ul className="space-y-3 text-zinc-400">
            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              Focus on meaningful conversations rather than one-way lectures
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              Interactive CEO round table discussions and audience Q&A
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              Invitation-only format for a curated audience of leaders and aspiring entrepreneurs
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              Practical knowledge and collaborative problem-solving
            </li>
          </ul>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white">Day 1 Theme</h3>
            <p className="mt-1 text-sm text-purple-300">22 January 2027</p>
            <p className="mt-3 text-zinc-400">
              Leadership, Entrepreneurship & Business Growth
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Focus: How do successful business leaders build, manage and expand their organisations in a competitive market?
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white">Day 2 Theme</h3>
            <p className="mt-1 text-sm text-purple-300">23 January 2027</p>
            <p className="mt-3 text-zinc-400">
              Technology, Innovation & Future Business
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Focus: How will technology, finance and innovation shape the future of Indian businesses?
            </p>
          </div>
        </section>

        <div className="text-center pt-6">
          <p className="text-xs text-zinc-600 mb-6 max-w-lg mx-auto">
            {event?.disclaimer ||
              "Dates, venue booking, speaker participation, sponsorships and attendance are proposed and subject to confirmation."}
          </p>
          <Link href="/request-invitation" className="btn-glow">
            Request Invitation
          </Link>
        </div>
      </div>
    </div>
  );
}
