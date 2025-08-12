// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import one from '../assets/rasi/1.webp';
// import two from '../assets/rasi/2.webp';
// import three from '../assets/rasi/3.webp';
// import four from '../assets/rasi/4.webp';
// import five from '../assets/rasi/5.webp';
// import six from '../assets/rasi/6.webp';
// import seven from '../assets/rasi/7.webp';
// import eight from '../assets/rasi/8.webp';
// import nine from '../assets/rasi/9.webp';
// import ten from '../assets/rasi/10.webp';
// import eleven from '../assets/rasi/11.webp';
// import twelve from '../assets/rasi/12.webp';
// import cornerImage from '../assets/banner2.webp';
 
// const Three = () => {
//   const { t } = useTranslation();
//   const [selectedZodiac, setSelectedZodiac] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const zodiacData = [
//     { key: 'aries', name: t('aries'), image: one, dates: t('aries_dates') },
//     { key: 'taurus', name: t('taurus'), image: two, dates: t('taurus_dates') },
//     { key: 'gemini', name: t('gemini'), image: three, dates: t('gemini_dates') },
//     { key: 'cancer', name: t('cancer'), image: four, dates: t('cancer_dates') },
//     { key: 'leo', name: t('leo'), image: five, dates: t('leo_dates') },
//     { key: 'virgo', name: t('virgo'), image: six, dates: t('virgo_dates') },
//     { key: 'libra', name: t('libra'), image: seven, dates: t('libra_dates') },
//     { key: 'scorpio', name: t('scorpio'), image: eight, dates: t('scorpio_dates') },
//     { key: 'sagittarius', name: t('sagittarius'), image: nine, dates: t('sagittarius_dates') },
//     { key: 'capricorn', name: t('capricorn'), image: ten, dates: t('capricorn_dates') },
//     { key: 'aquarius', name: t('aquarius'), image: eleven, dates: t('aquarius_dates') },
//     { key: 'pisces', name: t('pisces'), image: twelve, dates: t('pisces_dates') }
//   ];

//   const handleCardClick = (zodiac) => {
//     setSelectedZodiac(zodiac);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedZodiac(null);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white py-10 px-5 font-sans relative overflow-hidden">

//       {/* Right-corner decorative image (responsive, behind content) */}
//       <div className="pointer-events-none select-none hidden sm:block absolute -top-6 right-0 z-0">
//         <img
//           src={cornerImage}
//           alt=""
//           className="w-40 sm:w-56 md:w-64 lg:w-80 xl:w-[26rem] opacity-20 md:opacity-30 object-contain translate-x-6"
//         />
//       </div>

//       {/* Header */}
//   <div className="text-center mb-16 relative z-10">
//         <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-5 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
//           {t('free_daily_horoscope')}
//         </h1>
//         <div className="w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mb-5 rounded-full"></div>
//         <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
//           {t('horoscope_categories')}
//         </p>
//       </div>

//       {/* Zodiac Grid */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
//         {zodiacData.map((zodiac, index) => (
//           <div
//             key={index}
//             onClick={() => handleCardClick(zodiac)}
//             className="bg-black/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 lg:p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-black/70 hover:border-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/20 cursor-pointer"
//           >
//             {/* Icon Container */}
//             <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
//               <img
//                 src={zodiac.image}
//                 alt={zodiac.name}
//                 className="w-12 h-12 lg:w-full lg:h-full"
//               />
//             </div>

//             {/* Zodiac Name */}
//             <h3 className="text-xl lg:text-2xl font-semibold text-yellow-400 mb-2">
//               {zodiac.name}
//             </h3>

//             {/* Date Range */}
//             <p className="text-sm lg:text-base text-gray-300">
//               {zodiac.dates}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {isModalOpen && selectedZodiac && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-3xl w-full max-h-[90vh] overflow-y-auto relative">
//             {/* Close Button */}
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             {/* Modal Content */}
//             <div className="p-8">
//               {/* Zodiac Image */}
//               <div className="text-center mb-6">
//                 <div className="w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center">
//                   <img
//                     src={selectedZodiac.image}
//                     alt={selectedZodiac.name}
//                     className="w-24 h-24 object-contain"
//                   />
//                 </div>
//                 <h2 className="text-3xl font-bold text-yellow-400 mb-2">{selectedZodiac.name}</h2>
//                 <p className="text-lg text-gray-300">{selectedZodiac.dates}</p>
//               </div>

//               {/* Divider */}
//               <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mb-6 rounded-full"></div>

//               {/* Zodiac Details */}
//               <div className="space-y-6">
                
//                 <div>
//                   <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t('characteristics') || 'Characteristics'}</h3>
//                   <p className="text-gray-300 leading-relaxed">
//                     {t(`${selectedZodiac.key}_traits`) || 'Learn about the unique traits and characteristics that define this zodiac sign.'}
//                   </p>
//                 </div>

