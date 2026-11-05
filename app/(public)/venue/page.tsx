import Link from "next/link";

export default function VenuePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center mb-12">
        <span className="badge-invite mb-4 inline-block">Invitation Only</span>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Venue</h1>
      </div>

      <div className="glass-card p-8 mb-8">
        <h2 className="text-2xl font-semibold text-white">ITC Gardenia</h2>
        <p className="mt-2 text-zinc-400">
          1, Residency Road, Ashok Nagar, Bengaluru, Karnataka – 560025
        </p>
        <p className="mt-1 text-sm text-purple-300">
          Proposed hall: Mysore Hall
        </p>
        <p className="mt-4 text-sm text-zinc-500">
          Luxury five-star hotel · Corporate conference and round table setup
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mb-8">
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-3">Facilities</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>• Conference hall</li>
            <li>• Audio-visual equipment</li>
            <li>• Catering</li>
            <li>• Guest hospitality</li>
            <li>• Networking areas</li>
          </ul>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-3">Timing</h3>
          <p className="text-sm text-zinc-400">
            Daily: 9:30 AM – 4:00 PM (IST)
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            22–23 January 2027 (proposed)
          </p>
        </div>
      </div>

      <div className="glass-card p-6 mb-8">
        <h3 className="font-semibold text-white mb-3">Location</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Centrally located on Residency Road, Ashok Nagar, Bengaluru.
        </p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=ITC+Gardenia+Bengaluru"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-glow-outline text-sm inline-block"
        >
          Open in Google Maps
        </a>
      </div>

      <p className="text-center text-xs text-zinc-600 mb-8">
        Final hall, capacity, layout and availability are subject to hotel confirmation.
      </p>

      <div className="text-center">
        <Link href="/request-invitation" className="btn-glow">
          Request Invitation
        </Link>
      </div>
    </div>
  );
}
