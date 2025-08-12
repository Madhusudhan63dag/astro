// import React, { useEffect, useState } from "react";
// import { useTranslation } from 'react-i18next';
// import sampleVideo from '../assets/banner.mp4';
// import three from '../assets/8.webp';

// const KundliModal = ({ show, onClose }) => {
//   const { t } = useTranslation();
  
//   if (!show) return null;
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300 p-4">
//         <div className="bg-black/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden max-w-4xl w-full max-h-[90vh] border border-gray-700/50 relative animate-fadeIn">
//           {/* Close X button */}
//           <button
//             className="absolute top-3 right-3 text-2xl text-yellow-400 hover:text-amber-300 transition z-10"
//             onClick={onClose}
//             aria-label="Close"
//           >&times;</button>

//           {/* IMAGE LEFT */}
//           <div className="lg:w-[300px] w-full flex items-center justify-center p-4 lg:p-6">
//             <img
//               src={three}
//               alt="Vedic Kundli Sample"
//               className="object-contain w-full h-48 sm:h-60 lg:h-full rounded-lg max-w-[280px]"
//               style={{ boxShadow: "0 8px 28px rgba(251, 191, 36, 0.3)" }}
//               loading="lazy"
//             />
//           </div>

//           {/* CONTENT RIGHT */}
//           <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:px-7">
//             <div>
//               <div className="mb-2 flex items-center gap-2 text-yellow-400 text-sm sm:text-base font-semibold">
//                 <span>✦</span> {t('200_pages')} | {t('multi_system')}
//               </div>
//               <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-2 tracking-tight">
//                 {t('personalized_kundli')}—<span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">{t('most_detailed_india')}</span>
//               </h3>
//               <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
//                 {t('cosmic_blueprint_description')} <span className="font-semibold text-yellow-400">{t('200_pages')}</span> {t('predictions_doshas_remedies')} <b>{t('customized_for_you')}</b>.
//               </p>
//             </div>
//             <a
//               href="/kundli"
//               className="inline-block w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold shadow-lg rounded-lg py-3 text-center text-base sm:text-lg transition-all duration-300 transform hover:scale-105"
//             >
//               {t('check_sample_kundli')}
//             </a>
//           </div>
//         </div>
//       </div>
//     );
// };  

// const Hero = () => {
//   const { t } = useTranslation();
//   const [showKundliModal, setShowKundliModal] = useState(false);

//   const features = [
//     { text: t('detailed_reports') },
//     { text: t('horoscope_matching') },
//     { text: t('astrology_systems') },
//   ];

//   useEffect(() => {
//     const t = setTimeout(() => setShowKundliModal(true), 5000);
//     return () => clearTimeout(t);
//   }, []);

//   // Custom styles specifically targeting your screen size (1728px width)
//   const customStyles = `
//     /* Specific media query for 1728px width screens */
//     @media (min-width: 1700px) and (min-height: 1117px) {
//       .hero-title {
//         font-size: 6.5rem !important; /* 40px - optimized for 1728px width */
//       }
//       .hero-description {
//         font-size: 2rem !important; /* 16px */
//       }
//       .hero-button {
//         font-size: 1rem !important; /* 16px */
//         padding: 1rem 2rem !important;
//       }
//       .hero-features {
//         font-size: 0.875rem !important; /* 14px */
//         padding: 0.75rem 1rem !important;
//       }
//     }
    
//     /* Fallback for other laptop screens */
//     @media (min-width: 1024px) and (max-width: 1279px) {
//       .hero-title {
//         font-size: 1.875rem !important; /* 30px for smaller laptops */
//         line-height: 2.25rem !important;
//       }
//       .hero-description {
//         font-size: 0.875rem !important; /* 14px */
//       }
//       .hero-button {
//         font-size: 0.875rem !important; /* 14px */
//         padding: 0.75rem 1.5rem !important;
//       }
//       .hero-features {
//         font-size: 0.75rem !important; /* 12px */
//         padding: 0.5rem 0.75rem !important;
//       }
//     }
    
