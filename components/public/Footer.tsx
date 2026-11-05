import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/10 bg-black/50 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-white">
              THE CEO CONCLAVE <span className="text-purple-400">2027</span>
            </h3>
            <p className="mt-2 text-sm text-zinc-400 max-w-md">
              One Platform. Powerful Perspectives. An invitation-only two-day business leadership event in Bengaluru.
            </p>
            <div className="mt-4">
              <span className="badge-invite">Invitation Only</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/about" className="hover:text-purple-400">About</Link></li>
              <li><Link href="/speakers" className="hover:text-purple-400">Speakers</Link></li>
              <li><Link href="/agenda" className="hover:text-purple-400">Agenda</Link></li>
              <li><Link href="/request-invitation" className="hover:text-purple-400">Request Invitation</Link></li>
              <li><Link href="/request-status" className="hover:text-purple-400">Check Status</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/privacy" className="hover:text-purple-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-purple-400">Terms & Conditions</Link></li>
              <li><Link href="/contact" className="hover:text-purple-400">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-purple-500/10 pt-6 text-center text-xs text-zinc-500">
          <p>
            Dates, venue, speakers and sponsorships are proposed and subject to confirmation.
          </p>
          <p className="mt-2">
            © 2026–2027 THE CEO CONCLAVE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
