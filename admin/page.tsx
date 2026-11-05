import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [
      totalRequests,
      pending,
      approved,
      waitlisted,
      rejected,
      totalSpeakers,
      confirmedSpeakers,
      totalPasses,
      day1Checkins,
      day2Checkins,
    ] = await Promise.all([
      prisma.invitationRequest.count(),
      prisma.invitationRequest.count({ where: { status: "Pending" } }),
      prisma.invitationRequest.count({ where: { status: "Approved" } }),
      prisma.invitationRequest.count({ where: { status: "Waitlisted" } }),
      prisma.invitationRequest.count({ where: { status: "Rejected" } }),
      prisma.speaker.count(),
      prisma.speaker.count({ where: { status: "Confirmed" } }),
      prisma.pass.count({ where: { status: "Active" } }),
      prisma.checkIn.count({ where: { day: 1 } }),
      prisma.checkIn.count({ where: { day: 2 } }),
    ]);

    const byCategory = await prisma.invitationRequest.groupBy({
      by: ["audienceCategory"],
      where: { status: "Approved" },
      _count: true,
    });

    return {
      totalRequests,
      pending,
      approved,
      waitlisted,
      rejected,
      totalSpeakers,
      confirmedSpeakers,
      totalPasses,
      day1Checkins,
      day2Checkins,
      byCategory,
    };
  } catch {
    return null;
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const stats = await getStats();

  const cards = [
    { label: "Total Requests", value: stats?.totalRequests ?? 0, color: "text-white" },
    { label: "Pending", value: stats?.pending ?? 0, color: "text-blue-400" },
    { label: "Approved", value: stats?.approved ?? 0, color: "text-green-400" },
    { label: "Waitlisted", value: stats?.waitlisted ?? 0, color: "text-yellow-400" },
    { label: "Rejected", value: stats?.rejected ?? 0, color: "text-red-400" },
    { label: "Active Passes", value: stats?.totalPasses ?? 0, color: "text-purple-400" },
    { label: "Day 1 Check-ins", value: stats?.day1Checkins ?? 0, color: "text-zinc-300" },
    { label: "Day 2 Check-ins", value: stats?.day2Checkins ?? 0, color: "text-zinc-300" },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Welcome, {session.user?.name || session.user?.email}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="glass-card p-5">
              <p className="text-sm text-zinc-500">{card.label}</p>
              <p className={`mt-1 text-3xl font-bold ${card.color}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Approved by Category
            </h2>
            {stats?.byCategory && stats.byCategory.length > 0 ? (
              <ul className="space-y-2">
                {stats.byCategory.map((c) => (
                  <li
                    key={c.audienceCategory}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-zinc-400">{c.audienceCategory}</span>
                    <span className="text-white font-medium">{c._count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500">No approved requests yet.</p>
            )}
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-3">
              <Link
                href="/admin/requests"
                className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm text-purple-300 hover:bg-purple-500/20 transition"
              >
                Review Invitation Requests →
              </Link>
              <Link
                href="/admin/speakers"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 hover:bg-white/10 transition"
              >
                Manage Speakers →
              </Link>
              <Link
                href="/admin/settings"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 hover:bg-white/10 transition"
              >
                Event Settings →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Speakers</h2>
          <p className="text-sm text-zinc-400">
            {stats?.confirmedSpeakers ?? 0} confirmed / {stats?.totalSpeakers ?? 0} total
          </p>
        </div>
      </main>
    </div>
  );
}