//     @media (min-width: 1280px) and (max-width: 1535px) {
//       .hero-title {
//         font-size: 2.25rem !important; /* 36px for medium laptops */
//         line-height: 2.5rem !important;
//       }
//       .hero-description {
//         font-size: 1rem !important; /* 16px */
//       }
//       .hero-button {
//         font-size: 1rem !important; /* 16px */
//         padding: 1rem 2rem !important;
//       }
//       .hero-features {
//         font-size: 0.875rem !important; /* 14px */
//         padding: 0.5rem 1rem !important;
//       }
//     }

//     @media (min-width: 1536px) and (max-width: 1719px) {
//       .hero-title {
//         font-size: 2.75rem !important; /* 44px */
//         line-height: 3.25rem !important;
//       }
//       .hero-description {
//         font-size: 1.125rem !important; /* 18px */
//       }
//       .hero-button {
//         font-size: 1.125rem !important; /* 18px */
//         padding: 1.25rem 2.5rem !important;
//       }
//       .hero-features {
//         font-size: 0.875rem !important; /* 14px */
//         padding: 0.75rem 1rem !important;
//       }
//     }

//     @media (min-width: 1737px) {
//       .hero-title {
//         font-size: 3rem !important; /* 48px for very large screens */
//         line-height: 1 !important;
//       }
//       .hero-description {
//         font-size: 1.125rem !important; /* 18px */
//       }
//       .hero-button {
//         font-size: 1.125rem !important; /* 18px */
//         padding: 1.25rem 2.5rem !important;
//       }
//       .hero-features {
//         font-size: 0.875rem !important; /* 14px */
//         padding: 0.75rem 1rem !important;
//       }
//     }
//   `;

//   return (
//     <div>
//       {/* Inject custom styles */}
//       <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
//       <section className="relative w-full min-h-screen max-h-screen flex items-start lg:items-start px-4 sm:px-6 lg:px-9 overflow-hidden">
        
//         {/* Background video container */}
//         <div className="absolute inset-0 w-full h-full overflow-hidden">
//           <video
//             className="w-full h-full object-cover"
//             src={sampleVideo}
//             autoPlay
//             muted
//             loop
//             playsInline
//             aria-label="Background video"
//             style={{
//               objectPosition: 'center center'
//             }}
//           />
//         </div>
        
//         {/* Dark overlay for better text readability */}
//         <div className="absolute inset-0 bg-black/40 z-0"></div>

//         {/* Content - Starting from top with custom responsive classes */}
//         <div className="relative z-10 text-center lg:text-left w-full lg:w-1/2 h-full flex flex-col justify-start pt-8 lg:pt-12">
          
//           {/* Main Content */}
//           <div className="flex-1 flex flex-col justify-between">
//             {/* Top Section */}
//             <div>
//               <h1 className="hero-title text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold leading-tight mb-4 sm:mb-6 lg:mb-6 text-white">
//                 {t('unlock_cosmic')}
//                 <br />
//                 <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
//                   {t('personalized_predictions')}
//                 </span>
//               </h1>
              
//               <p className="hero-description font-medium text-gray-300 mb-6 sm:mb-8 lg:mb-8 leading-relaxed lg:mx-0">
//                 {t('hero_description')}
//               </p>
              
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start mb-8">
//                 <a
//                   href="/kundli"
//                   className="hero-button w-full sm:w-auto px-6 sm:px-8 lg:px-8 py-3 sm:py-4 lg:py-4 text-base sm:text-lg lg:text-base xl:text-lg rounded-lg font-bold bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center"
//                 >
//                   {t('get_my_report')} →
//                 </a>
//               </div>
//             </div>
            
//             {/* Bottom Section - Features */}
//             <div className="pb-8 lg:pb-12">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-3 max-w-2xl lg:max-w-full mx-auto lg:mx-0">
//                 {features.map((feature, i) => (
//                   <div
//                     key={i}
//                     className="hero-features flex items-center gap-2 sm:gap-3 text-gray-300 text-xs sm:text-sm lg:text-xs xl:text-sm font-medium bg-black/40 backdrop-blur-sm rounded-lg px-3 sm:px-4 lg:px-3 py-2 sm:py-3 lg:py-2 border border-gray-700/50"
//                   >
//                     <span className="text-yellow-400 text-sm">✓</span>
//                     {feature.text}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
          
//         </div>
//       </section>
      
//       <KundliModal show={showKundliModal} onClose={() => setShowKundliModal(false)} />
//     </div>
//   );
// };

// export default Hero;

import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import sampleVideo from '../assets/banner.mp4';
import three from '../assets/8.webp';

const KundliModal = ({ show, onClose }) => {
  const { t } = useTranslation();
  
  if (!show) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300 p-4">
        <div className="bg-black/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden max-w-4xl w-full max-h-[90vh] border border-gray-700/50 relative animate-fadeIn">
          {/* Close X button */}
          <button
            className="absolute top-3 right-3 text-2xl text-yellow-400 hover:text-amber-300 transition z-10"
            onClick={onClose}
            aria-label="Close"
          >&times;</button>

          {/* IMAGE LEFT */}
          <div className="lg:w-[300px] w-full flex items-center justify-center p-4 lg:p-6">
            <img
              src={three}
              alt="Vedic Kundli Sample"
              className="object-contain w-full h-48 sm:h-60 lg:h-full rounded-lg max-w-[280px]"
              style={{ boxShadow: "0 8px 28px rgba(251, 191, 36, 0.3)" }}
              loading="lazy"
            />
          </div>

          {/* CONTENT RIGHT */}
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:px-7">
            <div>
              <div className="mb-2 flex items-center gap-2 text-yellow-400 text-sm sm:text-base font-semibold">
                <span>✦</span> {t('200_pages')} | {t('multi_system')}
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-2 tracking-tight">
                {t('personalized_kundli')}—<span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">{t('most_detailed_india')}</span>
              </h3>
              <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
                {t('cosmic_blueprint_description')} <span className="font-semibold text-yellow-400">{t('200_pages')}</span> {t('predictions_doshas_remedies')} <b>{t('customized_for_you')}</b>.
              </p>
            </div>
            <a
              href="/kundli"
              className="inline-block w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold shadow-lg rounded-lg py-3 text-center text-base sm:text-lg transition-all duration-300 transform hover:scale-105"
            >
              {t('check_sample_kundli')}
            </a>
          </div>
        </div>
      </div>
    );
};  

const Hero = () => {
  const { t } = useTranslation();
  const [showKundliModal, setShowKundliModal] = useState(false);

  const features = [
    { text: t('detailed_reports') },
    { text: t('horoscope_matching') },
    { text: t('astrology_systems') },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowKundliModal(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced responsive styles with better MacBook Air support
  const customStyles = `
    /* MacBook Air 13" (1440x900 scaled, actual 2560x1600) */
    @media (min-width: 1280px) and (max-width: 1440px) and (min-height: 800px) {
      .hero-title {
        font-size: 3.5rem !important; /* 56px - larger for MacBook Air */
        line-height: 1.1 !important;
      }
      .hero-description {
        font-size: 1.25rem !important; /* 20px */
        line-height: 1.6 !important;
      }
      .hero-button {
        font-size: 1.125rem !important; /* 18px */
        padding: 1rem 2rem !important;
      }
      .hero-features {
        font-size: 1rem !important; /* 16px */
        padding: 0.75rem 1rem !important;
      }
    }

    /* MacBook Air 15" and similar (1440x900+ scaled) */
    @media (min-width: 1441px) and (max-width: 1680px) and (min-height: 900px) {
      .hero-title {
        font-size: 6rem !important; /* 64px */
        line-height: 1.1 !important;
      }
      .hero-description {
        font-size: 1.375rem !important; /* 22px */
        line-height: 1.6 !important;
      }
      .hero-button {
        font-size: 1.25rem !important; /* 20px */
        padding: 1.125rem 2.25rem !important;
      }
      .hero-features {
        font-size: 1.125rem !important; /* 18px */
        padding: 0.875rem 1.125rem !important;
      }
    }

    /* Standard laptops (1024px - 1279px) */
    @media (min-width: 1024px) and (max-width: 1279px) {
      .hero-title {
        font-size: 3rem !important; /* 48px */
        line-height: 1.1 !important;
      }
      .hero-description {
        font-size: 1.125rem !important; /* 18px */
        line-height: 1.6 !important;
      }
      .hero-button {
        font-size: 1rem !important; /* 16px */
        padding: 1rem 1.75rem !important;
      }
      .hero-features {
        font-size: 0.875rem !important; /* 14px */
        padding: 0.75rem 1rem !important;
      }
    }

    /* Large laptops and small desktops (1681px - 1919px) */
    @media (min-width: 1681px) and (max-width: 1919px) {
      .hero-title {
        font-size: 7.5rem !important; /* 72px */
        line-height: 1.1 !important;
      }
      .hero-description {
        font-size: 1.5rem !important; /* 24px */
        line-height: 1.6 !important;
      }
      .hero-button {
        font-size: 1.375rem !important; /* 22px */
        padding: 1.25rem 2.5rem !important;
      }
      .hero-features {
        font-size: 1.125rem !important; /* 18px */
        padding: 1rem 1.25rem !important;
      }
    }

    /* Large desktops (1920px+) */
    @media (min-width: 1920px) {
      .hero-title {
        font-size: 6rem !important; /* 80px */
        line-height: 1.1 !important;
      }
      .hero-description {
        font-size: 1.625rem !important; /* 26px */
        line-height: 1.6 !important;
      }
      .hero-button {
        font-size: 1.5rem !important; /* 24px */
        padding: 1.375rem 2.75rem !important;
      }
      .hero-features {
        font-size: 1.25rem !important; /* 20px */
        padding: 1rem 1.5rem !important;
      }
    }

    /* Specific override for high-DPI MacBook screens */
    @media (-webkit-min-device-pixel-ratio: 2) and (min-width: 1280px) and (max-width: 1680px) {
      .hero-title {
        font-size: 3.75rem !important; /* 60px */
        line-height: 1.1 !important;
      }
      .hero-description {
        font-size: 1.375rem !important; /* 22px */
        line-height: 1.6 !important;
      }
      .hero-button {
        font-size: 1.25rem !important; /* 20px */
        padding: 1.125rem 2.25rem !important;
      }
      .hero-features {
        font-size: 1rem !important; /* 16px */
        padding: 0.875rem 1.125rem !important;
      }
    }

    /* Ensure minimum sizes on very small laptop screens */
    @media (min-width: 1024px) and (max-height: 768px) {
      .hero-title {
        font-size: 2.75rem !important; /* 44px */
        line-height: 1.2 !important;
      }
      .hero-description {
        font-size: 1rem !important; /* 16px */
        line-height: 1.5 !important;
      }
      .hero-button {
        font-size: 0.875rem !important; /* 14px */
        padding: 0.875rem 1.5rem !important;
      }
      .hero-features {
        font-size: 0.75rem !important; /* 12px */
        padding: 0.625rem 0.875rem !important;
      }
    }
  `;

  return (
    <div>
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      <section className="relative w-full min-h-screen max-h-screen flex items-start lg:items-start px-4 sm:px-6 lg:px-9 overflow-hidden">
        
        {/* Background video container */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            className="w-full h-full object-cover"
            src={sampleVideo}
            autoPlay
            muted
            loop
            playsInline
            aria-label="Background video"
            style={{
              objectPosition: 'center center'
            }}
          />
        </div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        {/* Content - Starting from top with custom responsive classes */}
        <div className="relative z-10 text-center lg:text-left w-full lg:w-1/2 h-full flex flex-col justify-start pt-8 lg:pt-12">
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Top Section */}
            <div>
              <h1 className="hero-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 sm:mb-6 lg:mb-6 text-white">
                {t('unlock_cosmic')}
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                  {t('personalized_predictions')}
                </span>
              </h1>
              
              <p className="hero-description text-sm sm:text-base lg:text-lg xl:text-xl font-medium text-gray-300 mb-6 sm:mb-8 lg:mb-8 leading-relaxed lg:mx-0">
                {t('hero_description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start mb-8">
                <a
                  href="/kundli"
                  className="hero-button w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl rounded-lg font-bold bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center"
                >
                  {t('get_my_report')} →
                </a>
              </div>
            </div>
            
            {/* Bottom Section - Features */}
            <div className="pb-8 lg:pb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-3 max-w-2xl lg:max-w-full mx-auto lg:mx-0">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="hero-features flex items-center gap-2 sm:gap-3 text-gray-300 text-xs sm:text-sm lg:text-base font-medium bg-black/40 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-700/50"
                  >
                    <span className="text-yellow-400 text-sm">✓</span>
                    {feature.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </section>
      
      <KundliModal show={showKundliModal} onClose={() => setShowKundliModal(false)} />
    </div>
  );
};

export default Hero;
