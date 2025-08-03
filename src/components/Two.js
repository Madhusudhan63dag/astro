import React from 'react';
import { useTranslation } from 'react-i18next';
import banner2 from '../assets/banner2.webp';

const Two = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-slate-900 w-full py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl text-yellow-400">✦</div>
        <div className="absolute top-40 right-20 text-4xl text-amber-400">✧</div>
        <div className="absolute bottom-40 left-20 text-5xl text-yellow-400">✦</div>
        <div className="absolute bottom-20 right-10 text-3xl text-amber-400">✧</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row shadow-2xl rounded-2xl overflow-hidden bg-black/40 backdrop-blur-md border border-gray-700/50">
          
          {/* Image Section */}
          <div className="lg:w-1/2 w-full relative">
            <img
              src={banner2}
              alt={t('authentic_astrology_banner')}
              className="w-full h-full object-cover min-h-[400px]"
              loading="lazy"
            />
            {/* Image overlay for better integration */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30"></div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 w-full flex flex-col justify-center items-start p-8 lg:p-12">
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                <span className="mr-2">🕉️</span>
                {t('authentic_vedic_astrology')}
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
              {t('discover_your')} <span className="text-yellow-400">{t('cosmic_destiny')}</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                {t('through_ancient_wisdom')}
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {t('two_section_description')}
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-yellow-400">✓</span>
                <span className="text-gray-300">{t('personalized_birth_charts')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-400">✓</span>
                <span className="text-gray-300">{t('remedial_gemstone_guidance')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-400">✓</span>
                <span className="text-gray-300">{t('marriage_compatibility_analysis')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-400">✓</span>
                <span className="text-gray-300">{t('career_life_predictions')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <a
                href="/form"
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
              >
                {t('start_your_journey')} →
              </a>
              
              <a
                href="/about"
                className="px-8 py-4 text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-all duration-300 text-center"
              >
                {t('learn_more')}
              </a>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center gap-4 mt-6 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                <span>{t('rated_by_clients')}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">🔒</span>
                <span>{t('confidential_secure')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Two;