//                 <div>
//                   <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t('lucky_elements') || 'Lucky Elements'}</h3>
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <span className="text-gray-400">{t('lucky_color') || 'Lucky Color'}:</span>
//                       <span className="text-white ml-2">{t(`${selectedZodiac.key}_color`) || 'Golden'}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400">{t('lucky_number') || 'Lucky Number'}:</span>
//                       <span className="text-white ml-2">{t(`${selectedZodiac.key}_number`) || '7'}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400">{t('element') || 'Element'}:</span>
//                       <span className="text-white ml-2">{t(`${selectedZodiac.key}_element`) || 'Fire'}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400">{t('ruling_planet') || 'Ruling Planet'}:</span>
//                       <span className="text-white ml-2">{t(`${selectedZodiac.key}_planet`) || 'Sun'}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* More Insights */}
//                 <div>
//                   <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t('more_insights') || 'More Insights'}</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <span className="text-gray-400">{t('likes') || 'Likes'}:</span>
//                       <span className="text-white ml-2">{t(`${selectedZodiac.key}_likes`) || '—'}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400">{t('dislikes') || 'Dislikes'}:</span>
//                       <span className="text-white ml-2">{t(`${selectedZodiac.key}_dislikes`) || '—'}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400">{t('food') || 'Food'}:</span>
//                       <span className="text-white ml-2">{t(`${selectedZodiac.key}_food`) || '—'}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400">{t('travel_style') || 'Travel Style'}:</span>
//                       <span className="text-white ml-2">{t(`${selectedZodiac.key}_travel_style`) || '—'}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400">{t('movie_match') || 'Movie Match'}:</span>
//                       <span className="text-white ml-2">{t(`${selectedZodiac.key}_movie_match`) || '—'}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400">{t('song_vibe') || 'Song Vibe'}:</span>
//                       <span className="text-white ml-2">{t(`${selectedZodiac.key}_song_vibe`) || '—'}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Celebrities */}
//                 <div>
//                   <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t('celebs') || 'Celebrities'}</h3>
//                   <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
//                     {t(`${selectedZodiac.key}_celebs`) || '—'}
//                   </p>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Three;

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
import cornerImage from '../assets/banner2.webp';
 
