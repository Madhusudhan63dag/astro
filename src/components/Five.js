import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Five() {
  const { t } = useTranslation();
  const [variant] = useState('accordion'); // 'accordion' | 'compact'
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
      question: t('saving_notes_question'),
      answer: t('saving_notes_answer'),
    },
    {
      question: t('devices_question'),
      answer: t('devices_answer'),
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
    <section className=" bg-gradient-to-br from-black via-gray-900 to-slate-900">
      <div className="px-6">
        <h2 className="text-5xl font-extrabold text-white mb-6 text-center tracking-tight leading-tight">
          {t('why_choose')} 
        </h2>

        {/* Accordion variant: single-open, controlled (no native <details> to avoid toggle glitches) */}
        {variant === 'accordion' && (
          <div className="space-y-4">
            {qaItems.map(({ question, answer }, idx) => {
              const isOpen = openIndex === idx;
              const headerId = `faq-acc-header-${idx}`;
              const panelId = `faq-acc-panel-${idx}`;
              return (
                <div
                  key={idx}
                  className={`group rounded-xl border transition-all backdrop-blur-md p-4 ${
                    isOpen
                      ? 'bg-black/70 border-yellow-400/40'
                      : 'bg-black/60 border-gray-700/50'
                  }`}
                >
                  <button
                    id={headerId}
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full list-none flex items-center justify-between cursor-pointer select-none text-left"
                  >
                    <span className={`text-xl md:text-xl font-semibold ${isOpen ? 'text-yellow-300' : 'text-white'}`}>{question}</span>
                    <span className="text-yellow-400 flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                      <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      className="text-gray-300 text-base md:text-lg leading-relaxed mt-2"
                    >
                      {renderAnswer(answer)}
                    </div>
                  )}
                </div>
              );
            })}
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
