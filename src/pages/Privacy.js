import React from 'react'

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 relative overflow-hidden">
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-black/60 backdrop-blur-md rounded-2xl p-8 lg:p-12 border border-gray-700/50">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-center">Privacy Policy</h1>
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">

            <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Details:</strong> Name, email address, phone number.</li>
              <li><strong>Birth Details:</strong> Date, time, and place of birth (required for accurate astrology readings).</li>
              <li><strong>Payment Information:</strong> Processed securely via trusted payment gateways — we do not store your credit/debit card details.</li>
              <li><strong>Communication Records:</strong> Emails, WhatsApp chats, or messages related to your queries and orders.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Prepare and deliver personalized astrology reports.</li>
              <li>Communicate order updates and service information.</li>
              <li>Provide customer support and respond to your queries.</li>
              <li>Improve our website, services, and customer experience.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white">3. Confidentiality of Astrology Reports</h2>
            <p>
              All reports are strictly confidential and shared only with you. We will never publish, sell, or share your astrology data without your explicit consent.
            </p>

            <h2 className="text-2xl font-semibold text-white">4. Data Security</h2>
            <p>
              We use secure servers, encrypted connections, and trusted payment processors to protect your data. While we take every precaution, no online transmission is 100% secure, and you share data at your own risk.
            </p>

            <h2 className="text-2xl font-semibold text-white">5. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted here with the updated date.
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
