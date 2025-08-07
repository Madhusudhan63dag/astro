import React from "react";
import { useTranslation } from 'react-i18next';

export default function Five() {
  const { t } = useTranslation();

  const qaItems = [
    {
      question: t('unlimited_kundlis_question'),
      answer: t('unlimited_kundlis_answer'),
    },
    {
      question: t('kundli_reports_question'),
      answer: t('kundli_reports_answer'),
    },
    {
      question: t('branding_question'),
      answer: t('branding_answer'),
    },
    {
      question: t('saving_notes_question'),
      answer: t('saving_notes_answer'),
    },
    {
      question: t('devices_question'),
      answer: t('devices_answer'),
    },
    {
      question: t('astrology_systems_question'),
      answer: t('astrology_systems_answer'),
    },
    {
      question: t('data_safety_question'),
      answer: t('data_safety_answer'),
    },
    {
      question: t('advertising_question'),
      answer: t('advertising_answer'),
    },
    {
      question: t('client_management_question'),
      answer: t('client_management_answer'),
    },
    {
      question: t('customize_charts_question'),
      answer: t('customize_charts_answer'),
    },
    {
      question: t('discounts_question'),
      answer: t('discounts_answer'),
    },
   
    {
      question: t('languages_question'),
      answer: t('languages_answer'),
    },
  ];

  return (
    <section className="pt-10 bg-gradient-to-br from-black via-gray-900 to-slate-900">
      <div className="px-6">
        <h2 className="text-5xl font-extrabold text-white mb-14 text-center tracking-tight leading-tight">
          {t('why_choose')} <span className="text-gradient bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">{t('sri_astro_veda')}</span>
        </h2>
        <div className="">
          {qaItems.map(({ question, answer }, idx) => (
            <div key={idx} className="group bg-black/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 hover:bg-black/70 hover:border-yellow-400/50 transition-all duration-300">
              <dt className="text-2xl font-semibold text-white mb-4 leading-snug transition-colors group-hover:text-yellow-300 cursor-pointer">
                {question}
              </dt>
              <dd className="text-gray-300 text-lg leading-relaxed group-hover:text-gray-200 transition-colors">
                {answer.split('**').map((part, i) => 
                  i % 2 === 1 ? (
                    <span key={i} className="text-yellow-400 font-semibold">
                      {part}
                    </span>
                  ) : (
                    part
                  )
                )}
              </dd>
              <div className="w-20 h-1 mt-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
