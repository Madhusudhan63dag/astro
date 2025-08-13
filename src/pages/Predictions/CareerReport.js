import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import career_pathImage from '../../assets/2.webp';
import ThankYouPage from '../../components/ThankYouPage';
import API_CONFIG from '../api';
import { getRawPrice, getFormattedPrice, PRICE_KEYS } from '../../config/prices';
const API_URL = API_CONFIG.API_URL;


const CareerReport = () => {
        const { t } = useTranslation();
        const BC_PRICE_NUMBER = getRawPrice(PRICE_KEYS.careerReport);
        const BC_PRICE_FORMATTED = getFormattedPrice(PRICE_KEYS.careerReport);
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
  const [showAnalysis] = useState(false);
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

  // Split date/time inputs state
  const [dd, setDd] = useState('');
  const [mm, setMm] = useState('');
  const [yyyy, setYyyy] = useState('');
  const [hh, setHh] = useState(''); // 12-hour
  const [minute, setMinute] = useState('');
  const [ampm, setAmpm] = useState('AM');

  // Refs for auto-advance
  const ddRef = useRef(null);
  const mmRef = useRef(null);
  const yyyyRef = useRef(null);
  const hhRef = useRef(null);
  const minuteRef = useRef(null);
      
        // Initialize session tracking
        useEffect(() => {
          setSessionStartTime(Date.now());
        }, []);
      
        // Helpers for manual date/time
        const normalizeDigits = (val, maxLen) => (val || '').replace(/\D/g, '').slice(0, maxLen);

        const clampInRange = (val, min, max) => {
          if (val === '') return '';
          const n = parseInt(val, 10);
          if (isNaN(n)) return '';
          if (n < min) return String(min);
          if (n > max) return String(max);
          return String(n);
        };

        const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

        const isValidDateParts = (d, m, y) => {
          const ddNum = parseInt(d, 10);
          const mmNum = parseInt(m, 10);
          const yyyyNum = parseInt(y, 10);
          if (!ddNum || !mmNum || !yyyyNum) return false;
          if (mmNum < 1 || mmNum > 12) return false;
          const dim = daysInMonth(mmNum, yyyyNum);
          return ddNum >= 1 && ddNum <= dim;
        };

        const buildISODate = (d, m, y) => {
          if (!isValidDateParts(d, m, y)) return '';
          return `${y.padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        };

        const build24hTime = (h12, m2, a) => {
          if (!h12 || !m2 || !a) return '';
          let h = parseInt(h12, 10);
          const mmv = parseInt(m2, 10);
          if (isNaN(h) || isNaN(mmv)) return '';
          if (a === 'AM') {
            if (h === 12) h = 0;
          } else {
            if (h !== 12) h += 12;
          }
          const hh24 = String(h).padStart(2, '0');
          const mmStr = String(mmv).padStart(2, '0');
          return `${hh24}:${mmStr}`;
        };

        const updateDateInForm = (d, m, y) => {
          const iso = buildISODate(d, m, y);
          setFormData(prev => ({ ...prev, dateOfBirth: iso }));
        };

        const updateTimeInForm = (h12, m2, a) => {
          const t24 = build24hTime(h12, m2, a);
          setFormData(prev => ({ ...prev, timeOfBirth: t24 }));
        };

        const onChangeDigits = (e, maxLen, setter, nextRef, clampMin = null, clampMax = null, onComplete) => {
          let v = normalizeDigits(e.target.value, maxLen);
          // Only clamp when fully filled to avoid jumping while typing
          if (clampMin !== null && clampMax !== null && v.length === maxLen) {
            v = clampInRange(v, clampMin, clampMax).padStart(maxLen, '0');
          }
          setter(v);
          if (v.length === maxLen && nextRef && nextRef.current) {
            nextRef.current.focus();
          }
          if (onComplete && v.length === maxLen) onComplete();
        };
      
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
              service: 'career-guidance',
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
                service: 'career-guidance',
                reportType: 'career-guidance',
                birthDetails: {
                  dateOfBirth: formData.dateOfBirth,
                  timeOfBirth: formData.timeOfBirth,
                  placeOfBirth: formData.placeOfBirth,
                  gender: formData.gender
                },
                language: formData.language,
                additionalInfo: 'Complete Career Path Guidance (Kundli) Analysis Request',
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
                  service: 'Birth Chart Analysis',
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
            description: 'Birth Chart Analysis - Complete Kundli Report',
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
          
          // Build candidate with derived date/time first
          const candidate = { ...formData };
          if (!candidate.dateOfBirth) {
            const iso = buildISODate(dd, mm, yyyy);
            if (iso) candidate.dateOfBirth = iso;
          }
          if (!candidate.timeOfBirth) {
            const t24 = build24hTime(hh, minute, ampm);
            if (t24) candidate.timeOfBirth = t24;
          }

          // Validate form
          if (!candidate.name || !candidate.email || !candidate.phone || 
              !candidate.dateOfBirth || !candidate.timeOfBirth || !candidate.placeOfBirth) {
            setError(t('please_fill_required_fields') || 'Please fill in all required fields.');
            return;
          }
      
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(candidate.email)) {
            setError(t('invalid_email_format') || 'Please enter a valid email address.');
            return;
          }
      
          // Validate phone number (basic validation)
          const phoneRegex = /^\+?[\d\s()-]{10,}$/;
          if (!phoneRegex.test(candidate.phone)) {
            setError(t('invalid_phone_format') || 'Please enter a valid phone number.');
            return;
          }
      
          setError(null);
          // Persist candidate before continuing
          setFormData(candidate);
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
                receipt: `career_path_${Date.now()}`,
                notes: {
                  service: 'career_path_analysis',
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
            t('detailed_career_path_pdf') || "Detailed Career Path Guidance (PDF)",
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
                <span className="text-purple-400">{t('career_path')}</span>
               
              </h1>
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

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-3">
                          {t('date_of_birth')} <span className="text-pink-400">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            ref={ddRef}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="DD"
                            value={dd}
                            onChange={(e) => onChangeDigits(e, 2, setDd, mmRef, 1, 31, () => updateDateInForm(e.target.value.padStart(2,'0'), mm, yyyy))}
                            onBlur={() => updateDateInForm(dd, mm, yyyy)}
                            className="w-full px-3 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                          />
                          <input
                            ref={mmRef}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="MM"
                            value={mm}
                            onChange={(e) => onChangeDigits(e, 2, setMm, yyyyRef, 1, 12, () => updateDateInForm(dd, e.target.value.padStart(2,'0'), yyyy))}
                            onBlur={() => updateDateInForm(dd, mm, yyyy)}
                            className="w-full px-3 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                          />
                          <input
                            ref={yyyyRef}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="YYYY"
                            value={yyyy}
                            onChange={(e) => onChangeDigits(e, 4, setYyyy, hhRef, 1900, 2100, () => updateDateInForm(dd, mm, e.target.value))}
                            onBlur={() => updateDateInForm(dd, mm, yyyy)}
                            className="w-full px-3 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                          />
                        </div>
                        
                      </div>

                      {/* Time of Birth */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-base sm:text-lg mb-3">
                          {t('time_of_birth')} <span className="text-pink-400">*</span>
                        </label>
                        
                        <div className="space-y-3 sm:space-y-4">
                          <div className="grid grid-cols-5 gap-3 items-center">
                            <input
                              ref={hhRef}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="HH"
                              value={hh}
                              onChange={(e) => onChangeDigits(e, 2, setHh, minuteRef, 1, 12, () => updateTimeInForm(e.target.value.padStart(2,'0'), minute, ampm))}
                              onBlur={() => updateTimeInForm(hh, minute, ampm)}
                              className="w-full px-3 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                            />
                            <div className="text-center text-gray-300">:</div>
                            <input
                              ref={minuteRef}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="MM"
                              value={minute}
                              onChange={(e) => onChangeDigits(e, 2, setMinute, null, 0, 59, () => updateTimeInForm(hh, e.target.value.padStart(2,'0'), ampm))}
                              onBlur={() => updateTimeInForm(hh, minute, ampm)}
                              className="w-full px-3 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                            />
                            <div className="col-span-2">
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => { setAmpm('AM'); updateTimeInForm(hh, minute, 'AM'); }}
                                  className={`py-3 rounded-lg border ${ampm === 'AM' ? 'bg-purple-600 text-white border-purple-500' : 'bg-gray-800/80 text-gray-200 border-purple-600/50'}`}
                                >
                                  AM
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setAmpm('PM'); updateTimeInForm(hh, minute, 'PM'); }}
                                  className={`py-3 rounded-lg border ${ampm === 'PM' ? 'bg-purple-600 text-white border-purple-500' : 'bg-gray-800/80 text-gray-200 border-purple-600/50'}`}
                                >
                                  PM
                                </button>
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
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm mt-2">
                          {t('exact_time_note')}
                        </p>
                      </div>

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
                            <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-3 sm:mb-4">{BC_PRICE_FORMATTED}</div>
                            <ul className="text-gray-300 text-xs sm:text-sm space-y-2 text-left max-w-sm mx-auto">
                              <li className="flex items-center gap-2">
                                <span className="text-purple-400 flex-shrink-0">✓</span>
                                <span>{t('comprehensive_analysis')}</span>
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
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('processing_payment')}...
                          </span>
                        ) : isGenerating ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-4 sm:h-5 w-4 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                            src={career_pathImage}
                            alt={t('career_path')}
                            className="w-full rounded-xl shadow-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-xl"></div>
                        </div>
                      </div>

                      
                    </>
                  ) : (
                    // Generated Chart Result
                    <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-700/50">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                        <span className="text-purple-400 mr-2 sm:mr-3 text-lg sm:text-xl">📊</span>
                        {t('your_career_path_status')}
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

export default CareerReport;
