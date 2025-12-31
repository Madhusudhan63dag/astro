// Hero.jsx (or Hero.tsx if using TypeScript)
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// Assets
import banner from '../assets/banner/banner.jpg';
import mobile_banner from '../assets/banner/mobile_banner.webp';
import guruImage from '../assets/guru.webp';

// API Configuration - Update this path as per your project structure
import API_CONFIG from '../pages/api'; // Adjust path as needed
import { getRawPrice, getFormattedPrice, PRICE_KEYS } from '../config/prices'; // Adjust path as needed

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const API_URL = API_CONFIG.API_URL;

// -------------------- Helper Functions --------------------
function clamp(n, min, max) {
  const x = Number.isFinite(+n) ? +n : 0;
  return Math.min(Math.max(x, min), max);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

// Load Razorpay script
function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    const base = src.split('?')[0];
    if (document.querySelector(`script[src^="${base}"]`)) return resolve(true);
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(s);
  });
}

async function loadRazorpayScript() {
  return loadScriptOnce('https://checkout.razorpay.com/v1/checkout.js');
}

// Form validation function
const isFormValid = (formData) => {
  const { name, email, phone, day, month, year, hour, minute, place } = formData;
  
  const hasName = name && name.trim().length >= 2;
  const hasEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const hasPhone = phone && /^\+?[\d\s\-()]{10,}$/.test(phone.trim());
  const hasDate = day && month && year;
  const hasTime = hour && minute;
  const hasPlace = place && place.trim().length >= 2;
  
  return hasName && hasEmail && hasPhone && hasDate && hasTime && hasPlace;
};

