import React, { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";

// Extended testimonials data
const testimonials = [
  {
    name: "Sanjay Kumar",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "AstroVastu's personalized Kundli reports gave me deep clarity about my career path. Highly reliable and insightful!",
  },
  {
    name: "Anita Sharma",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.8,
    text: "The matchmaking compatibility feature is amazing! Helped me and my partner understand each other better on a cosmic level.",
  },
  {
    name: "Rajesh Patel",
    photo: "https://randomuser.me/api/portraits/men/54.jpg",
    rating: 4.9,
    text: "The remedies and gemstone advice really brought positive changes. The consults are very professional and empathetic.",
  },
  {
    name: "Priya Singh",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    text: "I love the detailed analysis and personalized reports. The customer service is outstanding.",
  },
  {
    name: "Amit Joshi",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4.7,
    text: "The astrology consultations helped me make better decisions in my personal and professional life.",
  },
  {
    name: "Neha Kapoor",
    photo: "https://randomuser.me/api/portraits/women/55.jpg",
    rating: 4.9,
    text: "The remedies suggested have shown positive effects, and the interface is user-friendly. Highly recommend!",
  }
];

export default function Four() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  // Auto-slide every 6s
  useEffect(() => {
    timeoutRef.current = setTimeout(() =>
      setCurrent(curr => (curr + 1) % testimonials.length), 6000
    );
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  // Manual slide handler
  const prev = () => setCurrent(curr => (curr - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(curr => (curr + 1) % testimonials.length);

  return (
    <section id="testimonials" className="py-16 bg-gradient-to-tr from-purple-50 via-indigo-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-11 text-center tracking-tight">
          What Our Clients Say
        </h2>
        <div className="relative flex flex-col items-center">
          {/* Slide Cards */}
          <div className="w-full">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`transition-all duration-700 absolute left-0 right-0 mx-auto
                  ${i === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 pointer-events-none z-0"}
                `}
                style={{ maxWidth: 420, minWidth: 280 }}
              >
                <div className="bg-white/90 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center
                  transition-transform hover:-translate-y-1 hover:shadow-indigo-300/40">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-20 h-20 rounded-full border-4 border-indigo-300 mb-4 object-cover"
                    loading="lazy"
                  />
                  <h3 className="text-lg font-semibold text-indigo-900 mb-1">{t.name}</h3>
                  <div className="flex items-center justify-center mb-3 space-x-1">
                    {[...Array(5)].map((_, i2) => (
                      <FaStar
                        key={i2}
                        className={`text-yellow-400 ${i2 < Math.round(t.rating) ? "opacity-100" : "opacity-30"}`}
                        size={17}
                      />
                    ))}
                  </div>
                  <p className="text-indigo-700 italic relative before:content-['“'] before:absolute before:-left-4 before:text-4xl before:text-indigo-300 after:content-['”'] after:absolute after:-right-4 after:text-4xl after:text-indigo-300 px-2">
                    {t.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/60 rounded-full shadow text-indigo-700 hover:bg-indigo-100 z-20 focus:outline-none"
            onClick={prev}
            aria-label="Previous testimonial"
          >&#8592;</button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/60 rounded-full shadow text-indigo-700 hover:bg-indigo-100 z-20 focus:outline-none"
            onClick={next}
            aria-label="Next testimonial"
          >&#8594;</button>
        </div>
      </div>
    </section>
  );
}
