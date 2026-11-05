import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendTemplateEmail, isEmailConfigured } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const data = parsed.data;

    await prisma.contactMessage.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        subject: data.subject || null,
        message: data.message.trim(),
        status: "New",
      },
    });

    if (isEmailConfigured()) {
      sendTemplateEmail("contact_form_ack", data.email, {
        name: data.name,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Unable to send message" }, { status: 500 });
  }
}
