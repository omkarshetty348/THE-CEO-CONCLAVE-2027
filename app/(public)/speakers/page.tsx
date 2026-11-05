import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SpeakersPage() {
  let event = null;
  let speakers: any[] = [];

  try {
    event = await prisma.event.findFirst({ where: { isPublished: true } });
    if (event?.showProposedSpeakers) {
      speakers = await prisma.speaker.findMany({
        where: {
          eventId: event.id,
          status: { in: ["Proposed", "Invited", "Confirmed"] },
        },
        orderBy: [{ day: "asc" }, { sortOrder: "asc" }],
      });
    }
  } catch {
    // DB not ready
  }

  const showSpeakers = event?.showProposedSpeakers ?? true;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center mb-12">
        <span className="badge-invite mb-4 inline-block">Invitation Only</span>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Speakers</h1>
        <p className="mt-2 text-zinc-400">
          Proposed business leaders for THE CEO CONCLAVE 2027
        </p>
      </div>

      {!showSpeakers || speakers.length === 0 ? (
        <div className="glass-card p-12 text-center max-w-lg mx-auto">
          <h2 className="text-xl font-semibold text-white">Speakers to be announced</h2>
          <p className="mt-3 text-zinc-400">
            Speaker lineup will be published once confirmed. Stay tuned.
          </p>
          <Link href="/request-invitation" className="btn-glow mt-6 inline-block">
            Request Invitation
          </Link>
        </div>
      ) : (
        <>
          <p className="text-center text-sm text-zinc-500 mb-10">
            All speakers shown are proposed invitees. Participation is subject to confirmation.
          </p>

          {[1, 2].map((day) => {
            const daySpeakers = speakers.filter((s) => s.day === day);
            if (daySpeakers.length === 0) return null;
            return (
              <div key={day} className="mb-16">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Day {day} · {day === 1 ? "22 January 2027" : "23 January 2027"}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {daySpeakers.map((speaker) => (
                    <div key={speaker.id} className="glass-card p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-lg font-semibold text-purple-200">
                          {speaker.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <span
                          className={
                            speaker.status === "Confirmed"
                              ? "badge-confirmed"
                              : "badge-proposed"
                          }
                        >
                          {speaker.status}
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-white">
                        {speaker.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400">{speaker.designation}</p>
                      <p className="mt-1 text-xs text-zinc-500">{speaker.industry}</p>
                      {speaker.sessionTopic && (
                        <p className="mt-4 text-sm text-purple-300/90 border-t border-white/5 pt-3">
                          {speaker.sessionTopic}
                        </p>
                      )}
                      {speaker.status !== "Confirmed" && (
                        <p className="mt-3 text-xs text-zinc-600">
                          Proposed invitee. Participation subject to confirmation.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
