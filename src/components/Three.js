import React, { useState, useEffect, useRef, useMemo } from 'react';
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

  const trackRef = useRef(null);
  const isUserInteracting = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Memoize data so it only regenerates when translations change
  const zodiacData = useMemo(() => ([
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
  ]), [t]);

  const prefersReduced = useRef(false);
  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleCardClick = (zodiac) => {
    setSelectedZodiac(zodiac);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedZodiac(null);
  };

  // Compute one-card step from the first rendered card inside the track
  const getStep = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const firstCardEl = track.querySelector('[data-card]');
    if (!(firstCardEl instanceof HTMLElement)) return 0;
    const cardW = firstCardEl.offsetWidth;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
    return Math.ceil(cardW + gap);
  };

  const scrollByStep = (dir = 1) => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStep();
    const target = track.scrollLeft + dir * step;
    track.scrollTo({ left: target, behavior: 'smooth' });
  };

  // Update active index on scroll using rAF to avoid thrash
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const step = getStep() || 1;
        const idx = Math.round(track.scrollLeft / step);
        setActiveIndex(Math.max(0, Math.min(idx, zodiacData.length - 1)));
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener('scroll', onScroll);
    };
  }, [zodiacData.length]);

  // Autoplay: advance one card every 3.5s (paused on hover/drag or if user prefers reduced motion)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let timer = null;
    const start = () => {
      if (timer || prefersReduced.current) return;
      timer = setInterval(() => {
        if (isPaused || isUserInteracting.current) return;
        const step = getStep();
        if (!step) return;
        const nearEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - step * 0.50;
        if (nearEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
        else track.scrollTo({ left: track.scrollLeft + step, behavior: 'smooth' });
      }, 2000);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    start();
    return () => stop();
  }, [isPaused]);

  // Lazy play/pause videos only when their card is visible in the track (no autoplay attribute)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const card = entry.target;
        const video = card.querySelector('video');
        if (!video) return;
        if (entry.isIntersecting) {
          // Attach src on demand then play (unless prefers reduced motion)
          if (!video.src && video.dataset.src) video.src = video.dataset.src;
          if (!prefersReduced.current) video.play().catch(() => {});
        }
      });
    }, { root: track, rootMargin: '0px', threshold: 0.2 });

    const cards = track.querySelectorAll('[data-card]');
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [zodiacData.length]);

  const getTableData = (zodiac) => ([
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
  ]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-12 pb-6 px-4 font-sans relative overflow-hidden">
      <h1 className="text-5xl sm:text-6xl text-center lg:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent leading-tight">
        {t('free_daily_horoscope')}
      </h1>

      {/* Decorative image (lazy) */}
      <div className="pointer-events-none select-none hidden lg:block absolute -top-10 right-0 z-0">
        <img
          src={cornerImage}
          alt=""
          loading="lazy"
          className="w-96 opacity-20 object-contain translate-x-12 filter blur-sm"
        />
      </div>

      {/* Slider with edge fade mask */}
      <div className="relative z-10">
        {/* Prev/Next */}
        <button
          aria-label="Previous"
          onClick={() => scrollByStep(-1)}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center backdrop-blur-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          aria-label="Next"
          onClick={() => scrollByStep(1)}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center backdrop-blur-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Mask wrapper to fade edges */}
        <div
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          }}
        >
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-2 px-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onPointerDown={() => { isUserInteracting.current = true; }}
            onPointerUp={() => { isUserInteracting.current = false; }}
            onPointerCancel={() => { isUserInteracting.current = false; }}
          >
            {zodiacData.map((zodiac) => (
              <div
                key={zodiac.key}
                data-card
                onClick={() => handleCardClick(zodiac)}
                className="snap-center flex-none w-[260px] sm:w-[300px] lg:w-[320px] group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-5 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                style={{
                  scrollSnapStop: 'always',
                  contentVisibility: 'auto',
                  containIntrinsicSize: '420px 320px',
                }}
              >
                {/* Hover gradient + glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${zodiac.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`}></div>
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${zodiac.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}></div>

                {/* Video (lazy src attach in observer) */}
                <div className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-600/50 group-hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                  <video
                    // No autoplay attribute; we play via IntersectionObserver
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    data-src={zodiac.video}
                    poster={zodiac.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg">
                    {zodiac.name}
                  </h3>
                  <p className="text-gray-300 text-sm">{zodiac.dates}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-2">
          {zodiacData.map((z, i) => (
            <button
              key={z.key}
              aria-label={`Go to ${z.name}`}
              onClick={() => {
                const track = trackRef.current;
                if (!track) return;
                const step = getStep();
                track.scrollTo({ left: i * step, behavior: 'smooth' });
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeIndex ? 'bg-yellow-400 w-6' : 'bg-gray-500/60 hover:bg-gray-400/70'}`}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedZodiac && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 w-full max-w-7xl h-[90vh] rounded-2xl relative shadow-2xl flex flex-col">
            <div className="absolute top-4 right-16 z-0 hidden lg:block">
              <div className="relative">
                <img
                  src={selectedZodiac.image}
                  alt={selectedZodiac.name}
                  className="w-32 h-24 object-contain opacity-70 shadow-lg filter drop-shadow-2xl"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedZodiac.color} opacity-20 rounded-lg`}></div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsPaused(true);
                closeModal();
                setTimeout(() => setIsPaused(false), 400);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-800/50 hover:bg-red-500/20 border border-gray-600/50 hover:border-red-400/50 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all duration-300 z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex-shrink-0 text-center p-6 border-b border-gray-700/30">
              <h2 className={`text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r ${selectedZodiac.color} bg-clip-text text-transparent`}>
                {selectedZodiac.name}
              </h2>
              <p className="text-lg text-gray-300 font-medium">{selectedZodiac.dates}</p>
            </div>

            <div className="flex-1 overflow-hidden p-6">
              <div className="h-full bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/30 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                    <div key={sectionIndex} className="p-4 pt-0">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-black/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300 mb-2"
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
                  ))}

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }

        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(156,163,175,0.5) transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156,163,175,0.5); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(156,163,175,0.8); }
      `}</style>
    </div>
  );
};

export default Three;


// import React, { useState, useEffect, useRef } from 'react';
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

// // Import your video files
// import ariesVideo from '../assets/rasi/10.mp4';
// import taurusVideo from '../assets/rasi/2.mp4';
// import geminiVideo from '../assets/rasi/3.mp4';
// import cancerVideo from '../assets/rasi/4.mp4';
// import leoVideo from '../assets/rasi/5.mp4';
// import virgoVideo from '../assets/rasi/6.mp4';
// import libraVideo from '../assets/rasi/7.mp4';
// import scorpioVideo from '../assets/rasi/8.mp4';
// import sagittariusVideo from '../assets/rasi/9.mp4';
// import capricornVideo from '../assets/rasi/1.mp4';
// import aquariusVideo from '../assets/rasi/11.mp4';
// import piscesVideo from '../assets/rasi/12.mp4';
 
// const Three = () => {
//   const { t } = useTranslation();
//   const [selectedZodiac, setSelectedZodiac] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const cardRefs = useRef([]);

//   const zodiacData = [
//     { key: 'aries', name: t('aries'), image: one, video: ariesVideo, dates: t('aries_dates'), color: 'from-red-500 to-orange-500' },
//     { key: 'taurus', name: t('taurus'), image: two, video: taurusVideo, dates: t('taurus_dates'), color: 'from-green-500 to-emerald-500' },
//     { key: 'gemini', name: t('gemini'), image: three, video: geminiVideo, dates: t('gemini_dates'), color: 'from-yellow-500 to-orange-500' },
//     { key: 'cancer', name: t('cancer'), image: four, video: cancerVideo, dates: t('cancer_dates'), color: 'from-blue-500 to-cyan-500' },
//     { key: 'leo', name: t('leo'), image: five, video: leoVideo, dates: t('leo_dates'), color: 'from-yellow-500 to-amber-500' },
//     { key: 'virgo', name: t('virgo'), image: six, video: virgoVideo, dates: t('virgo_dates'), color: 'from-green-500 to-teal-500' },
//     { key: 'libra', name: t('libra'), image: seven, video: libraVideo, dates: t('libra_dates'), color: 'from-pink-500 to-rose-500' },
//     { key: 'scorpio', name: t('scorpio'), image: eight, video: scorpioVideo, dates: t('scorpio_dates'), color: 'from-purple-600 to-indigo-600' },
//     { key: 'sagittarius', name: t('sagittarius'), image: nine, video: sagittariusVideo, dates: t('sagittarius_dates'), color: 'from-orange-500 to-red-500' },
//     { key: 'capricorn', name: t('capricorn'), image: ten, video: capricornVideo, dates: t('capricorn_dates'), color: 'from-gray-600 to-slate-600' },
//     { key: 'aquarius', name: t('aquarius'), image: eleven, video: aquariusVideo, dates: t('aquarius_dates'), color: 'from-blue-500 to-purple-500' },
//     { key: 'pisces', name: t('pisces'), image: twelve, video: piscesVideo, dates: t('pisces_dates'), color: 'from-teal-500 to-blue-500' }
//   ];

//   // Ensure videos start playing on initial load (muted autoplay)
//   useEffect(() => {
//     const playAll = () => {
//       cardRefs.current.forEach((ref) => {
//         if (!ref) return;
//         const video = ref.querySelector('video');
//         if (video) {
//           video.play().catch(() => {});
//         }
//       });
//     };
//     // Try immediately and after a short delay to catch rendered refs
//     playAll();
//     const id = setTimeout(playAll, 300);
//     return () => clearTimeout(id);
//   }, []);

//   const handleCardClick = (zodiac) => {
//     setSelectedZodiac(zodiac);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedZodiac(null);
//   };

//   // Table data for the selected zodiac
//   const getTableData = (zodiac) => {
//     return [
//       { category: t('basic_info') || 'Basic Information', items: [
//         { property: t('element') || 'Element', value: t(`${zodiac.key}_element`) || 'Fire' },
//         { property: t('ruling_planet') || 'Ruling Planet', value: t(`${zodiac.key}_planet`) || 'Sun' },
//       ]},
//       { category: t('lucky_elements') || 'Lucky Elements', items: [
//         { property: t('lucky_color') || 'Lucky Color', value: t(`${zodiac.key}_color`) || 'Golden' },
//         { property: t('lucky_number') || 'Lucky Number', value: t(`${zodiac.key}_number`) || '7' },
//       ]},
//       { category: t('personality_traits') || 'Personality Traits', items: [
//         { property: t('likes') || 'Likes', value: t(`${zodiac.key}_likes`) || 'Adventure, Leadership' },
//         { property: t('dislikes') || 'Dislikes', value: t(`${zodiac.key}_dislikes`) || 'Waiting, Inactivity' },
//       ]},
//       { category: t('lifestyle') || 'Lifestyle', items: [
//         { property: t('food') || 'Food Preference', value: t(`${zodiac.key}_food`) || 'Spicy food' },
//         { property: t('travel_style') || 'Travel Style', value: t(`${zodiac.key}_travel_style`) || 'Adventure trips' },
//       ]},
//     ];
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-16 px-4 font-sans relative overflow-hidden">

//       <h1 className="text-5xl sm:text-6xl text-center lg:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent leading-tight">
//           {t('free_daily_horoscope')}
//       </h1>

//       {/* Corner decorative image */}
//       <div className="pointer-events-none select-none hidden lg:block absolute -top-10 right-0 z-0">
//         <img
//           src={cornerImage}
//           alt=""
//           className="w-96 opacity-20 object-contain translate-x-12 filter blur-sm"
//         />
//       </div>

//       {/* Zodiac Grid Section */}
//       <div className="relative z-10">
//         {/* Zodiac Grid - Fixed to 3 columns */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {zodiacData.map((zodiac, index) => (
//               <div
//                 key={index}
//                 ref={el => cardRefs.current[index] = el}
//                 onClick={() => handleCardClick(zodiac)}
//                 className="group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-5 text-center transition-all duration-500 hover:-translate-y-3 hover:scale-105 cursor-pointer"
//                 style={{
//                   animationDelay: `${index * 100}ms`,
//                   animation: 'fadeInUp 0.6s ease-out forwards'
//                 }}
//               >
//                 {/* Gradient overlay on hover */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${zodiac.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`}></div>
                
//                 {/* Glowing border effect */}
//                 <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${zodiac.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}></div>
                
//                 {/* Video Container - ALL VIDEOS MUTED */}
//                 <div className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-600/50 group-hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm overflow-hidden">
//                   <video
//                     src={zodiac.video}
//                     autoPlay
//                     loop
//                     muted={true} // All videos are always muted
//                     playsInline
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                     onLoadedData={(e) => {
//                       e.target.play().catch(() => {});
//                     }}
//                   />
//                 </div>

//                 {/* Content */}
//                 <div className="relative z-10">
//                   <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-lg">
//                     {zodiac.name}
//                   </h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Full Width Modal with Icon instead of Video */}
//         {isModalOpen && selectedZodiac && (
//           <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
//             <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 w-full max-w-7xl h-[90vh] rounded-2xl relative shadow-2xl flex flex-col">
              
//               {/* Icon in right corner - REPLACED VIDEO WITH ICON */}
//               <div className="absolute top-4 right-16 z-0 hidden lg:block">
//                 <div className="relative">
//                   <img
//                     src={selectedZodiac.image}
//                     alt={selectedZodiac.name}
//                     className="w-32 h-24 object-contain opacity-70 shadow-lg filter drop-shadow-2xl"
//                   />
//                   {/* Optional: Color overlay for better integration */}
//                   <div className={`absolute inset-0 bg-gradient-to-br ${selectedZodiac.color} opacity-20 rounded-lg`}></div>
//                 </div>
//               </div>

//               {/* Enhanced Close Button */}
//               <button
//                 onClick={closeModal}
//                 className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-800/50 hover:bg-red-500/20 border border-gray-600/50 hover:border-red-400/50 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all duration-300 z-10"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>

//               {/* Modal Header - Fixed */}
//               <div className="flex-shrink-0 text-center p-6 border-b border-gray-700/30">
//                 <h2 className={`text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r ${selectedZodiac.color} bg-clip-text text-transparent`}>
//                   {selectedZodiac.name}
//                 </h2>
//                 <p className="text-lg text-gray-300 font-medium">{selectedZodiac.dates}</p>
//               </div>

//               {/* Modal Content - Scrollable Table */}
//               <div className="flex-1 overflow-hidden p-6">
//                 <div className="h-full bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/30 overflow-hidden flex flex-col">

//                   {/* Scrollable Table Content */}
//                   <div className="flex-1 overflow-y-auto custom-scrollbar">
//                     <div className="">
//                       {/* Additional Information Section - Compact */}
//                       <div className="p-4">
//                         <h4 className={`text-lg font-bold mb-3 bg-gradient-to-r ${selectedZodiac.color} bg-clip-text text-transparent`}>
//                           {t('characteristics') || 'Characteristics'}
//                         </h4>
//                         <div className="bg-black/30 rounded-lg border border-gray-700/50 p-3">
//                           <p className="text-gray-300 leading-relaxed text-sm">
//                             {t(`${selectedZodiac.key}_traits`) || 'Learn about the unique traits and characteristics that define this zodiac sign.'}
//                           </p>
//                         </div>
//                       </div>
//                       {getTableData(selectedZodiac).map((section, sectionIndex) => (
//                         <div key={sectionIndex} className="">
//                           {/* Compact Table Rows */}
//                           <div className="">
//                             {section.items.map((item, itemIndex) => (
//                               <div 
//                                 key={itemIndex} 
//                                 className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-black/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300"
//                               >
//                                 <div className="font-semibold text-gray-300 flex items-center text-sm">
//                                   <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${selectedZodiac.color} mr-2 flex-shrink-0`}></div>
//                                   {item.property}
//                                 </div>
//                                 <div className="text-white font-medium text-sm">
//                                   {item.value}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       ))}

//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* CSS for animations and custom scrollbar */}
//         <style jsx>{`
//           @keyframes fadeInUp {
//             from {
//               opacity: 0;
//               transform: translateY(30px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
          
//           @keyframes fadeIn {
//             from { opacity: 0; }
//             to { opacity: 1; }
//           }
          
//           .animate-fadeIn {
//             animation: fadeIn 0.3s ease-out;
//           }

//           .custom-scrollbar {
//             scrollbar-width: thin;
//             scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
//           }

//           .custom-scrollbar::-webkit-scrollbar {
//             width: 6px;
//           }

//           .custom-scrollbar::-webkit-scrollbar-track {
//             background: transparent;
//           }

//           .custom-scrollbar::-webkit-scrollbar-thumb {
//             background-color: rgba(156, 163, 175, 0.5);
//             border-radius: 3px;
//           }

//           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//             background-color: rgba(156, 163, 175, 0.8);
//           }
//         `}</style>

//       </div>
//   );
// };

// export default Three;
