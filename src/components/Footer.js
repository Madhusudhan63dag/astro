import React from "react";
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaWhatsapp } from "react-icons/fa";
import logo from '../assets/logo.webp';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#11162a] border-t border-slate-800 py-6 sm:py-10 text-slate-200">
      <div className="px-3 sm:px-4 max-w-7xl mx-auto">
        {/* Top Row: Brand and Service Links */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-6 sm:gap-8 pb-6 sm:pb-8 border-b border-slate-700/50">
          
          {/* Brand and tagline */}
          <div className="flex flex-col items-center lg:items-start lg:max-w-xs">
            <a href="https://sacredrelm.com" className="flex flex-col items-center justify-center mb-3 sm:mb-4">
              <img 
                src={logo} 
                alt="SriAstroVeda Logo" 
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain" 
              /> 
            </a>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 sm:space-x-5">
              <a 
                href="https://www.instagram.com/sriastroveda" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram" 
                className="text-slate-400 hover:text-pink-400 transition-colors duration-300 text-lg sm:text-xl"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61578760447472" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook" 
                className="text-slate-400 hover:text-blue-400 transition-colors duration-300 text-lg sm:text-xl"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://wa.me/919059821555" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp" 
                className="text-slate-400 hover:text-green-400 transition-colors duration-300 text-lg sm:text-xl"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Service Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 flex-1">
            
            {/* Main Navigation */}
            <div className="text-center sm:text-left">
              <h4 className="text-slate-400 uppercase text-xs sm:text-sm font-bold mb-3 sm:mb-4 tracking-wider">
                {t('navigation')}
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <li>
                  <a 
                    href="/" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('home')}
                  </a>
                </li>
                 <li>
                  <a 
                    href="/kundli" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('detailed')}
                  </a>
                </li>
                <li>
                  <a 
                    href="https://sacredrelm.com/about" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('about')}
                  </a>
                </li>
                <li>
                  <a 
                    href="https://sacredrelm.com/contact" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('contact')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Core Horoscope */}
            {/* <div className="text-center sm:text-left">
              <h4 className="text-slate-400 uppercase text-xs sm:text-sm font-bold mb-3 sm:mb-4 tracking-wider flex items-center justify-center sm:justify-start">
                <span className="mr-1 sm:mr-2 text-yellow-400">✦</span> 
                {t('core_services_footer')}
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <li>
                  <a 
                    href="/birth-chart" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('birth_chart_footer')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/match-horoscope" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('match_kundli_footer')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/ascendant" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('ascendant_footer')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/dasha-analysis" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('dasha_analysis_footer')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/nakshatra" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('nakshatra_footer')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/numerology" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('numerology_footer')}
                  </a>
                </li>
              </ul>
            </div> */}

            {/* Life Predictions */}
            {/* <div className="text-center sm:text-left">
              <h4 className="text-slate-400 uppercase text-xs sm:text-sm font-bold mb-3 sm:mb-4 tracking-wider flex items-center justify-center sm:justify-start">
                <span className="mr-1 sm:mr-2">🔮</span> 
                {t('predictions_footer')}
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <li>
                  <a 
                    href="/life-predictions" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('life_predictions_footer')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/2025-predictions" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('2025_report_footer')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/love-report" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('love_report_footer')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/career-report" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('career_report_footer')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/health-report" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('health_report_footer')}
                  </a>
                </li>
              </ul>
            </div> */}

            {/* Remedial Solutions */}
            {/* <div className="text-center sm:text-left">
              <h4 className="text-slate-400 uppercase text-xs sm:text-sm font-bold mb-3 sm:mb-4 tracking-wider flex items-center justify-center sm:justify-start">
                <span className="mr-1 sm:mr-2">🕉️</span> 
                {t('remedies_footer')}
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <li>
                  <a 
                    href="/lal-kitab" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('lal_kitab_footer')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/sade-sati" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('sade_sati_footer')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/ask-question" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('ask_question_footer')}
                  </a>
                </li>
                <li>
                  <a 
                    href="/gemstones" 
                    className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                  >
                    {t('gemstones_footer')}
                  </a>
                </li>
              </ul>
            </div> */}
          </div>

          {/* Support Section */}
          <div className="lg:max-w-xs text-center lg:text-left">
            <h4 className="text-slate-400 uppercase text-xs sm:text-sm font-bold mb-3 sm:mb-4 tracking-wider">
              {t('support')}
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <a href="mailto:hello@sriastroveda.com"  className="hover:text-yellow-300 transition-colors duration-300 block py-1 break-all">
                  hello@sriastroveda.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+919392277389" 
                  className="hover:text-yellow-300 transition-colors duration-300 block py-1"
                >
                  +91 93922 77389
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/919059821555" 
                  className="hover:text-green-300 transition-colors duration-300 block py-1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t('whatsapp_support')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="flex flex-col items-center mt-4 sm:mt-6 gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500">
          
          {/* Copyright */}
          <div className="text-center">
            &copy; {new Date().getFullYear()} {t('sri_astro_veda')}. {t('all_rights_reserved')}.
          </div>
          
          {/* Made with Love */}
          <div className="text-center">
            <span>{t('made_with')} <span className="text-pink-400">♥</span> {t('in_india')}.</span>
          </div>
          
          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center">
            <a 
              href="/privacy-policy" 
              className="hover:text-yellow-300 transition-colors duration-300 px-1"
            >
              {t('privacy_policy')}
            </a>
            <span className="text-slate-600">·</span>
            <a 
              href="/terms-of-service" 
              className="hover:text-yellow-300 transition-colors duration-300 px-1"
            >
              {t('terms_of_service')}
            </a>
            <span className="text-slate-600 hidden sm:inline">·</span>
            {/* <a 
              href="/shipping-policy" 
              className="hover:text-yellow-300 transition-colors duration-300 px-1"
            >
              {t('shipping_policy')}
            </a>
            <span className="text-slate-600">·</span>
             <a 
              href="/cancellation" 
              className="hover:text-yellow-300 transition-colors duration-300 px-1"
            >
              {t('Cancellation')}
            </a>
            <span className="text-slate-600">·</span> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
