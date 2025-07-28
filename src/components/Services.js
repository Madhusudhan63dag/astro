// import React from "react";
// import { GiCrystalBall, GiHearts, GiPalm, GiMeditation, GiStarsStack, GiPhone, GiStarFormation } from "react-icons/gi";

// const services = [
//   {
//     icon: <GiCrystalBall className="text-4xl text-indigo-400 transition group-hover:rotate-[10deg]" />,
//     title: "Personalized Kundli",
//     desc: "Get detailed birth charts based on your unique data.",
//     cta: "Explore Now",
//     img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=500&q=100",
//     popular: true,
//     rating: 4.9,
//     votes: 1287
//   },
//   {
//     icon: <GiStarsStack className="text-4xl text-purple-300 transition group-hover:-rotate-6" />,
//     title: "Horoscope Predictions",
//     desc: "Daily, weekly, monthly forecasts to guide your path.",
//     cta: "See Predictions",
//     img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=100",
//     popular: true
//   },
// ];

// function Services() {
//   return (
//     <section
//       id="core-services"
//       className="py-16 bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 relative overflow-x-hidden"
//     >
//       {/* Faint zodiac background watermark */}
//       <div className="absolute top-7 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none z-0">
//         <GiStarFormation className="text-[340px] text-purple-100" />
//       </div>
//       <div className="max-w-7xl mx-auto px-6 relative z-10">
//         <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-6 text-center tracking-tight">
//           Our Core Astrology Services
//         </h2>
//         <p className="text-lg text-indigo-700 max-w-3xl mx-auto mb-10 text-center">
//           Navigate life's mysteries with our advanced, science-backed astrology solutions.
//         </p>
//         <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
//           {services.map(({ icon, title, desc, cta, img, popular, rating, votes }, idx) => (
//             <div
//               key={idx}
//               className={`
//                 group relative 
//                 bg-white/85 border border-purple-100
//                 rounded-2xl p-0 shadow-lg flex flex-col items-center text-center
//                 transition-all duration-300 hover:-translate-y-2
//                 hover:shadow-2xl hover:border-fuchsia-300
//                 ${popular ? "ring-2 ring-pink-200" : ""}
//               `}
//               style={{ overflow: 'hidden', minHeight: 500 }}
//             >
//               {/* Popular Tag Ribbon */}
//               {popular && (
//                 <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md z-10 animate-pulse select-none">
//                   Most Popular
//                 </span>
//               )}
//               {/* Card Top Image */}
//               <div className="w-full h-[220px] bg-gradient-to-tr from-purple-50 via-white to-indigo-50 flex items-center justify-center overflow-hidden">
//                 <img
//                   src={img}
//                   alt={title}
//                   className="w-full h-full object-cover object-center rounded-t-2xl"
//                   width={500}
//                   height={500}
//                   loading="lazy"
//                 />
//               </div>
//               {/* Content */}
//               <div className="flex-1 flex flex-col items-center p-6 pb-7">
//                 <div className="mb-3">{icon}</div>
//                 <h3 className="text-lg font-semibold text-indigo-800 mb-2 group-hover:text-fuchsia-600 transition">{title}</h3>
//                 <p className="text-indigo-700/90 mb-3">{desc}</p>
//                 {/* Trust stars for popular */}
//                 {popular && rating && (
//                   <div className="flex items-center gap-1 text-yellow-500 text-xs justify-center mb-2">
//                     <span>★</span>
//                     <span>{rating}</span>
//                     <span className="text-slate-400">({votes}+ trust votes)</span>
//                   </div>
//                 )}
//                 <button
//                   className="uppercase font-bold text-indigo-800 bg-gradient-to-r from-pink-200 via-purple-100 to-indigo-100 px-6 py-2 rounded-full
//                              shadow hover:shadow-lg transition hover:brightness-105 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-200"
//                 >
//                   {cta}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Services;

import React from "react";
import { GiCrystalBall, GiStarsStack, GiStarFormation } from "react-icons/gi";
import { FaStar } from "react-icons/fa";

// DUMMY DATA
const services = [
  {
    icon: <GiCrystalBall className="text-5xl text-indigo-400 drop-shadow" />,
    title: "Personalized Kundli",
    desc: "Get detailed birth charts based on your unique data.",
    cta: "Explore Now",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=500&q=100",
    popular: true,
    rating: 4.9,
    votes: 1287,
  },
  {
    icon: <GiStarsStack className="text-5xl text-purple-400 drop-shadow" />,
    title: "Horoscope Predictions",
    desc: "Daily, weekly, monthly forecasts to guide your path.",
    cta: "See Predictions",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=100",
    popular: true,
    rating: 4.8,
    votes: 1112,
  },
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
          {services.map(({ icon, title, desc, cta, img, popular, rating, votes }, idx) => (
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
              {/* Most Popular badge */}
              {popular && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-fuchsia-400 via-pink-500 to-purple-500 text-white text-[13px] font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                  <FaStar className="inline text-yellow-300 -mt-0.5" /> Most Popular
                </span>
              )}

              {/* Card image */}
              <div className="w-full h-[220px] flex items-center justify-center relative overflow-hidden">
                <img
                  src={img}
                  alt={title}
                  className="w-full h-full object-cover object-center rounded-t-3xl"
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
                <div className="mb-4">{icon}</div>
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
                <button
                  className="mt-5 uppercase font-bold text-indigo-800 bg-gradient-to-r from-pink-200 via-purple-100 to-indigo-100 px-8 py-3 rounded-full
                    shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-200 transition
                    animate-[pulse_2.2s_infinite] hover:scale-105"
                  style={{ animationDelay: idx * 180 + "ms" }}
                >
                  {cta}
                </button>
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
