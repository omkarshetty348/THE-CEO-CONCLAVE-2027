import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Allow login and setup without session
  // For other admin routes we check session in the page or middleware

  return (
    <div className="min-h-screen bg-black text-white">
      {children}
    </div>
  );
}
