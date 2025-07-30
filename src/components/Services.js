import React from "react";
import services from "../assets/services.png";

const service = [
  {
    title: "Match Horoscope",
    desc: "Check marriage compatibility and kundli matching for you and your partner.",
    cta: "Match Now",
    link: "/services/match-horoscope",
  },
  {
    title: "Your Life Predictions",
    desc: "Get a complete overview of your future based on your birth chart.",
    cta: "View Predictions",
    link: "/services/life-predictions",
  },
  {
    title: "Ask A Question – ₹299",
    desc: "Get expert answers to any personal or urgent question.",
    cta: "Ask Now",
    link: "/services/ask-question",
  },
  {
    title: "Career",
    desc: "Discover the right career path and job opportunities based on your stars.",
    cta: "Explore Career",
    link: "/services/career",
  },
  {
    title: "Love",
    desc: "Understand your love life, relationship compatibility, and future romance.",
    cta: "Check Love Life",
    link: "/services/love",
  },
  {
    title: "2025 Personalized Report",
    desc: "Detailed yearly forecast tailored to your birth details.",
    cta: "Get 2025 Report",
    link: "/services/2025-personalized",
  },
  {
    title: "Dasha Phal Analysis",
    desc: "Understand the impact of planetary periods (Dashas) on your life.",
    cta: "Analyze Now",
    link: "/services/dasha-phal",
  },
  {
    title: "Sade Sati Life Report",
    desc: "Find out how Saturn's Sade Sati will affect you and get remedies.",
    cta: "Check Sade Sati",
    link: "/services/sade-sati",
  }
];

export default function Services() {
  return (
    <section
      id="core-services"
      className="bg-gradient-to-br from-[#131229] to-[#22203a] py-16 px-2"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Left - First 4 Services */}
        <div className="flex flex-col gap-6 flex-1 w-full max-w-xs px-2 md:px-0">
          {service.slice(0, 4).map((item) => (
            <div
              key={item.title}
              className="bg-[#191836] rounded-lg p-4 shadow-xl border-l-4 border-purple-500 hover:border-yellow-400 transition group md:mr-[-16px]"
            >
              <h3 className="text-lg font-semibold text-white group-hover:text-yellow-200">
                {item.title}
              </h3>
              <p className="text-sm text-gray-300">{item.desc}</p>
              <a
                href={item.link}
                className="inline-block mt-1 text-sm text-purple-300 font-medium group-hover:text-yellow-200 underline"
              >
                {item.cta}
              </a>
            </div>
          ))}
        </div>
        
        {/* Center Image - Larger Size */}
        <div className="flex justify-center items-center max-w-sm md:max-w-lg">
          <img
            src={services}
            alt="Spiritual Services"
            className="w-full md:w-[600px] lg:w-full object-contain  p-3"
            loading="lazy"
          />
        </div>
        
        {/* Right - Last 4 Services */}
        <div className="flex flex-col gap-6 flex-1 w-full max-w-xs px-2 md:px-0">
          {service.slice(4, 8).map((item) => (
            <div
              key={item.title}
              className="bg-[#191836] rounded-lg p-4 shadow-xl border-r-4 border-purple-500 hover:border-yellow-400 transition group md:ml-[-16px]"
            >
              <h3 className="text-lg font-semibold text-white group-hover:text-yellow-200">
                {item.title}
              </h3>
              <p className="text-sm text-gray-300">{item.desc}</p>
              <a
                href={item.link}
                className="inline-block mt-1 text-sm text-purple-300 font-medium group-hover:text-yellow-200 underline"
              >
                {item.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
