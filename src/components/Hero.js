import React from "react";

// SVG Visual (still subtle, but you can switch to a muted image or 3D if desired)
const ZodiacVisual = () => (
  <svg viewBox="0 0 276 276" fill="none" className="w-52 h-52 md:w-80 md:h-80" style={{ filter: "drop-shadow(0 6px 36px #a58bfc66)" }}>
    <circle cx="138" cy="138" r="130" stroke="url(#grad)" strokeWidth="3" />
    <defs>
      <linearGradient id="grad" x1="0" y1="0" x2="276" y2="276" gradientUnits="userSpaceOnUse">
        <stop stopColor="#cec3ff"/>
        <stop offset="1" stopColor="#a989dd"/>
      </linearGradient>
    </defs>
  </svg>
);

const features = [
  { text: "100% Personalized Astrology" },
  { text: "Multiple Systems: Parashari, KP, Jaimini" },
  { text: "Secure & Cloud-Based Access" },
  { text: "Multi-language Support" },
];

const Ratings = () => (
  <div className="flex items-center gap-2 text-yellow-300 text-[17px] mb-2 justify-center md:justify-start font-semibold drop-shadow">
    <span>★</span> 4.9 <span className="text-xs text-gray-200">Based on 1,200+ users</span>
  </div>
);

const Hero = () => {
  const ctaPulse = "animate-[pulse_1.6s_infinite] shadow-lg shadow-yellow-400/30";
  return (
    <section className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-center px-3 md:px-9 bg-gradient-to-tr from-[#181c2e] via-[#292c53] to-[#211f35] font-['Poppins',_Cormorant,serif]">
      {/* --- Left: Text --- */}
      <div className="relative z-10 flex-1 max-w-xl text-center md:text-left mx-auto md:mx-0 py-12">
        <Ratings />
        <h1 className="text-3xl md:text-[2.6rem] font-extrabold leading-tight mb-4 text-white drop-shadow-lg">
          Discover Your Future with&nbsp;
          <span className="bg-gradient-to-r from-yellow-300 via-pink-200 to-[#bda4f8] bg-clip-text text-transparent">Accurate &amp; Personalized Astrology</span>
        </h1>
        <div className="text-lg md:text-2xl font-medium text-fuchsia-200 mb-7 md:mb-9 drop-shadow text-shadow">
          Get detailed Kundli, horoscope, and remedies powered by ancient systems like Parashari, KP, and Jaimini – all in your language.
        </div>
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start mb-7">
          <a
            href="#personal-report"
            className={`px-8 py-3 text-lg rounded-full font-bold bg-gradient-to-r from-yellow-300 via-fuchsia-200 to-purple-300 text-indigo-900 shadow-lg ${ctaPulse} hover:brightness-110 focus:ring-2 focus:ring-yellow-400 `}
            style={{ boxShadow: "0 0 16px #fff4  " }}
          >
            Get My Personalized Report
          </a>
          <a
            href="#book-consult"
            className="px-8 py-3 text-lg rounded-full font-semibold bg-[#3f2f6e] text-white shadow transition hover:bg-[#4d3777] focus:ring-2 focus:ring-fuchsia-300"
          >
            Book Consultation Now
          </a>
        </div>
        {/* Features grid */}
        <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start mt-2 mb-5">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-200 font-medium text-base bg-indigo-950/80 rounded-full px-4 py-2 shadow border border-slate-700/30">
              {/* <span className="text-xl">{f.icon}</span> */}
              {f.text}
            </div>
          ))}
        </div>
      </div>
      {/* --- Right: Visual --- */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-10 md:my-0">
        <ZodiacVisual />
        {/* Swap out for a subtle Lottie, SVG, or 3D in production */}
      </div>
    </section>
  );
};

export default Hero;
