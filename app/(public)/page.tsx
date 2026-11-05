import Link from "next/link";
import prisma from "@/lib/prisma";
import Countdown from "@/components/public/Countdown";

export const dynamic = "force-dynamic";

async function getEventData() {
  try {
    const event = await prisma.event.findFirst({
      where: { isPublished: true },
      include: {
        speakers: {
          where: { status: { in: ["Proposed", "Invited", "Confirmed"] } },
          orderBy: { sortOrder: "asc" },
          take: 6,
        },
      },
    });
    return event;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const event = await getEventData();

  const name = event?.name || "THE CEO CONCLAVE 2027";
  const tagline = event?.tagline || "One Platform. Powerful Perspectives.";
  const venue = event?.venueName || "ITC Gardenia, Bengaluru";
  const startDate = event?.startDate
    ? new Date(event.startDate).toISOString()
    : "2027-01-22T09:30:00+05:30";
  const showSpeakers = event?.showProposedSpeakers ?? true;
  const speakers = event?.speakers || [];

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 text-center">
          <div className="mb-6">
            <span className="badge-invite">Invitation Only · 22–23 January 2027</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {name.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {name.split(" ").slice(-1)}
            </span>
          </h1>

          <p className="mt-4 text-lg text-zinc-400 sm:text-xl max-w-2xl mx-auto">
            {tagline}
          </p>

          <p className="mt-3 text-sm text-zinc-500">
            {venue} · 9:30 AM – 4:00 PM IST
          </p>

          <div className="mt-10">
            <Countdown targetDate={startDate} />
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/request-invitation" className="btn-glow">
              Request Invitation
            </Link>
            <Link href="/speakers" className="btn-glow-outline">
              View Speakers
            </Link>
          </div>

          <p className="mt-8 text-xs text-zinc-600 max-w-lg mx-auto">
            Dates, venue booking, speaker participation, sponsorships and attendance are proposed and subject to confirmation.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-purple-500/10 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            {[
              { value: "2", label: "Days" },
              { value: "6", label: "Business Leaders" },
              { value: "180", label: "Participants" },
              { value: "1", label: "Exclusive Platform" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About summary */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">About the Event</h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            {event?.aboutText ||
              "An exclusive two-day business leadership event that brings together prominent CEOs, entrepreneurs, founders and industry experts from across India for meaningful conversations and collaborative problem-solving."}
          </p>
          <Link href="/about" className="mt-6 inline-block text-sm text-purple-400 hover:text-purple-300">
            Learn more →
          </Link>
        </div>
      </section>

      {/* Speakers preview */}
      {showSpeakers && speakers.length > 0 && (
        <section className="border-t border-purple-500/10 bg-zinc-950/30">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Proposed Speakers</h2>
              <p className="mt-2 text-sm text-zinc-500">
                All speakers are proposed invitees. Participation subject to confirmation.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {speakers.map((speaker) => (
                <div key={speaker.id} className="glass-card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-lg font-semibold text-purple-300">
                      {speaker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <span className="badge-proposed">{speaker.status}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{speaker.name}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{speaker.designation}</p>
                  <p className="mt-1 text-xs text-zinc-500">{speaker.industry}</p>
                  {speaker.sessionTopic && (
                    <p className="mt-3 text-sm text-purple-300/80 line-clamp-2">
                      {speaker.sessionTopic}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-zinc-600">Day {speaker.day}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/speakers" className="btn-glow-outline text-sm">
                View All Speakers
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="glass-card p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Ready to join?</h2>
          <p className="mt-3 text-zinc-400 max-w-lg mx-auto">
            Entry is by invitation only. Submit your request and our team will review it.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/request-invitation" className="btn-glow">
              Request Invitation
            </Link>
            <Link href="/request-status" className="btn-glow-outline">
              Check Request Status
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
