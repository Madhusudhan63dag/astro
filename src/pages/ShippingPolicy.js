import React from 'react'

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 relative overflow-hidden">
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-black/60 backdrop-blur-md rounded-2xl p-8 lg:p-12 border border-gray-700/50">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-center">Shipping & Delivery Policy</h1>

          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              This Shipping & Delivery Policy applies to all digital astrology products and services purchased from SriAstroVeda ("we", "our", "us"). Our reports and consultations are delivered digitally and no physical shipment is involved.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">1. Nature of Delivery</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All offerings (reports, analyses, consultations) are delivered digitally via email and/or WhatsApp.</li>
              <li>No physical shipping or courier services are used.</li>
              <li>Delivery is considered complete when the report is sent to the email/phone number provided at checkout.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">2. Processing Time</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Standard processing time: typically within 12–24 hours after successful payment.</li>
              <li>Complex services may take up to 48 hours. You will be notified in case of delays.</li>
              <li>Orders placed during weekends/holidays may be processed on the next business day.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">3. Delivery Channels</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: We send the report to the email address provided.</li>
              <li>WhatsApp (when applicable): We may share download links or PDFs to your provided number.</li>
              <li>Please ensure your email inbox is not full and check Spam/Promotions folders.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">4. Order Confirmation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>After payment, you’ll receive a confirmation with your order/transaction ID.</li>
              <li>Keep this ID safe for any delivery support or follow‑up.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">5. Failed or Delayed Delivery</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>If you don’t receive your report within the stated timeframe, contact us with your name, email, phone, and order ID.</li>
              <li>Common causes: incorrect email/phone, email filters, inbox full, network issues.</li>
              <li>We will promptly re‑send the report after verification.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">6. Incorrect Details Provided</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for providing accurate email and phone details.</li>
              <li>For corrections, contact us as soon as possible. If the report is already delivered, changes may be treated as a revision request and handled case‑by‑case.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">7. File Format & Access</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reports are shared as PDF or equivalent read‑only formats.</li>
              <li>Ensure you have a compatible PDF reader installed.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">8. Urgent Requests</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>If you need expedited delivery, contact support before purchase. We’ll confirm feasibility and timelines.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">9. Refunds & Cancellations</h2>
            <p>
              Our refunds/cancellations are governed by our Cancellation & Refund Policy and Terms of Service. Please review those pages for details.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">10. Support</h2>
            <p>
              For delivery issues or assistance, write to <span className="text-yellow-400">customercareproductcenter@gmail.com</span> with your order ID. We aim to respond promptly.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">11. Updates to this Policy</h2>
            <p>
              We may update this Shipping & Delivery Policy from time to time. Changes will be posted on this page and are effective upon posting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingPolicy
