import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Thank = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get payment success data from sessionStorage
    const storedData = sessionStorage.getItem('paymentSuccess');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPaymentData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing payment data:', error);
        navigate('/');
      }
    } else {
      // No payment data, redirect to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  }, [navigate]);

  const handleBackToHome = () => {
    // Clear payment data from sessionStorage
    sessionStorage.removeItem('paymentSuccess');
    navigate('/');
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hi, I just completed payment for ${paymentData?.service || 'Astrology Service'}. Order ID: ${paymentData?.orderId || 'N/A'}. Looking forward to receiving my report.`
    );
    window.open(`https://wa.me/919392277389?text=${message}`, '_blank');
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  // If no payment data, show error message
  if (!paymentData) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Payment Data Not Found</h1>
          <p className="mb-4">Redirecting to home...</p>
          <button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg">
            Go Home Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Full Screen Overlay */}
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          
          {/* Floating Stars */}
          <div className="absolute top-20 left-20 text-yellow-400 text-2xl animate-bounce">⭐</div>
          <div className="absolute top-40 right-32 text-yellow-400 text-xl animate-bounce" style={{animationDelay: '0.5s'}}>✨</div>
          <div className="absolute bottom-32 left-32 text-yellow-400 text-lg animate-bounce" style={{animationDelay: '1s'}}>🌟</div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-5xl mx-auto">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-cyan-500/30 shadow-2xl">
              
              {/* Success Animation Header */}
              <div className="text-center mb-12">
                <div className="relative mb-8">
                  <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
                    <svg className="w-16 h-16 md:w-20 md:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  
                  {/* Celebration particles */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-ping absolute w-28 h-28 md:w-36 md:h-36 bg-green-400 rounded-full opacity-20"></div>
                    <div className="animate-ping absolute w-20 h-20 md:w-28 md:h-28 bg-emerald-400 rounded-full opacity-30" style={{animationDelay: '1s'}}></div>
                  </div>
                </div>

                {/* Thank You Message */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 animate-fade-in">
                  🎉 {t('payment_successful', 'Payment Successful')}!
                </h1>
                
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      Thank You, {paymentData.customerName || 'Valued Customer'}!
                    </span>
                  </h2>
                  <p className="text-xl text-slate-300">
                    Your {paymentData.service || 'astrology report'} order has been confirmed
                  </p>
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                  <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
                  </svg>
                  Order Summary
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                      <span className="text-slate-400">Service:</span>
                      <span className="text-white font-semibold">{paymentData.service || 'Astrology Report'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                      <span className="text-slate-400">Amount Paid:</span>
                      <span className="text-green-400 font-bold text-xl">{paymentData.amount || '₹599'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                      <span className="text-slate-400">Payment ID:</span>
                      <span className="text-cyan-400 font-mono text-sm">{paymentData.paymentId || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                      <span className="text-slate-400">Order ID:</span>
                      <span className="text-cyan-400 font-mono text-sm">{paymentData.orderId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-green-400 font-semibold uppercase">{paymentData.status || 'Completed'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-white text-sm break-all">{paymentData.customerEmail || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('delivery_time', 'Delivery Time')}</h3>
                  <p className="text-green-300 font-medium">Within 24 Hours</p>
                  <p className="text-slate-400 text-sm mt-1">High Priority Processing</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('email_delivery', 'Email Delivery')}</h3>
                  <p className="text-blue-300 font-medium">PDF Report</p>
                  <p className="text-slate-400 text-sm mt-1 break-all">{paymentData.customerEmail || 'Your Email'}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('whatsapp_notification', 'WhatsApp')}</h3>
                  <p className="text-purple-300 font-medium">Instant Updates</p>
                  <p className="text-slate-400 text-sm mt-1">Live Progress Tracking</p>
                </div>
              </div>

              {/* Service Features */}
              {paymentData.serviceFeatures && paymentData.serviceFeatures.length > 0 && (
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">What You'll Receive</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentData.serviceFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                          <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-slate-200">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button 
                  onClick={handleBackToHome}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  {t('back_to_home', 'Back to Home')}
                </button>
                
                <button 
                  onClick={handleWhatsAppContact}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  WhatsApp Us
                </button>
                
              </div>

              {/* Contact Information */}
              <div className="pt-8 border-t border-slate-700/50 text-center">
                <div className="bg-slate-800/40 rounded-xl p-6">
                  <h4 className="text-white text-xl font-semibold mb-4">Need Help?</h4>
                  <p className="text-slate-300 mb-4">
                    Our support team is here to assist you 24/7
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm md:text-base">
                    <a 
                      href="mailto:customercareproductcenter@gmail.com" 
                      className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      customercareproductcenter@gmail.com
                    </a>
                    <span className="text-slate-600 hidden sm:inline">•</span>

                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center mt-8">
                <p className="text-slate-400 text-sm">
                  🙏 Thank you for choosing SriAstroVeda. Your spiritual journey matters to us!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Thank;


// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';

// const Thank = ({ 
//   userName, 
//   userEmail, 
//   analysisData, 
//   serviceAmount = "₹399",
//   serviceFeatures = [],
//   bgGradient = "from-indigo-900 via-purple-900 to-pink-900",
//   onClose
// }) => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const handleBackToHome = () => {
//     if (onClose) onClose();
//     navigate('/');
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       {/* Full Screen Overlay */}
//       <div className={`min-h-screen w-full bg-gradient-to-br ${bgGradient} relative`}>
//         {/* Animated Background Elements */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
//         </div>

//         {/* Main Content */}
//         <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
//           <div className="w-full max-w-4xl mx-auto">
//             <div className="bg-black/70 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-purple-500/30 shadow-2xl">
//               <div className="text-center">
//                 {/* Success Animation */}
//                 <div className="relative mb-8">
//                   <div className="w-28 h-28 md:w-32 md:h-32 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
//                     <svg className="w-14 h-14 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
//                     </svg>
//                   </div>
//                   {/* Celebration particles */}
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="animate-ping absolute w-20 h-20 md:w-24 md:h-24 bg-green-400 rounded-full opacity-20"></div>
//                     <div className="animate-ping absolute w-16 h-16 md:w-20 md:h-20 bg-emerald-400 rounded-full opacity-30 animation-delay-1000"></div>
//                   </div>
//                 </div>

//                 {/* Thank You Message */}
//                 <div className="mb-8">
//                   <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
//                     🎉 {t('thank_you')} 
//                     <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
//                       {userName}!
//                     </span>
//                   </h1>
                  
//                   <p className="text-xl md:text-2xl text-gray-300 mb-6 animate-fade-in animation-delay-500">
//                     {t('payment_successful') || "Payment Successful!"}
//                   </p>
//                 </div>
                
//                 {/* Main Message Card */}
                
//                 {/* Delivery Information Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                   <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-400/30 rounded-xl p-6 animate-slide-up animation-delay-200">
//                     <h3 className="text-lg font-semibold text-white mb-2">{t('delivery_time') || "Delivery Time"}</h3>
//                     <p className="text-gray-300 text-sm">{t('within_12_hours') || "Within 12 Hours"}</p>
//                   </div>
                  
//                   <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl p-6 animate-slide-up animation-delay-400">
//                     <h3 className="text-lg font-semibold text-white mb-2">{t('whatsapp_notification') || "WhatsApp"}</h3>
//                     <p className="text-gray-300 text-sm">{t('instant_updates') || "Instant Updates"}</p>
//                   </div>
                  
//                   <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-6 animate-slide-up animation-delay-600">
//                     <h3 className="text-lg font-semibold text-white mb-2">{t('email_delivery') || "Email"}</h3>
//                     <p className="text-gray-300 text-sm break-all">{userEmail}</p>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-up animation-delay-1000">
//                   <button 
//                     onClick={handleBackToHome}
//                     className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
//                   >
//                     {t('back_to_home') || "Back to Home"}
//                   </button>
                  
//                   <a 
//                     href="tel:+91 93922 77389"
//                     className="px-8 py-4 text-purple-400 border-2 border-purple-400 hover:bg-purple-400 hover:text-white font-semibold rounded-xl text-center text-lg transition-all duration-300 transform hover:scale-105"
//                   >
//                     {t('contact_support') || "Contact Support"}
//                   </a>
//                 </div>

//                 {/* Contact Information */}
//                 <div className="pt-6 border-t border-purple-500/30 animate-fade-in animation-delay-1200">
//                   <p className="text-gray-400 mb-4 text-lg">
//                     {t('need_help') || "Need help?"} {t('contact_us_at') || "Contact us at"}:
//                   </p>
//                   <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm md:text-base">
//                     <a 
//                       href="mailto:customercareproductcenter@gmail.com" 
//                       className="text-blue-400 hover:text-blue-300 transition-colors break-all"
//                     >
//                       customercareproductcenter@gmail.com
//                     </a>
//                     <span className="text-gray-600 hidden sm:inline">|</span>
//                     <a 
//                       href="tel:+919392277389" 
//                       className="text-blue-400 hover:text-blue-300 transition-colors"
//                     >
//                       +91-93922 77389
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Thank;
