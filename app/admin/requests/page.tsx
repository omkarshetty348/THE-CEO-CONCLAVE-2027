import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import RequestActions from "@/components/admin/RequestActions";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const params = await searchParams;
  const statusFilter = params.status || "Pending";
  const search = params.q || "";

  let requests: any[] = [];
  try {
    requests = await prisma.invitationRequest.findMany({
      where: {
        ...(statusFilter !== "All" ? { status: statusFilter } : {}),
        ...(search
          ? {
              OR: [
                { fullName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { referenceId: { contains: search, mode: "insensitive" } },
                { organisation: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { pass: true },
    });
  } catch {
    requests = [];
  }

  const statuses = ["Pending", "Approved", "Waitlisted", "Rejected", "All"];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Invitation Requests</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Review and approve attendees
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {statuses.map((s) => (
            <a
              key={s}
              href={`/admin/requests?status=${s}${search ? `&q=${search}` : ""}`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === s
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              {s}
            </a>
          ))}
        </div>

        <form className="mb-6">
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Search name, email, reference ID..."
            className="w-full max-w-md rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none"
          />
        </form>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-zinc-500">
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Organisation</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Days</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                      No requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-purple-300">
                        {req.referenceId}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white">{req.fullName}</div>
                        <div className="text-xs text-zinc-500">{req.email}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {req.organisation}
                        <div className="text-xs text-zinc-600">{req.designation}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">
                        {req.audienceCategory}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{req.daysAttending}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            req.status === "Approved"
                              ? "badge-confirmed"
                              : req.status === "Pending"
                              ? "badge-pending"
                              : "badge-proposed"
                          }
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {req.status === "Pending" && (
                          <RequestActions requestId={req.id} />
                        )}
                        {req.status === "Approved" && req.pass && (
                          <span className="text-xs text-zinc-500 font-mono">
                            {req.pass.passNumber}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
