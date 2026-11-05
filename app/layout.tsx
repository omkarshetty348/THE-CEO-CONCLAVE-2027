import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "THE CEO CONCLAVE 2027 | One Platform. Powerful Perspectives.",
    template: "%s | THE CEO CONCLAVE 2027",
  },
  description:
    "An exclusive two-day business leadership event bringing together prominent CEOs, entrepreneurs and industry experts in Bengaluru. Invitation only.",
  openGraph: {
    title: "THE CEO CONCLAVE 2027",
    description: "One Platform. Powerful Perspectives. Invitation-only leadership summit in Bengaluru.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

