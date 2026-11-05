import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  referenceId: z.string().min(5),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const referenceId = parsed.data.referenceId.trim().toUpperCase();

    const request = await prisma.invitationRequest.findFirst({
      where: { email, referenceId },
      include: { pass: true },
    });

    if (!request) {
      return NextResponse.json(
        { error: "No request found with this email and reference ID." },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

    return NextResponse.json({
      fullName: request.fullName,
      referenceId: request.referenceId,
      status: request.status,
      daysAttending: request.daysAttending,
      passNumber: request.pass?.passNumber || null,
      passUrl:
        request.pass && request.status === "Approved"
          ? `${appUrl}/pass/${request.pass.verificationToken}`
          : null,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Unable to check status. Please try again." },
      { status: 500 }
    );
  }
}
