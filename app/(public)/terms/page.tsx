export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-white mb-8">Terms and Conditions</h1>
      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-zinc-400">
        <p>
          By submitting an invitation request or attending THE CEO CONCLAVE 2027, you agree to these terms.
        </p>
        <h2 className="text-lg font-semibold text-white">Invitation only</h2>
        <p>
          Entry is by invitation only. Submitting a request does not guarantee approval. The organisers reserve the right to approve, waitlist or reject any request.
        </p>
        <h2 className="text-lg font-semibold text-white">Proposed details</h2>
        <p>
          Dates, venue, speakers, sponsorships and attendance targets are proposed and subject to confirmation. The organisers may change the programme without prior notice.
        </p>
        <h2 className="text-lg font-semibold text-white">Conduct</h2>
        <p>
          Attendees must behave professionally. Business discussions are confidential. Photography and media coverage are subject to individual consent.
        </p>
        <h2 className="text-lg font-semibold text-white">Passes and check-in</h2>
        <p>
          Approved attendees receive a digital pass with a unique QR code. The pass is non-transferable. Check-in is recorded per day. Misuse of passes may result in cancellation.
        </p>
        <h2 className="text-lg font-semibold text-white">Liability</h2>
        <p>
          The organisers are not liable for changes to the programme, cancellation of the event, or any loss arising from attendance, except as required by applicable law.
        </p>
        <p className="text-xs text-zinc-600 pt-4">
          These terms are editable from the admin dashboard. Last updated: 2026.
        </p>
      </div>
    </div>
  );
}
