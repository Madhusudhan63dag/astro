import React from 'react'

const Cancellation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 relative overflow-hidden">
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-black/60 backdrop-blur-md rounded-2xl p-8 lg:p-12 border border-gray-700/50">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-center">
            Cancellation & Refund Policy – Astrology Services
          </h1>

          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              We aim to provide accurate, timely, and personalized astrological guidance.
              Since our services are customized for each client, certain limitations apply to
              cancellations and refunds. Please read carefully before booking.
            </p>

            <hr className="border-gray-700" />

            <h2 className="text-2xl font-semibold text-white mt-8">1. Nature of Services</h2>
            <p>
              All astrology reports, consultations, and predictions are prepared specifically
              for you, based on your birth details and questions. Due to this personalized
              nature, changes, cancellations, and refunds are restricted.
            </p>

            <hr className="border-gray-700" />

            <h2 className="text-2xl font-semibold text-white mt-8">2. Cancellation Policy</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">Before Service Begins:</span> You may request a cancellation within 2 hours of placing your order if our team has not yet started working on your report or consultation. A full refund will be issued in such cases.
              </li>
              <li>
                <span className="font-semibold">After Service Has Started:</span> Once your report preparation, chart analysis, or consultation scheduling has commenced, no cancellation or refund will be possible.
              </li>
              <li>
                <span className="font-semibold">For Live Consultations:</span> If you cannot attend your scheduled session, inform us at least 24 hours in advance to reschedule. Missed appointments without prior notice will be considered completed, with no refund.
              </li>
            </ul>

            <hr className="border-gray-700" />

            <h2 className="text-2xl font-semibold text-white mt-8">3. Refund Policy</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">Eligibility for Refunds:</span> Refunds are only applicable if:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>A cancellation request is made within the allowed time before work starts.</li>
                  <li>The service cannot be delivered due to our technical or operational issues.</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Non-Refundable Cases:</span>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Dissatisfaction with the interpretation, predictions, or guidance (as astrology is a matter of faith and personal belief).</li>
                  <li>Incorrect or incomplete details provided by the client.</li>
                  <li>Missed consultation slots without prior notice.</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Mode of Refund:</span> Approved refunds will be processed through the original payment method within 7–10 working days.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cancellation