// -------------------- AstroForm Component --------------------
const AstroForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [abandonedEmailSent, setAbandonedEmailSent] = useState(false);
  const sessionStartTime = useRef(Date.now());
  const PRICE_NUMBER = getRawPrice(PRICE_KEYS.kundli);
  const PRICE_OPTIONS = [149, 199, 249, 299, 349, 399, 449, 499, 549, 599];
  const [selectedAmount, setSelectedAmount] = useState(PRICE_OPTIONS[0]);


  const PRICE_FORMATTED = getFormattedPrice(PRICE_KEYS.kundli);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'male',
    language: 'en',
    day: '',
    month: '',
    year: '',
    hour: '',
    minute: '',
    ampm: 'AM',
    place: ''
  });

  const [error, setError] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  // Check if form is valid
  const isFormComplete = useMemo(() => isFormValid(formData), [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Clear errors when user types
  };

  // Convert form data to required format
  const getFormattedData = useCallback(() => {
    const { day, month, year, hour, minute, ampm } = formData;
    
    // Format date as YYYY-MM-DD
    const dateOfBirth = `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    // Convert to 24-hour format
    let hour24 = parseInt(hour, 10) % 12;
    if (ampm === 'PM') hour24 += 12;
    const timeOfBirth = `${pad2(hour24)}:${pad2(parseInt(minute, 10))}`;
    
    return {
      ...formData,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth: formData.place
    };
  }, [formData]);

  useEffect(() => {
    const hasName = formData.name && formData.name.trim().length >= 2;
    const hasEmail = formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const hasPhone = formData.phone && /^\+?[\d\s\-()]{10,}$/.test(formData.phone);
    
    if (hasName && hasEmail && hasPhone && !abandonedEmailSent && !isPaying) {
      const timeout = setTimeout(() => {
        sendAbandonedEmail();
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [formData.name, formData.email, formData.phone, abandonedEmailSent, isPaying, selectedAmount]); // ✅ ADDED selectedAmount

  // Function to send abandoned payment notification
  const sendAbandonedEmail = async () => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: 'kundli',
        amount: selectedAmount, // ✅ FIXED
        birthDetails: {
          gender: formData.gender,
          language: formData.language
        },
        paymentDetails: {
          status: 'pending',
          orderId: `pending_hero_${Date.now()}`,
          sessionStartTime: sessionStartTime.current,
          formAbandonedAt: Date.now()
      }
      };

      await fetch(`${API_URL}/abandoned-payment-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setAbandonedEmailSent(true);
      console.log('Abandoned payment notification sent from Hero form');
    } catch (error) {
      console.error('Failed to send abandoned payment notification:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormComplete) {
      setError(t('please_complete_all_fields', { defaultValue: 'Please complete all required fields correctly.' }));
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const phoneOk = /^\+?[\d\s\-()]{10,}$/.test(formData.phone);

    if (!emailOk) return setError(t('invalid_email_format', { defaultValue: 'Please enter a valid email address.' }));
    if (!phoneOk) return setError(t('invalid_phone_format', { defaultValue: 'Please enter a valid phone number.' }));

    setError(null);
    setIsPaying(true);

    try {
      // Create order
      const orderRes = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedAmount , // Razorpay expects paise
          currency: 'INR',
          receipt: `kundli_${Date.now()}`,
          notes: {
            service: 'kundli',
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone
          }
        })

      });

      if (!orderRes.ok) throw new Error(t('failed_to_create_order', { defaultValue: 'Failed to create order' }));
      const orderData = await orderRes.json();

      if (!orderData?.success) {
        throw new Error(orderData?.message || t('failed_to_create_payment_order', { defaultValue: 'Failed to create payment order' }));
      }

      // Load Razorpay script
      await loadRazorpayScript();

      const key = orderData?.key ?? orderData?.key_id ?? orderData?.keyId ?? orderData?.razorpayKeyId;
      const order = orderData?.order ?? orderData;
      const orderId = order?.id ?? order?.order_id;
      const amount = order?.amount;
      const currency = order?.currency ?? 'INR';

      if (!key || !orderId || typeof amount !== 'number') {
        throw new Error('Missing payment key/order info');
      }

      // Initialize Razorpay
      const rzp = new window.Razorpay({
        key,
        order_id: orderId,
        amount,
        currency,
        name: 'SriAstroVeda',
        description: t('complete_kundli_report', { defaultValue: 'Complete Kundli Report' }),
        image: '/logo192.png',
        prefill: { 
          name: formData.name, 
          email: formData.email, 
          contact: formData.phone 
        },
        theme: { color: '#06B6D4' },
        handler: async (paymentData) => {
          try {
            // Verify payment
            const verifyRes = await fetch(`${API_URL}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentData.razorpay_order_id,
                razorpay_payment_id: paymentData.razorpay_payment_id,
                razorpay_signature: paymentData.razorpay_signature
              })
            });

            const verify = await verifyRes.json();
            if (!verify?.success) {
              throw new Error(verify?.message || 'Payment verification failed');
            }

            // Get formatted data
            const formattedData = getFormattedData();

            // Send email notification
            const payload = {
              name: formattedData.name,
              email: formattedData.email,
              phone: formattedData.phone,
              service: 'kundli',
              reportType: 'kundli',
              birthDetails: {
                dateOfBirth: formattedData.dateOfBirth,
                timeOfBirth: formattedData.timeOfBirth,
                placeOfBirth: formattedData.placeOfBirth,
                gender: formattedData.gender
              },
              language: formattedData.language,
              additionalInfo: t('complete_career_guidance_request', { 
                defaultValue: 'Complete Career Path Guidance (Kundli) Analysis Request' 
              }),
              paymentDetails: {
                status: 'paid',
                amount: selectedAmount,
                paymentId: paymentData.razorpay_payment_id,
                orderId: paymentData.razorpay_order_id
              }
            };

            // Send email (non-blocking)
            fetch(`${API_URL}/send-astro-email`, { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify(payload) 
            }).catch(() => {});

            // Store payment data for thank you page
            const analysisData = {
              orderId: paymentData.razorpay_order_id,
              paymentId: paymentData.razorpay_payment_id,
              requestId: paymentData.razorpay_order_id,
              service: t('birth_chart_analysis', { defaultValue: 'Personalized Astrology Report' }),
              amount: `₹${selectedAmount}`, // ✅ FIXED
              status: 'completed',
              customerName: formattedData.name,
              customerEmail: formattedData.email,
              serviceFeatures: [
                t('detailed_career_guidance_pdf', { defaultValue: 'Detailed Career Path Guidance (PDF)' }),
                t('comprehensive_astrological_analysis', { defaultValue: 'Comprehensive Astrological Analysis' }),
                t('dasha_system_predictions_feature', { defaultValue: 'Dasha System Predictions' }),
                t('personalized_remedial_suggestions_feature', { defaultValue: 'Personalized Remedial Suggestions' })
              ]
            };

            sessionStorage.setItem('paymentSuccess', JSON.stringify(analysisData));
            
            // Redirect to thank you page
            navigate('/thank-you');

          } catch (err) {
            setError(
              t('failed_to_process_astrology_request', { 
                defaultValue: 'Failed to process astrology service request' 
              }) + `: ${err.message}`
            );
          } finally {
            setIsPaying(false);
          }
        },
        modal: { 
          ondismiss: () => setIsPaying(false) 
        },
        timeout: 300
      });

      rzp.on('payment.failed', () => {
        setIsPaying(false);
        setError(t('payment_failed_message', { 
          defaultValue: 'Payment failed. Please try again or contact support.' 
        }));
      });

      rzp.open();
      
    } catch (err) {
      setIsPaying(false);
      setError(err.message || t('failed_to_initialize_payment', { 
        defaultValue: 'Failed to initialize payment' 
      }));
    }
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-cyan-500/30 rounded-3xl px-6 py-6 lg:px-8 lg:py-8 shadow-2xl w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="p-3 rounded-xl bg-red-900/50 border border-red-500/50 text-red-200 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="text-white block font-medium mb-2 text-sm">
            {t('full_name', { defaultValue: 'Full Name' })} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('enter_name', { defaultValue: 'Enter your complete name' })}
            required
            className="w-full h-11 rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white placeholder-slate-400 px-4 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-white block font-medium mb-2 text-sm">
              {t('email', { defaultValue: 'Email' })} <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="w-full h-11 rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white placeholder-slate-400 px-4 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
            />
          </div>
          <div>
            <label className="text-white block font-medium mb-2 text-sm">
              {t('phone', { defaultValue: 'Phone' })} <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765"
              required
              className="w-full h-11 rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white placeholder-slate-400 px-4 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
            />
          </div>
        </div>

        {/* Gender & Language */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-white block font-medium mb-2 text-sm">
              {t('gender', { defaultValue: 'Gender' })}
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full h-11 rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white px-4 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
            >
              <option value="male">{t('male', { defaultValue: 'Male' })}</option>
              <option value="female">{t('female', { defaultValue: 'Female' })}</option>
              <option value="other">{t('other', { defaultValue: 'Other' })}</option>
            </select>
          </div>
          <div>
            <label className="text-white block font-medium mb-2 text-sm">
              {t('language', { defaultValue: 'Language' })}
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full h-11 rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white px-4 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="text-white block font-medium mb-2 text-sm">
            {t('date_of_birth', { defaultValue: 'Date of Birth' })} <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              name="day"
              value={formData.day}
              onChange={handleChange}
              placeholder="DD"
              min="1"
              max="31"
              required
              className="h-11 rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white text-center placeholder-slate-400 px-3 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
            />
            <input
              type="number"
              name="month"
              value={formData.month}
              onChange={handleChange}
              placeholder="MM"
              min="1"
              max="12"
              required
              className="h-11 rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white text-center placeholder-slate-400 px-3 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
            />
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="YYYY"
              min="1900"
              max="2025"
              required
              className="h-11 rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white text-center placeholder-slate-400 px-3 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
            />
          </div>
        </div>

        {/* Time of Birth */}
        <div>
          <label className="text-white block font-medium mb-2 text-sm">
            {t('time_of_birth', { defaultValue: 'Time of Birth' })} <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              name="hour"
              value={formData.hour}
              onChange={handleChange}
              placeholder="HH"
              min="1"
              max="12"
              required
              className="h-11 rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white text-center placeholder-slate-400 px-3 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
            />
            <input
              type="number"
              name="minute"
              value={formData.minute}
              onChange={handleChange}
              placeholder="MM"
              min="0"
              max="59"
              required
              className="h-11 rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white text-center placeholder-slate-400 px-3 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
            />
            <div className="flex items-center justify-center gap-3">
              <label className="flex items-center gap-1 cursor-pointer text-white text-sm">
                <input
                  type="radio"
                  name="ampm"
                  value="AM"
                  checked={formData.ampm === 'AM'}
                  onChange={handleChange}
                  className="accent-cyan-500"
                />
                <span>AM</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer text-white text-sm">
                <input
                  type="radio"
                  name="ampm"
                  value="PM"
                  checked={formData.ampm === 'PM'}
                  onChange={handleChange}
                  className="accent-cyan-500"
                />
                <span>PM</span>
              </label>
            </div>
          </div>
        </div>

        {/* Birth Place */}
        <div>
          <label className="text-white block font-medium mb-2 text-sm">
            {t('birth_place', { defaultValue: 'Birth Place' })} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="place"
            value={formData.place}
            onChange={handleChange}
            placeholder={t('enter_place', { defaultValue: 'City, State, Country' })}
            required
            className="w-full h-11 rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white placeholder-slate-400 px-4 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
          />
        </div>
        <a href="/GoshalaCharitySection" className="text-white block font-medium mb-4 text-sm">
          Get Your Kundali Report | Support Goshala Seva with Every Purchase
        </a>
      <div>
        <label className="text-white block font-medium mb-2 text-sm">
          Select Your Offering Amount <span className="text-red-400">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setSelectedAmount(amount)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all
                ${selectedAmount === amount
                  ? 'bg-orange-500 text-white border-orange-400 shadow-lg scale-105'
                  : 'bg-slate-800 text-slate-200 border-slate-600 hover:border-orange-400 hover:text-white'
                }`}
            >
              ₹{amount}  {/* ✅ FIXED - Changed from selectedAmount to amount */}
            </button>
          ))}
        </div>
      </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormComplete || isPaying}
          className={`w-full h-14 rounded-xl font-bold text-white text-base shadow-lg transition-all duration-300 transform flex items-center justify-center gap-2 ${
            isFormComplete && !isPaying
              ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:scale-[1.02] cursor-pointer'
              : 'bg-slate-600 cursor-not-allowed opacity-50'
          }`}
        >
          {isPaying ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t('processing_payment', { defaultValue: 'Processing...' })}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              {t('complete_payment', { defaultValue: 'Complete Payment & Get Report' })}
            </>
          )}
        </button>

        {/* Security Note */}
        <div className="text-center text-gray-400 text-xs flex items-center justify-center gap-2">
          <svg width="14" height="14" fill="#4ade80" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
          {t('secure_payment', { defaultValue: 'Secured by SSL' })}
        </div>
      </form>

      {/* Loading Overlay */}
      {isPaying && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-900/90 rounded-2xl p-8 border border-cyan-500/30 flex flex-col items-center gap-4 max-w-sm mx-4">
            <div className="h-12 w-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin" />
            <div className="text-center">
              <p className="text-white font-semibold mb-1">
                {t('processing_payment', { defaultValue: 'Processing Payment...' })}
              </p>
              <p className="text-slate-400 text-sm">Please wait while we secure your transaction</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------- Hero --------------------
const Hero = () => {
  const { t } = useTranslation();
  const [showKundliModal, setShowKundliModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [kundliModalClosed, setKundliModalClosed] = useState(false);
  const [activeDesktopIndex, setActiveDesktopIndex] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const features = [
    { text: t('detailed_reports') },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowServicesModal(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowKundliModal(true), 5000);
    return () => clearTimeout(timer);
  }, [kundliModalClosed]);

  const handleServicesModalClose = () => {
    setShowServicesModal(false);
    setKundliModalClosed(true);
  };
  const handleKundliModalClose = () => setShowKundliModal(false);

const customStyles = `
    @keyframes fadeIn { from { opacity:0; transform: translateY(20px);} to { opacity:1; transform: translateY(0);} }
    .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
    @keyframes float { 
      0%, 100% { transform: translateY(0px); } 
      50% { transform: translateY(-10px); } 
    }
    .animate-float { animation: float 3s ease-in-out infinite; }
  `;

  const desktopSlides = [
    { type: 'image', src: banner, alt: 'SriAstroVeda Banner', eager: true },
  ];
  
  const mobileSlides = [
    { type: 'image', src: mobile_banner, alt: 'SriAstroVeda Mobile Banner', eager: true },
  ];

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* MOBILE VERSION */}
      <section className="relative w-full min-h-screen flex lg:hidden items-center justify-center overflow-hidden py-8 px-4">
        <div className="absolute inset-0 w-full h-full">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade, A11y]}
            slidesPerView={1}
            loop
            effect="fade"
            speed={800}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            onSlideChange={(swiper) => setActiveMobileIndex(swiper.realIndex)}
            className="w-full h-full"
          >
            {mobileSlides.map((s, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={s.src}
                  alt={s.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={s.eager ? 'eager' : 'lazy'}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/70" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Mobile Content with Image */}
        <div className="relative z-10 w-full flex flex-col items-center gap-6">
          {/* Guru Image - Mobile */}
          <div className="flex justify-center">
            <img 
              src={guruImage} 
              alt="Spiritual Guru" 
              className="h-64 object-cover "
            />
          </div>

          {/* Mobile Heading */}
          <div className="text-center px-4 mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3 text-white">
              {t('unlock_cosmic', { defaultValue: 'Your offering' })}
            </h1>
            <p className="text-lg sm:text-xl bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent font-semibold">
              {t('personalized_predictions', { defaultValue: 'directly supports the Goshala and spiritual missions. This simple action weaves good fortune into your life.' })}
            </p>
          </div>

          {/* Form */}
          <AstroForm />
        </div>
      </section>

      {/* DESKTOP VERSION */}
      <section className="relative w-full min-h-screen hidden lg:flex items-center justify-end overflow-hidden">
        {/* Background Swiper */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade, A11y]}
            slidesPerView={1}
            loop
            effect="fade"
            speed={800}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            navigation
            onSlideChange={(swiper) => setActiveDesktopIndex(swiper.realIndex)}
            className="w-full h-full"
          >
            {desktopSlides.map((s, idx) => (
              <SwiperSlide key={idx}>
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={s.src}
                    alt={s.alt}
                    className="w-full h-full object-cover"
                    loading={s.eager ? 'eager' : 'lazy'}
                    draggable={false}
                    style={{ objectPosition: 'center center' }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/20" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Left Side Content with Guru Image */}
        <div className="absolute left-12 xl:left-16 top-1/2 -translate-y-1/2 z-10 hidden xl:block max-w-xl">
          {/* Guru Image - Desktop */}
          <div className="">
            <img 
              src={guruImage} 
              alt="Spiritual Guru" 
              className="h-72 object-cover"
            />
          </div>

          {/* Desktop Heading */}
          <h1 className="text-xl xl:text-4xl font-bold leading-tight mb-6 text-white">
            {/* {t('unlock_cosmic', { defaultValue: 'Your offering' })} */}
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              {t('personalized_predictions', { defaultValue: 'directly supports the Goshala and spiritual missions. This simple action weaves good fortune into your life.' })}
            </span>
          </h1>

          <p className="text-xl text-gray-300 leading-relaxed">
            {t('hero_description', { defaultValue: 'Where ancient wisdom meets your modern life — explore Birth Charts, Numerology, Your Love Life, and Dasha Phal readings.' })}
          </p>
        </div>

        {/* Form on RIGHT side */}
        <div className="relative z-10 py-12 px-6 lg:px-12">
          <AstroForm />
        </div>
      </section>
    </div>
  );
};

export default Hero;