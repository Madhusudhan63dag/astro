import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MatchHoroscope = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    // Partner 1 (Male/Primary)
    partner1: {
      name: '',
      gender: 'male',
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: ''
    },
    // Partner 2 (Female/Secondary)
    partner2: {
      name: '',
      gender: 'female',
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: ''
    }
  });
  const [isMatching, setIsMatching] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false); // New state for thank you message
  const [matchResult, setMatchResult] = useState(null);

  const handleInputChange = (partner, field, value) => {
    setFormData(prev => ({
      ...prev,
      [partner]: {
        ...prev[partner],
        [field]: value
      }
    }));
  };

  const handleMatchHoroscope = (e) => {
    e.preventDefault();
    setIsMatching(true);
    
    // Show thank you message immediately after submission
    setTimeout(() => {
      setIsMatching(false);
      setShowThankYou(true);
    }, 2000);
  };

  const getCompatibilityColor = (percentage) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCompatibilityStatus = (percentage) => {
    if (percentage >= 80) return t('excellent_match');
    if (percentage >= 60) return t('good_match');
    return t('average_match');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl text-yellow-400">✦</div>
        <div className="absolute top-40 right-20 text-4xl text-amber-400">✧</div>
        <div className="absolute bottom-40 left-20 text-5xl text-yellow-400">✦</div>
        <div className="absolute bottom-20 right-10 text-3xl text-amber-400">✧</div>
        <div className="absolute top-1/2 left-1/4 text-3xl text-yellow-300">✦</div>
        <div className="absolute top-1/3 right-1/3 text-2xl text-amber-300">✧</div>
      </div>

      <div className="relative z-10 py-16 px-4">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            {t('match_your')} <span className="text-yellow-400">{t('horoscopes')}</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              {t('for_perfect_union')}
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('match_horoscope_description')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Thank You Message */}
          {showThankYou && (
            <div className="mb-12 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-8 border border-green-500/30 text-center">                
                <h2 className="text-3xl font-bold text-white mb-4">
                  {t('thank_you_submission')}
                </h2>
                
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  {t('data_received_message')}
                </p>

                {/* Security and Timeline Info */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-center mb-4">
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('your_data_secure')}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {t('data_security_message')}
                    </p>
                  </div>

                  <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-center mb-4">
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('response_within_12_hours')}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {t('response_time_message')}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                    {t('need_immediate_help')}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
                    <a 
                      href="tel:+919392277389" 
                      className="text-yellow-400 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2"
                    >
                      +91 93922 77389
                    </a>
                    <span className="text-gray-500 hidden sm:inline">|</span>
                    <a 
                      href="https://wa.me/919573999254" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition-colors duration-300 flex items-center gap-2"
                    >
                      {t('whatsapp_support')}
                    </a>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => {
                      setShowThankYou(false);
                      setFormData({
                        partner1: { name: '', gender: 'male', dateOfBirth: '', timeOfBirth: '', placeOfBirth: '' },
                        partner2: { name: '', gender: 'female', dateOfBirth: '', timeOfBirth: '', placeOfBirth: '' }
                      });
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {t('match_another_couple')}
                  </button>
                  
                  <a
                    href="/"
                    className="px-8 py-3 text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-all duration-300 text-center"
                  >
                    {t('back_to_home')}
                  </a>
                </div>
              </div>
            </div>
          )}

          {!showThankYou && !showResult ? (
            /* Input Form Section */
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Partner 1 Form */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  {t('partner_1_details')} ({t('male_groom')})
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('full_name')} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.partner1.name}
                      onChange={(e) => handleInputChange('partner1', 'name', e.target.value)}
                      placeholder={t('enter_groom_name')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('gender')}
                    </label>
                    <select
                      value={formData.partner1.gender}
                      onChange={(e) => handleInputChange('partner1', 'gender', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="male">{t('male')}</option>
                      <option value="female">{t('female')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('date_of_birth')} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.partner1.dateOfBirth}
                      onChange={(e) => handleInputChange('partner1', 'dateOfBirth', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('time_of_birth')} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.partner1.timeOfBirth}
                      onChange={(e) => handleInputChange('partner1', 'timeOfBirth', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('place_of_birth')} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.partner1.placeOfBirth}
                      onChange={(e) => handleInputChange('partner1', 'placeOfBirth', e.target.value)}
                      placeholder={t('place_of_birth_placeholder')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Partner 2 Form */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  {t('partner_2_details')} ({t('female_bride')})
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('full_name')} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.partner2.name}
                      onChange={(e) => handleInputChange('partner2', 'name', e.target.value)}
                      placeholder={t('enter_bride_name')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('gender')}
                    </label>
                    <select
                      value={formData.partner2.gender}
                      onChange={(e) => handleInputChange('partner2', 'gender', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="female">{t('female')}</option>
                      <option value="male">{t('male')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('date_of_birth')} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.partner2.dateOfBirth}
                      onChange={(e) => handleInputChange('partner2', 'dateOfBirth', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('time_of_birth')} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.partner2.timeOfBirth}
                      onChange={(e) => handleInputChange('partner2', 'timeOfBirth', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('place_of_birth')} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.partner2.placeOfBirth}
                      onChange={(e) => handleInputChange('partner2', 'placeOfBirth', e.target.value)}
                      placeholder={t('place_of_birth_placeholder')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Match Button */}
          {!showResult && !showThankYou && (
            <div className="text-center mb-12">
              <form onSubmit={handleMatchHoroscope}>
                <button
                  type="submit"
                  disabled={isMatching}
                  className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                  {isMatching ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('processing_request')}...
                    </span>
                  ) : (
                    <> {t('match_horoscopes_now')}</>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Features Section */}
          {!showResult && !showThankYou && (
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-white text-center mb-12">
                {t('what_our_matching_includes')}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: "🎯", title: t('36_guna_analysis'), desc: t('36_guna_analysis_desc') },
                  { icon: "💕", title: t('love_compatibility'), desc: t('love_compatibility_desc') },
                  { icon: "🏠", title: t('family_harmony'), desc: t('family_harmony_desc') },
                  { icon: "🌟", title: t('manglik_dosha'), desc: t('manglik_dosha_desc') }
                ].map((feature, index) => (
                  <div key={index} className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h4 className="text-lg font-semibold text-white mb-3">{feature.title}</h4>
                    <p className="text-gray-300 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchHoroscope;
