import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Five() {
  const { t } = useTranslation();
  const [variant, setVariant] = useState('accordion'); // 'accordion' | 'compact'
  const [openIndex, setOpenIndex] = useState(0);

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

  const renderAnswer = (answer) => (
    <>
      {answer.split('**').map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-yellow-400 font-semibold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );

  return (
    <section className="pt-10 bg-gradient-to-br from-black via-gray-900 to-slate-900">
      <div className="px-6">
        <h2 className="text-5xl font-extrabold text-white mb-6 text-center tracking-tight leading-tight">
          {t('why_choose')} <span className="text-gradient bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">{t('sri_astro_veda')}</span>
        </h2>

        {/* Accordion variant: multiple open via <details> */}
        {variant === 'accordion' && (
          <div className="space-y-4">
            {qaItems.map(({ question, answer }, idx) => (
              <details key={idx} className="group bg-black/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 md:p-6 open:bg-black/70 open:border-yellow-400/40 transition-all">
                <summary className="list-none flex items-center justify-between gap-4 cursor-pointer select-none">
                  <span className="text-xl md:text-2xl font-semibold text-white group-open:text-yellow-300">{question}</span>
                  <span className="text-yellow-400 flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                    <FiChevronDown className="transition-transform duration-300 group-open:rotate-180" />
                  </span>
                </summary>
                <div className="mt-4 text-gray-300 text-base md:text-lg leading-relaxed">
                  {renderAnswer(answer)}
                </div>
              </details>
            ))}
          </div>
        )}

        {/* Compact variant: single-open, left-accent cards */}
        {variant === 'compact' && (
          <div className="space-y-3">
            {qaItems.map(({ question, answer }, idx) => {
              const isOpen = openIndex === idx
              return (
                <div
                  key={idx}
                  className={`border rounded-xl overflow-hidden transition-all ${isOpen ? 'border-yellow-400/60 bg-black/70' : 'border-gray-700/50 bg-black/50 hover:border-yellow-400/40'}`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 px-4 md:px-6 py-4"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-1.5 h-8 rounded ${isOpen ? 'bg-yellow-400' : 'bg-gray-600'}`} />
                      <span className={`text-left text-lg md:text-xl font-semibold ${isOpen ? 'text-yellow-300' : 'text-white'}`}>{question}</span>
                    </div>
                    {isOpen ? (
                      <FiChevronUp className="text-yellow-400" />
                    ) : (
                      <FiChevronDown className="text-gray-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 md:px-6 pb-5 text-gray-300 text-base md:text-lg leading-relaxed border-t border-gray-700/50">
                      {renderAnswer(answer)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  );
}
