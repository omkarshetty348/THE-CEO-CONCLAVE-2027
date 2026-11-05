import { Resend } from "resend";
import prisma from "./prisma";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export function isEmailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  templateKey,
  metadata,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  templateKey?: string;
  metadata?: Record<string, any>;
}) {
  if (!resend || !isEmailConfigured()) {
    console.warn("Email not configured. Skipping send to", to);
    await prisma.emailLog.create({
      data: {
        toEmail: to,
        subject,
        templateKey,
        status: "failed",
        error: "Email service not configured (missing RESEND_API_KEY or RESEND_FROM_EMAIL)",
        metadata: metadata || {},
      },
    });
    return { success: false, error: "Email not configured" };
  }

  try {
    const from = `${process.env.RESEND_FROM_NAME || "THE CEO CONCLAVE 2027"} <${process.env.RESEND_FROM_EMAIL}>`;

    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    await prisma.emailLog.create({
      data: {
        toEmail: to,
        subject,
        templateKey,
        status: "sent",
        resendId: result.data?.id || null,
        metadata: metadata || {},
      },
    });

    return { success: true, id: result.data?.id };
  } catch (error: any) {
    console.error("Email send error:", error);
    await prisma.emailLog.create({
      data: {
        toEmail: to,
        subject,
        templateKey,
        status: "failed",
        error: error?.message || "Unknown error",
        metadata: metadata || {},
      },
    });
    return { success: false, error: error?.message };
  }
}

export function replaceVariables(
  template: string,
  vars: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), value || "");
  }
  return result;
}

export async function sendTemplateEmail(
  templateKey: string,
  to: string,
  variables: Record<string, string>
) {
  const template = await prisma.emailTemplate.findUnique({
    where: { key: templateKey },
  });

  if (!template || !template.isActive) {
    return { success: false, error: `Template ${templateKey} not found or inactive` };
  }

  const subject = replaceVariables(template.subject, variables);
  const html = replaceVariables(template.bodyHtml, variables);

  return sendEmail({
    to,
    subject,
    html,
    templateKey,
    metadata: { variables },
  });
}
