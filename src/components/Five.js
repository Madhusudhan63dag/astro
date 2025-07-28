import React from "react";

const qaItems = [
  {
    question: "Can I create and save unlimited Kundlis?",
    answer:
      "Absolutely! With Dhruv Astro Software, you're empowered to generate and store **unlimited Kundlis** on the cloud. This means no more paperwork, file clutter, or storage worries. Whether you're managing hundreds of clients or running astrology workshops, your data is automatically saved, backed up, and accessible from anywhere. Perfect for astrologers who want complete freedom, reliability, and zero limitations.",
  },
  {
    question: "What do I get in the Kundli reports?",
    answer:
      "Each Kundli report is a **professionally designed 200+ page document**, featuring detailed predictions, colorful charts, planetary timelines, remedies, and life-event forecasts. These reports are based on multiple systems like Parashari, KP, Lal Kitab, and more—making them incredibly comprehensive and trustworthy. Your clients will see you as a seasoned professional offering insights far beyond generic software reports.",
  },
  {
    question: "Can I add my branding to Kundli reports?",
    answer:
      "Yes, and it’s a powerful feature! Add your **name, address, logo, website, phone number**, or custom footer to every page of the Kundli. This turns every report into a marketing tool—boosting brand recall, gaining referrals, and enhancing trust. Ideal for astrologers who want to build a business and leave a lasting impression with every consultation.",
  },
  {
    question: "Does it support horoscope matching?",
    answer:
      "Yes! Our advanced matchmaking engine supports both **Ashtakoota and Dashakoota** systems along with in-depth Manglik dosha analysis. Whether you're handling traditional marriage matching or modern relationship compatibility, Dhruv gives you detailed points, analysis graphs, and recommendations in seconds. It's a complete marriage compatibility toolkit.",
  },
  {
    question: "Is there a feature for saving notes?",
    answer:
      "Definitely! With **cloud-based worksheets and note-saving**, you can jot down personalized prescriptions, remedies, to-do lists, or session summaries during your consultations. It’s like having your own digital astrology diary—auto-synced and always available across your devices. Great for client follow-ups and professional record-keeping.",
  },
  {
    question: "Which devices can I use the software on?",
    answer:
      "Dhruv Astro Software is **truly cross-platform**. It works smoothly on Windows laptops/desktops, Android phones, and iPhones. Whether you're consulting from your office or traveling to a client’s home, your data, reports, and charts are just a tap away—giving you total flexibility and control.",
  },
  {
    question: "What astrology systems are supported?",
    answer:
      "You’ll have access to **12+ astrology systems** including Parashari, KP, Jaimini, Lal Kitab, Western, Tajik, Horary, and Numerology. The software allows you to switch between systems effortlessly and even combine insights. This makes Dhruv perfect for learners, teachers, and professional astrologers who work across diverse traditions.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. Data safety is our top priority. All your Kundlis, notes, and client records are **securely encrypted and stored on the cloud** with industry-grade protection. Only you can access your files—ensuring complete confidentiality. We never sell or share your data. You focus on astrology, we take care of security.",
  },
  {
    question: "Is there advertising inside the software?",
    answer:
      "No! Unlike many free apps, Dhruv offers a **100% ad-free experience** so you can stay focused on your work without interruptions. Whether you’re generating reports or consulting clients, the interface remains clean, professional, and distraction-free.",
  },
  {
    question: "Are there tools for managing clients?",
    answer:
      "Yes, Dhruv comes with **built-in office management tools** to schedule appointments, track consultations, store client history, and manage follow-ups. Think of it as your digital astrology assistant—streamlining your workflow, improving customer service, and saving you hours every week.",
  },
  {
    question: "Can I customize the birth charts?",
    answer:
      "Yes, you can generate charts in **North Indian, South Indian, or East Indian formats**, depending on your practice or your client’s preference. You can also personalize the visual style—fonts, line colors, chart size—making every chart look unique and beautifully aligned with your brand.",
  },
  {
    question: "Do I get any perks on product delivery?",
    answer:
      "Yes! You get **Pan-India free shipping** on all AstroSage astrology products like gemstones, Yantras, books, and more. No hidden charges, no shipping fees—just order what you need and get it delivered to your door at zero extra cost.",
  },
  {
    question: "Are there discounts on other AstroSage services?",
    answer:
      "Absolutely. As an active Dhruv user, you receive a **10% discount on all other AstroSage services**—including astrology consultations, remedy tools, premium features, and reports. It’s our way of helping you grow and save more while delivering exceptional value to your clients.",
  },
  {
    question: "Is there an affiliate opportunity?",
    answer:
      "Yes! Join our affiliate program and earn **10% to 20% commissions** on every referral. Whether you're an influencer, teacher, or astrologer with a network, this is a great passive income opportunity. Share your custom referral link and watch your income grow.",
  },
  {
    question: "Does it support different languages?",
    answer:
      "Yes, Dhruv Astro Software speaks your language! It’s available in **9 Indian languages**: English, Hindi, Bengali, Marathi, Telugu, Tamil, Kannada, Malayalam, and Gujarati. Serve clients in their native language and make every consultation more personal and impactful.",
  },
];


export default function Five() {
  return (
    <section className="py-20 pt-60 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
      <div className="px-6">
        <h2 className="text-5xl font-extrabold text-indigo-900 mb-14 text-center tracking-tight leading-tight">
          Why Choose <span className="text-gradient bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 bg-clip-text text-transparent">Dhruv Astro Software</span>?
        </h2>
        <div className="">
          {qaItems.map(({ question, answer }, idx) => (
            <div key={idx} className="group">
              <dt className="text-2xl font-semibold text-indigo-900 mb-3 leading-snug transition-colors group-hover:text-purple-600 cursor-pointer">
                {question}
              </dt>
              <dd className="text-indigo-700 text-lg leading-relaxed">
                {answer}
              </dd>
              <div className="w-20 h-1 mt-6 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 rounded-full opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

