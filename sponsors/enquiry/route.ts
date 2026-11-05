import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendTemplateEmail, isEmailConfigured } from "@/lib/email";

const schema = z.object({
  companyName: z.string().min(1).max(150),
  contactPerson: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional().nullable(),
  interestedCategory: z.string().max(100).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const data = parsed.data;

    await prisma.sponsorEnquiry.create({
      data: {
        companyName: data.companyName.trim(),
        contactPerson: data.contactPerson.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone || null,
        interestedCategory: data.interestedCategory || null,
        message: data.message || null,
        status: "New",
      },
    });

    if (isEmailConfigured()) {
      sendTemplateEmail("sponsor_enquiry_received", data.email, {
        contact_person: data.contactPerson,
        company_name: data.companyName,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sponsor enquiry error:", error);
    return NextResponse.json({ error: "Unable to submit enquiry" }, { status: 500 });
  }
}
