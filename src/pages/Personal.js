import React, { useState } from "react";

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
  email: ""
};

export default function Personal() {
  const [form, setForm] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Personal Chart request submitted! (Integrate with backend for actual use)");
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 min-h-[90vh] flex items-center">
      <div className="flex flex-col md:flex-row items-center bg-transparent overflow-hidden">
        {/* Image Side */}
        <div className="md:w-1/2 w-full h-[340px] md:h-[540px] flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-50 to-pink-50">
          <img
            src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=100"
            alt="Astrological Chart"
            className="object-contain h-full w-full"
            loading="lazy"
          />
        </div>
        {/* Form Side */}
        <div className="md:w-1/2 w-full p-8 md:p-12">
          <h2 className="text-3xl font-bold text-indigo-900 mb-3 tracking-tight text-center md:text-left">
            Create Your Personal Astrology Chart
          </h2>
          <p className="text-lg text-indigo-700 mb-8 text-center md:text-left">
            Enter your birth details to generate an authentic, personalized Kundli with Vedic, KP, and Jaimini insights.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="name">
                Full Name <span className="text-pink-500">*</span>
              </label>
              <input
                required
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="gender">
                Gender <span className="text-pink-500">*</span>
              </label>
              <select
                required
                id="gender"
                name="gender"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="dob">
                Date of Birth <span className="text-pink-500">*</span>
              </label>
              <input
                required
                type="date"
                id="dob"
                name="dob"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                value={form.dob}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="tob">
                Time of Birth <span className="text-pink-500">*</span>
                <span className="text-xs text-indigo-400 ml-2">(24hr format, eg. 14:30)</span>
              </label>
              <input
                required
                type="time"
                id="tob"
                name="tob"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                value={form.tob}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="pob">
                Place of Birth <span className="text-pink-500">*</span>
                <span className="text-xs text-indigo-400 ml-2">(City, State, Country)</span>
              </label>
              <input
                required
                type="text"
                id="pob"
                name="pob"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                placeholder="e.g. Jaipur, Rajasthan, India"
                value={form.pob}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-semibold text-indigo-800 mb-1" htmlFor="lat">
                  Latitude <span className="text-xs text-indigo-400">(optional)</span>
                </label>
                <input
                  type="text"
                  id="lat"
                  name="lat"
                  className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                  placeholder="e.g. 26.9124"
                  value={form.lat}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold text-indigo-800 mb-1" htmlFor="lng">
                  Longitude <span className="text-xs text-indigo-400">(optional)</span>
                </label>
                <input
                  type="text"
                  id="lng"
                  name="lng"
                  className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                  placeholder="e.g. 75.7873"
                  value={form.lng}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="timezone">
                Timezone <span className="text-xs text-indigo-400">(optional)</span>
              </label>
              <input
                type="text"
                id="timezone"
                name="timezone"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                placeholder="e.g. Asia/Kolkata"
                value={form.timezone}
                onChange={handleChange}
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
                Generate My Personal Chart
              </button>
            </div>
          </form>
          <div className="text-xs text-indigo-400 mt-6 text-center">
            Your information is encrypted and never shared. For consultation, accuracy is key—please double-check your details.
          </div>
        </div>
      </div>
    </section>
  );
}
