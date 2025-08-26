import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";

const initial = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initial);
  const [sent, setSent] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Replace with real email send/api
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm(initial);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-black via-gray-900 to-slate-900 min-h-[90vh]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl text-yellow-400">✦</div>
        <div className="absolute top-40 right-20 text-4xl text-amber-400">✧</div>
        <div className="absolute bottom-40 left-20 text-5xl text-yellow-400">✦</div>
        <div className="absolute bottom-20 right-10 text-3xl text-amber-400">✧</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-extrabold text-white text-center mb-2 tracking-tight">
          {t('contact')} <span className="text-yellow-400">{t('us')}</span>
        </h2>
        <p className="text-lg text-gray-300 mb-10 text-center">
          {t('contact_description')}
        </p>
        
        <div className="flex flex-col lg:flex-row lg:gap-10 gap-7 justify-between">
          {/* Info block */}
          <div className="lg:w-1/2 flex flex-col justify-start lg:pt-2">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 space-y-6">
              <div>
                <div className="font-bold text-gray-100 mb-2 flex items-center">
                  <span className="text-yellow-400 mr-2">✉</span>
                  {t('email')}:
                </div>
                <a href="mailto:sriastroveda@gmail.com" className="text-yellow-400 hover:text-amber-300 transition-colors duration-300">
                  sriastroveda@gmail.com
                </a>
              </div>
              
              <div>
                <div className="font-bold text-gray-100 mb-2 flex items-center">
                  {t('phone_whatsapp')}:
                </div>
                <a href="tel:+919392277389" className="text-yellow-400 hover:text-amber-300 transition-colors duration-300 block mb-2">
                  +91 93922 77389
                </a>
                <a 
                  href="https://wa.me/919059821555" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-green-400 hover:text-green-300 transition-colors duration-300 flex items-center gap-2 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20"
                >
                  <FaWhatsapp /> {t('chat_on_whatsapp')}
                </a>
              </div>
              
              <div>
                <div className="font-bold text-gray-100 mb-2 flex items-center">
                  <span className="text-yellow-400 mr-2">🌟</span>
                  {t('follow_us')}:
                </div>
                <div className="flex space-x-4 mt-3">
                  <a 
                    href="https://www.instagram.com/sriastroveda" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-pink-400 transition-colors duration-300 text-2xl p-3 bg-gray-800/50 rounded-lg border border-gray-600/30"
                  >
                    <FaInstagram />
                  </a>
                  <a 
                    href="https://www.facebook.com/profile.php?id=61578760447472" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-2xl p-3 bg-gray-800/50 rounded-lg border border-gray-600/30"
                  >
                    <FaFacebookF />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:w-1/2">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block font-semibold text-gray-100 mb-2" htmlFor="name">
                    {t('full_name')} <span className="text-amber-400">*</span>
                  </label>
                  <input
                    required
                    name="name"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t('enter_full_name')}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-100 mb-2" htmlFor="email">
                    {t('email_address')} <span className="text-amber-400">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t('email_placeholder')}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-100 mb-2" htmlFor="phone">
                    {t('phone_number')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t('phone_placeholder')}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-100 mb-2" htmlFor="subject">
                    {t('subject')}
                  </label>
                  <input
                    name="subject"
                    id="subject"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder={t('subject_placeholder')}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-100 mb-2" htmlFor="message">
                    {t('message')} <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    required
                    name="message"
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none"
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t('message_placeholder')}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {sent ? t('message_sent_success') : t('send_message')}
                </button>

                {sent && (
                  <div className="text-green-400 text-center mt-2 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                    {t('thank_you_message')}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
