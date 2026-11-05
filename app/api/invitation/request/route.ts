import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { generateReferenceId } from "@/lib/utils";
import { sendTemplateEmail, isEmailConfigured } from "@/lib/email";

const schema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(150),
  mobile: z.string().min(8).max(20),
  organisation: z.string().min(1).max(150),
  designation: z.string().min(1).max(100),
  audienceCategory: z.string().min(1),
  city: z.string().max(100).optional().nullable(),
  daysAttending: z.enum(["Day 1", "Day 2", "Both"]),
  linkedinUrl: z.string().url().optional().or(z.literal("")).nullable(),
  whyAttend: z.string().max(1000).optional().nullable(),
  studentIdOrCollege: z.string().max(150).optional().nullable(),
  privacyConsent: z.boolean().refine((v) => v === true, "Privacy consent required"),
  termsConsent: z.boolean().refine((v) => v === true, "Terms consent required"),
  mediaConsent: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const email = data.email.toLowerCase().trim();

    // Duplicate check: one active request per email
    const existing = await prisma.invitationRequest.findFirst({
      where: {
        email,
        status: { in: ["Pending", "Approved", "Waitlisted"] },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "An active invitation request already exists for this email. Please check your status or contact the organisers.",
        },
        { status: 409 }
      );
    }

    const referenceId = generateReferenceId();

    const request = await prisma.invitationRequest.create({
      data: {
        referenceId,
        fullName: data.fullName.trim(),
        email,
        mobile: data.mobile.trim(),
        organisation: data.organisation.trim(),
        designation: data.designation.trim(),
        audienceCategory: data.audienceCategory,
        city: data.city?.trim() || null,
        daysAttending: data.daysAttending,
        linkedinUrl: data.linkedinUrl || null,
        whyAttend: data.whyAttend || null,
        studentIdOrCollege: data.studentIdOrCollege || null,
        privacyConsent: data.privacyConsent,
        termsConsent: data.termsConsent,
        mediaConsent: data.mediaConsent || false,
        status: "Pending",
      },
    });

    // Send confirmation email (non-blocking)
    if (isEmailConfigured()) {
      sendTemplateEmail("request_received", email, {
        attendee_name: data.fullName,
        reference_id: referenceId,
        event_name: "THE CEO CONCLAVE 2027",
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      referenceId: request.referenceId,
      message:
        "Your invitation request has been received. You will receive a confirmation email shortly.",
    });
  } catch (error) {
    console.error("Invitation request error:", error);
    return NextResponse.json(
      { error: "Unable to process request. Please try again later." },
      { status: 500 }
    );
  }
}
