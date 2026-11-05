import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DigitalPassPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let pass: any = null;
  try {
    pass = await prisma.pass.findUnique({
      where: { verificationToken: token },
      include: {
        request: true,
        contact: true,
      },
    });
  } catch {
    notFound();
  }

  if (!pass || pass.status !== "Active") {
    notFound();
  }

  const attendee = pass.request;
  const contact = pass.contact;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-widest text-purple-400">
            Digital Invitation Pass
          </p>
          <h1 className="mt-1 text-xl font-bold text-white">
            THE CEO CONCLAVE 2027
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            One Platform. Powerful Perspectives.
          </p>
        </div>

        <div className="glass-card overflow-hidden">
          {/* Header band */}
          <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-6 py-4 border-b border-purple-500/20">
            <p className="text-xs text-zinc-400">Pass Number</p>
            <p className="font-mono text-lg text-white">{pass.passNumber}</p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs text-zinc-500">Attendee</p>
              <p className="text-lg font-semibold text-white">{attendee.fullName}</p>
              <p className="text-sm text-zinc-400">
                {attendee.designation}, {attendee.organisation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-zinc-500">Category</p>
                <p className="text-white">{attendee.audienceCategory}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Days</p>
                <p className="text-white">{pass.daysApproved}</p>
              </div>
            </div>

            <div className="text-sm">
              <p className="text-xs text-zinc-500">Event</p>
              <p className="text-white">22–23 January 2027</p>
              <p className="text-zinc-400">ITC Gardenia, Bengaluru</p>
              <p className="text-zinc-500 text-xs">9:30 AM – 4:00 PM IST</p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center pt-4 border-t border-white/10">
              {pass.qrCodeDataUrl ? (
                <img
                  src={pass.qrCodeDataUrl}
                  alt="QR Code"
                  className="w-48 h-48 rounded-lg bg-white p-2"
                />
              ) : (
                <div className="w-48 h-48 rounded-lg bg-white/10 flex items-center justify-center text-zinc-500 text-sm">
                  QR unavailable
                </div>
              )}
              <p className="mt-2 text-xs text-zinc-500 text-center">
                Present this QR code at the venue for entry
              </p>
              <p className="mt-1 text-[10px] text-zinc-600 font-mono">
                {pass.registrationId}
              </p>
            </div>

            {contact && (
              <div className="pt-4 border-t border-white/10 text-sm">
                <p className="text-xs text-zinc-500">Your Organiser Contact</p>
                <p className="text-white">{contact.name}</p>
                <p className="text-zinc-400">{contact.role}</p>
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-green-400 hover:underline"
                  >
                    WhatsApp: {contact.whatsapp}
                  </a>
                )}
                {contact.phone && (
                  <p className="text-xs text-zinc-500 mt-1">Phone: {contact.phone}</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-zinc-950/80 px-6 py-3 text-center">
            <p className="text-[10px] text-zinc-600">
              Invitation only · Participant privacy must be respected · 
              Dates and venue subject to confirmation
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-white">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
