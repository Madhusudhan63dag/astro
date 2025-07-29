import React, { useState, useEffect } from "react";
import { 
  FaStar, 
  FaMoon, 
  FaSun, 
  // FaCrystalBall, 
  FaCalendarAlt, 
  FaUser, 
  FaEnvelope,
  FaLanguage,
  FaCheckCircle,
  FaQuoteLeft,
  FaInfinity,
  FaEye,
  FaClock,
  FaHeart,
  FaGem,
  FaFire,
  FaLeaf,
  FaTint,
  FaWind,
  FaMagic,
  // FaSparkles, // Remove this line - it doesn't exist
  // GiSparkles // Add this instead from Game Icons
} from "react-icons/fa";
// import { GiSparkles } from "react-icons/gi"; // Add this import for sparkles
import five from '../assets/5.webp';


const initialData = {
  sign: "",
  reportType: "daily",
  reportFor: "",
  language: "English",
  email: "",
  timePreference: "morning"
};

const zodiacSigns = [
  { name: "Aries", element: "Fire", dates: "Mar 21 - Apr 19", emoji: "♈", color: "text-red-400" },
  { name: "Taurus", element: "Earth", dates: "Apr 20 - May 20", emoji: "♉", color: "text-green-400" },
  { name: "Gemini", element: "Air", dates: "May 21 - Jun 20", emoji: "♊", color: "text-yellow-400" },
  { name: "Cancer", element: "Water", dates: "Jun 21 - Jul 22", emoji: "♋", color: "text-blue-400" },
  { name: "Leo", element: "Fire", dates: "Jul 23 - Aug 22", emoji: "♌", color: "text-orange-400" },
  { name: "Virgo", element: "Earth", dates: "Aug 23 - Sep 22", emoji: "♍", color: "text-green-500" },
  { name: "Libra", element: "Air", dates: "Sep 23 - Oct 22", emoji: "♎", color: "text-pink-400" },
  { name: "Scorpio", element: "Water", dates: "Oct 23 - Nov 21", emoji: "♏", color: "text-purple-400" },
  { name: "Sagittarius", element: "Fire", dates: "Nov 22 - Dec 21", emoji: "♐", color: "text-indigo-400" },
  { name: "Capricorn", element: "Earth", dates: "Dec 22 - Jan 19", emoji: "♑", color: "text-gray-400" },
  { name: "Aquarius", element: "Air", dates: "Jan 20 - Feb 18", emoji: "♒", color: "text-cyan-400" },
  { name: "Pisces", element: "Water", dates: "Feb 19 - Mar 20", emoji: "♓", color: "text-teal-400" }
];

const reportTypes = [
  { value: "daily", label: "Daily Horoscope", icon: <FaSun />, description: "Get insights for today" },
  { value: "weekly", label: "Weekly Horoscope", icon: <FaCalendarAlt />, description: "Plan your week ahead" },
  { value: "monthly", label: "Monthly Horoscope", icon: <FaMoon />, description: "Navigate the month" },
  { value: "yearly", label: "Yearly Horoscope", icon: <FaStar />, description: "Discover your year" }
];

// Floating cosmic elements animation component
const FloatingElements = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const generateElements = () => {
      const newElements = [];
      for (let i = 0; i < 30; i++) {
        newElements.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 10,
          duration: Math.random() * 4 + 3,
          type: Math.random() > 0.5 ? 'star' : 'sparkle'
        });
      }
      setElements(newElements);
    };
    generateElements();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element) => (
        <div
          key={element.id}
          className={`absolute animate-pulse ${element.type === 'star' ? 'text-yellow-300' : 'text-purple-300'}`}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            fontSize: `${element.size}px`,
            animationDuration: `${element.duration}s`
          }}
        >
          {element.type === 'star' ? '✦' : '✨'}
        </div>
      ))}
    </div>
  );
};

