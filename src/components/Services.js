import React from "react";
import {
  GiCrystalBall,
  GiStarsStack,
  GiStarFormation,
  GiSpiralLollipop,
  GiNotebook,
  GiTalk
} from "react-icons/gi";
import { FaStar } from "react-icons/fa";
import four from '../assets/4.webp';
import nine from '../assets/9.webp';

// DUMMY DATA
const services = [
  {
    icon: <GiCrystalBall className="text-5xl text-indigo-400 drop-shadow" />,
    title: "Personalized Kundli",
    desc: "Unlock your destiny with a deeply personalized Kundli based on your exact birth date, time, and location. Get over 200 pages of astrological insights, colorful charts, yogas, doshas, dasha periods, and tailored remedies—all powered by systems like Parashari, KP, and Jaimini. Ideal for self-discovery or professional consultation.",
    cta: "Explore Now",
    img: four,
    popular: true,
    rating: 4.9,
    votes: 1287,
    link: "/personal",
  },
  {
    icon: <GiStarsStack className="text-5xl text-purple-400 drop-shadow" />,
    title: "Horoscope Predictions",
    desc: "Navigate life with clarity using daily, weekly, and monthly horoscopes based on planetary transits, dashas, and house positions. Whether you're facing decisions in career, relationships, or health—our precise forecasts give you the cosmic edge, tailored to your Kundli.",
    cta: "See Predictions",
    img: nine,
    popular: true,
    rating: 4.8,
    votes: 1112,
    link: "/horoscope",
  }
];


export default function Services() {
  return (
    <section
      id="core-services"
      className="py-20 bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 relative overflow-x-hidden"
    >
      {/* Faint Zodiac Watermark */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-15 pointer-events-none z-0">
        <GiStarFormation className="text-[340px] text-fuchsia-200" />
      </div>

      {/* Subtle floating dust/particles */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{ background: "radial-gradient(circle at 80% 30%, #ecd9ff88 0 8%, transparent 60%), radial-gradient(circle at 15% 70%, #daf4fc55 0 10%, transparent 65%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-950 mb-7 text-center tracking-tight">
          <span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
            Our Core Astrology Services
          </span>
        </h2>
        <p className="text-lg text-indigo-700/90 max-w-2xl mx-auto mb-12 text-center">
          From personalized Kundli to expert horoscope insights—unlock the cosmos with science-backed, accessible astrology for everyone.
        </p>
        <div className="grid gap-12 md:grid-cols-2 grid-cols-1">
          {services.map(({ icon, title, desc, cta, img, popular, rating, votes,link }, idx) => (
            <div
              key={idx}
              className={`group relative bg-white/60 backdrop-blur-[3px] border-2 border-transparent
                shadow-2xl rounded-3xl p-0 flex flex-col items-center justify-between text-center min-h-[540px] overflow-hidden
                transition-all duration-400 hover:scale-[1.033] hover:shadow-fuchsia-100 hover:border-fuchsia-300 ring-1 ring-inset ring-white/20
                before:absolute before:inset-0 before:border-4 before:rounded-3xl before:border-transparent before:pointer-events-none
                hover:before:border-[var(--tw-gradient-from)] hover:before:animate-shimmerCard
                `}
              style={{
                "--tw-gradient-from": "#ffd6eb",
              }}
            >
              {/* Card image */}
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                <img
                  src={img}
                  alt={title}
                  className="w-full h-full object-contain"
                  width={500}
                  height={220}
                  loading="lazy"
                  style={{ filter: "brightness(1.07) saturate(1.15)" }}
                />
                {/* Soft overlay at bottom for text contrast, optional */}
                <div className="absolute bottom-0 left-0 w-full h-2/5 bg-gradient-to-t from-white/85 via-transparent to-transparent rounded-b-3xl pointer-events-none" />
              </div>

              {/* Card Content */}
              <div className="flex-1 flex flex-col items-center p-8 pb-7 w-full">
                <h3 className="text-2xl font-bold text-indigo-900 mb-2 group-hover:text-fuchsia-600 transition-all">
                  {title}
                </h3>
                <p className="text-indigo-700/90 mb-5">{desc}</p>
                {/* Star Trust Row */}
                {popular && rating && (
                  <div className="flex items-center justify-center gap-1 text-yellow-400 text-base font-semibold mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`${i < Math.round(rating) ? "" : "opacity-25"}`} />
                    ))}
                    <span className="ml-1 font-normal text-slate-500 text-xs">
                      {rating} <span className="text-slate-400">({votes}+)</span>
                    </span>
                  </div>
                )}
                <a href={link}>
                  <button
                    className="mt-5 uppercase font-bold text-indigo-800 bg-gradient-to-r from-pink-200 via-purple-100 to-indigo-100 px-8 py-3 rounded-full
                    shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-200 transition
                    animate-[pulse_2.2s_infinite] hover:scale-105"
                    style={{ animationDelay: idx * 180 + "ms" }}
                    >
                    {cta}
                  </button>
                </a>
              </div>
              
              {/* Subtle floating cosmic particles per card */}
              <div className="absolute -bottom-6 right-5 opacity-30 blur-[2px] pointer-events-none select-none">
                <svg width="41" height="41"><circle cx="20" cy="20" r="12" fill="#a7f3fec0" /></svg>
              </div>
              <div className="absolute top-5 left-11 opacity-20 blur-[1.5px] pointer-events-none select-none">
                <svg width="27" height="27"><circle cx="13" cy="13" r="6" fill="#f0abfc" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Card shimmer keyframes */}
      <style>{`
        @keyframes shimmerCard {
            0% { border-color: transparent; }
            50% { border-color: #fbcfe8 #e0e7ff #e0e7ff #fbcfe8; }
            100% { border-color: transparent; }
        }
      `}</style>
    </section>
  );
}
