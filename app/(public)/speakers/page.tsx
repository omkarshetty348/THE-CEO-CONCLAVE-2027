import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const proposedSpeakers = [
  { name: "Falguni Nayar", designation: "Founder, Executive Chairperson and MD, Nykaa", industry: "E-commerce and Retail", sessionTopic: "From Startup to Success - Building a Powerful Business Brand", day: 1 },
  { name: "Priya Nair", designation: "CEO and MD, Hindustan Unilever", industry: "FMCG and Marketing", sessionTopic: "Brand Building, Consumer Behaviour and Marketing Strategies", day: 1 },
  { name: "Kalyan Krishnamurthy", designation: "Group CEO, Flipkart", industry: "E-commerce and Digital Business", sessionTopic: "Business Expansion, Competition and E-commerce Growth", day: 1 },
  { name: "K. Krithivasan", designation: "CEO and MD, Tata Consultancy Services", industry: "IT and Technology", sessionTopic: "Artificial Intelligence, Digital Transformation and Future Business", day: 2 },
  { name: "Anup Bagchi", designation: "MD and CEO, HDFC Bank", industry: "Banking and Finance", sessionTopic: "Financial Management, Risk and Sustainable Business Growth", day: 2 },
  { name: "C. Vijayakumar", designation: "CEO and MD, HCLTech", industry: "IT Services and Technology", sessionTopic: "Global Business Leadership, Innovation and Organisational Growth", day: 2 },
];

export default async function SpeakersPage() {
  let speakers: any[] = proposedSpeakers;
  let showSpeakers = true;

  try {
    const event = await prisma.event.findFirst({ where: { isPublished: true } });
    if (event) {
      showSpeakers = event.showProposedSpeakers;
      const databaseSpeakers = await prisma.speaker.findMany({
        where: { eventId: event.id, status: { in: ["Proposed", "Invited", "Confirmed"] } },
        orderBy: [{ day: "asc" }, { sortOrder: "asc" }],
      });
      // Use database-managed profiles when available; otherwise show the published proposed lineup.
      if (databaseSpeakers.length > 0) speakers = databaseSpeakers;
    }
  } catch {
    // Keep the public proposed lineup visible while database setup is pending.
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <span className="badge-invite mb-4 inline-block">Invitation Only</span>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Our Speakers</h1>
        <p className="mt-2 text-zinc-400">Business leaders and industry voices proposed for THE CEO CONCLAVE 2027</p>
      </div>

      {!showSpeakers ? (
        <div className="glass-card mx-auto max-w-lg p-12 text-center">
          <h2 className="text-xl font-semibold text-white">Speaker lineup coming soon</h2>
          <p className="mt-3 text-zinc-400">The speaker lineup will be published once it is ready.</p>
          <Link href="/request-invitation" className="btn-glow mt-6 inline-block">Request Invitation</Link>
        </div>
      ) : (
        <>
          <p className="mb-10 text-center text-sm text-zinc-500">All listed speakers are proposed invitees. Their participation is subject to confirmation.</p>
          {[1, 2].map((day) => {
            const daySpeakers = speakers.filter((speaker) => speaker.day === day);
            return (
              <section key={day} className="mb-16">
                <h2 className="mb-6 text-xl font-semibold text-white">Day {day} · {day === 1 ? "22 January 2027" : "23 January 2027"}</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {daySpeakers.map((speaker) => (
                    <article key={speaker.id ?? speaker.name} className="glass-card p-6 transition-transform duration-300 hover:-translate-y-1">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-xl font-bold text-purple-200 ring-1 ring-purple-400/30">
                        {speaker.name.split(" ").map((part: string) => part[0]).join("").slice(0, 2)}
                      </div>
                      <div className="mt-5 flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-white">{speaker.name}</h3>
                        <span className={speaker.status === "Confirmed" ? "badge-confirmed" : "badge-proposed"}>{speaker.status ?? "Proposed"}</span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-300">{speaker.designation}</p>
                      <p className="mt-1 text-xs text-zinc-500">{speaker.industry}</p>
                      {speaker.sessionTopic && <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-purple-300/90">{speaker.sessionTopic}</p>}
                      <p className="mt-4 text-xs text-zinc-500">Proposed invitee · Participation subject to confirmation</p>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