// Enhanced Horoscope Information Component
function HoroscopeInfo() {
  const [currentBenefit, setCurrentBenefit] = useState(0);

  const benefits = [
    {
      icon: <FaEye className="text-3xl text-purple-400" />,
      title: "Self-Discovery",
      description: "Gain deep insights into your personality, strengths, and natural inclinations through cosmic guidance."
    },
    {
      icon: <FaHeart className="text-3xl text-pink-400" />,
      title: "Relationship Harmony",
      description: "Understand compatibility patterns and improve connections with family, friends, and partners."
    },
    {
      icon: <FaClock className="text-3xl text-blue-400" />,
      title: "Perfect Timing",
      description: "Discover auspicious moments for important decisions, career moves, and life changes."
    },
    {
      icon: <FaGem className="text-3xl text-green-400" />,
      title: "Life Guidance",
      description: "Navigate challenges with cosmic wisdom and make empowered choices for your future."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % benefits.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <FaInfinity className="text-4xl text-purple-400 mx-2 animate-spin-slow" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              The Power of Horoscopes
            </h2>
            {/* <FaSparkles className="text-4xl text-pink-400 mx-2 animate-pulse" /> */}
          </div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover the ancient wisdom of <span className="text-purple-400 font-semibold">SriAstroVeda</span>, 
            where cosmic insights meet modern precision to guide your journey through life's celestial rhythms.
          </p>
        </div>

        {/* What is a Horoscope Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white mb-6">What Is a Horoscope?</h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              A horoscope is your personalized cosmic blueprint—a detailed forecast based on the unique celestial positions 
              at the moment of your birth. It reveals the hidden influences of planets, stars, and lunar cycles that shape 
              your personality, relationships, and life path.
            </p>
            <p className="text-base text-gray-400 leading-relaxed">
              At <span className="font-semibold text-purple-400">SriAstroVeda</span>, our horoscopes combine the wisdom 
              of classical Vedic astrology with modern KP and Western methods to deliver accurate, actionable insights you 
              can trust. Whether you seek daily inspiration, weekly planning, or long-term vision, our cosmic guidance puts 
              the universe's wisdom at your fingertips.
            </p>
            
            {/* Benefits Showcase */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mt-8">
              <div className="flex items-center space-x-4 mb-4">
                {benefits[currentBenefit].icon}
                <div>
                  <h4 className="text-xl font-bold text-white">{benefits[currentBenefit].title}</h4>
                  <p className="text-gray-300 text-sm">{benefits[currentBenefit].description}</p>
                </div>
              </div>
              
              {/* Progress indicators */}
              <div className="flex space-x-2 mt-4">
                {benefits.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      index === currentBenefit ? 'bg-purple-400' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/10 rounded-2xl">
                  <FaFire className="text-3xl text-red-400 mx-auto mb-2" />
                  <h5 className="text-white font-semibold">Fire Signs</h5>
                  <p className="text-gray-400 text-sm">Passionate & Dynamic</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-2xl">
                  <FaLeaf className="text-3xl text-green-400 mx-auto mb-2" />
                  <h5 className="text-white font-semibold">Earth Signs</h5>
                  <p className="text-gray-400 text-sm">Practical & Stable</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-2xl">
                  <FaWind className="text-3xl text-cyan-400 mx-auto mb-2" />
                  <h5 className="text-white font-semibold">Air Signs</h5>
                  <p className="text-gray-400 text-sm">Intellectual & Social</p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-2xl">
                  <FaTint className="text-3xl text-blue-400 mx-auto mb-2" />
                  <h5 className="text-white font-semibold">Water Signs</h5>
                  <p className="text-gray-400 text-sm">Emotional & Intuitive</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horoscope Types Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-white mb-12">Choose Your Cosmic Journey</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((type, index) => (
              <div key={type.value} className="group">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="text-center">
                    <div className="text-4xl text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {type.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{type.label}</h4>
                    <p className="text-gray-300 text-sm mb-4">{type.description}</p>
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3">
                      <p className="text-white text-xs">
                        {index === 0 && "Perfect for daily guidance and immediate insights"}
                        {index === 1 && "Ideal for planning and strategic decision-making"}
                        {index === 2 && "Great for long-term goals and life planning"}
                        {index === 3 && "Essential for major life transitions and growth"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Our Horoscopes */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <FaCheckCircle className="text-4xl text-green-400 mb-4" />
            <h4 className="text-2xl font-bold text-white mb-4">Why Read Your Horoscope?</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <FaStar className="text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                <span>Discover timely opportunities and navigate obstacles with confidence</span>
              </li>
              <li className="flex items-start">
                <FaHeart className="text-pink-400 mt-1 mr-3 flex-shrink-0" />
                <span>Gain clarity in love, relationships, and family dynamics</span>
              </li>
              <li className="flex items-start">
                <FaGem className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                <span>Make empowered decisions about career and finances</span>
              </li>
              <li className="flex items-start">
                <FaMoon className="text-blue-400 mt-1 mr-3 flex-shrink-0" />
                <span>Start each day with cosmic wisdom and positive energy</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <FaMagic className="text-4xl text-purple-400 mb-4" />
            <h4 className="text-2xl font-bold text-white mb-4">Our Calculation Method</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                {/* <FaCrystalBall className="text-purple-400 mt-1 mr-3 flex-shrink-0" /> */}
                <span>Real planetary positions—not just generic sun sign readings</span>
              </li>
              <li className="flex items-start">
                <FaInfinity className="text-cyan-400 mt-1 mr-3 flex-shrink-0" />
                <span>Authentic Vedic, KP, and Western astrological systems</span>
              </li>
              <li className="flex items-start">
                <FaUser className="text-orange-400 mt-1 mr-3 flex-shrink-0" />
                <span>Personalized for your sign, date, time, and location</span>
              </li>
              <li className="flex items-start">
                {/* <FaSparkles className="text-pink-400 mt-1 mr-3 flex-shrink-0" /> */}
                <span>Easy-to-understand, action-oriented cosmic guidance</span>
              </li>
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Meera Patel",
      sign: "Leo",
      text: "SriAstroVeda's daily horoscopes have been incredibly accurate. The timing guidance helped me land my dream job!",
      rating: 5
    },
    {
      name: "Arjun Kumar",
      sign: "Scorpio", 
      text: "The weekly horoscopes are so detailed and insightful. I plan my entire week based on the cosmic guidance.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      sign: "Pisces",
      text: "Monthly readings from SriAstroVeda transformed my understanding of relationships. Truly life-changing!",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowReport(true);
  };

  const selectedSign = zodiacSigns.find(sign => sign.name === form.sign);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <FloatingElements />
      
      {/* Cosmic overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 animate-pulse" />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            
            {/* Brand Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center items-center mb-6">
                {/* <FaCrystalBall className="text-5xl text-purple-400 mx-3 animate-bounce" /> */}
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  SriAstroVeda
                </div>
                <FaMagic className="text-5xl text-pink-400 mx-3 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Your Personal Horoscope Sanctuary
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Unlock the secrets of your cosmic journey with personalized horoscope readings. 
                From daily guidance to yearly insights, discover what the stars have aligned for you.
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20 mb-16">
              
              {/* Left Side - Zodiac Wheel */}
              <div className="lg:w-1/2 relative bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 flex justify-center items-center p-8">
                <div className="relative">
                  <img src={five} alt="Zodiac Wheel" className="w-full h-auto" />
                </div>
              </div>

              {/* Right Side - Enhanced Form */}
              <div className="lg:w-1/2 p-8 lg:p-12">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Get Your Cosmic Reading</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Select your preferences below to receive your personalized horoscope from SriAstroVeda's expert astrologers.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Report Type Selection */}
                  <div>
                    <label className="flex items-center font-medium text-white mb-3">
                      <FaCalendarAlt className="mr-2 text-purple-400" />
                      Report Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {reportTypes.map(rt => (
                        <label
                          key={rt.value}
                          className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            form.reportType === rt.value
                              ? 'border-purple-400 bg-purple-400/20 text-white'
                              : 'border-white/30 bg-white/10 text-gray-300 hover:bg-white/15'
                          }`}
                        >
                          <input
                            type="radio"
                            name="reportType"
                            value={rt.value}
                            checked={form.reportType === rt.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span className="text-lg mr-2">{rt.icon}</span>
                          <span className="text-sm font-medium">{rt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Zodiac Sign Selection */}
                  {/* <div>
                    <label className="flex items-center font-medium text-white mb-3">
                      <FaStar className="mr-2 text-yellow-400" />
                      Your Zodiac Sign
                    </label>
                    <select
                      required
                      name="sign"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                      value={form.sign}
                      onChange={handleChange}
                    >
                      <option value="" className="bg-gray-800">Choose your sign</option>
                      {zodiacSigns.map(sign => (
                        <option key={sign.name} value={sign.name} className="bg-gray-800">
                          {sign.emoji} {sign.name} ({sign.dates}) - {sign.element}
                        </option>
                      ))}
                    </select>
                    {selectedSign && (
                      <div className="mt-2 p-3 bg-white/10 rounded-lg">
                        <p className={`text-sm ${selectedSign.color} font-semibold`}>
                          {selectedSign.element} Sign • {selectedSign.dates}
                        </p>
                      </div>
                    )}
                  </div> */}

                  {/* Date Selection */}
                  <div>
                    <label className="flex items-center font-medium text-white mb-3">
                      <FaCalendarAlt className="mr-2 text-blue-400" />
                      Date <span className="text-xs text-gray-400 ml-2">(optional for daily; specify for week/month/year)</span>
                    </label>
                    <input
                      type="date"
                      name="reportFor"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                      value={form.reportFor}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Time Preference */}
                  <div>
                    <label className="flex items-center font-medium text-white mb-3">
                      <FaClock className="mr-2 text-orange-400" />
                      Reading Time Preference
                    </label>
                    <select
                      name="timePreference"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                      value={form.timePreference}
                      onChange={handleChange}
                    >
                      <option value="morning" className="bg-gray-800">Morning Reading</option>
                      <option value="afternoon" className="bg-gray-800">Afternoon Reading</option>
                      <option value="evening" className="bg-gray-800">Evening Reading</option>
                    </select>
                  </div>

                  {/* Language and Email Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center font-medium text-white mb-3">
                        <FaLanguage className="mr-2 text-cyan-400" />
                        Language
                      </label>
                      <select
                        name="language"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                        value={form.language}
                        onChange={handleChange}
                      >
                        <option value="English" className="bg-gray-800">English</option>
                        <option value="Hindi" className="bg-gray-800">Hindi</option>
                        <option value="Bengali" className="bg-gray-800">Bengali</option>
                        <option value="Tamil" className="bg-gray-800">Tamil</option>
                        <option value="Telugu" className="bg-gray-800">Telugu</option>
                        <option value="Other" className="bg-gray-800">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center font-medium text-white mb-3">
                        <FaEnvelope className="mr-2 text-red-400" />
                        Email Address <span className="text-pink-400">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-2xl relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {/* <FaCrystalBall className="mr-3 group-hover:animate-spin" /> */}
                      Generate My {form.reportType.charAt(0).toUpperCase() + form.reportType.slice(1)} Horoscope
                      {/* <FaSparkles className="ml-3 group-hover:animate-pulse" /> */}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </button>

                  {/* Privacy Notice */}
                  <div className="text-xs text-gray-400 text-center mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <FaCheckCircle className="inline mr-2 text-green-400" />
                    Your information is secure with SriAstroVeda. We respect your privacy and never share personal details.
                  </div>
                </form>

                {/* Report Display */}
                {showReport && (
                  <div className="mt-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-6">
                      <div className="flex justify-center items-center mb-4">
                        <span className="text-4xl mr-3">{selectedSign?.emoji}</span>
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {form.reportType.charAt(0).toUpperCase() + form.reportType.slice(1)} Horoscope
                          </h3>
                          <p className="text-purple-300">for {form.sign}</p>
                        </div>
                        {/* <FaSparkles className="text-4xl ml-3 text-pink-400 animate-pulse" /> */}
                      </div>
                      <p className="text-gray-400 text-sm mb-6">
                        Powered by SriAstroVeda's Advanced Astrological Engine
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white/10 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                          <FaStar className="text-yellow-400 mr-2" />
                          Cosmic Insight
                        </h4>
                        <p className="text-gray-300 leading-relaxed">
                          The celestial energies are perfectly aligned for transformation and growth in your life. 
                          {selectedSign?.element === 'Fire' && " Your fiery nature ignites new opportunities and passionate pursuits."}
                          {selectedSign?.element === 'Earth' && " Your grounded energy attracts stability and material success."}
                          {selectedSign?.element === 'Air' && " Your intellectual nature opens doors to communication and learning."}
                          {selectedSign?.element === 'Water' && " Your intuitive gifts guide you toward emotional fulfillment and deep connections."}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-2xl p-4">
                          <h5 className="text-white font-semibold mb-2 flex items-center">
                            <FaHeart className="text-pink-400 mr-2" />
                            Love & Relationships
                          </h5>
                          <p className="text-gray-400 text-sm">Venus brings harmony to your connections. Express your feelings openly.</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-4">
                          <h5 className="text-white font-semibold mb-2 flex items-center">
                            <FaGem className="text-green-400 mr-2" />
                            Career & Wealth
                          </h5>
                          <p className="text-gray-400 text-sm">Jupiter's influence brings opportunities for professional advancement.</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-bold">Lucky Elements</h4>
                          <FaMagic className="text-purple-400 text-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-purple-300">Lucky Color: </span>
                            <span className="text-white font-semibold">
                              {selectedSign?.element === 'Fire' ? 'Crimson Red' : 
                               selectedSign?.element === 'Earth' ? 'Emerald Green' :
                               selectedSign?.element === 'Air' ? 'Sky Blue' : 'Deep Ocean Blue'}
                            </span>
                          </div>
                          <div>
                            <span className="text-purple-300">Lucky Number: </span>
                            <span className="text-white font-semibold">{Math.floor(Math.random() * 9) + 1}</span>
                          </div>
                        </div>
                      </div>

                      {form.email && (
                        <div className="text-center bg-white/5 rounded-2xl p-4">
                          <p className="text-green-400 text-sm flex items-center justify-center">
                            <FaCheckCircle className="mr-2" />
                            Your detailed horoscope will be sent to: <span className="font-semibold ml-1">{form.email}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">What Our Cosmic Community Says</h2>
                <p className="text-xl text-gray-300">Join thousands who trust SriAstroVeda for cosmic guidance</p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
                  <FaQuoteLeft className="text-4xl text-purple-400 mx-auto mb-6" />
                  <p className="text-xl text-white mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-xl mx-1" />
                    ))}
                  </div>
                  <p className="text-purple-300 font-semibold">
                    - {testimonials[currentTestimonial].name}
                    <span className="text-gray-400 ml-2">({testimonials[currentTestimonial].sign})</span>
                  </p>
                  
                  {/* Testimonial Indicators */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTestimonial ? 'bg-purple-400' : 'bg-white/30'
                        }`}
                        onClick={() => setCurrentTestimonial(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Information Section */}
        <HoroscopeInfo />

        {/* Footer CTA */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
            <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
              {/* <FaCrystalBall className="text-6xl text-purple-400 mx-auto mb-6 animate-bounce" /> */}
              <h2 className="text-3xl font-bold text-white mb-4">Begin Your Cosmic Journey Today</h2>
              <p className="text-xl text-gray-300 mb-8">
                Let SriAstroVeda guide you through the celestial wisdom that shapes your destiny
              </p>
              <button 
                onClick={() => document.querySelector('form').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Get My Horoscope Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 8s linear infinite;
        }
      `}</style>
    </section>
  );
}
