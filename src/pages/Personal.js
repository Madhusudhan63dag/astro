import React, { useState, useEffect } from "react";
import { 
  FaStar, 
  FaMoon, 
  FaSun, 
  FaGlobe, 
  FaClock, 
  FaUser, 
  FaVenus, 
  FaMapMarkerAlt, 
  FaEnvelope,
  FaLanguage,
  FaCheckCircle,
  FaQuoteLeft,
  FaInfinity,
  FaEye
} from "react-icons/fa";
import six from '../assets/6.webp';

const initialData = {
  name: "",
  gender: "",
  dob: "",
  tob: "",
  pob: "",
  lat: "",
  lng: "",
  timezone: "",
  language: "English",
  email: "",
  chartType: "vedic"
};

// Floating stars animation component
const FloatingStars = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 3 + 2
        });
      }
      setStars(newStars);
    };
    generateStars();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full opacity-70 animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`
          }}
        />
      ))}
    </div>
  );
};

export default function Personal() {
  const [form, setForm] = useState(initialData);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${form.chartType.toUpperCase()} Astrology Chart request submitted! (Integrate with backend for actual use)`);
  };

  const testimonials = [
    {
      name: "Priya Sharma",
      text: "The Vedic chart reading was incredibly accurate. It helped me understand my career path better.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      text: "KP astrology predictions about my marriage timing were spot on. Highly recommended!",
      rating: 5
    },
    {
      name: "Anjana Devi",
      text: "Jaimini system revealed aspects of my personality I never knew. Life-changing experience!",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <FloatingStars />
      
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 animate-pulse" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <FaInfinity className="text-6xl text-purple-400 mx-4 animate-spin-slow" />
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Sriastroveda
            </div>
            <FaEye className="text-6xl text-blue-400 mx-4 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Unlock Your Cosmic Blueprint
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Experience the profound wisdom of <span className="text-purple-400 font-semibold">Kundli</span>, 
            Generate your personalized birth chart and discover the celestial influences shaping your destiny.
          </p>
          
          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <FaCheckCircle className="text-3xl text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Precise Calculations</h3>
              <p className="text-gray-300 text-sm">Advanced algorithms ensure astronomical accuracy in chart generation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <FaCheckCircle className="text-3xl text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Multiple Systems</h3>
              <p className="text-gray-300 text-sm">Choose from Kundli astrology systems</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <FaCheckCircle className="text-3xl text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Detailed Analysis</h3>
              <p className="text-gray-300 text-sm">Comprehensive interpretations and future predictions</p>
            </div>
          </div>
        </div>

        {/* Main Form Section */}
        <div className="flex flex-col lg:flex-row bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20 mb-16">
          
          {/* Left Side - Mystical Image */}
          <div className="lg:w-1/2 relative bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 flex justify-center items-center p-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
              <img
                src={six}
                alt="Mystical Astrology Chart"
                className="relative rounded-2xl shadow-2xl object-cover w-full h-full max-w-md border-2 border-white/30"
              />
              {/* <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full animate-pulse"></div> */}
            </div>
          </div>

          {/* Right Side - Enhanced Form */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Enter Your Birth Chart</h2>
              <p className="text-gray-300 leading-relaxed">
                Enter your birth details below to generate your personalized {form.chartType.toUpperCase()} astrology chart. 
                Ensure accuracy for the most precise predictions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="flex items-center font-medium text-white mb-2" htmlFor="name">
                  <FaUser className="mr-2 text-purple-400" />
                  Full Name <span className="text-pink-400 ml-1">*</span>
                </label>
                <input
                  required
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              {/* Gender Field */}
              <div>
                <label className="flex items-center font-medium text-white mb-2" htmlFor="gender">
                  <FaVenus className="mr-2 text-pink-400" />
                  Gender <span className="text-pink-400 ml-1">*</span>
                </label>
                <select
                  required
                  id="gender"
                  name="gender"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="" className="bg-gray-800">Select gender</option>
                  <option value="male" className="bg-gray-800">Male</option>
                  <option value="female" className="bg-gray-800">Female</option>
                  <option value="other" className="bg-gray-800">Other / Prefer not to say</option>
                </select>
              </div>

              {/* Date and Time Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center font-medium text-white mb-2" htmlFor="dob">
                    <FaSun className="mr-2 text-yellow-400" />
                    Date of Birth <span className="text-pink-400 ml-1">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    id="dob"
                    name="dob"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    value={form.dob}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="flex items-center font-medium text-white mb-2" htmlFor="tob">
                    <FaClock className="mr-2 text-blue-400" />
                    Time of Birth <span className="text-pink-400 ml-1">*</span>
                    <span className="ml-2 text-xs text-gray-400">(24hr format)</span>
                  </label>
                  <input
                    required
                    type="time"
                    id="tob"
                    name="tob"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    value={form.tob}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Place of Birth */}
              <div>
                <label className="flex items-center font-medium text-white mb-2" htmlFor="pob">
                  <FaMapMarkerAlt className="mr-2 text-green-400" />
                  Place of Birth <span className="text-pink-400 ml-1">*</span>
                </label>
                <input
                  required
                  type="text"
                  id="pob"
                  name="pob"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="City, State, Country"
                  value={form.pob}
                  onChange={handleChange}
                />
              </div>

              {/* Coordinates Row */}
              {/* <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center font-medium text-white mb-2" htmlFor="lat">
                    <FaGlobe className="mr-2 text-indigo-400" />
                    Latitude <span className="text-xs text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="lat"
                    name="lat"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    placeholder="e.g. 26.9124"
                    value={form.lat}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="flex items-center font-medium text-white mb-2" htmlFor="lng">
                    <FaGlobe className="mr-2 text-indigo-400" />
                    Longitude <span className="text-xs text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="lng"
                    name="lng"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    placeholder="e.g. 75.7873"
                    value={form.lng}
                    onChange={handleChange}
                  />
                </div>
              </div> */}

              {/* Timezone and Language Row */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* <div>
                  <label className="flex items-center font-medium text-white mb-2" htmlFor="timezone">
                    <FaClock className="mr-2 text-orange-400" />
                    Timezone <span className="text-xs text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="timezone"
                    name="timezone"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    placeholder="e.g. Asia/Kolkata"
                    value={form.timezone}
                    onChange={handleChange}
                  />
                </div> */}
                <div>
                  <label className="flex items-center font-medium text-white mb-2" htmlFor="language">
                    <FaLanguage className="mr-2 text-cyan-400" />
                    Preferred Language
                  </label>
                  <select
                    id="language"
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
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center font-medium text-white mb-2" htmlFor="email">
                  <FaEnvelope className="mr-2 text-red-400" />
                  Email Address <span className="text-pink-400 ml-1">*</span>
                </label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-bold py-4 rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-2xl relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <FaStar className="mr-2 group-hover:animate-spin" />
                  Generate My {form.chartType.toUpperCase()} Chart
                  <FaStar className="ml-2 group-hover:animate-spin" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </button>

              {/* Privacy Notice */}
              <div className="text-xs text-gray-400 text-center mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <FaCheckCircle className="inline mr-2 text-green-400" />
                Your data is encrypted and secure. We respect your privacy and never share personal information.
              </div>
            </form>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-300">Thousands trust our astrological insights</p>
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* <div className="text-center p-6 bg-white/10 rounded-2xl border border-white/20">
            <FaCheckCircle className="text-4xl text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Instant Generation</h3>
            <p className="text-gray-300 text-sm">Get your chart in seconds with our advanced algorithms</p>
          </div> */}
          <div className="text-center p-6 bg-white/10 rounded-2xl border border-white/20">
            <FaCheckCircle className="text-4xl text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Multiple Languages</h3>
            <p className="text-gray-300 text-sm">Available in Hindi, English, Bengali, Tamil & more</p>
          </div>
          <div className="text-center p-6 bg-white/10 rounded-2xl border border-white/20">
            <FaCheckCircle className="text-4xl text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Expert Analysis</h3>
            <p className="text-gray-300 text-sm">Detailed interpretations by experienced astrologers</p>
          </div>
          <div className="text-center p-6 bg-white/10 rounded-2xl border border-white/20">
            <FaCheckCircle className="text-4xl text-pink-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
            <p className="text-gray-300 text-sm">Your data is encrypted and never shared</p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Discover Your Destiny?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands who have unlocked their cosmic potential through our precise astrological analysis
            </p>
          </div>
        </div>
      </div>
      
      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
}
