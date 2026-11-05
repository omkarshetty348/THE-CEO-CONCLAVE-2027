import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  let day1: any[] = [];
  let day2: any[] = [];

  try {
    const event = await prisma.event.findFirst({ where: { isPublished: true } });
    if (event) {
      day1 = await prisma.session.findMany({
        where: { eventId: event.id, day: 1, isVisible: true },
        orderBy: { sortOrder: "asc" },
      });
      day2 = await prisma.session.findMany({
        where: { eventId: event.id, day: 2, isVisible: true },
        orderBy: { sortOrder: "asc" },
      });
    }
  } catch {}

  // Fallback static agenda if DB empty
  if (day1.length === 0) {
    day1 = [
      { startTime: "09:30", endTime: "10:00", title: "Registration", description: "Guest arrival and welcome", type: "registration" },
      { startTime: "10:00", endTime: "10:15", title: "Inauguration and lamp lighting", description: "Organising Team", type: "inauguration" },
      { startTime: "10:15", endTime: "11:15", title: "From Startup to Success", description: "Falguni Nayar", type: "keynote" },
      { startTime: "11:15", endTime: "11:30", title: "Tea and refreshments", description: "Break", type: "break" },
      { startTime: "11:30", endTime: "12:30", title: "Brand Building and Consumer Behaviour", description: "Priya Nair", type: "keynote" },
      { startTime: "12:30", endTime: "13:30", title: "Business Expansion and E-commerce Growth", description: "Kalyan Krishnamurthy", type: "keynote" },
      { startTime: "13:30", endTime: "14:30", title: "Lunch and Networking", description: "", type: "lunch" },
      { startTime: "14:30", endTime: "15:30", title: "Interactive CEO Round Table Discussion", description: "All Day 1 Speakers", type: "roundtable" },
      { startTime: "15:30", endTime: "16:00", title: "Audience Q&A and Closing Remarks", description: "All Day 1 Speakers", type: "qa" },
    ];
  }
  if (day2.length === 0) {
    day2 = [
      { startTime: "09:30", endTime: "10:00", title: "Guest arrival and registration", description: "Organising Team", type: "registration" },
      { startTime: "10:00", endTime: "11:00", title: "AI and the Future of Business", description: "K. Krithivasan", type: "keynote" },
      { startTime: "11:00", endTime: "11:15", title: "Tea Break", description: "", type: "break" },
      { startTime: "11:15", endTime: "12:15", title: "Financial Management and Business Sustainability", description: "Anup Bagchi", type: "keynote" },
      { startTime: "12:15", endTime: "13:15", title: "Global Leadership and Innovation", description: "C. Vijayakumar", type: "keynote" },
      { startTime: "13:15", endTime: "14:15", title: "Lunch and Networking", description: "", type: "lunch" },
      { startTime: "14:15", endTime: "15:15", title: "Interactive CEO Round Table Discussion", description: "All Day 2 Speakers", type: "roundtable" },
      { startTime: "15:15", endTime: "15:45", title: "Audience Interaction and Q&A", description: "All Day 2 Speakers", type: "qa" },
      { startTime: "15:45", endTime: "16:00", title: "Closing Ceremony and Vote of Thanks", description: "Organising Team", type: "closing" },
    ];
  }

  function Timeline({ sessions, day }: { sessions: any[]; day: number }) {
    return (
      <div className="space-y-0">
        {sessions.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-purple-300" />
              {i < sessions.length - 1 && (
                <div className="w-px flex-1 bg-purple-500/30 min-h-[60px]" />
              )}
            </div>
            <div className="pb-8 flex-1">
              <p className="text-xs font-mono text-purple-400">
                {s.startTime} – {s.endTime}
              </p>
              <h3 className="mt-1 font-semibold text-white">{s.title}</h3>
              {s.description && (
                <p className="mt-0.5 text-sm text-zinc-400">{s.description}</p>
              )}
              {s.type && s.type !== "session" && (
                <span className="mt-1 inline-block text-[10px] uppercase tracking-wider text-zinc-600">
                  {s.type}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center mb-12">
        <span className="badge-invite mb-4 inline-block">Invitation Only</span>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Agenda</h1>
        <p className="mt-2 text-zinc-400">
          Two days of leadership conversations and insights
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="glass-card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Day 1</h2>
            <p className="text-sm text-purple-300">22 January 2027</p>
            <p className="mt-1 text-xs text-zinc-500">
              Theme: Leadership, Entrepreneurship & Business Growth
            </p>
          </div>
          <Timeline sessions={day1} day={1} />
        </div>

        <div className="glass-card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Day 2</h2>
            <p className="text-sm text-purple-300">23 January 2027</p>
            <p className="mt-1 text-xs text-zinc-500">
              Theme: Technology, Innovation & Future Business
            </p>
          </div>
          <Timeline sessions={day2} day={2} />
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs text-zinc-600 mb-6">
          Agenda is proposed and subject to change. Final schedule will be confirmed closer to the event.
        </p>
        <Link href="/request-invitation" className="btn-glow">
          Request Invitation
        </Link>
      </div>
    </div>
  );
}
