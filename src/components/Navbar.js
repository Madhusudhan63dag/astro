import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AstroNavbar = () => {
  const { t, i18n } = useTranslation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');

  const handleMouseEnter = (dropdown) => {
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    setActiveDropdown(null);
    i18n.changeLanguage(langCode);
  };

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    // { code: 'mr', name: 'Marathi', native: 'मराठी' },
    // { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
  ];

  const currentLang = languages.find(lang => lang.code === selectedLanguage);

  const navItems = [
    {
      title: t('core_horoscope'),
      key: "core",
      icon: "✦",
      items: [
        { name: t('birth_chart'), href: "/birth-chart" },
        { name: t('match_horoscope'), href: "/match-horoscope" },
        { name: t('ascendant_analysis'), href: "/ascendant" },
        { name: t('dasha_analysis'), href: "/dasha-analysis" },
        { name: t('nakshatra_report'), href: "/nakshatra" },
        { name: t('numerology'), href: "/numerology" }
      ]
    },
    {
      title: t('life_predictions'),
      key: "predictions",
      icon: "🔮",
      items: [
        { name: t('your_life_predictions'), href: "/life-predictions" },
        { name: t('2025_report'), href: "/2025-predictions" },
        { name: t('year_analysis'), href: "/year-analysis" },
        { name: t('daily_horoscope'), href: "/daily-horoscope" },
        { name: t('love_compatibility'), href: "/love-report" },
        { name: t('career_guidance'), href: "/career-report" },
        { name: t('nature_analysis'), href: "/nature-report" },
        { name: t('health_index'), href: "/health-report" }
      ]
    },
    {
      title: t('remedial_solutions'),
      key: "remedial",
      icon: "🕉️",
      items: [
        { name: t('lal_kitab'), href: "/lal-kitab" },
        { name: t('sade_sati'), href: "/sade-sati" },
        { name: t('ask_question'), href: "/ask-question", price: "₹299" },
        { name: t('gemstones_report'), href: "/gemstones" }
      ]
    }
  ];

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-slate-900 shadow-2xl border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold text-white">
                SriAstro<span className="text-yellow-400">Veda</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium">
              {t('home')}
            </a>

            {navItems.map((item) => (
              <div 
                key={item.key} 
                className="relative group"
                onMouseEnter={() => handleMouseEnter(item.key)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium py-2">
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.title}</span>
                  <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === item.key ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 transition-all duration-300 ${
                  activeDropdown === item.key ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
                }`}>
                  <div className="p-4 space-y-2">
                    {item.items.map((subItem, index) => (
                      <a
                        key={index}
                        href={subItem.href}
                        className="flex items-center justify-between px-3 py-2 text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                      >
                        <span className="text-sm">{subItem.name}</span>
                        {subItem.price && (
                          <span className="text-xs bg-amber-500 text-black px-2 py-1 rounded-full font-semibold">
                            {subItem.price}
                          </span>
                        )}
                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <a href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium">
              {t('about')}
            </a>
            
            <a href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium">
              {t('contact')}
            </a>

            {/* Language Selector */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('language')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium py-2 px-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                <span className="text-sm">🌐</span>
                <span className="text-sm">{currentLang?.native || 'English'}</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'language' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Language Dropdown */}
              <div className={`absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 transition-all duration-300 ${
                activeDropdown === 'language' ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
              }`}>
                <div className="p-3 space-y-1">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-all duration-200 ${
                        selectedLanguage === language.code 
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                          : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{language.native}</span>
                        <span className="text-xs text-gray-500">{language.name}</span>
                      </div>
                      {selectedLanguage === language.code && (
                        <span className="text-yellow-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-yellow-400 transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="py-4 space-y-4 border-t border-gray-700/50">
            <a href="/" className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300">
              {t('home')}
            </a>

            {navItems.map((item) => (
              <div key={item.key} className="px-4">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === `mobile-${item.key}` ? null : `mobile-${item.key}`)}
                  className="flex items-center justify-between w-full py-2 text-left text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === `mobile-${item.key}` ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className={`pl-6 space-y-2 transition-all duration-300 ${activeDropdown === `mobile-${item.key}` ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  {item.items.map((subItem, index) => (
                    <a
                      key={index}
                      href={subItem.href}
                      className="flex items-center justify-between py-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                    >
                      <span>{subItem.name}</span>
                      {subItem.price && (
                        <span className="text-xs bg-amber-500 text-black px-2 py-1 rounded-full font-semibold">
                          {subItem.price}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            <a href="/about" className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300">
              {t('about')}
            </a>
            
            <a href="/contact" className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300">
              {t('contact')}
            </a>

            {/* Mobile Language Selector */}
            <div className="px-4">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'mobile-language' ? null : 'mobile-language')}
                className="flex items-center justify-between w-full py-2 text-left text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">🌐</span>
                  <span>{t('language')} - {currentLang?.native || 'English'}</span>
                </div>
                <svg className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'mobile-language' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className={`pl-6 space-y-2 transition-all duration-300 ${activeDropdown === 'mobile-language' ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full flex items-center justify-between py-2 text-left text-sm transition-colors duration-200 ${
                      selectedLanguage === language.code 
                        ? 'text-yellow-400' 
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>{language.native}</span>
                      <span className="text-xs text-gray-500">{language.name}</span>
                    </div>
                    {selectedLanguage === language.code && (
                      <span className="text-yellow-400">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AstroNavbar;
