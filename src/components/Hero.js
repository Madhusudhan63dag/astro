// Hero.jsx (or Hero.tsx if using TypeScript)
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from 'react-i18next';

// Assets (keep your existing ones)
import sampleVideo from '../assets/banner/banner.mp4';
import three from '../assets/8.webp';

import mobile_banner from '../assets/banner/mobile_banner.webp';
import mobile_banner2 from '../assets/banner/mobile_banner2.webp';
import mobile_banner3 from '../assets/banner/mobile_banner3.webp';
import mobile_banner4 from '../assets/banner/mobile_banner4.webp';
import mobile_banner5 from '../assets/banner/mobile_banner5.webp';


// Optional extra banners (add/replace as needed)
import banner2 from '../assets/banner/banner2.webp';
import banner3 from '../assets/banner/banner3.webp';
import banner4 from '../assets/banner/banner4.webp';
import banner5 from '../assets/banner/banner5.webp';


// Swiper imports (npm i swiper)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';


// // -------------------- KundliModal --------------------
const KundliModal = ({ show, onClose }) => {
  const { t } = useTranslation();
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300 p-4">
      <div className="bg-black/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden max-w-4xl w-full max-h-[90vh] border border-gray-700/50 relative animate-fadeIn">
        <button className="absolute top-3 right-3 text-2xl text-yellow-400 hover:text-amber-300 transition z-10" onClick={onClose} aria-label="Close">&times;</button>

        <div className="lg:w-[300px] w-full flex items-center justify-center p-4 lg:p-6">
          <img src={three} alt="Vedic Kundli Sample" className="object-contain w-full h-48 sm:h-60 lg:h-full rounded-lg max-w-[280px]" style={{ boxShadow: "0 8px 28px rgba(251, 191, 36, 0.3)" }} loading="lazy" />
        </div>

        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:px-7">
          <div>
            <div className="mb-2 flex items-center gap-2 text-yellow-400 text-sm sm:text-base font-semibold">
              <span>✦</span> {t('200_pages')} | {t('20_years_predictions')}
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-2 tracking-tight">
              {t('personalized_kundli')}—<span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">{t('most_detailed_india')}</span>
            </h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
              {t('cosmic_blueprint_description')} <span className="font-semibold text-yellow-400">{t('200_pages')}</span> {t('predictions_doshas_remedies')} <b>{t('customized_for_you')}</b>.
            </p>
          </div>
          <a href="/kundli" className="inline-block w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold shadow-lg rounded-lg py-3 text-center text-base sm:text-lg transition-all duration-300 transform hover:scale-105">
            {t('check_sample_kundli')}
          </a>
        </div>
      </div>
    </div>
  );
};

