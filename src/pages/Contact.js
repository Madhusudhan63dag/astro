import React, { useState } from "react";
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";

const initial = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [sent, setSent] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Replace with real email send/api
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm(initial);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 min-h-[90vh]">
      <div className=" px-6 py-12">
        <h2 className="text-4xl font-extrabold text-indigo-900 text-center mb-2 tracking-tight">
          Contact Us
        </h2>
        <p className="text-lg text-indigo-700 mb-10 text-center">
          Have a question, feedback, or want a personalized consultation? Reach out and we’ll respond within 24–48 hours.
        </p>
        <div className="flex flex-col md:flex-row md:gap-10 gap-7 justify-between">
          {/* Info block */}
          <div className="md:w-1/2 flex flex-col justify-start md:pt-2">
            <div className="mb-6">
              <div className="font-bold text-indigo-900 mb-1">Email:</div>
              <a href="mailto:support@dhruvastro.com" className="text-fuchsia-600 hover:underline">
                support@dhruvastro.com
              </a>
            </div>
            <div className="mb-6">
              <div className="font-bold text-indigo-900 mb-1">Phone / WhatsApp:</div>
              <a href="tel:+911234567890" className="text-fuchsia-600 hover:underline block mb-1">
                +91 12345 67890
              </a>
              <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline flex items-center gap-2">
                <FaWhatsapp /> Chat on WhatsApp
              </a>
            </div>
            <div>
              <div className="font-bold text-indigo-900 mb-1">Follow Us:</div>
              <div className="flex space-x-4 mt-2 text-xl">
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-fuchsia-500 transition"><FaInstagram /></a>
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-fuchsia-500 transition"><FaFacebookF /></a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-fuchsia-500 transition"><FaTwitter /></a>
              </div>
            </div>
          </div>
          {/* Contact form */}
          <form onSubmit={handleSubmit} className="md:w-1/2 flex flex-col gap-5">
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="name">
                Name <span className="text-pink-500">*</span>
              </label>
              <input
                required
                name="name"
                id="name"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="email">
                Email <span className="text-pink-500">*</span>
              </label>
              <input
                required
                type="email"
                name="email"
                id="email"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="phone">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                value={form.phone}
                onChange={handleChange}
                placeholder="Optional: +91 xxxxx-xxxxx"
              />
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="subject">
                Subject
              </label>
              <input
                name="subject"
                id="subject"
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
              />
            </div>
            <div>
              <label className="block font-semibold text-indigo-800 mb-1" htmlFor="message">
                Message <span className="text-pink-500">*</span>
              </label>
              <textarea
                required
                name="message"
                id="message"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us how we can help!"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white font-bold py-3 rounded-lg shadow hover:brightness-110 transition"
            >
              {sent ? "Message Sent!" : "Send Message"}
            </button>
            {sent && (
              <div className="text-green-600 text-center mt-2">
                Thank you for contacting us! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
