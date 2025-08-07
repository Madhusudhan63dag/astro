import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = ({ 
  userName, 
  userEmail, 
  analysisData, 
  serviceAmount = "₹399",
  serviceFeatures = [],
  bgGradient = "from-indigo-900 via-purple-900 to-pink-900",
  onClose
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackToHome = () => {
    if (onClose) onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Full Screen Overlay */}
      <div className={`min-h-screen w-full bg-gradient-to-br ${bgGradient} relative`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-black/70 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-purple-500/30 shadow-2xl">
              <div className="text-center">
                {/* Success Animation */}
                <div className="relative mb-8">
                  <div className="w-28 h-28 md:w-32 md:h-32 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                    <svg className="w-14 h-14 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  {/* Celebration particles */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-ping absolute w-20 h-20 md:w-24 md:h-24 bg-green-400 rounded-full opacity-20"></div>
                    <div className="animate-ping absolute w-16 h-16 md:w-20 md:h-20 bg-emerald-400 rounded-full opacity-30 animation-delay-1000"></div>
                  </div>
                </div>

                {/* Thank You Message */}
                <div className="mb-8">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
                    🎉 {t('thank_you')} 
                    <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                      {userName}!
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-300 mb-6 animate-fade-in animation-delay-500">
                    {t('payment_successful') || "Payment Successful!"}
                  </p>
                </div>
                
                {/* Main Message Card */}
                
                {/* Delivery Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-400/30 rounded-xl p-6 animate-slide-up animation-delay-200">
                    <h3 className="text-lg font-semibold text-white mb-2">{t('delivery_time') || "Delivery Time"}</h3>
                    <p className="text-gray-300 text-sm">{t('within_12_hours') || "Within 12 Hours"}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl p-6 animate-slide-up animation-delay-400">
                    <h3 className="text-lg font-semibold text-white mb-2">{t('whatsapp_notification') || "WhatsApp"}</h3>
                    <p className="text-gray-300 text-sm">{t('instant_updates') || "Instant Updates"}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-6 animate-slide-up animation-delay-600">
                    <h3 className="text-lg font-semibold text-white mb-2">{t('email_delivery') || "Email"}</h3>
                    <p className="text-gray-300 text-sm break-all">{userEmail}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-up animation-delay-1000">
                  <button 
                    onClick={handleBackToHome}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  >
                    {t('back_to_home') || "Back to Home"}
                  </button>
                  
                  <a 
                    href="tel:+91 93922 77389"
                    className="px-8 py-4 text-purple-400 border-2 border-purple-400 hover:bg-purple-400 hover:text-white font-semibold rounded-xl text-center text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {t('contact_support') || "Contact Support"}
                  </a>
                </div>

                {/* Contact Information */}
                <div className="pt-6 border-t border-purple-500/30 animate-fade-in animation-delay-1200">
                  <p className="text-gray-400 mb-4 text-lg">
                    {t('need_help') || "Need help?"} {t('contact_us_at') || "Contact us at"}:
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm md:text-base">
                    <a 
                      href="mailto:customercareproductcenter@gmail.com" 
                      className="text-blue-400 hover:text-blue-300 transition-colors break-all"
                    >
                      customercareproductcenter@gmail.com
                    </a>
                    <span className="text-gray-600 hidden sm:inline">|</span>
                    <a 
                      href="tel:+919392277389" 
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      +91-93922 77389
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
