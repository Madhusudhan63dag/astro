import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import one from '../assets/rasi/1.webp';
import two from '../assets/rasi/2.webp';
import three from '../assets/rasi/3.webp';
import four from '../assets/rasi/4.webp';
import five from '../assets/rasi/5.webp';
import six from '../assets/rasi/6.webp';
import seven from '../assets/rasi/7.webp';
import eight from '../assets/rasi/8.webp';
import nine from '../assets/rasi/9.webp';
import ten from '../assets/rasi/10.webp';
import eleven from '../assets/rasi/11.webp';
import twelve from '../assets/rasi/12.webp';

const Three = () => {
  const { t } = useTranslation();
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const zodiacData = [
    { name: t('aries'), image: one, dates: t('aries_dates') },
    { name: t('taurus'), image: two, dates: t('taurus_dates') },
    { name: t('gemini'), image: three, dates: t('gemini_dates') },
    { name: t('cancer'), image: four, dates: t('cancer_dates') },
    { name: t('leo'), image: five, dates: t('leo_dates') },
    { name: t('virgo'), image: six, dates: t('virgo_dates') },
    { name: t('libra'), image: seven, dates: t('libra_dates') },
    { name: t('scorpio'), image: eight, dates: t('scorpio_dates') },
    { name: t('sagittarius'), image: nine, dates: t('sagittarius_dates') },
    { name: t('capricorn'), image: ten, dates: t('capricorn_dates') },
    { name: t('aquarius'), image: eleven, dates: t('aquarius_dates') },
    { name: t('pisces'), image: twelve, dates: t('pisces_dates') }
  ];

  const handleCardClick = (zodiac) => {
    setSelectedZodiac(zodiac);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedZodiac(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white py-10 px-5 font-sans relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl text-yellow-400">✦</div>
        <div className="absolute top-40 right-20 text-4xl text-amber-400">✧</div>
        <div className="absolute bottom-40 left-20 text-5xl text-yellow-400">✦</div>
        <div className="absolute bottom-20 right-10 text-3xl text-amber-400">✧</div>
        <div className="absolute top-1/2 left-1/4 text-3xl text-yellow-300">✦</div>
        <div className="absolute top-1/3 right-1/3 text-2xl text-amber-300">✧</div>
      </div>

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-5 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
          {t('free_daily_horoscope')}
        </h1>
        <div className="w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mb-5 rounded-full"></div>
        <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
          {t('horoscope_categories')}
        </p>
      </div>

      {/* Zodiac Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto relative z-10">
        {zodiacData.map((zodiac, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(zodiac)}
            className="bg-black/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 lg:p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-black/70 hover:border-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/20 cursor-pointer"
          >
            {/* Icon Container */}
            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
              <img
                src={zodiac.image}
                alt={zodiac.name}
                className="w-12 h-12 lg:w-full lg:h-full"
              />
            </div>

            {/* Zodiac Name */}
            <h3 className="text-xl lg:text-2xl font-semibold text-yellow-400 mb-2">
              {zodiac.name}
            </h3>

            {/* Date Range */}
            <p className="text-sm lg:text-base text-gray-300">
              {zodiac.dates}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedZodiac && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="p-8">
              {/* Zodiac Image */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/20 flex items-center justify-center">
                  <img
                    src={selectedZodiac.image}
                    alt={selectedZodiac.name}
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">{selectedZodiac.name}</h2>
                <p className="text-lg text-gray-300">{selectedZodiac.dates}</p>
              </div>

              {/* Divider */}
              <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mb-6 rounded-full"></div>

              {/* Zodiac Details */}
              <div className="space-y-6">
                
                <div>
                  <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t('characteristics') || 'Characteristics'}</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {t(`${selectedZodiac.name.toLowerCase()}_traits`) || 'Learn about the unique traits and characteristics that define this zodiac sign.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t('lucky_elements') || 'Lucky Elements'}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">{t('lucky_color') || 'Lucky Color'}:</span>
                      <span className="text-white ml-2">{t(`${selectedZodiac.name.toLowerCase()}_color`) || 'Golden'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">{t('lucky_number') || 'Lucky Number'}:</span>
                      <span className="text-white ml-2">{t(`${selectedZodiac.name.toLowerCase()}_number`) || '7'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">{t('element') || 'Element'}:</span>
                      <span className="text-white ml-2">{t(`${selectedZodiac.name.toLowerCase()}_element`) || 'Fire'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">{t('ruling_planet') || 'Ruling Planet'}:</span>
                      <span className="text-white ml-2">{t(`${selectedZodiac.name.toLowerCase()}_planet`) || 'Sun'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {/* <div className="mt-8 text-center">
                <button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold px-8 py-3 rounded-full hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 transform hover:scale-105">
                  {t('get_detailed_reading') || 'Get Detailed Reading'}
                </button>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Three;