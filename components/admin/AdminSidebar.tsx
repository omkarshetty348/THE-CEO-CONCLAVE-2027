"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Mic2,
  Calendar,
  Handshake,
  Ticket,
  Settings,
  LogOut,
  Mail,
  QrCode,
  FileText,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/requests", label: "Invitation Requests", icon: Users },
  { href: "/admin/passes", label: "Passes", icon: Ticket },
  { href: "/admin/speakers", label: "Speakers", icon: Mic2 },
  { href: "/admin/agenda", label: "Agenda", icon: Calendar },
  { href: "/admin/sponsors", label: "Sponsors", icon: Handshake },
  { href: "/admin/checkin", label: "QR Check-in", icon: QrCode },
  { href: "/admin/emails", label: "Emails", icon: Mail },
  { href: "/admin/settings", label: "Event Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-purple-500/10 bg-zinc-950/90 backdrop-blur">
      <div className="flex h-full flex-col">
        <div className="border-b border-purple-500/10 px-5 py-4">
          <Link href="/admin" className="text-lg font-bold text-white">
            CEO<span className="text-purple-400">CONCLAVE</span>
          </Link>
          <p className="text-xs text-zinc-500 mt-0.5">Admin Dashboard</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-purple-500/15 text-purple-300"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-purple-500/10 p-3">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
