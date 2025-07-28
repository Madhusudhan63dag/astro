import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 border-t border-indigo-200 pt-12 pb-4 text-indigo-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid */}
        <div className="grid gap-8 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 pb-8 border-b border-indigo-100">
          {/* Company/name & CTA */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text text-transparent tracking-tight">Dhruv Astro Software</span>
            </div>
            <p className="text-indigo-700 mb-5">
              Astrological solutions blending tradition and technology.
            </p>
            <a
              className="inline-block mt-2 bg-gradient-to-r from-fuchsia-300 via-yellow-200 to-indigo-200 text-indigo-900 font-semibold px-5 py-2 rounded-full shadow hover:brightness-110 transition"
              href="#core-services"
            >
              Get Started
            </a>
          </div>
          {/* Navigation */}
          <div>
            <h4 className="font-bold mb-3 text-indigo-900">Navigation</h4>
            <ul className="space-y-2 text-indigo-700">
              <li><a href="#home" className="hover:text-fuchsia-600 transition">Home</a></li>
              <li><a href="#core-services" className="hover:text-fuchsia-600 transition">Core Services</a></li>
              <li><a href="#why-choose" className="hover:text-fuchsia-600 transition">Why Choose Us</a></li>
              <li><a href="#testimonials" className="hover:text-fuchsia-600 transition">Testimonials</a></li>
              <li><a href="#contact" className="hover:text-fuchsia-600 transition">Contact</a></li>
            </ul>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-3 text-indigo-900">Quick Links</h4>
            <ul className="space-y-2 text-indigo-700">
              <li><a href="#pricing" className="hover:text-fuchsia-600 transition">Pricing</a></li>
              <li><a href="#blog" className="hover:text-fuchsia-600 transition">Blog / Learn</a></li>
              <li><a href="#affiliate" className="hover:text-fuchsia-600 transition">Affiliate Program</a></li>
              <li><a href="#login" className="hover:text-fuchsia-600 transition">Login / Dashboard</a></li>
              <li><a href="#privacy" className="hover:text-fuchsia-600 transition">Privacy Policy</a></li>
            </ul>
          </div>
          {/* Contact & Social */}
          <div>
            <h4 className="font-bold mb-3 text-indigo-900">Contact</h4>
            <ul className="text-indigo-700 mb-4">
              <li>Email: <a href="mailto:support@dhruvastro.com" className="hover:text-fuchsia-600 transition">support@dhruvastro.com</a></li>
              <li>Phone: <a href="tel:+911234567890" className="hover:text-fuchsia-600 transition">+91 12345 67890</a></li>
              <li>
                Whatsapp: <a href="https://wa.me/911234567890" className="hover:text-fuchsia-600 transition" target="_blank" rel="noopener noreferrer">Chat now</a>
              </li>
            </ul>
            <div className="flex space-x-4 mt-2 text-xl">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-fuchsia-500 transition"><FaInstagram /></a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-fuchsia-500 transition"><FaFacebookF /></a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-fuchsia-500 transition"><FaTwitter /></a>
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-fuchsia-500 transition"><FaYoutube /></a>
              <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-fuchsia-500 transition"><FaWhatsapp /></a>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-3">
          <div className="text-sm text-indigo-700">
            &copy; {new Date().getFullYear()} Dhruv Astro Software. All rights reserved.
          </div>
          <div className="text-xs text-indigo-400/70">
            Made with <span className="text-pink-500">♥</span> in India.
          </div>
        </div>
      </div>
    </footer>
  );
}
