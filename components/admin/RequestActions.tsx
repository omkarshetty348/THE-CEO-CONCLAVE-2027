"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestActions({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "approve" | "waitlist" | "reject") => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/requests/${requestId}/${action}`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Action failed");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      alert("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-1.5">
      <button
        onClick={() => handleAction("approve")}
        disabled={loading}
        className="rounded px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => handleAction("waitlist")}
        disabled={loading}
        className="rounded px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 disabled:opacity-50"
      >
        Waitlist
      </button>
      <button
        onClick={() => handleAction("reject")}
        disabled={loading}
        className="rounded px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
