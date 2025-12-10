import React from 'react';
import { useTranslation } from 'react-i18next';

// Import your cow shelter images
import cowImage1 from '../assets/cow-shelter-1.jpg';
import cowImage2 from '../assets/cow-shelter-2.jpg';
import cowImage3 from '../assets/cow-shelter-3.jpg';

const GoshalaCharitySection = () => {
  const { t } = useTranslation();

  const spiritualBenefits = [
    {
      title: "Sacred Service (Seva)",
      description: "Supporting cow welfare is considered a highly meritorious act in Vedic tradition",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    },
    {
      title: "Positive Karma",
      description: "Your contribution generates positive spiritual energy and blessings",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Divine Protection",
      description: "Cow protection is believed to bring divine grace and planetary blessings",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-300 mb-4">
            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <span className="text-orange-700 font-semibold text-sm">Your Seva (Selfless Service)</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 mb-4">
            Your Purchase Serves a Sacred Purpose
          </h2>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            When you invest <span className="font-bold text-orange-600">₹499</span> in your Divine Kundali Report, 
            you're not just receiving spiritual guidance—you're also supporting cow welfare and spiritual initiatives.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Image Gallery */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-300/30 via-amber-300/30 to-yellow-300/30 rounded-3xl blur-2xl"></div>
            
            <div className="relative grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <img 
                  src={cowImage1} 
                  alt="Cow shelter with peaceful cows grazing"
                  className="w-full h-64 object-cover rounded-2xl shadow-2xl border-4 border-white"
                />
              </div>
              <img 
                src={cowImage2} 
                alt="Volunteers feeding cows in shelter"
                className="w-full h-48 object-cover rounded-2xl shadow-xl border-4 border-white"
              />
              <img 
                src={cowImage3} 
                alt="Well-maintained cow shelter facility"
                className="w-full h-48 object-cover rounded-2xl shadow-xl border-4 border-white"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white px-6 py-4 rounded-2xl shadow-2xl border-4 border-white">
              <div className="text-3xl font-bold">₹499</div>
              <div className="text-sm font-medium">Includes Goshala Seva</div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white">
                  🐄
                </span>
                How Your Contribution Helps
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Cow Shelter Support</h4>
                    <p className="text-gray-700 text-sm">Your payment directly supports the maintenance, feeding, and medical care of cows in our partner Goshalas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Spiritual Activities</h4>
                    <p className="text-gray-700 text-sm">Funding for daily prayers, rituals, and spiritual programs that benefit the community</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Expert Astrology Service</h4>
                    <p className="text-gray-700 text-sm">Receive your comprehensive 200+ page Kundali report prepared by experienced Vedic astrologers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">100% Transparent</div>
                  <p className="text-gray-700 text-sm">Every rupee is accounted for and used for the stated purposes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spiritual Benefits Cards */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Spiritual Benefits of Your Contribution
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {spiritualBenefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What You Receive Section */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
          <div className="text-center mb-10">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              What You Receive
            </h3>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              A comprehensive spiritual package combining divine wisdom with charitable service
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">200+ Page Kundali Report</h4>
                  <p className="text-purple-200 text-sm">Detailed birth chart, planetary analysis, life predictions, and personalized remedies</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Goshala Contribution</h4>
                  <p className="text-purple-200 text-sm">Direct support for cow welfare, feeding, medical care, and spiritual activities</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">24-Hour Delivery</h4>
                  <p className="text-purple-200 text-sm">Receive your detailed PDF report via WhatsApp or email within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Spiritual Merit</h4>
                  <p className="text-purple-200 text-sm">Blessings from supporting sacred cow welfare and spiritual initiatives</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="inline-block bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-1 rounded-2xl shadow-2xl">
            <div className="bg-white rounded-xl px-8 py-6">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                Your Spiritual Journey Begins at ₹499
              </p>
              <p className="text-gray-700">
                Gain divine insights while serving a sacred cause
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoshalaCharitySection;
