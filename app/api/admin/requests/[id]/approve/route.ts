import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, hasPermission } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generatePassNumber, generateToken } from "@/lib/utils";
import { generateQRDataUrl, createVerificationToken } from "@/lib/qr";
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
    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.invitationRequest.findUnique({
        where: { id },
      });

      if (!request) {
        throw new Error("Request not found");
      }

      if (request.status !== "Pending") {
        throw new Error("Request is not pending");
      }

      // Optional hard capacity check
      const event = await tx.event.findFirst();
      if (event?.hardCapacityLimit) {
        const approvedCount = await tx.invitationRequest.count({
          where: { status: "Approved" },
        });
        if (approvedCount >= event.capacityLimit) {
          throw new Error(
            `Hard capacity limit of ${event.capacityLimit} reached. Enable more capacity or turn off the limit.`
          );
        }
      }

      // Find SPOC contact for this category
      const assignment = await tx.contactAssignment.findFirst({
        where: { audienceCategory: request.audienceCategory },
        include: { contact: true },
      });

      const verificationToken = createVerificationToken();
      const passNumber = generatePassNumber();
      const registrationId = `REG-${generateToken(8).toUpperCase()}`;

      let qrCodeDataUrl: string | null = null;
      try {
        qrCodeDataUrl = await generateQRDataUrl(verificationToken);
      } catch (e) {
        console.warn("QR generation failed, continuing without data URL", e);
      }

      // Update request status
      await tx.invitationRequest.update({
        where: { id },
        data: {
          status: "Approved",
          reviewedAt: new Date(),
          reviewedById: (session.user as any).id,
        },
      });

      // Create pass
      const pass = await tx.pass.create({
        data: {
          requestId: id,
          registrationId,
          passNumber,
          verificationToken,
          qrCodeDataUrl,
          daysApproved: request.daysAttending,
          status: "Active",
          contactId: assignment?.contact?.id || null,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: (session.user as any).id,
          action: "APPROVE",
          entity: "InvitationRequest",
          entityId: id,
          details: {
            passNumber,
            registrationId,
            daysApproved: request.daysAttending,
          },
        },
      });

      return { request, pass, contact: assignment?.contact || null };
    });

    // Send approval email (outside transaction)
    if (isEmailConfigured()) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
      const passUrl = `${appUrl}/pass/${result.pass.verificationToken}`;

      sendTemplateEmail("request_approved", result.request.email, {
        attendee_name: result.request.fullName,
        pass_number: result.pass.passNumber,
        registration_id: result.pass.registrationId,
        days_approved: result.pass.daysApproved,
        pass_url: passUrl,
        contact_name: result.contact?.name || "Event Team",
        contact_phone: result.contact?.phone || result.contact?.whatsapp || "",
        contact_email: result.contact?.email || "",
        event_name: "THE CEO CONCLAVE 2027",
        event_date: "22–23 January 2027",
        event_venue: "ITC Gardenia, Bengaluru",
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      passNumber: result.pass.passNumber,
      registrationId: result.pass.registrationId,
    });
  } catch (error: any) {
    console.error("Approve error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to approve request" },
      { status: 400 }
    );
  }
}
