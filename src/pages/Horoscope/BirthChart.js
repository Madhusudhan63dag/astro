import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import birthChartImage from '../../assets/1.webp'; // Your birth chart image

const BirthChart = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    chartType: 'south-indian'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateChart = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate chart generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowChart(true);
    }, 3000);
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
            {t('create_your')} <span className="text-yellow-400">{t('birth_chart')}</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              {t('kundli_analysis')}
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('birth_chart_description')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Form */}
            <div className="space-y-8">
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="text-yellow-400 mr-3">📝</span>
                  {t('enter_birth_details')}
                </h2>

                <form onSubmit={handleGenerateChart} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('full_name')} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('enter_full_name')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Gender Field */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('gender')} <span className="text-amber-400">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    >
                      <option value="male">{t('male')}</option>
                      <option value="female">{t('female')}</option>
                      <option value="other">{t('other')}</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('date_of_birth')} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Time of Birth */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('time_of_birth')} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="time"
                      name="timeOfBirth"
                      value={formData.timeOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      {t('exact_time_note')}
                    </p>
                  </div>

                  {/* Place of Birth */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('place_of_birth')} <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleInputChange}
                      placeholder={t('place_of_birth_placeholder')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      {t('place_birth_note')}
                    </p>
                  </div>

                  {/* Chart Type */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('chart_type')}
                    </label>
                    <select
                      name="chartType"
                      value={formData.chartType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="south-indian">{t('south_indian_style')}</option>
                      <option value="north-indian">{t('north_indian_style')}</option>
                      <option value="east-indian">{t('east_indian_style')}</option>
                    </select>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('generating_chart')}...
                      </span>
                    ) : (
                      t('generate_birth_chart')
                    )}
                  </button>
                </form>

                {/* Features List */}
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {t('what_you_get')}:
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400">✓</span>
                      <span className="text-gray-300">{t('detailed_planetary_positions')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400">✓</span>
                      <span className="text-gray-300">{t('zodiac_sign_analysis')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400">✓</span>
                      <span className="text-gray-300">{t('dasha_system_predictions')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400">✓</span>
                      <span className="text-gray-300">{t('remedial_suggestions')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual Content */}
            <div className="space-y-8">
              {!showChart ? (
                <>
                  {/* Sample Chart Display */}
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <span className="text-yellow-400 mr-3">📊</span>
                      {t('sample_birth_chart')}
                    </h3>
                    <div className="relative">
                      <img
                        src={birthChartImage}
                        alt={t('sample_birth_chart')}
                        className="w-full rounded-xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-xl"></div>
                    </div>
                    <p className="text-gray-300 mt-4 text-center">
                      {t('sample_chart_description')}
                    </p>
                  </div>

                  {/* Astrological Symbols */}
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="text-yellow-400 mr-3">🌟</span>
                      {t('astrological_elements')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl mb-2 text-white">☉</div>
                        <div className="text-gray-300 text-sm">{t('sun')}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl mb-2 text-white">☽</div>
                        <div className="text-gray-300 text-sm">{t('moon')}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl mb-2 text-white">♂</div>
                        <div className="text-gray-300 text-sm">{t('mars')}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl mb-2 text-white">☿</div>
                        <div className="text-gray-300 text-sm">{t('mercury')}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl mb-2 text-white">♃</div>
                        <div className="text-gray-300 text-sm">{t('jupiter')}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-2xl mb-2 text-white">♀</div>
                        <div className="text-gray-300 text-sm">{t('venus')}</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Generated Chart Result
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="text-yellow-400 mr-3">🎉</span>
                    {t('your_birth_chart')}
                  </h3>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-xl p-8 mb-6">
                      <div className="text-6xl text-yellow-400 mb-4">📊</div>
                      <h4 className="text-xl font-semibold text-white mb-2">
                        {t('chart_generated_successfully')}
                      </h4>
                      <p className="text-gray-300">
                        {t('chart_ready_message')}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-all duration-300">
                        {t('download_chart')}
                      </button>
                      <button className="px-6 py-3 text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-all duration-300">
                        {t('view_detailed_report')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthChart;
