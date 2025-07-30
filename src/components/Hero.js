// import React, { useEffect, useState } from "react";
// import bannerBg from '../assets/11.png'; // use your preferred image
// import three from '../assets/8.webp'
// import front from '../assets/3.webp';

// const features = [
//   { text: "Unlimited Kundli Creation" },
//   { text: "200+ Page Detailed Reports" },
//   { text: "Horoscope Matching Tools" },
//   { text: "Cloud Backup & Multi-device Access" },
//   { text: "Custom Branding Options" },
//   { text: "Supports 12+ Astrology Systems" },
// ];

// const KundliModal = ({ show, onClose }) => {
//   if (!show) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1b28cc] backdrop-blur-[2px] transition-all duration-300">
//       <div className="bg-white/95 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-w-3xl w-full border border-fuchsia-100 relative animate-fadeIn">
//         {/* Close X button */}
//         <button
//           className="absolute top-3 right-3 text-2xl text-pink-400 hover:text-indigo-800 transition"
//           onClick={onClose}
//           aria-label="Close"
//         >&times;</button>

//         {/* IMAGE LEFT */}
//         <div className="md:w-[300px] w-full flex items-center justify-center p-0 md:p-6">
//           <img
//             src={three}
//             alt="Vedic Kundli Sample"
//             className="object-contain w-full h-60 md:h-full"
//             style={{ maxWidth: 280, boxShadow: "0 8px 28px #bca9ff44" }}
//             loading="lazy"
//           />
//         </div>

//         {/* CONTENT RIGHT */}
//         <div className="flex-1 flex flex-col justify-between p-6 px-7">
//           <div>
//             <div className="mb-2 flex items-center gap-2 text-yellow-400 text-base font-semibold">
//               <span>★</span> 200+ Pages | Multi-System
//             </div>
//             <h3 className="text-2xl md:text-3xl font-extrabold text-indigo-900 mb-2 tracking-tight">
//               Personalized Kundli Report—<span className="bg-gradient-to-r from-fuchsia-500 via-yellow-300 to-indigo-500 bg-clip-text text-transparent">Most Detailed in India!</span>
//             </h3>
//             <p className="text-indigo-800 mb-4">
//               Dive deep into your life's cosmic blueprint: <span className="font-semibold text-fuchsia-700">200+ pages</span> of predictions, doshas, remedies, career-personality analysis, and much more. Based on Vedic, KP & Jaimini astrology and <b>customized just for you</b>.
//             </p>
//           </div>
//           <a
//             href="/personal"
//             className="inline-block w-full bg-gradient-to-r from-yellow-300 via-pink-300 to-indigo-300 text-indigo-900 font-bold shadow-lg rounded-full py-3 text-center text-lg hover:brightness-110 focus:ring-2 focus:ring-yellow-400 animate-pulse"
//           >
//             Check Out Sample Kundli Report
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Hero = () => {
//   const [showKundliModal, setShowKundliModal] = useState(false);

//   // Show modal after 5s (once per mount)
//   useEffect(() => {
//     const t = setTimeout(() => setShowKundliModal(true), 5000);
//     return () => clearTimeout(t);
//   }, []);

//   return (
//     <div>
//       <section
//         className="relative w-full h-[600px] flex items-center justify-start px-3 md:px-9"
//         style={{
//           backgroundImage: `url(${bannerBg})`,
//           backgroundSize: 'cover',       // cover the whole area
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//         }}
//       >
//         {/* Overlay for darkening/upgrading readability */}
//         {/* <div className="absolute inset-0 bg-gradient-to-r from-[#1b1b28e6] via-[#181c2e99] to-transparent"></div> */}
//         {/* Content on one side */}
//         <div className="relative z-10 text-left">
//           <h1 className="text-3xl md:text-[2.6rem] font-extrabold leading-tight mb-4 text-white drop-shadow-lg">
//             All-in-One Astrology Software for&nbsp;
//             <span className="bg-gradient-to-r from-yellow-300 via-pink-200 to-[#bda4f8] bg-clip-text text-transparent">
//               Professionals & Passionate Learners
//             </span>
//           </h1>
//           <div className="text-lg md:text-2xl font-medium text-fuchsia-200 mb-7 md:mb-9 drop-shadow text-shadow">
//             Generate unlimited Kundlis, offer 200+ page reports, perform deep compatibility matching, and manage clients with powerful cloud tools—all from one secure, multi-language platform.
//           </div>
//           <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start mb-7">
//             <a
//               href="/personal"
//               className="px-8 py-3 text-lg rounded-full font-bold bg-gradient-to-r from-yellow-300 via-fuchsia-200 to-purple-300 text-indigo-900 shadow-lg animate-[pulse_1.6s_infinite] hover:brightness-110 focus:ring-2 focus:ring-yellow-400"
//               style={{ boxShadow: "0 0 16px #fff4" }}
//             >
//               Get My Personalized Report
//             </a>
//           </div>
//           <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start mt-2 mb-5">
//             {features.map((f, i) => (
//               <div
//                 key={i}
//                 className="flex items-center gap-2 text-slate-200 font-medium text-base bg-indigo-950/80 rounded-full px-4 py-2 shadow border border-slate-700/30"
//               >
//                 {f.text}
//               </div>
//             ))}
//           </div>
//         </div>
//         {/* No right side image/content */}
//       </section>
//       {/* Modal code... */}
//       <KundliModal show={showKundliModal} onClose={() => setShowKundliModal(false)} />

//     </div>
//   );
// };

// export default Hero;

import React, { useEffect, useState } from "react";
import sampleVideo from '../assets/banner.mp4';
import three from '../assets/8.webp'



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
        <div className="md:w-[300px] w-full flex items-center justify-center p-0 md:p-6">
          <img
            src={three}
            alt="Vedic Kundli Sample"
            className="object-contain w-full h-60 md:h-full"
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

const Hero = () => {
  const [showKundliModal, setShowKundliModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowKundliModal(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <section className="relative w-full h-[600px] flex items-center justify-start px-3 md:px-9 overflow-hidden">
        
        {/* Background video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={sampleVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-label="Background video"
        />

        {/* Optional: video overlay for readability (uncomment if needed) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b1b28e6] via-[#181c2e99] to-transparent"></div>

        {/* Content on top */}
        <div className="relative z-10 text-left w-1/2">
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
              className="px-8 py-3 text-lg rounded-full font-bold bg-gradient-to-r from-yellow-300 via-fuchsia-200 to-purple-300 text-indigo-900 shadow-lg animate-[pulse_1.6s_infinite] hover:brightness-110 focus:ring-2 focus:ring-yellow-400"
              style={{ boxShadow: "0 0 16px #fff4" }}
            >
              Get My Personalized Report
            </a>
          </div>
        </div>
      </section>
      
      {/* <KundliModal show={showKundliModal} onClose={() => setShowKundliModal(false)} /> */}
    </div>
  );
};

export default Hero;
