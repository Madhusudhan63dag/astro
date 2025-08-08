import React from 'react'

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 relative overflow-hidden">
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-black/60 backdrop-blur-md rounded-2xl p-8 lg:p-12 border border-gray-700/50">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-center">
            Disclaimer
          </h1>
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              Sri Astro Veda wants to make it clear that our astrologers put their best efforts in providing the service that you have ordered but any prediction that you receive from us is not to be considered as a substitute for advice, program, or treatment that you would normally receive from a licensed professional such as a lawyer, doctor, psychiatrist, or financial adviser.
            </p>
            <p>
              The services are provided as-is and Sri Astro Veda provides no guarantees, implied warranties, or assurances of any kind, and will not be responsible for any interpretation made or use by the recipient of the information and data mentioned above.
            </p>
            <p>
              If you are not comfortable with this information, please do not use it. By the grace of God, our astrologers can only try to give their best and hope that the efforts will improve your life.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Disclaimer