// -------------------- Hero --------------------
const Hero = () => {
  const { t } = useTranslation();
  // State for modals (unchanged)
  const [showKundliModal, setShowKundliModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [kundliModalClosed, setKundliModalClosed] = useState(false);
  // Slider active indices
  const [activeDesktopIndex, setActiveDesktopIndex] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  // VALID refs (do not make them conditional)
  const videoRef = useRef(null);

  const features = [
    { text: t('detailed_reports') },
    // { text: t('horoscope_matching') },
    // { text: t('astrology_systems') },
  ];

  // Show services modal after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowServicesModal(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Show kundli modal after services closed
  useEffect(() => {
    const timer = setTimeout(() => setShowKundliModal(true), 5000);
    return () => clearTimeout(timer);
    // if (kundliModalClosed) {
    // }
  }, [kundliModalClosed]);

  const handleServicesModalClose = () => {
    setShowServicesModal(false);
    setKundliModalClosed(true);
  };
  const handleKundliModalClose = () => setShowKundliModal(false);

  // Nudge autoplay for video on first slide
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    if (v.readyState >= 2) {
      tryPlay();
    } else {
      v.addEventListener('canplay', tryPlay, { once: true });
      return () => v.removeEventListener('canplay', tryPlay);
    }
  }, []);

  // Pause video when not on first slide
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (activeDesktopIndex === 0) v.play().catch(() => {}); else v.pause();
  }, [activeDesktopIndex]);

  const customStyles = `
    /* Keep your existing responsive .hero-* rules here */
    @keyframes fadeIn { from { opacity:0; transform: translateY(20px);} to { opacity:1; transform: translateY(0);} }
    .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
  `;

  // Slides lists
  const desktopSlides = [
    { type: 'video', src: sampleVideo },
    // { type: 'image', src: banner2, alt: 'Banner B' },
    // { type: 'image', src: banner4, alt: 'Banner C' },
    // { type: 'image', src: banner5, alt: 'Banner D' },
    // { type: 'image', src: banner3, alt: 'Banner E' },
  ];
  const mobileSlides = [
    { type: 'image', src: mobile_banner,  alt: 'SriAstroVeda Mobile Banner', eager: true },
    // { type: 'image', src: mobile_banner2, alt: 'Mobile Banner B' },
    // { type: 'image', src: mobile_banner3, alt: 'Mobile Banner C' },
    // { type: 'image', src: mobile_banner4, alt: 'Mobile Banner D' },
    // { type: 'image', src: mobile_banner5, alt: 'Mobile Banner E' },
  ];

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* MOBILE: slider with CTA visible only on first slide */}
      <section className="relative w-full h-[80vh] sm:h-[80vh] flex lg:hidden items-end overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade, A11y]}
            slidesPerView={1}
            loop
            effect="fade"
            speed={800}
            autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            onSlideChange={(swiper) => setActiveMobileIndex(swiper.realIndex)}
            className="w-full h-full"
          >
            {mobileSlides.map((s, idx) => (
              <SwiperSlide key={idx}>
                <a href="/kundli">
                  <img
                    src={s.src}
                    alt={s.alt}
                    className="absolute inset-0 w-full h-full"
                    loading={s.eager ? 'eager' : 'lazy'}
                    draggable={false}
                    />
                  <div className="absolute inset-0 bg-black/40" />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {activeMobileIndex === 0 && (
          <div className="relative z-10 w-full px-4 pb-6">
            <a
              href="/kundli"
              className="hero-button inline-block mx-auto px-8 py-4 text-lg rounded-lg font-bold bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center"
            >
              {t('get_my_report')} →
            </a>
          </div>
        )}
      </section>

      {/* DESKTOP: background slider; overlay shown only for first slide */}
      <section className="relative w-full min-h-[46.875vw] max-h-screen hidden lg:flex items-start px-4 sm:px-6 lg:px-9 overflow-hidden">
        {/* Background Swiper */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade, A11y]}
            slidesPerView={1}
            loop
            effect="fade"
            speed={800}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            navigation
            onSlideChange={(swiper) => setActiveDesktopIndex(swiper.realIndex)}
            className="w-full h-full"
          >
            {/* Slide 0: original video (valid ref via callback) */}
            <SwiperSlide>
              <div className="absolute inset-0 w-full h-full">
                <video
                  ref={(el) => { videoRef.current = el; }}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-label="Background video"
                  style={{ objectPosition: 'center center' }}
                >
                  <source src={sampleVideo} type="video/mp4" />
                </video>
              </div>
              {/* <div className="absolute inset-0 bg-black/40" /> */}
            </SwiperSlide>

              {/* Other slides: banners only */}
              {desktopSlides.slice(1).map((s, i) => (
                <SwiperSlide key={i + 1}>
                  <a href="/kundli">
                    <div className="absolute inset-0 w-full h-full">
                      <img
                        src={s.src}
                        alt={s.alt}
                        className="w-full h-full "
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                  </a>  
                  {/* <div className="absolute inset-0 bg-black/40" /> */}
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        {/* Original overlay content — only on first slide */}
        {activeDesktopIndex === 0 && (
          <div className="relative z-10 text-center lg:text-left w-full lg:w-1/2 h-full flex flex-col justify-start pt-8 lg:pt-12">
            <div className="flex-1 flex flex-col justify-between">
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

              <div className="pb-8 lg:pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-3 max-w-2xl lg:max-w-full mx-auto lg:mx-0">
                  {features.map((feature, i) => (
                    <div key={i} className="hero-features flex items-center gap-2 sm:gap-3 text-gray-300 text-xs sm:text-sm lg:text-base font-medium bg-black/40 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-700/50">
                      <span className="text-yellow-400 text-sm">✓</span>
                      {feature.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Keep your modals (import or inline as before) */}
      {/* <ServicesModal show={showServicesModal} onClose={handleServicesModalClose} /> */}
      {/* <KundliModal show={showKundliModal} onClose={handleKundliModalClose} />  */}
    </div>
  );
};

export default Hero;



