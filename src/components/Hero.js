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
    const t = setTimeout(() => setShowKundliModal(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <section className="relative w-full min-h-screen flex items-center justify-center lg:justify-start px-4 sm:px-6 lg:px-9 overflow-hidden">
        
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
        
  {/* Dark overlay for better text readability (below content) */}
  <div className="absolute inset-0 bg-black/40 z-0"></div>

        {/* Content */}
        <div className="relative z-10 text-center lg:text-left w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 sm:mb-6 text-white w-full lg:w-1/2">
            {t('unlock_cosmic')}
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              {t('personalized_predictions')}
            </span>
          </h1>
          
          <p className="text-sm sm:text-base lg:text-xl w-full lg:w-1/2 font-medium text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto lg:mx-0">
            {t('hero_description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start mb-6 sm:mb-8">
            <a
              href="/kundli"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg font-bold bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center"
            >
              {t('get_my_report')} →
            </a>
            
          </div>
          
          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl mx-auto lg:mx-0">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm font-medium bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/50"
              >
                <span className="text-yellow-400 text-xs">✓</span>
                {feature.text}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <KundliModal show={showKundliModal} onClose={() => setShowKundliModal(false)} />
    </div>
  );
};

export default Hero;
