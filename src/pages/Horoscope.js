import React, { useState } from "react";

const initialData = {
  sign: "",
  reportType: "daily",
  reportFor: "",
  language: "English",
  email: ""
};

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const reportTypes = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" }
];

function HoroscopeInfo() {
  return (
    <section className="py-14 px-5 bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-50 border-t border-indigo-200 mt-12">
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-4 tracking-tight">
          What Is a Horoscope?
        </h3>
        <p className="text-lg text-indigo-800 mb-4">
          A horoscope is a personalized forecast based on the unique position of planets, stars, and the moon at the time of your birth. It reveals hidden opportunities, challenges, and guiding influences in your journey—offering clarity on love, career, health, and personal growth.
        </p>
        <p className="text-base text-indigo-700 mb-4">
          At <span className="font-semibold text-fuchsia-600">Dhruv Astro Software</span>, our horoscopes combine classical Vedic, KP, and modern methods to deliver accurate predictions you can trust. Whether you seek daily inspiration or long-term vision, a quality horoscope puts the wisdom of the cosmos in your hands.
        </p>
        <div className="flex flex-col md:flex-row gap-6 mt-8 justify-center items-center">
          <div className="bg-white/70 rounded-xl px-5 py-4 shadow-md border border-purple-100 max-w-xs mx-auto">
            <div className="font-semibold text-indigo-800 mb-2">Why Read Your Horoscope?</div>
            <ul className="text-indigo-600 text-left list-disc list-inside space-y-1">
              <li>Find timely opportunities & avoid obstacles</li>
              <li>Prepare for love, career, and finances</li>
              <li>Empower your decisions with cosmic insight</li>
              <li>Start your day with positivity & mindfulness</li>
            </ul>
          </div>
          <div className="bg-white/70 rounded-xl px-5 py-4 shadow-md border border-purple-100 max-w-xs mx-auto">
            <div className="font-semibold text-indigo-800 mb-2">How Do We Calculate?</div>
            <ul className="text-indigo-600 text-left list-disc list-inside space-y-1">
              <li>Actual planetary postions—not just sun sign only</li>
              <li>Authentic Vedic, KP, and Western systems</li>
              <li>Personalized for you: sign, date, and location</li>
              <li>Easy-to-understand, action-oriented predictions</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}


export default function Horoscope() {
  const [form, setForm] = useState(initialData);
  const [showReport, setShowReport] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowReport(true);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50">
      <div className="flex flex-col md:flex-row items-center bg-transparent overflow-hidden">
        {/* Image Side */}
        <div className="md:w-1/2 w-full h-[340px] md:h-[540px] flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-50 to-pink-50">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=100"
            alt="Horoscope Zodiac Chart"
            className="object-contain h-full w-full"
            loading="lazy"
          />
        </div>
        {/* Content + Form Side */}
        <div className="md:w-1/2 w-full p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="reportType">
                Report Type
              </label>
              <select
                required
                id="reportType"
                name="reportType"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2 outline-none"
                value={form.reportType}
                onChange={handleChange}
              >
                {reportTypes.map(rt => (
                  <option key={rt.value} value={rt.value}>
                    {rt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="sign">
                Zodiac Sign
              </label>
              <select
                required
                id="sign"
                name="sign"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                value={form.sign}
                onChange={handleChange}
              >
                <option value="">Select your sign</option>
                {zodiacSigns.map(sign => (
                  <option key={sign} value={sign}>{sign}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="reportFor">
                Date <span className="text-xs text-indigo-400 ml-2">(optional for daily; use for week/month/year start)</span>
              </label>
              <input
                id="reportFor"
                name="reportFor"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                type="date"
                value={form.reportFor}
                onChange={handleChange}
                placeholder="Select date"
              />
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="language">
                Preferred Language
              </label>
              <select
                id="language"
                name="language"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                value={form.language}
                onChange={handleChange}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Bengali</option>
                <option>Tamil</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="email">
                Email <span className="text-pink-500">*</span>
              </label>
              <input
                required
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                placeholder="e.g. youremail@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white font-bold py-3 rounded-lg shadow hover:brightness-110 transition"
              >
                Generate Horoscope Report
              </button>
            </div>
          </form>
          {showReport && (
            <div className="mt-12 bg-white border border-indigo-100 rounded-xl shadow px-7 py-6">
              <h3 className="text-xl font-bold text-indigo-800 mb-3 text-center">
                {form.reportType.charAt(0).toUpperCase() + form.reportType.slice(1)} Horoscope for {form.sign}
              </h3>
              <p className="text-indigo-700 mb-2 text-sm text-center">
                (This is a sample. Integrate with backend for actual content)
              </p>
              <div className="text-base text-indigo-900 text-center leading-relaxed">
                Today’s astrological influences bring you new clarity and possibilities. Favorable planetary alignments support your ambitions and spark fresh insights. Remain open to guidance, and positive outcomes are on the horizon.
                <br /><br />
                <span className="text-indigo-500">Lucky Color: </span><span className="font-semibold text-fuchsia-500">Purple</span>
                <br />
                <span className="text-indigo-500">Tip: </span> Be mindful of opportunities—today’s choices set tomorrow’s tone.
                {form.email && (
                  <div className="mt-5 text-indigo-400 text-xs">
                    Your horoscope will be sent to: <span className="font-semibold">{form.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <HoroscopeInfo />
    </section>
  );
}
