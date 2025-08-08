import React from "react";
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaWhatsapp } from "react-icons/fa";
import logo from '../assets/logo.png'; // Adjust the path as necessary


export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#11162a] border-t border-slate-800 py-10 text-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Row: Brand and Service Links */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 pb-6 border-b border-slate-700/50">
          {/* Brand and tagline */}
          <div className="flex flex-col items-center lg:items-start lg:max-w-xs">
            <a href="/" className="font-bold text-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-400 to-yellow-300 bg-clip-text text-transparent tracking-wide mb-1"><img src={logo} alt="SriAstroVeda Logo" /></a>
            <div className="text-slate-400 text-sm text-center lg:text-left mb-3">{t('footer_tagline')}</div>
            <div className="flex space-x-3">
              <a href="https://www.instagram.com/sriastroveda" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-400 transition"><FaInstagram /></a>
              <a href="https://www.facebook.com/profile.php?id=61578760447472" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-400 transition"><FaFacebookF /></a>
              {/* <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-rose-400 transition"><FaYoutube /></a> */}
              <a href="https://wa.me/919573999254" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-green-400 transition"><FaWhatsapp /></a>
            </div>
          </div>

          {/* Service Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 flex-1">
            {/* Main Navigation */}
            <div>
              <h4 className="text-slate-400 uppercase text-xs font-bold mb-3 tracking-wider">{t('navigation')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-yellow-300 transition">{t('home')}</a></li>
                <li><a href="/about" className="hover:text-yellow-300 transition">{t('about')}</a></li>
                <li><a href="/contact" className="hover:text-yellow-300 transition">{t('contact')}</a></li>
                <li><a href="/form" className="hover:text-yellow-300 transition">{t('get_reading')}</a></li>
              </ul>
            </div>

            {/* Core Horoscope */}
            <div>
              <h4 className="text-slate-400 uppercase text-xs font-bold mb-3 tracking-wider flex items-center">
                <span className="mr-1">✦</span> {t('core_services_footer')}
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/birth-chart" className="hover:text-yellow-300 transition">{t('birth_chart_footer')}</a></li>
                <li><a href="/match-horoscope" className="hover:text-yellow-300 transition">{t('match_horoscope_footer')}</a></li>
                <li><a href="/ascendant" className="hover:text-yellow-300 transition">{t('ascendant_footer')}</a></li>
                <li><a href="/dasha-analysis" className="hover:text-yellow-300 transition">{t('dasha_analysis_footer')}</a></li>
                <li><a href="/nakshatra" className="hover:text-yellow-300 transition">{t('nakshatra_footer')}</a></li>
                <li><a href="/numerology" className="hover:text-yellow-300 transition">{t('numerology_footer')}</a></li>
              </ul>
            </div>

            {/* Life Predictions */}
            <div>
              <h4 className="text-slate-400 uppercase text-xs font-bold mb-3 tracking-wider flex items-center">
                <span className="mr-1">🔮</span> {t('predictions_footer')}
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/life-predictions" className="hover:text-yellow-300 transition">{t('life_predictions_footer')}</a></li>
                <li><a href="/2025-predictions" className="hover:text-yellow-300 transition">{t('2025_report_footer')}</a></li>
                <li><a href="/daily-horoscope" className="hover:text-yellow-300 transition">{t('daily_horoscope_footer')}</a></li>
                <li><a href="/love-report" className="hover:text-yellow-300 transition">{t('love_report_footer')}</a></li>
                <li><a href="/career-report" className="hover:text-yellow-300 transition">{t('career_report_footer')}</a></li>
                <li><a href="/health-report" className="hover:text-yellow-300 transition">{t('health_report_footer')}</a></li>
              </ul>
            </div>

            {/* Remedial Solutions */}
            <div>
              <h4 className="text-slate-400 uppercase text-xs font-bold mb-3 tracking-wider flex items-center">
                <span className="mr-1">🕉️</span> {t('remedies_footer')}
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/lal-kitab" className="hover:text-yellow-300 transition">{t('lal_kitab_footer')}</a></li>
                <li><a href="/sade-sati" className="hover:text-yellow-300 transition">{t('sade_sati_footer')}</a></li>
                <li><a href="/ask-question" className="hover:text-yellow-300 transition">{t('ask_question_footer')}</a></li>
                <li><a href="/gemstones" className="hover:text-yellow-300 transition">{t('gemstones_footer')}</a></li>
              </ul>
            </div>
          </div>

          {/* Support Section */}
          <div className="lg:max-w-xs">
            <h4 className="text-slate-400 uppercase text-xs font-bold mb-3 tracking-wider">{t('support')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:customercareproductcenter@gmail.com" className="hover:text-yellow-300 transition">
                  customercareproductcenter@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919392277389" className="hover:text-yellow-300 transition">
                  +91 93922 77389
                </a>
              </li>
              <li>
                <a href="https://wa.me/919573999254" className="hover:text-green-300 transition" target="_blank" rel="noopener noreferrer">
                  {t('whatsapp_support')}
                </a>
              </li>
              <li>
                <div className="text-slate-500 text-xs mt-3">
                  {t('available_24_7')}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {t('sri_astro_veda')}. {t('all_rights_reserved')}.
          </div>
          <div className="flex items-center gap-4">
            <span>{t('made_with')} <span className="text-pink-400">♥</span> {t('in_india')}.</span>
            <span className="hidden md:inline">·</span>
            <a href="/privacy-policy" className="hover:text-yellow-300 transition">{t('privacy_policy')}</a>
            <span>·</span>
            <a href="/terms-of-service" className="hover:text-yellow-300 transition">{t('terms_of_service')}</a>
            <span>·</span>
            <a href="/disclaimer" className="hover:text-yellow-300 transition">{t('disclaimer')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
