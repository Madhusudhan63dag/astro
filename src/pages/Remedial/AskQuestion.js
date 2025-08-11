import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ascendantImage from '../../assets/2.webp'; // Different image for ascendant
import API_CONFIG from '../api';

const API_URL = API_CONFIG.API_URL;

const AskQuestion = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    language: 'en',
    email: '',
    phone: '',
    question: '',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  // Send abandonment email
  const sendAbandonmentEmail = useCallback(async (reason = 'Payment cancelled by user') => {
    // Prevent multiple abandonment emails
    if (userAbandoned || paymentCompleted || showThankYou) return;
    
    setUserAbandoned(true);
    
    try {
      const timeOnPage = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0;

      const abandonmentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: 'ask-question',
        birthDetails: {
          dateOfBirth: formData.dateOfBirth,
          timeOfBirth: formData.timeOfBirth,
          placeOfBirth: formData.placeOfBirth,
          gender: formData.gender
        },
        language: formData.language,
        abandonmentReason: reason,
        sessionData: {
          timeOnPage: timeOnPage,
          hasUserInteracted: true
        },
        specialRequests: formData.question
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
          service: 'ask-question',
          reportType: 'ask-question',
          birthDetails: {
            dateOfBirth: formData.dateOfBirth,
            timeOfBirth: formData.timeOfBirth,
            placeOfBirth: formData.placeOfBirth,
            gender: formData.gender
          },
          language: formData.language,
          additionalInfo: 'Ask Question Service Request',
          specialRequests: formData.question,
          paymentDetails: {
            status: 'paid',
            amount: 149,
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
            service: 'Ask Question Service',
            amount: '₹149',
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
      setError(`Failed to process question service request: ${error.message}`);
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
      description: 'Ask Question Service - Personalized Answer',
      image: '/logo192.png',
      order_id: orderData.order.id,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#8B5CF6'
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

    setIsGenerating(true);
    setError(null);

    try {
      // Validate form data
      if (!validateFormData(formData)) {
        throw new Error(t('please_fill_all_required_fields'));
      }

      // Step 1: Create Razorpay order
      setIsProcessingPayment(true);
      setPaymentInitiated(true);

      const orderResponse = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 149,
          currency: 'INR',
          receipt: `ask_question_${Date.now()}`,
          notes: {
            service: 'ask_question',
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          }
        })
      });

      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error('Failed to create payment order');
      }

      // Step 2: Initialize Razorpay payment
      await initializePayment(orderData);

    } catch (error) {
      setError(error.message);
      console.error('Analysis generation failed:', error);
      setIsProcessingPayment(false);
      setIsGenerating(false);
      
      if (validateFormData(formData)) {
        sendAbandonmentEmail(`Error during process: ${error.message}`);
      }
    }
  };

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (validateFormData(formData) && !showAnalysis && !showThankYou && !userAbandoned && !paymentCompleted) {
        sendAbandonmentEmail('User left page with filled form details');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData, showAnalysis, showThankYou, userAbandoned, paymentCompleted, sendAbandonmentEmail]);

  // Utility functions
  const validateFormData = (data) => {
    return data.name && data.email && data.phone && data.dateOfBirth && data.timeOfBirth && data.placeOfBirth && data.question;
  };

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const generateRequestId = () => {
    return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const saveToUserHistory = (formData, result) => {
    try {
      const historyItem = {
        id: generateRequestId(),
        formData,
        result,
        createdAt: new Date().toISOString()
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('askQuestionHistory') || '[]');
      existingHistory.unshift(historyItem);
      
      const limitedHistory = existingHistory.slice(0, 10);
      localStorage.setItem('askQuestionHistory', JSON.stringify(limitedHistory));
    } catch (error) {
      console.warn('Failed to save to history:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="relative z-10 py-8 sm:py-16 px-4">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            {t('discover_your')} <span className="text-purple-400">{t('ask_question')}</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-violet-500 bg-clip-text text-transparent text-2xl sm:text-3xl lg:text-5xl">
              {t('personalized_answers')}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            {t('ask_question_description')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-start">
            {/* Left Side - Form */}
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-purple-700/50">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                  {t('enter_details_for_question')}
                </h2>

                {/* Error Display */}
                {error && (
                  <div className="mb-4 sm:mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
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
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                      required
                    />
                    <p className="text-gray-400 text-xs sm:text-sm mt-2">
                      {t('name_question_context')}
                    </p>
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
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
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
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
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
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
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
                      {t('date_time_of_birth') || 'DATE & TIME OF BIRTH'} <span className="text-pink-400">*</span>
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
                        {t('birth_date_question_context')}
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
                          {t('birth_time_question_context')}
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
                      placeholder={t('enter_place_of_birth')}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                      required
                    />
                    <p className="text-gray-400 text-xs sm:text-sm mt-2">
                      {t('birth_place_question_context')}
                    </p>
                  </div>

                  {/* Question Field */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-2">
                      {t('your_question')} <span className="text-pink-400">*</span>
                    </label>
                    <textarea
                      name="question"
                      value={formData.question}
                      onChange={handleInputChange}
                      placeholder={t('enter_your_question')}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base resize-none"
                      required
                    />
                    <p className="text-gray-400 text-xs sm:text-sm mt-2">
                      {t('question_guidance')}
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
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                      required
                    >
                      <option value="en">{t('english')}</option>
                      <option value="hi">{t('hindi')}</option>
                      <option value="te">{t('telugu')}</option>
                      <option value="kn">{t('kannada')}</option>
                    </select>
                    <p className="text-gray-400 text-xs sm:text-sm mt-2">
                      {t('language_note')}
                    </p>
                  </div>

                  {/* Pricing Information */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                      {t('service_price')}
                    </label>
                    <div className="bg-gradient-to-r from-purple-400/10 to-pink-400/10 border-2 border-purple-400/50 rounded-lg p-4 sm:p-6">
                      <div className="text-center">
                        <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">{t('personalized_question_answer')}</h4>
                        <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-3 sm:mb-4">₹149</div>
                        <ul className="text-gray-300 text-xs sm:text-sm space-y-2 text-left max-w-sm mx-auto">
                          <li className="flex items-center gap-2">
                            <span className="text-purple-400">✓</span>
                            <span>{t('detailed_answer_explanation')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-purple-400">✓</span>
                            <span>{t('astrological_context')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-purple-400">✓</span>
                            <span>{t('timing_guidance')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-purple-400">✓</span>
                            <span>{t('remedial_suggestions')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-purple-400">✓</span>
                            <span>{t('follow_up_guidance')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-purple-400">✓</span>
                            <span>{t('pdf_answer_report')}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm mt-3 text-center">
                      {t('personalized_question_answer_note')}
                    </p>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={isGenerating || isProcessingPayment}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 sm:py-4 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                  >
                    {isProcessingPayment ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('processing_payment')}...
                      </span>
                    ) : isGenerating ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('processing_request')}...
                      </span>
                    ) : (
                      `${t('pay_and_get_answer')} - ₹149`
                    )}
                  </button>
                </form>

                {/* Features List */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-purple-700/50">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                    {t('what_you_get')}:
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-purple-400">✓</span>
                      <span className="text-gray-300 text-sm sm:text-base">{t('comprehensive_answer')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-purple-400">✓</span>
                      <span className="text-gray-300 text-sm sm:text-base">{t('astrological_insights')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-purple-400">✓</span>
                      <span className="text-gray-300 text-sm sm:text-base">{t('practical_guidance')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-purple-400">✓</span>
                      <span className="text-gray-300 text-sm sm:text-base">{t('remedial_solutions')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual Content */}
            <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
              {/* Thank You Section */}
              {showThankYou ? (
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-purple-700/50">
                  <div className="text-center">
                    {/* Success Icon */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>

                    {/* Thank You Message */}
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                      🎉 {t('thank_you')} {formData.name}!
                    </h3>
                    
                    <div className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                      <h4 className="text-lg sm:text-xl font-semibold text-purple-400 mb-2 sm:mb-3">
                        {t('payment_successful')}
                      </h4>
                      <p className="text-gray-300 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                        {t('question_answer_processing')}
                      </p>
                      
                      {/* Order Details */}
                      {analysisData && (
                        <div className="bg-black/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                          <div className="text-left text-xs sm:text-sm">
                            <p className="text-gray-400 mb-1">
                              <span className="font-semibold text-white">{t('order_id')}:</span> {analysisData.requestId}
                            </p>
                            <p className="text-gray-400 mb-1">
                              <span className="font-semibold text-white">{t('payment_id')}:</span> {analysisData.paymentId}
                            </p>
                            <p className="text-gray-400">
                              <span className="font-semibold text-white">{t('amount_paid')}:</span> ₹149
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delivery Information */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-2 border-blue-400/30 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                      <div className="flex items-center justify-center mb-3 sm:mb-4">
                        <div className="text-3xl sm:text-4xl text-blue-400 mr-2 sm:mr-3">📧</div>
                        <h4 className="text-lg sm:text-xl font-semibold text-white">{t('delivery_information')}</h4>
                      </div>
                      
                      <div className="space-y-3 sm:space-y-4 text-left">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-blue-400 text-base sm:text-lg mt-1">⏰</span>
                          <div>
                            <p className="text-white font-semibold text-sm sm:text-base">{t('delivery_time')}</p>
                            <p className="text-gray-300 text-xs sm:text-sm">{t('within_6_hours_delivery_note')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-blue-400 text-base sm:text-lg mt-1">📱</span>
                          <div>
                            <p className="text-white font-semibold text-sm sm:text-base">{t('whatsapp_notification')}</p>
                            <p className="text-gray-300 text-xs sm:text-sm">{t('whatsapp_delivery_note')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-blue-400 text-base sm:text-lg mt-1">📧</span>
                          <div>
                            <p className="text-white font-semibold text-sm sm:text-base">{t('email_delivery')}</p>
                            <p className="text-gray-300 text-xs sm:text-sm break-all">{t('email_delivery_note')}: {formData.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* What You'll Receive */}
                    <div className="bg-gradient-to-r from-purple-400/10 to-pink-400/10 border-2 border-purple-400/30 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                      <ul className="text-left space-y-2">
                        <li className="flex items-center gap-2 sm:gap-3">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300 text-xs sm:text-sm">{t('detailed_answer_report_pdf')}</span>
                        </li>
                        <li className="flex items-center gap-2 sm:gap-3">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300 text-xs sm:text-sm">{t('astrological_explanation')}</span>
                        </li>
                        <li className="flex items-center gap-2 sm:gap-3">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300 text-xs sm:text-sm">{t('timing_recommendations')}</span>
                        </li>
                        <li className="flex items-center gap-2 sm:gap-3">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300 text-xs sm:text-sm">{t('remedial_measures')}</span>
                        </li>
                        <li className="flex items-center gap-2 sm:gap-3">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300 text-xs sm:text-sm">{t('action_plan_guidance')}</span>
                        </li>
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center">
                      <a 
                        href="tel:+91 93922 77389"
                        className="px-4 sm:px-6 py-2 sm:py-3 text-purple-400 border-2 border-purple-400 hover:bg-purple-400 hover:text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 text-center text-sm sm:text-base"
                      >
                        {t('contact_support')}
                      </a>
                    </div>

                    {/* Contact Information */}
                    <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-purple-700/50">
                      <p className="text-gray-400 text-xs sm:text-sm mb-2">
                        {t('need_help')} {t('contact_us_at')}:
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <a href="mailto:customercareproductcenter@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors break-all">
                          customercareproductcenter@gmail.com
                        </a>
                        <span className="text-gray-600 hidden sm:inline">|</span>
                        <a href="tel:+919392277389" className="text-blue-400 hover:text-blue-300 transition-colors">
                          +91-93922 77389
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : !showAnalysis ? (
                <>
                  {/* Sample Ask Question Display */}
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-purple-700/50">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                      {t('sample_question_answer')}
                    </h3>
                    <div className="relative">
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 sm:p-8 border border-purple-500/30">
                        <div className="text-center">
                          <div className="text-4xl sm:text-6xl text-purple-400 mb-3 sm:mb-4">💡</div>
                          <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">{t('expert_answer')}</h4>
                          <p className="text-gray-300 text-xs sm:text-sm">{t('sample_answer_preview')}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-3 sm:mt-4 text-center text-sm sm:text-base">
                      {t('sample_question_preview')}
                    </p>
                  </div>

                  {/* Question Categories */}
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-purple-700/50">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                      <span className="text-purple-400 mr-3">💭</span>
                      {t('question_categories')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                        <div className="text-lg sm:text-2xl mb-2 text-purple-400">💼</div>
                        <div className="text-gray-300 text-xs">{t('career')}</div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                        <div className="text-lg sm:text-2xl mb-2 text-purple-400">💕</div>
                        <div className="text-gray-300 text-xs">{t('love')}</div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                        <div className="text-lg sm:text-2xl mb-2 text-purple-400">💰</div>
                        <div className="text-gray-300 text-xs">{t('finance')}</div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                        <div className="text-lg sm:text-2xl mb-2 text-purple-400">💪</div>
                        <div className="text-gray-300 text-xs">{t('health')}</div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                        <div className="text-lg sm:text-2xl mb-2 text-purple-400">🏠</div>
                        <div className="text-gray-300 text-xs">{t('family')}</div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                        <div className="text-lg sm:text-2xl mb-2 text-purple-400">🌟</div>
                        <div className="text-gray-300 text-xs">{t('spiritual')}</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Generated Analysis Result
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-purple-700/50">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                    {t('your_question_status')}
                  </h3>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl p-6 sm:p-8 mb-4 sm:mb-6">
                      <div className="text-4xl sm:text-6xl text-purple-400 mb-3 sm:mb-4">⏳</div>
                      <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">
                        {t('processing_your_question')}
                      </h4>
                      <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                        {t('question_processing_message')}
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
                      <div className="flex items-center gap-2 sm:gap-3 text-left">
                        <span className="text-blue-400">📧</span>
                        <span className="text-gray-300 text-sm sm:text-base">{t('email_notification_sent')}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-left">
                        <span className="text-blue-400">📱</span>
                        <span className="text-gray-300 text-sm sm:text-base">{t('whatsapp_update_coming')}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-left">
                        <span className="text-purple-400">⏰</span>
                        <span className="text-gray-300 text-sm sm:text-base">{t('delivery_within_6_hours')}</span>
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
  );
};

export default AskQuestion;
