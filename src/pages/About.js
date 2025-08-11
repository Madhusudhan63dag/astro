import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import aboutImage1 from '../assets/about/1.webp'; // Replace with your actual image paths
import aboutImage2 from '../assets/about/2.webp';
import aboutImage3 from '../assets/about/3.webp';
import aboutImage4 from '../assets/about/4.webp';

const About = () => {
  const { t } = useTranslation();

  // Helper to parse targets like "10,000+", "98%", "15+"
  const parseTarget = (str) => {
    if (!str) return { value: 0, suffix: '' };
    const match = String(str).match(/([0-9.,]+)([^0-9.,]*)/);
    if (!match) return { value: 0, suffix: '' };
    const num = parseFloat(match[1].replace(/,/g, '')) || 0;
    const suffix = match[2] || '';
    return { value: num, suffix };
  };

  const formatWithCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const CountUp = ({ target, start, duration = 1800 }) => {
    const [{ value, suffix }] = useState(() => parseTarget(target));
    const [display, setDisplay] = useState(0);
    const rafRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
      if (!start) return;
      const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
      const step = (ts) => {
        if (!startTimeRef.current) startTimeRef.current = ts;
        const elapsed = ts - startTimeRef.current;
        const p = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(p);
        const current = Math.round(value * eased);
        setDisplay(current);
        if (p < 1) {
          rafRef.current = requestAnimationFrame(step);
        }
      };
      rafRef.current = requestAnimationFrame(step);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [start, value, duration]);

    const text = `${formatWithCommas(display)}${suffix}`;
    return <>{text}</>;
  };

  const features = [
    {
      title: t('authentic_vedic_wisdom'),
      description: t('authentic_vedic_wisdom_desc')
    },
    {
      title: t('personalized_approach'),
      description: t('personalized_approach_desc')
    },
    {
      title: t('comprehensive_analysis'),
      description: t('comprehensive_analysis_desc')
    },
    {
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

  // IntersectionObserver to trigger animation when stats enter viewport
  const statsRef = useRef(null);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    if (!statsRef.current) return;
    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            setAnimateStats(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 relative overflow-hidden">

      <div className="relative z-10 py-16 px-4">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-20">
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
                {/* <div className="text-4xl mb-4">{feature.icon}</div> */}
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
                className="w-full h-96  rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="relative group">
              <img
                src={aboutImage3}
                alt={t('ancient_scriptures')}
                className="w-full h-96  rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="relative group md:col-span-2 lg:col-span-1">
              <img
                src={aboutImage4}
                alt={t('spiritual_guidance')}
                className="w-full h-96 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

  {/* Stats Section */}
  <div ref={statsRef} className=" mb-20">
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
        <CountUp target={stat.number} start={animateStats} />
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
