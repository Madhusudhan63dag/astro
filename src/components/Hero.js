import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import sampleVideo from '../assets/banner.mp4';
import three from '../assets/8.webp';

const KundliModal = ({ show, onClose }) => {
  const { t } = useTranslation();
  
  if (!show) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300">
        <div className="bg-black/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-w-3xl w-full border border-gray-700/50 relative animate-fadeIn">
          {/* Close X button */}
          <button
            className="absolute top-3 right-3 text-2xl text-yellow-400 hover:text-amber-300 transition"
            onClick={onClose}
            aria-label="Close"
          >&times;</button>

          {/* IMAGE LEFT */}
          <div className="md:w-[300px] w-full flex items-center justify-center p-0 md:p-6">
            <img
              src={three}
              alt="Vedic Kundli Sample"
              className="object-contain w-full h-60 md:h-full rounded-lg"
              style={{ maxWidth: 280, boxShadow: "0 8px 28px rgba(251, 191, 36, 0.3)" }}
              loading="lazy"
            />
          </div>

          {/* CONTENT RIGHT */}
          <div className="flex-1 flex flex-col justify-between p-6 px-7">
            <div>
              <div className="mb-2 flex items-center gap-2 text-yellow-400 text-base font-semibold">
                <span>✦</span> {t('200_pages')} | {t('multi_system')}
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">
                {t('personalized_kundli')}—<span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">{t('most_detailed_india')}</span>
              </h3>
              <p className="text-gray-300 mb-4">
                {t('cosmic_blueprint_description')} <span className="font-semibold text-yellow-400">{t('200_pages')}</span> {t('predictions_doshas_remedies')} <b>{t('customized_for_you')}</b>.
              </p>
            </div>
            <a
              href="/form"
              className="inline-block w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold shadow-lg rounded-lg py-3 text-center text-lg transition-all duration-300 transform hover:scale-105"
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
    { text: t('unlimited_kundli') },
    { text: t('detailed_reports') },
    { text: t('horoscope_matching') },
    { text: t('cloud_backup') },
    { text: t('custom_branding') },
    { text: t('astrology_systems') },
  ];

  useEffect(() => {
    const t = setTimeout(() => setShowKundliModal(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <section className="relative w-full h-screen flex items-center justify-start px-3 md:px-9 overflow-hidden">
        
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
        {/* <div className="absolute inset-0 bg-black/40 z-5"></div> */}

        {/* Content */}
        <div className="relative z-10 text-left max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-white">
            {t('unlock_cosmic')} <span className="text-yellow-400">{t('wisdom')}</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              {t('personalized_predictions')}
            </span>
          </h1>
          
          <p className="text-xl font-medium text-gray-300 mb-8 leading-relaxed">
            {t('hero_description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start mb-8">
            <a
              href="/form"
              className="px-8 py-4 text-lg rounded-lg font-bold bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              {t('get_my_report')} →
            </a>
            
            <button
              onClick={() => setShowKundliModal(true)}
              className="px-8 py-4 text-lg rounded-lg font-semibold text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              {t('view_sample')}
            </button>
          </div>
          
          {/* Features grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-gray-300 text-sm font-medium bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/50"
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
