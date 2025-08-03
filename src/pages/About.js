import React from 'react';
import { useTranslation } from 'react-i18next';
import aboutImage1 from '../assets/about/1.webp'; // Replace with your actual image paths
import aboutImage2 from '../assets/about/2.webp';
import aboutImage3 from '../assets/about/3.webp';

const About = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: "🕉️",
      title: t('authentic_vedic_wisdom'),
      description: t('authentic_vedic_wisdom_desc')
    },
    {
      icon: "✦",
      title: t('personalized_approach'),
      description: t('personalized_approach_desc')
    },
    {
      icon: "🔮",
      title: t('comprehensive_analysis'),
      description: t('comprehensive_analysis_desc')
    },
    {
      icon: "🌟",
      title: t('proven_expertise'),
      description: t('proven_expertise_desc')
    }
  ];

  const stats = [
    { number: "10,000+", label: t('satisfied_clients') },
    { number: "15+", label: t('years_experience') },
    { number: "50,000+", label: t('kundlis_created') },
    { number: "98%", label: t('accuracy_rate') }
  ];

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
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-20">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              <span className="mr-2">🕉️</span>
              {t('about_sri_astro_veda')}
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('unveiling_cosmic')} <span className="text-yellow-400">{t('mysteries')}</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              {t('since_generations')}
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('about_hero_description')}
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={aboutImage1}
                alt={t('our_story_image')}
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-2xl"></div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white mb-6">
                {t('our_story')} <span className="text-yellow-400">{t('our_mission')}</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                {t('our_story_description_1')}
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                {t('our_story_description_2')}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <span className="text-yellow-400 text-xl">✦</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">{t('authentic_tradition')}</h4>
                  <p className="text-gray-400 text-sm">{t('authentic_tradition_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {t('why_choose')} <span className="text-yellow-400">{t('sri_astro_veda')}</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('why_choose_description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-yellow-400/50 transition-all duration-300 group text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Image Gallery Section */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('spiritual_journey')} <span className="text-yellow-400">{t('visual_story')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative group">
              <img
                src={aboutImage2}
                alt={t('cosmic_wisdom')}
                className="w-full h-80 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 rounded-xl transition-colors duration-300"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-white font-semibold text-lg">{t('cosmic_wisdom')}</h4>
                <p className="text-gray-300 text-sm">{t('cosmic_wisdom_desc')}</p>
              </div>
            </div>

            <div className="relative group">
              <img
                src={aboutImage3}
                alt={t('ancient_scriptures')}
                className="w-full h-80 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 rounded-xl transition-colors duration-300"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-white font-semibold text-lg">{t('ancient_scriptures')}</h4>
                <p className="text-gray-300 text-sm">{t('ancient_scriptures_desc')}</p>
              </div>
            </div>

            <div className="relative group md:col-span-2 lg:col-span-1">
              <img
                src={aboutImage1}
                alt={t('spiritual_guidance')}
                className="w-full h-80 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 rounded-xl transition-colors duration-300"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-white font-semibold text-lg">{t('spiritual_guidance')}</h4>
                <p className="text-gray-300 text-sm">{t('spiritual_guidance_desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 lg:p-12 border border-gray-700/50">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                {t('our_achievements')} <span className="text-yellow-400">{t('in_numbers')}</span>
              </h2>
              <p className="text-xl text-gray-300">
                {t('achievements_description')}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-yellow-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl p-8 lg:p-12 border border-yellow-500/30">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {t('ready_to_discover')} <span className="text-yellow-400">{t('your_destiny')}</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {t('cta_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/birth-chart"
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
              >
                {t('get_your_kundli')} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
