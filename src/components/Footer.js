import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#11162a] border-t border-slate-800 py-10 text-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Row: Brand and Links */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-8 pb-6 border-b border-slate-700/50">
          {/* Brand and tagline */}
          <div className="flex flex-col items-center md:items-start">
            <a href="/" className="font-bold text-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-400 to-yellow-300 bg-clip-text text-transparent tracking-wide mb-1">AstroVastu</a>
            <div className="text-slate-400 text-sm text-center md:text-left mb-1">Astrology & Vastu. Modern, Personal, Trusted.</div>
            <div className="flex space-x-3 mt-2">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-400 transition"><FaInstagram /></a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-400 transition"><FaFacebookF /></a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-sky-400 transition"><FaTwitter /></a>
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-rose-400 transition"><FaYoutube /></a>
              <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-green-400 transition"><FaWhatsapp /></a>
            </div>
          </div>

          {/* Navigation & Contact */}
          <div className="flex flex-col md:flex-row gap-7 md:gap-12 items-center">
            {/* Navigation */}
            <nav>
              <h4 className="text-slate-400 uppercase text-xs font-bold mb-2 tracking-wider">Navigation</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="/" className="hover:text-yellow-300 transition">Home</a></li>
                <li><a href="/personal" className="hover:text-yellow-300 transition">Personal Chart</a></li>
                <li><a href="/horoscope" className="hover:text-yellow-300 transition">Horoscope</a></li>
                <li><a href="/pricing" className="hover:text-yellow-300 transition">Pricing</a></li>
                <li><a href="/contact" className="hover:text-yellow-300 transition">Contact Us</a></li>
              </ul>
            </nav>
            {/* Support */}
            <div>
              <h4 className="text-slate-400 uppercase text-xs font-bold mb-2 tracking-wider">Support</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="mailto:support@astrovastu.com" className="hover:text-yellow-300 transition">
                    support@astrovastu.com
                  </a>
                </li>
                <li>
                  <a href="tel:+911234567890" className="hover:text-yellow-300 transition">
                    +91 12345 67890
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/911234567890" className="hover:text-green-300 transition" target="_blank" rel="noopener noreferrer">
                    WhatsApp Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} AstroVastu. All rights reserved.
          </div>
          <div>
            Made with <span className="text-pink-400">♥</span> in India.
            {/** Optionally add Privacy Policy and Terms */}
            {/* <span className="mx-2">·</span>
            <a href="/privacy" className="underline hover:text-yellow-300">Privacy Policy</a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
