import React, { useState } from 'react';

const AstroForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 text-6xl text-yellow-500">✦</div>
        <div className="absolute top-40 right-20 text-4xl text-amber-400">✧</div>
        <div className="absolute bottom-40 left-20 text-5xl text-yellow-500">✦</div>
        <div className="absolute bottom-20 right-10 text-3xl text-amber-400">✧</div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get Your <span className="text-yellow-400">Personalized</span>
              <br />
              <span className="text-amber-400">Astrology Report</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Enter your birth details to unlock the secrets of your future
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-700/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-gray-100 font-semibold text-lg">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              {/* Date of Birth Field */}
              <div className="space-y-2">
                <label className="block text-gray-100 font-semibold text-lg">
                  Date of Birth <span className="text-amber-400">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              {/* Time of Birth Field */}
              <div className="space-y-2">
                <label className="block text-gray-100 font-semibold text-lg">
                  Time of Birth <span className="text-amber-400">*</span>
                </label>
                <input
                  type="time"
                  name="timeOfBirth"
                  value={formData.timeOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <p className="text-gray-500 text-sm">
                  If exact time is unknown, enter approximate time
                </p>
              </div>

              {/* Place of Birth Field */}
              <div className="space-y-2">
                <label className="block text-gray-100 font-semibold text-lg">
                  Place of Birth <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleInputChange}
                  placeholder="City, State, Country"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <p className="text-gray-500 text-sm">
                  Enter your complete birth location for accurate calculations
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Generate My Kundli Report
                </button>
              </div>

              {/* Additional Info */}
              <div className="text-center pt-4">
                <p className="text-gray-300 text-sm">
                  🔒 Your data is completely secure and encrypted
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Get 200+ page detailed report • Multiple astrology systems • Professional analysis
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstroForm;