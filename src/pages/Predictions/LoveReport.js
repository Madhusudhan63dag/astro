import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import birthChartImage from '../../assets/services/love.webp';
import ThankYouPage from '../../components/ThankYouPage';
import API_CONFIG from '../api';
import { getRawPrice, getFormattedPrice, PRICE_KEYS } from '../../config/prices';
const API_URL = API_CONFIG.API_URL;




const LoveReport = () => {
  const { t } = useTranslation();
  const BC_PRICE_NUMBER = getRawPrice(PRICE_KEYS.loveReport);
  const BC_PRICE_FORMATTED = getFormattedPrice(PRICE_KEYS.loveReport);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    language: 'en',
    email: '',
    phone: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // State variables for tracking
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [userAbandoned, setUserAbandoned] = useState(false);

  // Manual split fields for DOB and TOB
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [tobHour, setTobHour] = useState('');
  const [tobMinute, setTobMinute] = useState('');
  const [tobMeridiem, setTobMeridiem] = useState('AM');

  // Refs for auto-advance focus
  const ddRef = useRef(null);
  const mmRef = useRef(null);
  const yyyyRef = useRef(null);
  const hhRef = useRef(null);
  const minRef = useRef(null);

  // Initialize session tracking
  useEffect(() => {
    setSessionStartTime(Date.now());
  }, []);

  // Helpers: validation and normalization
  const clampNum = (num, min, max) => Math.max(min, Math.min(max, num));
  const isValidDateParts = (d, m, y) => {
    if (!d || !m || !y || y.length !== 4) return false;
    const day = parseInt(d, 10);
    const mon = parseInt(m, 10);
    const yr = parseInt(y, 10);
    if (Number.isNaN(day) || Number.isNaN(mon) || Number.isNaN(yr)) return false;
    if (mon < 1 || mon > 12) return false;
    const dt = new Date(yr, mon - 1, day);
    return dt.getFullYear() === yr && dt.getMonth() === mon - 1 && dt.getDate() === day;
  };
  
  const updateDateInForm = (d, m, y) => {
    if (isValidDateParts(d, m, y)) {
      const yyyy = y;
      const mm = String(parseInt(m, 10)).padStart(2, '0');
      const dd = String(parseInt(d, 10)).padStart(2, '0');
      setFormData(prev => ({ ...prev, dateOfBirth: `${yyyy}-${mm}-${dd}` }));
    } else {
      setFormData(prev => ({ ...prev, dateOfBirth: '' }));
    }
  };
  
  const updateTimeInForm = (h, m, mer) => {
    if (!h || !m || h.length < 1 || m.length < 2) {
      setFormData(prev => ({ ...prev, timeOfBirth: '' }));
      return;
    }
    let hh = parseInt(h, 10);
    const mm = parseInt(m, 10);
    if (Number.isNaN(hh) || Number.isNaN(mm)) {
      setFormData(prev => ({ ...prev, timeOfBirth: '' }));
      return;
    }
    // Expect 12-hour input 1-12
    if (hh < 1) hh = 1;
    if (hh > 12) hh = 12;
    const mmClamped = clampNum(mm, 0, 59);
    // Convert to 24h
    let hh24 = hh;
    if (mer === 'AM') {
      if (hh === 12) hh24 = 0;
    } else {
      if (hh !== 12) hh24 = hh + 12;
    }
    const norm = `${String(hh24).padStart(2, '0')}:${String(mmClamped).padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, timeOfBirth: norm }));
  };

  // Handlers for digit-only inputs with auto-advance
  const onChangeDigits = (setter, value, maxLen, nextRef) => {
    const digits = (value || '').replace(/\D/g, '').slice(0, maxLen);
    setter(digits);
    if (digits.length === maxLen && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  // Auto-update form data when manual inputs change
  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      updateDateInForm(dobDay, dobMonth, dobYear);
    }
  }, [dobDay, dobMonth, dobYear]);

  useEffect(() => {
    if (tobHour && tobMinute) {
      updateTimeInForm(tobHour, tobMinute, tobMeridiem);
    }
  }, [tobHour, tobMinute, tobMeridiem]);

  // Initialize split fields from existing formData (if any)
  useEffect(() => {
    if (formData.dateOfBirth) {
      const [y, m, d] = formData.dateOfBirth.split('-');
      if (y && m && d) {
        setDobYear(y);
        setDobMonth(m);
        setDobDay(d);
      }
    }
    if (formData.timeOfBirth) {
      const [hhStr, mmStr] = formData.timeOfBirth.split(':');
      if (hhStr && mmStr) {
        let h = parseInt(hhStr, 10);
        let mer = 'AM';
        if (h === 0) { h = 12; mer = 'AM'; }
        else if (h === 12) { mer = 'PM'; }
        else if (h > 12) { h = h - 12; mer = 'PM'; }
        setTobHour(String(h).padStart(2, '0'));
        setTobMinute(String(parseInt(mmStr, 10)).padStart(2, '0'));
        setTobMeridiem(mer);
      }
    }
  }, [formData.dateOfBirth, formData.timeOfBirth]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Load Razorpay script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Send abandonment email
  const sendAbandonmentEmail = useCallback(async (reason = 'Payment cancelled by user') => {
    // Prevent multiple abandonment emails
    if (userAbandoned || paymentCompleted || showThankYou) return;
    
    setUserAbandoned(true);
    
    try {
      const abandonmentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: 'love-report',
        birthDetails: {
          dateOfBirth: formData.dateOfBirth,
          timeOfBirth: formData.timeOfBirth,
          placeOfBirth: formData.placeOfBirth,
          gender: formData.gender
        },
        language: formData.language,
        abandonmentReason: reason,
        sessionData: {
          timeOnPage: sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0,
          hasUserInteracted: true
        }
      };

      await fetch(`${API_URL}/abandoned-payment-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(abandonmentData)
      });
    } catch (error) {
      console.error('Error sending abandonment email:', error);
    }
  }, [formData, paymentCompleted, sessionStartTime, showThankYou, userAbandoned]);

  // Handle payment success
  const handlePaymentSuccess = async (paymentData) => {
    try {
      setPaymentInProgress(false);
      setPaymentCompleted(true);
      setIsProcessingPayment(true);

      // First verify payment
      const verifyResponse = await fetch(`${API_URL}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
        })
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.success) {
        // Send astrology service email with CORRECT data format
        const astroEmailData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: 'love-report',
          reportType: 'love-report',
          birthDetails: {
            dateOfBirth: formData.dateOfBirth,
            timeOfBirth: formData.timeOfBirth,
            placeOfBirth: formData.placeOfBirth,
            gender: formData.gender
          },
          language: formData.language,
          additionalInfo: 'Complete Love Report Analysis Request',
          paymentDetails: {
            status: 'paid',
            amount: BC_PRICE_NUMBER,
            paymentId: paymentData.razorpay_payment_id,
            orderId: paymentData.razorpay_order_id
          }
        };

        console.log('Sending astro email data:', astroEmailData); // Debug log

        const emailResponse = await fetch(`${API_URL}/send-astro-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(astroEmailData)
        });

        if (!emailResponse.ok) {
          throw new Error(`Email API returned ${emailResponse.status}: ${emailResponse.statusText}`);
        }

        const emailResult = await emailResponse.json();

        if (emailResult.success) {
          // Set analysis data for thank you page
          setAnalysisData({
            orderId: paymentData.razorpay_order_id,
            paymentId: paymentData.razorpay_payment_id,
            requestId: paymentData.razorpay_order_id,
            service: 'Love Report Analysis',
            amount: BC_PRICE_FORMATTED,
            status: 'completed'
          });

          // IMPORTANT: Show thank you page
          setShowThankYou(true);
          setIsGenerating(false);
          setIsProcessingPayment(false);
        } else {
          throw new Error(emailResult.message || 'Failed to send confirmation email');
        }
      } else {
        throw new Error(verifyResult.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setError(`Failed to process astrology service request: ${error.message}`);
      setIsProcessingPayment(false);
    }
  };

  // Handle payment failure/cancellation
  const handlePaymentFailure = (error) => {
      console.error('Payment failed:', error);
      setPaymentInProgress(false);
      setIsProcessingPayment(false);
      setIsGenerating(false);
      
      let reason = 'Payment failed';
      if (error.code === 'BAD_REQUEST_ERROR') {
        reason = 'User cancelled payment';
      } else if (error.description) {
        reason = error.description;
      }
      
      // Send abandonment email ONLY for payment failures/cancellations
      sendAbandonmentEmail(reason);
      
      setError(t('payment_failed_message') || 'Payment failed. Please try again or contact support.');
  };

  // Initialize Razorpay payment
  const initializePayment = async (orderData) => {
    const res = await loadRazorpay();
    if (!res) {
      setError('Failed to load payment gateway. Please try again.');
      return;
    }

    setPaymentInProgress(true);

    const options = {
      key: orderData.key,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: 'SriAstroVeda',
      description: 'Love Report Analysis - Complete Kundli Report',
      image: '/logo192.png',
      order_id: orderData.order.id,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#9333EA'
      },
      modal: {
        ondismiss: () => {
          // Only trigger abandonment if user hasn't completed payment and actually cancels
          if (paymentInProgress && !paymentCompleted) {
            setPaymentInProgress(false);
            setIsProcessingPayment(false);
            setIsGenerating(false);
            sendAbandonmentEmail('User closed payment modal without completing payment');
          }
        }
      },
      handler: handlePaymentSuccess,
      timeout: 300,
    };

    const razorpay = new window.Razorpay(options);
    
    razorpay.on('payment.failed', handlePaymentFailure);
    
    try {
      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      setPaymentInProgress(false);
      setIsProcessingPayment(false);
      setIsGenerating(false);
      sendAbandonmentEmail('Error opening payment gateway');
      setError('Failed to open payment gateway. Please try again.');
    }
  };

  // Main form submission handler
  const handleGenerateAnalysis = async (e) => {
    e.preventDefault();
    
    // Force update date/time if manual inputs are complete
    if (dobDay && dobMonth && dobYear && !formData.dateOfBirth) {
      updateDateInForm(dobDay, dobMonth, dobYear);
    }
    if (tobHour && tobMinute && !formData.timeOfBirth) {
      updateTimeInForm(tobHour, tobMinute, tobMeridiem);
    }
    
    // Add a small delay to ensure state updates
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || 
        !formData.dateOfBirth || !formData.timeOfBirth || !formData.placeOfBirth) {
      setError(t('please_fill_required_fields') || 'Please fill in all required fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('invalid_email_format') || 'Please enter a valid email address.');
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^\+?[\d\s()-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError(t('invalid_phone_format') || 'Please enter a valid phone number.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setPaymentInitiated(true);

    try {
      const orderResponse = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: BC_PRICE_NUMBER,
          currency: 'INR',
          receipt: `love_report_${Date.now()}`,
          notes: {
            service: 'love_report_analysis',
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone
          }
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      if (orderData.success) {
        setIsProcessingPayment(true);
        await initializePayment(orderData);
      } else {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

    } catch (error) {
      console.error('Order creation error:', error);
      setError(error.message || 'Failed to initialize payment. Please try again.');
      setIsGenerating(false);
      
      // Send abandonment email ONLY for technical issues that prevent payment
      sendAbandonmentEmail(`Technical error during order creation: ${error.message}`);
    }
  };

  useEffect(() => {
      const handleBeforeUnload = (e) => {
        // Only send abandonment if:
        // 1. User has filled form and initiated payment
        // 2. Payment hasn't been completed
        // 3. User hasn't already abandoned
        // 4. Not on thank you page
        if (paymentInitiated && !paymentCompleted && !userAbandoned && !showThankYou) {
          // Check if form has meaningful data
          const hasFormData = formData.name && formData.email && formData.phone;
          if (hasFormData) {
            sendAbandonmentEmail('User left page with filled form details');
          }
        }
      };

      const handleVisibilityChange = () => {
        // Track when user switches tabs during payment process
        if (document.hidden && paymentInProgress && !paymentCompleted) {
          // Don't send immediately - user might come back
          setTimeout(() => {
            if (document.hidden && paymentInProgress && !paymentCompleted && !userAbandoned) {
              sendAbandonmentEmail('User switched away during payment process');
            }
          }, 30000); // Wait 30 seconds before considering it abandonment
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
  }, [paymentInitiated, paymentCompleted, userAbandoned, showThankYou, formData, sendAbandonmentEmail, paymentInProgress]);

  return (
    <div>
      {showThankYou ? (
        <ThankYouPage 
          userName={formData.name}
          userEmail={formData.email}
          chartData={analysisData}
          serviceAmount={BC_PRICE_FORMATTED}
          serviceFeatures={[
            t('detailed_love_report_pdf') || "Detailed Love Report (PDF)",
            t('comprehensive_astrological_analysis') || "Comprehensive Astrological Analysis",
            t('planetary_positions_interpretations') || "Planetary Positions & Interpretations",
            t('dasha_system_predictions') || "Dasha System Predictions",
            t('personalized_remedial_suggestions') || "Personalized Remedial Suggestions"
          ]}
          bgGradient="from-indigo-900 via-purple-900 to-pink-900"
          onClose={() => setShowThankYou(false)}
        />
      ) : (
        <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          {/* Live status for accessibility */}
          <div aria-live="polite" aria-busy={isProcessingPayment || isGenerating ? 'true' : 'false'} className="sr-only">
            {isProcessingPayment ? (t('processing_payment') || 'Processing Payment') : (isGenerating ? (t('processing_request') || 'Generating Analysis') : '')}
          </div>

          {/* Hero: Left content, right image */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: service copy */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300">
                    {t('discover_your')} {t('love_report')}
                  </span>
                  <span className="block mt-3 text-purple-100/90 text-xl sm:text-2xl">
                    {t('cosmic_love_insights')}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-purple-100/90 max-w-2xl mt-5">
                  {t('love_report_description')}
                </p>

                {/* Advantages/benefits */}
                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-white font-semibold mb-1">{t('delivery_time') || 'Analysis Delivery'}</h3>
                    <p className="text-purple-100/90 text-sm">{t('within_12_hours_delivery_note_love')}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-white font-semibold mb-1">{t('pdf_download')}</h3>
                    <p className="text-purple-100/90 text-sm">{t('comprehensive_love_analysis_note')}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-white font-semibold mb-1">{t('romantic_compatibility_score')}</h3>
                    <p className="text-purple-100/90 text-sm">{t('relationship_potential_insights')}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-white font-semibold mb-1">{t('marriage_timing_insights')}</h3>
                    <p className="text-purple-100/90 text-sm">{t('marriage_timing_predictions')}</p>
                  </div>
                </div>
              </div>

              {/* Right: image */}
              <div className="relative overflow-hidden rounded-2xl border border-purple-700/40 bg-black/40">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-purple-400/10 to-pink-400/10" />
                <img
                  src={birthChartImage}
                  alt={t('sample_love_analysis')}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Form section below (full width) */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-5 sm:p-7 border border-purple-700/40">
              <h2 className="text-2xl font-bold text-white mb-5">
                {t('enter_details_for_love_analysis')}
              </h2>

              {/* Error */}
              {error && (
                <div className="mb-5 p-4 bg-red-900/50 border border-red-500/50 rounded-lg" role="alert">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Full form (unchanged handlers) */}
              <form onSubmit={handleGenerateAnalysis} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-2">
                    {t('full_name')} <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('enter_full_name')}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-2">
                    {t('email_address')} <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('enter_email_address')}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-2">
                    {t('phone_number')} <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('enter_phone_number')}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-2">
                    {t('gender')} <span className="text-pink-400">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="male">{t('male')}</option>
                    <option value="female">{t('female')}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                </div>

                {/* Date & Time split */}
                <div>
                  <label className="block text-gray-100 font-semibold text-lg mb-3">
                    {t('date_of_birth')} • {t('time_of_birth')} <span className="text-pink-400">*</span>
                  </label>
                  <div className="bg-gray-800/60 border border-purple-600/40 rounded-xl p-4">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Date: DD/MM/YYYY */}
                      <div className="flex items-center gap-2">
                        <input
                          ref={ddRef}
                          type="text"
                          inputMode="numeric"
                          placeholder="DD"
                          value={dobDay}
                          onChange={(e) => onChangeDigits(setDobDay, e.target.value, 2, mmRef)}
                          onBlur={() => updateDateInForm(dobDay, dobMonth, dobYear)}
                          className="w-16 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-purple-600/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-gray-400">/</span>
                        <input
                          ref={mmRef}
                          type="text"
                          inputMode="numeric"
                          placeholder="MM"
                          value={dobMonth}
                          onChange={(e) => onChangeDigits(setDobMonth, e.target.value, 2, yyyyRef)}
                          onBlur={() => updateDateInForm(dobDay, dobMonth, dobYear)}
                          className="w-16 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-purple-600/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-gray-400">/</span>
                        <input
                          ref={yyyyRef}
                          type="text"
                          inputMode="numeric"
                          placeholder="YYYY"
                          value={dobYear}
                          onChange={(e) => onChangeDigits(setDobYear, e.target.value, 4, hhRef)}
                          onBlur={() => updateDateInForm(dobDay, dobMonth, dobYear)}
                          className="w-24 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-purple-600/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      {/* Time: HH:MM and AM/PM */}
                      <div className="flex items-center gap-2">
                        <input
                          ref={hhRef}
                          type="text"
                          inputMode="numeric"
                          placeholder="HH"
                          value={tobHour}
                          onChange={(e) => onChangeDigits(setTobHour, e.target.value, 2, minRef)}
                          onBlur={() => updateTimeInForm(tobHour, tobMinute, tobMeridiem)}
                          className="w-16 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-purple-600/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-gray-400">:</span>
                        <input
                          ref={minRef}
                          type="text"
                          inputMode="numeric"
                          placeholder="MM"
                          value={tobMinute}
                          onChange={(e) => onChangeDigits(setTobMinute, e.target.value, 2)}
                          onBlur={() => updateTimeInForm(tobHour, tobMinute, tobMeridiem)}
                          className="w-16 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-purple-600/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      {/* AM/PM toggle */}
                      <div className="inline-flex rounded-md overflow-hidden border border-purple-600/40">
                        <button
                          type="button"
                          onClick={() => { setTobMeridiem('AM'); updateTimeInForm(tobHour, tobMinute, 'AM'); }}
                          className={`px-3 py-2 text-sm ${tobMeridiem === 'AM' ? 'bg-purple-600 text-white' : 'bg-gray-900/70 text-gray-200'}`}
                        >
                          AM
                        </button>
                        <button
                          type="button"
                          onClick={() => { setTobMeridiem('PM'); updateTimeInForm(tobHour, tobMinute, 'PM'); }}
                          className={`px-3 py-2 text-sm ${tobMeridiem === 'PM' ? 'bg-purple-600 text-white' : 'bg-gray-900/70 text-gray-200'}`}
                        >
                          PM
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-3">
                      {'Enter DD/MM/YYYY and HH:MM (12-hour) with AM/PM'}
                    </p>
                  </div>
                </div>

                {/* Time visualization (text only) */}
                {formData.timeOfBirth && (
                  <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-xl p-4 sm:p-6">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-200 mb-1 sm:mb-2">
                        {new Date(`2000-01-01T${formData.timeOfBirth}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {(() => {
                          const hour = parseInt(formData.timeOfBirth.split(':'), 10);
                          if (hour >= 5 && hour < 12) return 'Morning Birth';
                          if (hour >= 12 && hour < 17) return 'Afternoon Birth';
                          if (hour >= 17 && hour < 21) return 'Evening Birth';
                          return 'Night Birth';
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Place of Birth */}
                <div>
                  <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-2">
                    {t('place_of_birth')} <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleInputChange}
                    placeholder={t('place_of_birth_placeholder')}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                  <p className="text-gray-400 text-xs sm:text-sm mt-2">{t('place_birth_note')}</p>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-2">
                    {t('preferred_language')} <span className="text-pink-400">*</span>
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="en">{t('english')}</option>
                    <option value="hi">{t('hindi')}</option>
                    <option value="te">{t('telugu')}</option>
                    <option value="kn">{t('kannada')}</option>
                  </select>
                </div>

                {/* Pricing */}
                <div>
                  <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-4">
                    {t('service_price')}
                  </label>
                  <div className="bg-gradient-to-r from-purple-400/10 to-pink-400/10 border-2 border-purple-400/50 rounded-lg p-4 sm:p-6">
                    <div className="text-center">
                      <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">
                        {t('complete_love_analysis')}
                      </h4>
                      <div className="text-3xl sm:text-4xl font-bold text-purple-300 mb-3 sm:mb-4">
                        {BC_PRICE_FORMATTED}
                      </div>
                      <ul className="text-gray-300 text-xs sm:text-sm space-y-2 text-left max-w-sm mx-auto">
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 inline-block"></span>
                          <span>{t('detailed_love_report')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 inline-block"></span>
                          <span>{t('comprehensive_analysis') || t('comprehensive_love_analysis_note')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 inline-block"></span>
                          <span>{t('remedial_suggestions') || t('love_enhancing_remedies')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 inline-block"></span>
                          <span>{t('pdf_download')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
 
                {/* CTA */}
                <button
                  type="submit"
                  disabled={isGenerating || isProcessingPayment}
                  className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg"
                >
                  {isProcessingPayment
                    ? `${t('processing_payment')}...`
                    : isGenerating
                    ? `${t('processing_request')}...`
                    : `${t('pay_and_generate_analysis_love') || t('pay_and_generate_chart')} - ${BC_PRICE_FORMATTED}`}
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default LoveReport;
