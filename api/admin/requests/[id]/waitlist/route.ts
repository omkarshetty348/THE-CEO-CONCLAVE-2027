import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, hasPermission } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendTemplateEmail, isEmailConfigured } from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const permissions = (session.user as any).permissions || [];
  if (!hasPermission(permissions, "requests.review")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const request = await prisma.invitationRequest.findUnique({ where: { id } });
    if (!request || request.status !== "Pending") {
      return NextResponse.json({ error: "Request not found or not pending" }, { status: 400 });
    }

    await prisma.invitationRequest.update({
      where: { id },
      data: {
        status: "Waitlisted",
        reviewedAt: new Date(),
        reviewedById: (session.user as any).id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "WAITLIST",
        entity: "InvitationRequest",
        entityId: id,
      },
    });

    if (isEmailConfigured()) {
      sendTemplateEmail("request_waitlisted", request.email, {
        attendee_name: request.fullName,
        reference_id: request.referenceId,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
