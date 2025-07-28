import React from "react";

const plans = [
  {
    name: "Basic",
    price: "₹499",
    period: "/month",
    features: [
      "Unlimited Kundli Creation",
      "Daily Horoscope Reports",
      "Cloud Saving",
      "Access on Web & Mobile",
      "Email Support"
    ],
    highlight: false,
  },
  {
    name: "Professional",
    price: "₹1,299",
    period: "/month",
    features: [
      "All Basic Features",
      "Advanced Matchmaking",
      "Gemstone & Remedies Module",
      "Bulk Report Generation",
      "Priority Support",
      "Multi-language PDF Reports",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "₹2,499",
    period: "/month",
    features: [
      "All Professional Features",
      "Team Member Access (5 users)",
      "Custom Branding on Reports",
      "Vastu & Office Tools",
      "Dedicated Account Manager"
    ],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 min-h-[90vh]">
      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 text-center mb-12">
        <h2 className="text-4xl font-extrabold text-indigo-900 mb-4 tracking-tight">
          Choose Your Plan
        </h2>
        <p className="text-lg text-indigo-700 mb-8 max-w-xl mx-auto">
          Flexible plans for astrologers and enthusiasts—discover your cosmic journey with features that grow with you.
        </p>
      </div>
      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className={`bg-white rounded-2xl shadow-xl border 
              ${plan.highlight ? "border-fuchsia-400 ring-2 ring-fuchsia-200 scale-105 z-10" : "border-indigo-100"}
              flex flex-col items-center p-8 transition-all duration-300 hover:-translate-y-2`}
          >
            {plan.highlight && (
              <div className="absolute top-4 right-4 bg-fuchsia-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold select-none">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold text-indigo-900 mb-2">{plan.name}</h3>
            <div className="text-4xl font-extrabold text-indigo-800 mb-1">{plan.price}<span className="text-lg font-normal text-indigo-400">{plan.period}</span></div>
            <ul className="text-indigo-700 mb-7 mt-3 space-y-2 text-base text-left w-full max-w-xs mx-auto">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className="mr-2 text-lg text-fuchsia-500">✓</span> {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-full bg-gradient-to-r 
                ${plan.highlight 
                  ? "from-pink-400 via-purple-400 to-indigo-400 text-white font-bold" 
                  : "from-indigo-200 via-pink-100 to-purple-100 text-indigo-900 font-semibold"} 
                shadow hover:brightness-110 transition`}
            >
              {plan.highlight ? "Start Free Trial" : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>
      {/* Footer/Note */}
      <div className="mt-12 text-center text-xs text-indigo-400 max-w-xl mx-auto">
        All prices are inclusive of GST. Cancel anytime. More plans and add-ons coming soon.<br/>
        Need a custom solution for your organization or want yearly pricing? <a href="#contact" className="text-fuchsia-600 underline">Contact us</a>.
      </div>
    </section>
  );
}
