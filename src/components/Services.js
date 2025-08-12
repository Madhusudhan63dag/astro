import React from "react";
import { useTranslation } from 'react-i18next';
import services from "../assets/services.png";
import { getFormattedPrice, PRICE_KEYS } from '../config/prices';

export default function Services() {
  const { t } = useTranslation();

  const service = [
    {
      title: t('match_horoscope'),
      desc: t('match_horoscope_desc'),
      cta: t('match_now'),
      link: "/match-horoscope",
    },
    {
      title: t('your_life_predictions'),
      desc: t('life_predictions_desc'),
      cta: t('view_predictions'),
      link: "/life-predictions",
    },
    {
      title: t('ask_question_price'),
      desc: t('ask_question_desc'),
      cta: t('ask_now'),
      link: "/ask-question",
    },
    {
      title: t('career_guidance'),
      desc: t('career_desc'),
      cta: t('explore_career'),
      link: "/career-report",
    },
    {
      title: t('love_compatibility'),
      desc: t('love_desc'),
      cta: t('check_love_life'),
      link: "/love-report",
    },
    {
      title: t('2025_personalized_report'),
      desc: t('2025_report_desc'),
      cta: t('get_2025_report'),
      link: "/2025-predictions",
    },
    {
      title: t('dasha_phal_analysis'),
      desc: t('dasha_analysis_desc'),
      cta: t('analyze_now'),
      link: "/dasha-analysis",
    },
    {
      title: t('sade_sati_report'),
      desc: t('sade_sati_desc'),
      cta: t('check_sade_sati'),
      link: "/sade-sati",
    }
  ];

  return (
    <section
      id="core-services"
      className="bg-gradient-to-br from-black via-gray-900 to-slate-900 py-16 px-2"
    >
      <div className=" flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Left - First 4 Services */}
        <div className="flex flex-col gap-6 flex-1 w-full max-w-xs px-2 md:px-0">
          {service.slice(0, 4).map((item) => (
            <div
              key={item.title}
              className="bg-black/60 backdrop-blur-md rounded-lg p-4 shadow-xl border-l-4 border-yellow-500 hover:border-yellow-400 transition group md:mr-[-16px] border border-gray-700/50"
            >
              <h3 className="text-lg font-semibold text-white group-hover:text-yellow-200">
                {item.title}
              </h3>
              <p className="text-sm text-gray-300">{item.desc}</p>
              <a
                href={item.link}
                className="inline-block mt-1 text-sm text-yellow-300 font-medium group-hover:text-yellow-200 underline"
              >
                {item.cta}
              </a>
            </div>
          ))}
        </div>
        
        {/* Center Image - Larger Size */}
        <div className="flex justify-center items-center max-w-sm md:max-w-lg">
          <img
            src={services}
            alt="Spiritual Services"
            className="w-full md:w-[600px] lg:w-full object-contain p-3"
            loading="lazy"
          />
        </div>
        
        {/* Right - Last 4 Services */}
        <div className="flex flex-col gap-6 flex-1 w-full max-w-xs px-2 md:px-0">
          {service.slice(4, 8).map((item) => (
            <div
              key={item.title}
              className="bg-black/60 backdrop-blur-md rounded-lg p-4 shadow-xl border-r-4 border-yellow-500 hover:border-yellow-400 transition group md:ml-[-16px] border border-gray-700/50"
            >
              <h3 className="text-lg font-semibold text-white group-hover:text-yellow-200">
                {item.title}
              </h3>
              <p className="text-sm text-gray-300">{item.desc}</p>
              <a
                href={item.link}
                className="inline-block mt-1 text-sm text-yellow-300 font-medium group-hover:text-yellow-200 underline"
              >
                {item.cta}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Example usage: replace hardcoded prices */}
      <div className="service-card">
        {/* ...existing code... */}
        <div className="text-sm font-semibold">
          {getFormattedPrice(PRICE_KEYS.birthChart)}
        </div>
      </div>

      {/* Repeat for each service item */}
      {/* e.g., match horoscope */}
      <div className="service-card">
        {/* ...existing code... */}
        <div className="text-sm font-semibold">
          {getFormattedPrice(PRICE_KEYS.matchHoroscope)}
        </div>
      </div>
    </section>
  );
}
