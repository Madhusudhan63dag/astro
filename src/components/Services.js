import React from "react";
import { useTranslation } from 'react-i18next';
import services from "../assets/services.png";

export default function Services() {
  const { t } = useTranslation();

  const service = [
    {
      title: t('match_kundli'),
      desc: t('match_kundli_desc'),
      cta: t('match_now'),
      link: "/match-kundli",
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
    <section id="core-services" className="bg-black">
      <div className=" flex flex-col md:flex-row items-center md:items-center justify-between relative p-3">
        {/* Left - First 4 Services */}
        <div className="flex flex-col z-10 gap-6 flex-1 w-full max-w-xs px-2 md:px-0">
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
        <div className="flex justify-center z-0 items-center max-w-sm md:max-w-4xl">
          <img
            src={services}
            alt="Spiritual Services"
            className="w-full md:w-full lg:w-[45rem] object-cover"
            loading="lazy"
          />
        </div>
        
        {/* Right - Last 4 Services */}
        <div className="flex flex-col gap-6 z-10 flex-1 w-full max-w-xs px-2 md:px-0">
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
    </section>
  );
}
