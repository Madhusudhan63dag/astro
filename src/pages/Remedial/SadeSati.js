import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import sadesatiImage from '../../assets/services/sadesati.jpg';
import ThankYouPage from '../../components/ThankYouPage';
import API_CONFIG from '../api';
import { getRawPrice, getFormattedPrice, PRICE_KEYS } from '../../config/prices';
// Removed MUI imports since we're using manual inputs now

const API_URL = API_CONFIG.API_URL;

const SadeSati = () => {
  const { t } = useTranslation();
  const BC_PRICE_NUMBER = getRawPrice(PRICE_KEYS.sadeSati);
  const BC_PRICE_FORMATTED = getFormattedPrice(PRICE_KEYS.sadeSati);
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
        service: 'sadesati',
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
          service: 'sadesati',
          reportType: 'sadesati',
          birthDetails: {
            dateOfBirth: formData.dateOfBirth,
            timeOfBirth: formData.timeOfBirth,
            placeOfBirth: formData.placeOfBirth,
            gender: formData.gender
          },
          language: formData.language,
          additionalInfo: 'Complete SadeSati (Kundli) Analysis Request',
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
            service: 'SadeSati Analysis',
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
      description: 'SadeSati Analysis - Complete Kundli Report',
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
          receipt: `sadesati_${Date.now()}`,
          notes: {
            service: 'sadesati-consultation',
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
            t('detailed_sade_sati_pdf') || "Detailed SadeSati (PDF)",
            t('comprehensive_astrological_analysis') || "Comprehensive Astrological Analysis",
            t('planetary_positions_interpretations') || "Planetary Positions & Interpretations",
            t('dasha_system_predictions') || "Dasha System Predictions",
            t('personalized_remedial_suggestions') || "Personalized Remedial Suggestions"
          ]}
          bgGradient="from-indigo-900 via-purple-900 to-pink-900"
          onClose={() => setShowThankYou(false)}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 sm:top-20 left-4 sm:left-10 text-4xl sm:text-6xl text-purple-400">✦</div>
            <div className="absolute top-20 sm:top-40 right-8 sm:right-20 text-3xl sm:text-4xl text-pink-400">✧</div>
            <div className="absolute bottom-20 sm:bottom-40 left-8 sm:left-20 text-4xl sm:text-5xl text-purple-400">✦</div>
            <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 text-2xl sm:text-3xl text-pink-400">✧</div>
            <div className="absolute top-1/2 left-1/4 text-2xl sm:text-3xl text-purple-300">✦</div>
            <div className="absolute top-1/3 right-1/3 text-xl sm:text-2xl text-pink-300">✧</div>
          </div>

          <div className="relative z-10 py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                <span className="text-purple-400">{t('sadesati_your')}</span>
                
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-2">
                {t('sadesati_description')}
              </p>
            </div>

            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
                {/* Left Side - Form */}
                <div className="space-y-6 sm:space-y-8">
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-700/50">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                      <span className="text-purple-400 mr-2 sm:mr-3 text-lg sm:text-xl">📝</span>
                      {t('enter_birth_details')}
                    </h2>

                    {/* Error Display */}
                    {error && (
                      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
                        <p className="text-red-300 flex items-center text-sm sm:text-base">
                          <span className="mr-2">⚠️</span>
                          {error}
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleGenerateAnalysis} className="space-y-4 sm:space-y-6">
                      {/* Name Field */}
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
                          className="w-full px-3 sm:px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          required
                        />
                      </div>

                      {/* Email Field */}
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
                          className="w-full px-3 sm:px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          required
                        />
                      </div>

                      {/* Phone Field */}
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
                          className="w-full px-3 sm:px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          required
                        />
                      </div>

                      {/* Gender Field */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-2">
                          {t('gender')} <span className="text-pink-400">*</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          required
                        >
                          <option value="male">{t('male')}</option>
                          <option value="female">{t('female')}</option>
                          <option value="other">{t('other')}</option>
                        </select>
                      </div>

                      {/* Date & Time of Birth - Manual split fields */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-lg mb-3">
                          {t('date_of_birth') || 'DATE & TIME OF BIRTH'} <span className="text-pink-400">*</span>
                        </label>
                        <div className="bg-gray-800/60 border border-purple-600/40 rounded-xl p-4">
                          <div className="flex flex-wrap items-center gap-4">
                            {/* Date: DD / MM / YYYY */}
                            <div className="flex items-center gap-2">
                              <input
                                ref={ddRef}
                                type="text"
                                inputMode="numeric"
                                placeholder="DD"
                                value={dobDay}
                                onChange={(e) => {
                                  onChangeDigits(setDobDay, e.target.value, 2, mmRef);
                                }}
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
                                onChange={(e) => {
                                  onChangeDigits(setDobMonth, e.target.value, 2, yyyyRef);
                                }}
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
                                onChange={(e) => {
                                  onChangeDigits(setDobYear, e.target.value, 4, hhRef);
                                }}
                                onBlur={() => updateDateInForm(dobDay, dobMonth, dobYear)}
                                className="w-24 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-purple-600/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>

                            {/* Time: HH : MM and AM/PM */}
                            <div className="flex items-center gap-2">
                              <input
                                ref={hhRef}
                                type="text"
                                inputMode="numeric"
                                placeholder="HH"
                                value={tobHour}
                                onChange={(e) => {
                                  onChangeDigits(setTobHour, e.target.value, 2, minRef);
                                }}
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
                                onChange={(e) => {
                                  onChangeDigits(setTobMinute, e.target.value, 2);
                                }}
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
                                {t('am') || 'AM'}
                              </button>
                              <button
                                type="button"
                                onClick={() => { setTobMeridiem('PM'); updateTimeInForm(tobHour, tobMinute, 'PM'); }}
                                className={`px-3 py-2 text-sm ${tobMeridiem === 'PM' ? 'bg-purple-600 text-white' : 'bg-gray-900/70 text-gray-200'}`}
                              >
                                {t('pm') || 'PM'}
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-400 text-xs mt-3">{t('date_time_hint') || 'Enter DD/MM/YYYY and HH:MM (12-hour) with AM/PM'}</p>
                        </div>
                        <div className="mt-3 flex items-center text-sm">
                          <div className="flex items-center text-gray-400">
                            <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {t('enter_your_birth_date_accurately')}
                          </div>
                        </div>
                      </div>

                      {/* Time Visualization */}
                      {formData.timeOfBirth && (
                        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-xl p-4 sm:p-6">
                          <div className="text-center">
                            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">
                              {(() => {
                                const hour = parseInt(formData.timeOfBirth.split(':')[0]);
                                if (hour >= 5 && hour < 12) return '🌅';
                                if (hour >= 12 && hour < 17) return '☀️';
                                if (hour >= 17 && hour < 21) return '🌆';
                                return '🌙';
                              })()}
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-gray-200 mb-1 sm:mb-2">
                              {new Date(`2000-01-01T${formData.timeOfBirth}`).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400">
                              {(() => {
                                const hour = parseInt(formData.timeOfBirth.split(':')[0]);
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
                          className="w-full px-3 sm:px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          required
                        />
                        <p className="text-gray-400 text-xs sm:text-sm mt-2">
                          {t('place_birth_note')}
                        </p>
                      </div>

                      {/* Language Selection */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-2">
                          {t('preferred_language')} <span className="text-pink-400">*</span>
                        </label>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          required
                        >
                          <option value="en">{t('english')}</option>
                          <option value="hi">{t('hindi')}</option>
                          <option value="te">{t('telugu')}</option>
                          <option value="kn">{t('kannada')}</option>
                        </select>
                      </div>

                      {/* Pricing Information */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-4">
                          {t('service_price')}
                        </label>
                        <div className="bg-gradient-to-r from-purple-400/10 to-pink-400/10 border-2 border-purple-400/50 rounded-lg p-4 sm:p-6">
                          <div className="text-center">
                            <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">{t('complete_sadesati_analysis')}</h4>
                            <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-3 sm:mb-4">{BC_PRICE_FORMATTED}</div>
                            <ul className="text-gray-300 text-xs sm:text-sm space-y-2 text-left max-w-sm mx-auto">
                              <li className="flex items-center gap-2">
                                <span className="text-purple-400 flex-shrink-0">✓</span>
                                <span>{t('detailed_sadesati_report')}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-purple-400 flex-shrink-0">✓</span>
                                <span>{t('comprehensive_analysis')}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-purple-400 flex-shrink-0">✓</span>
                                <span>{t('sadesati_predictions')}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-purple-400 flex-shrink-0">✓</span>
                                <span>{t('remedial_suggestions')}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-purple-400 flex-shrink-0">✓</span>
                                <span>{t('pdf_download')}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Generate Button */}
                      <button
                        type="submit"
                        disabled={isGenerating || isProcessingPayment}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 sm:py-4 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                      >
                        {isProcessingPayment ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-4 sm:h-5 w-4 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('processing_payment')}...
                          </span>
                        ) : isGenerating ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-4 sm:h-5 w-4 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('processing_request')}...
                          </span>
                        ) : (
                          `${t('pay_and_generate_chart')} - ${BC_PRICE_FORMATTED}`
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Side - Visual Content */}
                <div className="space-y-6 sm:space-y-8">
                  {!showAnalysis ? (
                    <>
                      {/* Sample Chart Display */}
                      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-700/50">
                        <div className="relative">
                          <img
                            src={sadesatiImage}
                            alt={t('sadesati')}
                            className="w-full rounded-xl shadow-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-xl"></div>
                        </div>
                      </div>

                      {/* Astrological Symbols */}
                      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-700/50">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                          <span className="text-purple-400 mr-2 sm:mr-3 text-lg">🌟</span>
                          {t('astrological_elements')}
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                            <div className="text-xl sm:text-2xl mb-1 sm:mb-2 text-purple-400">☉</div>
                            <div className="text-gray-300 text-xs sm:text-sm">{t('sun')}</div>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                            <div className="text-xl sm:text-2xl mb-1 sm:mb-2 text-purple-400">☽</div>
                            <div className="text-gray-300 text-xs sm:text-sm">{t('moon')}</div>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                            <div className="text-xl sm:text-2xl mb-1 sm:mb-2 text-purple-400">♂</div>
                            <div className="text-gray-300 text-xs sm:text-sm">{t('mars')}</div>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                            <div className="text-xl sm:text-2xl mb-1 sm:mb-2 text-purple-400">☿</div>
                            <div className="text-gray-300 text-xs sm:text-sm">{t('mercury')}</div>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                            <div className="text-xl sm:text-2xl mb-1 sm:mb-2 text-purple-400">♃</div>
                            <div className="text-gray-300 text-xs sm:text-sm">{t('jupiter')}</div>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                            <div className="text-xl sm:text-2xl mb-1 sm:mb-2 text-purple-400">♀</div>
                            <div className="text-gray-300 text-xs sm:text-sm">{t('venus')}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Generated Chart Result
                    <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-700/50">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                        <span className="text-purple-400 mr-2 sm:mr-3 text-lg sm:text-xl">📊</span>
                        {t('your_sadesati_status')}
                      </h3>
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl p-6 sm:p-8 mb-4 sm:mb-6">
                          <div className="text-4xl sm:text-6xl text-purple-400 mb-3 sm:mb-4">⏳</div>
                          <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">
                            {t('processing_your_chart')}
                          </h4>
                          <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                            {t('chart_processing_message')}
                          </p>
                          {analysisData && (
                            <div className="mt-3 sm:mt-4 text-left bg-black/30 rounded-lg p-3 sm:p-4">
                              <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                <span className="font-semibold text-white">{t('request_id')}:</span> {analysisData.requestId}
                              </p>
                              <p className="text-gray-400 text-xs sm:text-sm">
                                <span className="font-semibold text-white">{t('status')}:</span> {analysisData.status === 'processing' ? t('processing') : t('pending')}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center gap-3 text-left">
                            <span className="text-blue-400 text-lg flex-shrink-0">📧</span>
                            <span className="text-gray-300 text-xs sm:text-sm">{t('email_notification_sent')}</span>
                          </div>
                          <div className="flex items-center gap-3 text-left">
                            <span className="text-blue-400 text-lg flex-shrink-0">📱</span>
                            <span className="text-gray-300 text-xs sm:text-sm">{t('whatsapp_update_coming')}</span>
                          </div>
                          <div className="flex items-center gap-3 text-left">
                            <span className="text-purple-400 text-lg flex-shrink-0">⏰</span>
                            <span className="text-gray-300 text-xs sm:text-sm">{t('delivery_within_12_hours')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SadeSati;
