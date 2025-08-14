import React, { useState, useEffect, useRef } from 'react';
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
import cornerImage from '../assets/banner2.webp';

// Import your video files
import ariesVideo from '../assets/rasi/10.mp4';
import taurusVideo from '../assets/rasi/2.mp4';
import geminiVideo from '../assets/rasi/3.mp4';
import cancerVideo from '../assets/rasi/4.mp4';
import leoVideo from '../assets/rasi/5.mp4';
import virgoVideo from '../assets/rasi/6.mp4';
import libraVideo from '../assets/rasi/7.mp4';
import scorpioVideo from '../assets/rasi/8.mp4';
import sagittariusVideo from '../assets/rasi/9.mp4';
import capricornVideo from '../assets/rasi/1.mp4';
import aquariusVideo from '../assets/rasi/11.mp4';
import piscesVideo from '../assets/rasi/12.mp4';
 
const Three = () => {
  const { t } = useTranslation();
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const cardRefs = useRef([]);
  const sectionRef = useRef(null);

  const zodiacData = [
    { key: 'aries', name: t('aries'), image: one, video: ariesVideo, dates: t('aries_dates'), color: 'from-red-500 to-orange-500' },
    { key: 'taurus', name: t('taurus'), image: two, video: taurusVideo, dates: t('taurus_dates'), color: 'from-green-500 to-emerald-500' },
    { key: 'gemini', name: t('gemini'), image: three, video: geminiVideo, dates: t('gemini_dates'), color: 'from-yellow-500 to-orange-500' },
    { key: 'cancer', name: t('cancer'), image: four, video: cancerVideo, dates: t('cancer_dates'), color: 'from-blue-500 to-cyan-500' },
    { key: 'leo', name: t('leo'), image: five, video: leoVideo, dates: t('leo_dates'), color: 'from-yellow-500 to-amber-500' },
    { key: 'virgo', name: t('virgo'), image: six, video: virgoVideo, dates: t('virgo_dates'), color: 'from-green-500 to-teal-500' },
    { key: 'libra', name: t('libra'), image: seven, video: libraVideo, dates: t('libra_dates'), color: 'from-pink-500 to-rose-500' },
    { key: 'scorpio', name: t('scorpio'), image: eight, video: scorpioVideo, dates: t('scorpio_dates'), color: 'from-purple-600 to-indigo-600' },
    { key: 'sagittarius', name: t('sagittarius'), image: nine, video: sagittariusVideo, dates: t('sagittarius_dates'), color: 'from-orange-500 to-red-500' },
    { key: 'capricorn', name: t('capricorn'), image: ten, video: capricornVideo, dates: t('capricorn_dates'), color: 'from-gray-600 to-slate-600' },
    { key: 'aquarius', name: t('aquarius'), image: eleven, video: aquariusVideo, dates: t('aquarius_dates'), color: 'from-blue-500 to-purple-500' },
    { key: 'pisces', name: t('pisces'), image: twelve, video: piscesVideo, dates: t('pisces_dates'), color: 'from-teal-500 to-blue-500' }
  ];

  // (Removed card-level visibility observer; using section-level audio control instead)

  // Auto toggle audio based on section visibility (unmute in view, mute when out)
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsMuted(!inView);

        // Reflect immediately on the first card's video element
        const firstCardRef = cardRefs.current[0];
        if (firstCardRef) {
          const video = firstCardRef.querySelector('video');
          if (video) {
            video.muted = !inView;
            // Ensure it's playing when in view
            if (inView) {
              video.play().catch(() => {});
            }
          }
        }
    },
    { threshold: 0 }
      );
      observer.observe(sectionRef.current);
      return () => observer.disconnect();
  }, []);

  // Ensure videos start playing on initial load (muted autoplay is allowed)
  useEffect(() => {
    const playAll = () => {
      cardRefs.current.forEach((ref) => {
        if (!ref) return;
        const video = ref.querySelector('video');
        if (video) {
          video.play().catch(() => {});
        }
      });
    };
    // Try immediately and after a short delay to catch rendered refs
    playAll();
    const id = setTimeout(playAll, 300);
    return () => clearTimeout(id);
  }, []);

  const handleCardClick = (zodiac) => {
    setSelectedZodiac(zodiac);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedZodiac(null);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Update only the first card's video audio
    const firstCardRef = cardRefs.current[0];
    if (firstCardRef) {
      const video = firstCardRef.querySelector('video');
      if (video) {
        video.muted = !isMuted;
      }
    }
  };

  // Table data for the selected zodiac
  const getTableData = (zodiac) => {
    return [
      { category: t('basic_info') || 'Basic Information', items: [
        { property: t('element') || 'Element', value: t(`${zodiac.key}_element`) || 'Fire' },
        { property: t('ruling_planet') || 'Ruling Planet', value: t(`${zodiac.key}_planet`) || 'Sun' },
      ]},
      { category: t('lucky_elements') || 'Lucky Elements', items: [
        { property: t('lucky_color') || 'Lucky Color', value: t(`${zodiac.key}_color`) || 'Golden' },
        { property: t('lucky_number') || 'Lucky Number', value: t(`${zodiac.key}_number`) || '7' },
      ]},
      { category: t('personality_traits') || 'Personality Traits', items: [
        { property: t('likes') || 'Likes', value: t(`${zodiac.key}_likes`) || 'Adventure, Leadership' },
        { property: t('dislikes') || 'Dislikes', value: t(`${zodiac.key}_dislikes`) || 'Waiting, Inactivity' },
      ]},
      { category: t('lifestyle') || 'Lifestyle', items: [
        { property: t('food') || 'Food Preference', value: t(`${zodiac.key}_food`) || 'Spicy food' },
        { property: t('travel_style') || 'Travel Style', value: t(`${zodiac.key}_travel_style`) || 'Adventure trips' },
      ]},
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-16 px-4 font-sans relative overflow-hidden">

      <h1 className="text-5xl sm:text-6xl text-center lg:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent leading-tight">
          {t('free_daily_horoscope')}
      </h1>

      {/* Corner decorative image */}
      <div className="pointer-events-none select-none hidden lg:block absolute -top-10 right-0 z-0">
        <img
          src={cornerImage}
          alt=""
          className="w-96 opacity-20 object-contain translate-x-12 filter blur-sm"
        />
      </div>

      {/* Zodiac Grid Section */}
      <div ref={sectionRef} className="relative z-10">
        {/* Zodiac Grid - Fixed to 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {zodiacData.map((zodiac, index) => (
              <div
                key={index}
                ref={el => cardRefs.current[index] = el}
                onClick={() => handleCardClick(zodiac)}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-5 text-center transition-all duration-500 hover:-translate-y-3 hover:scale-105 cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${zodiac.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`}></div>
                
                {/* Glowing border effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${zodiac.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}></div>
                
                {/* Video Container - ALL VIDEOS AUTOPLAY; ONLY FIRST HAS AUDIO WHEN SECTION IN VIEW */}
                <div className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-600/50 group-hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                  <video
                    src={zodiac.video}
                    autoPlay
                    loop
                    muted={index === 0 ? isMuted : true} // Only first card respects mute state, others are always muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onLoadedData={(e) => {
                      // Attempt to play regardless; browsers may block unmuted play which we avoid by starting muted
                      e.target.play().catch(() => {});
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg">
                    {zodiac.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Mute Button at bottom of section - Now only affects first card */}
          <div className="flex justify-center mt-12">
            <button
              onClick={toggleMute}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-600/50 hover:border-yellow-400/50 rounded-full text-white hover:text-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors duration-300">
                {isMuted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </div>
              <span className="font-semibold">
                {isMuted ? t('unmute_first_card') || 'Unmute First Card' : t('mute_first_card') || 'Mute First Card'}
              </span>
            </button>
          </div>
        </div>

        {/* Full Width Modal with Icon instead of Video */}
        {isModalOpen && selectedZodiac && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 w-full max-w-7xl h-[90vh] rounded-2xl relative shadow-2xl flex flex-col">
              
              {/* Icon in right corner - REPLACED VIDEO WITH ICON */}
              <div className="absolute top-4 right-16 z-0 hidden lg:block">
                <div className="relative">
                  <img
                    src={selectedZodiac.image}
                    alt={selectedZodiac.name}
                    className="w-32 h-24 object-contain opacity-70 shadow-lg filter drop-shadow-2xl"
                  />
                  {/* Optional: Color overlay for better integration */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${selectedZodiac.color} opacity-20 rounded-lg`}></div>
                </div>
              </div>

              {/* Enhanced Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-800/50 hover:bg-red-500/20 border border-gray-600/50 hover:border-red-400/50 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all duration-300 z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Header - Fixed */}
              <div className="flex-shrink-0 text-center p-6 border-b border-gray-700/30">
                <h2 className={`text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r ${selectedZodiac.color} bg-clip-text text-transparent`}>
                  {selectedZodiac.name}
                </h2>
                <p className="text-lg text-gray-300 font-medium">{selectedZodiac.dates}</p>
              </div>

              {/* Modal Content - Scrollable Table */}
              <div className="flex-1 overflow-hidden p-6">
                <div className="h-full bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/30 overflow-hidden flex flex-col">

                  {/* Scrollable Table Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="">
                      {/* Additional Information Section - Compact */}
                      <div className="p-4">
                        <h4 className={`text-lg font-bold mb-3 bg-gradient-to-r ${selectedZodiac.color} bg-clip-text text-transparent`}>
                          {t('characteristics') || 'Characteristics'}
                        </h4>
                        <div className="bg-black/30 rounded-lg border border-gray-700/50 p-3">
                          <p className="text-gray-300 leading-relaxed text-sm">
                            {t(`${selectedZodiac.key}_traits`) || 'Learn about the unique traits and characteristics that define this zodiac sign.'}
                          </p>
                        </div>
                      </div>
                      {getTableData(selectedZodiac).map((section, sectionIndex) => (
                        <div key={sectionIndex} className="">
                          {/* Compact Table Rows */}
                          <div className="">
                            {section.items.map((item, itemIndex) => (
                              <div 
                                key={itemIndex} 
                                className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-black/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300"
                              >
                                <div className="font-semibold text-gray-300 flex items-center text-sm">
                                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${selectedZodiac.color} mr-2 flex-shrink-0`}></div>
                                  {item.property}
                                </div>
                                <div className="text-white font-medium text-sm">
                                  {item.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CSS for animations and custom scrollbar */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }

          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5);
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(156, 163, 175, 0.8);
          }
        `}</style>

      </div>
  );
};

export default Three;
