import React, { useEffect, useState } from "react";

// Place this at the top of your file (or before Hero)

// // SVG visual component
// const ZodiacVisual = () => (
//   <svg ...> {/* Your SVG here */} </svg>
// );

// Features array
const features = [
  { text: "Unlimited Kundli Creation" },
  { text: "200+ Page Detailed Reports" },
  { text: "Horoscope Matching Tools" },
  { text: "Cloud Backup & Multi-device Access" },
  { text: "Custom Branding Options" },
  { text: "Supports 12+ Astrology Systems" },
];

// Ratings component
const Ratings = () => (
  <div className="flex items-center gap-2 text-yellow-300 text-[17px] mb-2 justify-center md:justify-start font-semibold drop-shadow">
    <span>★</span> 4.9 <span className="text-xs text-gray-200">Based on 1,200+ users</span>
  </div>
);

// ...now define your Hero component, as you have.


// ... (keep your ZodiacVisual, features, Ratings, and Hero components as-is)

const KundliModal = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1b28cc] backdrop-blur-[2px] transition-all duration-300">
      <div className="bg-white/95 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-w-3xl w-full border border-fuchsia-100 relative animate-fadeIn">
        {/* Close X button */}
        <button
          className="absolute top-3 right-3 text-2xl text-pink-400 hover:text-indigo-800 transition"
          onClick={onClose}
          aria-label="Close"
        >&times;</button>

        {/* IMAGE LEFT */}
        <div className="md:w-[300px] w-full md:min-h-[420px] flex items-center justify-center bg-gradient-to-br from-fuchsia-100 via-indigo-50 to-purple-50 p-0 md:p-6">
          <img
            src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=450&q=90"
            alt="Vedic Kundli Sample"
            className="object-cover rounded-2xl md:rounded-xl w-full h-60 md:h-full"
            style={{ maxWidth: 280, boxShadow: "0 8px 28px #bca9ff44" }}
            loading="lazy"
          />
        </div>

        {/* CONTENT RIGHT */}
        <div className="flex-1 flex flex-col justify-between p-6 px-7">
          <div>
            <div className="mb-2 flex items-center gap-2 text-yellow-400 text-base font-semibold">
              <span>★</span> 200+ Pages | Multi-System
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-indigo-900 mb-2 tracking-tight">
              Personalized Kundli Report—<span className="bg-gradient-to-r from-fuchsia-500 via-yellow-300 to-indigo-500 bg-clip-text text-transparent">Most Detailed in India!</span>
            </h3>
            <p className="text-indigo-800 mb-4">
              Dive deep into your life's cosmic blueprint: <span className="font-semibold text-fuchsia-700">200+ pages</span> of predictions, doshas, remedies, career-personality analysis, and much more. Based on Vedic, KP & Jaimini astrology and <b>customized just for you</b>.
            </p>
            <ul className="text-indigo-700 space-y-2 mb-6 text-sm pl-4 list-disc">
              <li>All charts and dasha at a glance</li>
              <li>Career, marriage, health, wealth forecasts</li>
              <li>Easy-to-read, includes remedies & strengths</li>
              <li>Downloadable PDF, English & Indian languages</li>
            </ul>
          </div>
          <a
            href="/personal"
            className="inline-block w-full bg-gradient-to-r from-yellow-300 via-pink-300 to-indigo-300 text-indigo-900 font-bold shadow-lg rounded-full py-3 text-center text-lg hover:brightness-110 focus:ring-2 focus:ring-yellow-400 animate-pulse"
          >
            Check Out Sample Kundli Report
          </a>
        </div>
      </div>
    </div>
  );
};

// --------- Main Hero component: add modal logic ----------
const Hero = () => {
  const ctaPulse = "animate-[pulse_1.6s_infinite] shadow-lg shadow-yellow-400/30";
  const [showKundliModal, setShowKundliModal] = useState(false);

  // Show modal after 5s (once per mount)
  useEffect(() => {
    const t = setTimeout(() => setShowKundliModal(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <section className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-center px-3 md:px-9 bg-gradient-to-tr from-[#181c2e] via-[#292c53] to-[#211f35] font-['Poppins',_Cormorant,serif]">
        {/* --- Left: Text --- */}
        <div className="relative z-10 flex-1 max-w-xl text-center md:text-left mx-auto md:mx-0 py-12">
          <Ratings />
          <h1 className="text-3xl md:text-[2.6rem] font-extrabold leading-tight mb-4 text-white drop-shadow-lg">
            All-in-One Astrology Software for&nbsp;
            <span className="bg-gradient-to-r from-yellow-300 via-pink-200 to-[#bda4f8] bg-clip-text text-transparent">
              Professionals & Passionate Learners
            </span>
          </h1>
          <div className="text-lg md:text-2xl font-medium text-fuchsia-200 mb-7 md:mb-9 drop-shadow text-shadow">
            Generate unlimited Kundlis, offer 200+ page reports, perform deep compatibility matching, and manage clients with powerful cloud tools—all from one secure, multi-language platform.
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start mb-7">
            <a
              href="/personal"
              className={`px-8 py-3 text-lg rounded-full font-bold bg-gradient-to-r from-yellow-300 via-fuchsia-200 to-purple-300 text-indigo-900 shadow-lg ${ctaPulse} hover:brightness-110 focus:ring-2 focus:ring-yellow-400`}
              style={{ boxShadow: "0 0 16px #fff4" }}
            >
              Get My Personalized Report
            </a>
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start mt-2 mb-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-slate-200 font-medium text-base bg-indigo-950/80 rounded-full px-4 py-2 shadow border border-slate-700/30"
              >
                {f.text}
              </div>
            ))}
          </div>
        </div>
        {/* --- Right: Visual --- */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-10 md:my-0">
          {/* <ZodiacVisual /> */}
        </div>
      </section>
      {/* Kundli Offer Modal */}
      <KundliModal show={showKundliModal} onClose={() => setShowKundliModal(false)} />
    </>
  );
};

export default Hero;