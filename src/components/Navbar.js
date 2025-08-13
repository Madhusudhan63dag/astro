import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png';
import logovideo from '../assets/logo.gif';

const AstroNavbar = () => {
  const { t, i18n } = useTranslation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseEnter = (dropdown) => {
    // Only handle mouse events on desktop
    if (window.innerWidth >= 1024) {
      setActiveDropdown(dropdown);
    }
  };

  const handleMouseLeave = () => {
    // Only handle mouse events on desktop
    if (window.innerWidth >= 1024) {
      setActiveDropdown(null);
    }
  };

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    setActiveDropdown(null);
    i18n.changeLanguage(langCode);
    // Close mobile menu after language change
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
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
        { name: t('ask_question'), href: "/ask-question" },
        { name: t('gemstones_report'), href: "/gemstones" }
      ]
    }
  ];

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-slate-900 shadow-2xl border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div>
              <a href="/" className='flex flex-col items-center justify-center'>
                <img 
                  src={logovideo} 
                  className="h-20 sm:h-24 lg:h-28 w-auto object-contain" 
                  alt="SriAstroVeda Logo" 
                />
              </a>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">

            <a href="/" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium text-sm xl:text-sm">
              {t('home')}
            </a>
            <a href="/kundli" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium text-sm xl:text-sm">
              {t('detailed')}
            </a>

            {navItems.map((item) => (
              <div 
                key={item.key} 
                className="relative group"
                onMouseEnter={() => handleMouseEnter(item.key)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center space-x-1 xl:space-x-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium py-2 text-sm xl:text-base">
                  <span className="text-xs xl:text-sm">{item.icon}</span>
                  <span className="whitespace-nowrap">{item.title}</span>
                  <svg className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-200 ${activeDropdown === item.key ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Desktop Dropdown Menu */}
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 xl:w-72 bg-black/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 transition-all duration-300 ${
                  activeDropdown === item.key ? 'opacity-100 visible transform translate-y-0 -translate-x-1/2' : 'opacity-0 invisible transform -translate-y-2 -translate-x-1/2'
                }`}>
                  <div className="p-3 xl:p-4 space-y-1 xl:space-y-2">
                    {item.items.map((subItem, index) => (
                      <a
                        key={index}
                        href={subItem.href}
                        className="flex items-center justify-between px-2 xl:px-3 py-2 text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                      >
                        <span className="text-xs xl:text-sm">{subItem.name}</span>
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

            {/* <a href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium text-sm xl:text-sm">
              {t('about')}
            </a> */}
            <a href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium text-sm xl:text-sm">
              {t('contact')}
            </a>

            {/* Desktop Language Selector */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('language')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center space-x-1 xl:space-x-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium py-2 px-2 xl:px-3 bg-gray-800/50 rounded-lg border border-gray-600/30 text-sm xl:text-base">
                <span className="text-xs xl:text-sm">🌐</span>
                <span className="text-xs xl:text-sm whitespace-nowrap">{currentLang?.native || 'English'}</span>
                <svg className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-200 ${activeDropdown === 'language' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Desktop Language Dropdown */}
              <div className={`absolute top-full right-0 mt-2 w-44 xl:w-48 bg-black/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 transition-all duration-300 ${
                activeDropdown === 'language' ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
              }`}>
                <div className="p-2 xl:p-3 space-y-1">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full flex items-center justify-between px-2 xl:px-3 py-2 text-left rounded-lg transition-all duration-200 ${
                        selectedLanguage === language.code 
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                          : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs xl:text-sm font-medium">{language.native}</span>
                        <span className="text-xs text-gray-500">{language.name}</span>
                      </div>
                      {selectedLanguage === language.code && (
                        <span className="text-yellow-400 text-sm">✓</span>
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
            className="lg:hidden text-gray-300 hover:text-yellow-400 transition-colors duration-300 p-2 -mr-2"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}>
          <div className="py-3 sm:py-4 space-y-1 border-t border-gray-700/50">
            
            {/* Mobile Navigation Links */}
            {/* <a 
              href="/about" 
              className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-300 hover:text-yellow-400 hover:bg-gray-800/30 rounded-lg mx-2 transition-colors duration-300 text-sm sm:text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('about')}
            </a> */}

            <a 
              href="/kundli" 
              className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-300 hover:text-yellow-400 hover:bg-gray-800/30 rounded-lg mx-2 transition-colors duration-300 text-sm sm:text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('detailed')}
            </a>

            {/* Mobile Dropdown Items */}
            {navItems.map((item) => (
              <div key={item.key} className="mx-2">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === `mobile-${item.key}` ? null : `mobile-${item.key}`)}
                  className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-gray-300 hover:text-yellow-400 hover:bg-gray-800/30 rounded-lg transition-colors duration-300 font-medium text-sm sm:text-base"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="text-sm sm:text-base">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 flex-shrink-0 ${activeDropdown === `mobile-${item.key}` ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Mobile Submenu */}
                <div className={`transition-all duration-300 ease-in-out ${
                  activeDropdown === `mobile-${item.key}` 
                    ? 'max-h-96 opacity-100 mt-1' 
                    : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  <div className="pl-4 sm:pl-6 pr-2 space-y-1">
                    {item.items.map((subItem, index) => (
                      <a
                        key={index}
                        href={subItem.href}
                        className="flex items-center justify-between py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-400 hover:text-yellow-400 hover:bg-gray-800/20 rounded-lg transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="flex-1 pr-2">{subItem.name}</span>
                        {subItem.price && (
                          <span className="text-xs bg-amber-500 text-black px-2 py-1 rounded-full font-semibold flex-shrink-0">
                            {subItem.price}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <a 
              href="/contact" 
              className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-300 hover:text-yellow-400 hover:bg-gray-800/30 rounded-lg mx-2 transition-colors duration-300 text-sm sm:text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('contact')}
            </a>

            {/* Mobile Language Selector */}
            <div className="mx-2">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'mobile-language' ? null : 'mobile-language')}
                className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-gray-300 hover:text-yellow-400 hover:bg-gray-800/30 rounded-lg transition-colors duration-300 font-medium text-sm sm:text-base"
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-sm sm:text-base">🌐</span>
                  <span>{t('language')} - {currentLang?.native || 'English'}</span>
                </div>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 flex-shrink-0 ${activeDropdown === 'mobile-language' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Mobile Language Submenu */}
              <div className={`transition-all duration-300 ease-in-out ${
                activeDropdown === 'mobile-language' 
                  ? 'max-h-96 opacity-100 mt-1' 
                  : 'max-h-0 opacity-0 overflow-hidden'
              }`}>
                <div className="pl-4 sm:pl-6 pr-2 space-y-1">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full flex items-center justify-between py-2 sm:py-3 px-2 sm:px-3 text-left text-xs sm:text-sm rounded-lg transition-colors duration-200 ${
                        selectedLanguage === language.code 
                          ? 'text-yellow-400 bg-yellow-500/10' 
                          : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-800/20'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{language.native}</span>
                        <span className="text-xs text-gray-500">{language.name}</span>
                      </div>
                      {selectedLanguage === language.code && (
                        <span className="text-yellow-400 text-sm flex-shrink-0">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AstroNavbar;
