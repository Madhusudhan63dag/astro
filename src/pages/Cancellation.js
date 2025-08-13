import React from 'react'

const Cancellation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 relative overflow-hidden">
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-black/60 backdrop-blur-md rounded-2xl p-8 lg:p-12 border border-gray-700/50">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-center">Return, Refund & Cancellation Policy</h1>

          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              SriAstroVeda has a friendly return and refund policy to ensure your online purchase is free of stress. We offer a “100% Buyer Protection Program” for our valued customers. We are always with you, before your purchase and after your purchase. We are not perfect but we have ensured hard that our refund/return policies do not bring any ugly surprises to you post your purchase.
            </p>

            <p>
              By requesting a refund, the user agrees to provide SriAstroVeda’s Quality Audit team permission to access the recording of the consultation for which a refund has been requested, in order to determine whether the case is fit for refund.
            </p>

            <p>
              SriAstroVeda Quality Audit team’s decision on processing the refund is at the sole discretion of the team and such decision is final in nature. The Quality Audit team will, on a best efforts basis, provide refund to users in their SriAstroVeda Wallet wherever quality parameters have not been satisfied.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">What is SriAstroVeda Return Policy?</h2>
            <h3 className="text-xl font-semibold text-white mt-4">Service</h3>
            <p>Our “100% Buyer Protection Program” for service has the below mentioned refund & cancellation policy:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Any cancellation made within two hours of payment.</li>
              <li>No refund shall be made for incorrect data provided by the customer. However one can send correct information within two hours of order.</li>
              <li>Once the report is delivered to the customer no refund shall be made.</li>
              <li>In case of double payment made by mistake against the single order, one payment will be refunded.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">What to do if SriAstroVeda is not responding to the dispute?</h2>
            <p>
              Please allow 3 business days for us to address the issue and provide instructions for your return/resolution. If we do not respond even after 3 business days, or if your issue is not addressed to your satisfaction, you can submit the dispute by sending an email to <span className="text-yellow-400">sriastroveda@gmail.com</span> and we will ensure you get timely resolution to your dispute.
            </p>
           
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cancellation