const Three = () => {
  const { t } = useTranslation();
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const zodiacData = [
    { key: 'aries', name: t('aries'), image: one, dates: t('aries_dates'), color: 'from-red-500 to-orange-500' },
    { key: 'taurus', name: t('taurus'), image: two, dates: t('taurus_dates'), color: 'from-green-500 to-emerald-500' },
    { key: 'gemini', name: t('gemini'), image: three, dates: t('gemini_dates'), color: 'from-yellow-500 to-orange-500' },
    { key: 'cancer', name: t('cancer'), image: four, dates: t('cancer_dates'), color: 'from-blue-500 to-cyan-500' },
    { key: 'leo', name: t('leo'), image: five, dates: t('leo_dates'), color: 'from-yellow-500 to-amber-500' },
    { key: 'virgo', name: t('virgo'), image: six, dates: t('virgo_dates'), color: 'from-green-500 to-teal-500' },
    { key: 'libra', name: t('libra'), image: seven, dates: t('libra_dates'), color: 'from-pink-500 to-rose-500' },
    { key: 'scorpio', name: t('scorpio'), image: eight, dates: t('scorpio_dates'), color: 'from-purple-600 to-indigo-600' },
    { key: 'sagittarius', name: t('sagittarius'), image: nine, dates: t('sagittarius_dates'), color: 'from-orange-500 to-red-500' },
    { key: 'capricorn', name: t('capricorn'), image: ten, dates: t('capricorn_dates'), color: 'from-gray-600 to-slate-600' },
    { key: 'aquarius', name: t('aquarius'), image: eleven, dates: t('aquarius_dates'), color: 'from-blue-500 to-purple-500' },
    { key: 'pisces', name: t('pisces'), image: twelve, dates: t('pisces_dates'), color: 'from-teal-500 to-blue-500' }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-16 px-4 font-sans relative overflow-hidden">

      {/* Corner decorative image */}
      <div className="pointer-events-none select-none hidden lg:block absolute -top-10 right-0 z-0">
        <img
          src={cornerImage}
          alt=""
          className="w-96 opacity-20 object-contain translate-x-12 filter blur-sm"
        />
      </div>

      {/* Header with enhanced styling - removed emojis */}
      <div className="text-center mb-20 relative z-10">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent leading-tight">
          {t('free_daily_horoscope')}
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-yellow-400 rounded-full"></div>
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-yellow-400 rounded-full"></div>
        </div>
        
        <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          {t('horoscope_categories')}
        </p>
      </div>

      {/* Zodiac Grid - Fixed to 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {zodiacData.map((zodiac, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(zodiac)}
            className="group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-3 hover:scale-105 cursor-pointer"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${zodiac.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`}></div>
            
            {/* Glowing border effect */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${zodiac.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}></div>
            
            {/* Icon Container with enhanced styling */}
            <div className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/50 group-hover:border-yellow-400/50 transition-all duration-300">
              <img
                src={zodiac.image}
                alt={zodiac.name}
                className="w-16 h-16 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                {zodiac.name}
              </h3>
              
              <div className="w-12 h-0.5 bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-yellow-400 group-hover:to-amber-500 mx-auto mb-3 rounded-full transition-all duration-300"></div>
              
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium">
                {zodiac.dates}
              </p>
              
              {/* Hover indicator - removed arrow emoji */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                  {t('explore')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Width Modal with Image in Right Corner */}
      {isModalOpen && selectedZodiac && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 w-full h-full overflow-y-auto relative shadow-2xl">
            
            {/* Image in right corner */}
            <div className="absolute top-6 right-20 z-0 hidden lg:block">
              <div className={`relative p-8`}>
                <img
                  src={selectedZodiac.image}
                  alt={selectedZodiac.name}
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>

            {/* Enhanced Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800/50 hover:bg-red-500/20 border border-gray-600/50 hover:border-red-400/50 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all duration-300 z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="p-8 lg:p-16 max-w-4xl">
              
              {/* Enhanced Header */}
              <div className="text-left mb-12 relative z-10">
                <div className="mb-6">
                  <h2 className={`text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r ${selectedZodiac.color} bg-clip-text text-transparent`}>
                    {selectedZodiac.name}
                  </h2>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-0.5 bg-gradient-to-r ${selectedZodiac.color} rounded-full`}></div>
                    <div className={`w-12 h-0.5 bg-gradient-to-l ${selectedZodiac.color} rounded-full`}></div>
                  </div>
                  
                  <p className="text-2xl text-gray-300 font-medium">{selectedZodiac.dates}</p>
                </div>
              </div>

              {/* Content Sections with Cards */}
              <div className="space-y-8 relative z-10">
                
                {/* Characteristics Card */}
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${selectedZodiac.color}`}></div>
                    <h3 className="text-3xl font-bold text-white">{t('characteristics') || 'Characteristics'}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-xl">
                    {t(`${selectedZodiac.key}_traits`) || 'Learn about the unique traits and characteristics that define this zodiac sign.'}
                  </p>
                </div>

                {/* Lucky Elements Card */}
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${selectedZodiac.color}`}></div>
                    <h3 className="text-3xl font-bold text-white">{t('lucky_elements') || 'Lucky Elements'}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: t('lucky_color') || 'Lucky Color', value: t(`${selectedZodiac.key}_color`) || 'Golden' },
                      { label: t('lucky_number') || 'Lucky Number', value: t(`${selectedZodiac.key}_number`) || '7' },
                      { label: t('element') || 'Element', value: t(`${selectedZodiac.key}_element`) || 'Fire' },
                      { label: t('ruling_planet') || 'Ruling Planet', value: t(`${selectedZodiac.key}_planet`) || 'Sun' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-gray-700/50">
                        <span className="text-gray-400 font-medium text-lg">{item.label}:</span>
                        <span className={`font-bold text-lg bg-gradient-to-r ${selectedZodiac.color} bg-clip-text text-transparent`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* More Insights Card */}
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${selectedZodiac.color}`}></div>
                    <h3 className="text-3xl font-bold text-white">{t('more_insights') || 'More Insights'}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: t('likes') || 'Likes', value: t(`${selectedZodiac.key}_likes`) || '—' },
                      { label: t('dislikes') || 'Dislikes', value: t(`${selectedZodiac.key}_dislikes`) || '—' },
                      { label: t('food') || 'Food', value: t(`${selectedZodiac.key}_food`) || '—' },
                      { label: t('travel_style') || 'Travel Style', value: t(`${selectedZodiac.key}_travel_style`) || '—' },
                      { label: t('movie_match') || 'Movie Match', value: t(`${selectedZodiac.key}_movie_match`) || '—' },
                      { label: t('song_vibe') || 'Song Vibe', value: t(`${selectedZodiac.key}_song_vibe`) || '—' }
                    ].map((item, index) => (
                      <div key={index} className="p-4 bg-black/30 rounded-lg border border-gray-700/50">
                        <div className="text-gray-400 text-base font-medium mb-2">{item.label}</div>
                        <div className="text-white font-medium text-lg">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Celebrities Card */}
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${selectedZodiac.color}`}></div>
                    <h3 className="text-3xl font-bold text-white">{t('celebs') || 'Celebrities'}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-xl">
                    {t(`${selectedZodiac.key}_celebs`) || '—'}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
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
      `}</style>

    </div>
  );
};

export default Three;
