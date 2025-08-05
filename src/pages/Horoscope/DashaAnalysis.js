import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dashaPhalImage from '../../assets/1.webp'
import API_CONFIG from '../api';

const API_URL = API_CONFIG.API_URL;

const DashaPhalAnalysis = () => {
  const { t } = useTranslation();
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
  const [formCompletedTime, setFormCompletedTime] = useState(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  // Track session start time
  useEffect(() => {
    setSessionStartTime(new Date());
  }, []);

  // Track form completion
  useEffect(() => {
    if (validateFormData(formData) && !formCompletedTime) {
      setFormCompletedTime(new Date());
    }
  }, [formData, formCompletedTime]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  // Function to send abandoned payment email
  const sendAbandonedPaymentEmail = async (reason = 'User cancelled payment') => {
    try {
      const timeOnPage = sessionStartTime 
        ? Math.round((new Date() - sessionStartTime) / 1000) 
        : 0;

      const response = await fetch(`${API_URL}/abandoned-payment-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: 'dasha-phal-analysis',
          language: formData.language,
          birthDetails: {
            dateOfBirth: formData.dateOfBirth,
            timeOfBirth: formData.timeOfBirth,
            placeOfBirth: formData.placeOfBirth,
            gender: formData.gender
          },
          abandonmentReason: reason,
          sessionData: {
            timeOnPage: `${Math.floor(timeOnPage / 60)}m ${timeOnPage % 60}s`,
            formCompletedAt: formCompletedTime?.toISOString(),
            sessionStartedAt: sessionStartTime?.toISOString(),
            paymentInitiated: paymentInitiated
          }
        })
      });

      const result = await response.json();
      console.log('Abandoned payment email sent:', result);
    } catch (error) {
      console.error('Failed to send abandoned payment email:', error);
    }
  };

  const handleGenerateAnalysis = async (e) => {
    e.preventDefault();
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
          amount: 499, // Updated price for dasha phal analysis
          currency: 'INR',
          receipt: `dasha_phal_analysis_${Date.now()}`,
          notes: {
            service: 'dasha_phal_analysis',
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
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'SriAstroVeda',
        description: 'Dasha Phal Analysis',
        order_id: orderData.order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#F59E0B' // Amber theme for dasha phal
        },
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            const verificationResponse = await fetch(`${API_URL}/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verificationData = await verificationResponse.json();
            
            if (verificationData.success) {
              // Step 4: Send astro email after successful payment
              await sendAstroEmailAfterPayment(response.razorpay_payment_id, response.razorpay_order_id);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setIsProcessingPayment(false);
            setIsGenerating(false);
            
            if (validateFormData(formData)) {
              sendAbandonedPaymentEmail('User closed payment modal');
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.log('Payment failed:', response);  
        setIsProcessingPayment(false);
        setIsGenerating(false);
        setError('Payment failed. Please try again.');
        
        if (validateFormData(formData)) {
          sendAbandonedPaymentEmail(`Payment failed: ${response.error.description}`);
        }
      });

      rzp.open();

    } catch (error) {
      setError(error.message);
      console.error('Analysis generation failed:', error);
      setIsProcessingPayment(false);
      setIsGenerating(false);
      
      if (validateFormData(formData)) {
        sendAbandonedPaymentEmail(`Error during process: ${error.message}`);
      }
    }
  };

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (validateFormData(formData) && !showAnalysis && !showThankYou) {
        sendAbandonedPaymentEmail('User left page');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData, showAnalysis, showThankYou]);

  // Function to send astro email after successful payment
  const sendAstroEmailAfterPayment = async (paymentId, orderId) => {
    let emailSent = false;
    let retryCount = 0;
    const maxRetries = 3;

    while (!emailSent && retryCount < maxRetries) {
      try {
        retryCount++;
        console.log(`Attempt ${retryCount}: Sending astro email...`);

        const emailResponse = await fetch(`${API_URL}/send-astro-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: 'dasha-phal-analysis',
            language: formData.language,
            birthDetails: {
              dateOfBirth: formData.dateOfBirth,
              timeOfBirth: formData.timeOfBirth,
              placeOfBirth: formData.placeOfBirth,
              gender: formData.gender
            },
            paymentDetails: {
              paymentId: paymentId,
              orderId: orderId,
              amount: 499,
              status: 'paid'
            },
            additionalInfo: `Payment successful. Payment ID: ${paymentId}, Order ID: ${orderId}`
          })
        });

        if (!emailResponse.ok) {
          throw new Error(`Server responded with status: ${emailResponse.status}`);
        }

        const emailData = await emailResponse.json();
        
        if (emailData.success) {
          emailSent = true;
          console.log('✅ Email sent successfully!');
          
          setAnalysisData({
            requestId: orderId,
            paymentId: paymentId,
            status: 'processing'
          });
          
          setShowThankYou(true);
          setShowAnalysis(false);
          
          saveToUserHistory(formData, {
            requestId: orderId,
            paymentId: paymentId,
            timestamp: new Date().toISOString()
          });
          
          break;
        } else {
          throw new Error(emailData.message || 'Email service returned failure');
        }

      } catch (error) {
        console.error(`Attempt ${retryCount} failed:`, error.message);
        
        if (retryCount >= maxRetries) {
          console.error('❌ All email attempts failed, sending pending payment notification');
          
          try {
            await sendPendingPaymentEmail(paymentId, orderId);
            console.log('✅ Pending payment notification sent');
          } catch (pendingError) {
            console.error('❌ Failed to send pending payment email:', pendingError);
            setError(`Payment successful (Order: ${orderId}) but notification failed. Please contact support.`);
          }
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
    }

    setIsGenerating(false);
  };

  // Function to handle pending payment emails
  const sendPendingPaymentEmail = async (paymentId, orderId) => {
    try {
      console.log('📧 Sending pending payment notification...');

      const response = await fetch(`${API_URL}/pending-payment-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: 'dasha-phal-analysis',
          language: formData.language,
          birthDetails: {
            dateOfBirth: formData.dateOfBirth,
            timeOfBirth: formData.timeOfBirth,
            placeOfBirth: formData.placeOfBirth,
            gender: formData.gender
          },
          paymentDetails: {
            paymentId: paymentId,
            orderId: orderId,
            amount: 499,
            status: 'paid_but_processing_failed'
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAnalysisData({
            requestId: orderId,
            paymentId: paymentId,
            status: 'pending'
          });
          setShowThankYou(true);
          setError(null);
          console.log('✅ Pending payment notification sent successfully');
        }
      }
    } catch (error) {
      console.error('❌ Pending payment email error:', error);
      setError(`Payment successful (Order: ${orderId}) but there was an issue processing your request. Please contact support with this Order ID.`);
    }
  };

  // Function to handle "View Analysis" button
  const handleViewAnalysis = () => {
    setShowThankYou(false);
    setShowAnalysis(true);
  };

  // Utility functions
  const validateFormData = (data) => {
    return data.name && data.email && data.phone && data.dateOfBirth && data.timeOfBirth && data.placeOfBirth;
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
      
      const existingHistory = JSON.parse(localStorage.getItem('dashaPhalHistory') || '[]');
      existingHistory.unshift(historyItem);
      
      const limitedHistory = existingHistory.slice(0, 10);
      localStorage.setItem('dashaPhalHistory', JSON.stringify(limitedHistory));
    } catch (error) {
      console.warn('Failed to save to history:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 relative overflow-hidden">
      {/* Background Pattern - Dasha symbols */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl text-amber-400">🪐</div>
        <div className="absolute top-40 right-20 text-4xl text-orange-400">⏰</div>
        <div className="absolute bottom-40 left-20 text-5xl text-yellow-400">🌙</div>
        <div className="absolute bottom-20 right-10 text-3xl text-red-400">☀️</div>
        <div className="absolute top-1/2 left-1/4 text-3xl text-amber-300">🪐</div>
        <div className="absolute top-1/3 right-1/3 text-2xl text-orange-300">⏰</div>
      </div>

      <div className="relative z-10 py-16 px-4">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            {t('discover_your')} <span className="text-amber-400">{t('dasha_phal')}</span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-red-500 bg-clip-text text-transparent">
              {t('planetary_periods_analysis')}
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('dasha_phal_description')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Form */}
            <div className="space-y-8">
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-amber-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="text-amber-400 mr-3">🪐</span>
                  {t('enter_birth_details')}
                </h2>

                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 flex items-center">
                      <span className="mr-2">⚠️</span>
                      {error}
                    </p>
                  </div>
                )}

                <form onSubmit={handleGenerateAnalysis} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('full_name')} <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('enter_full_name')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-amber-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('email_address')} <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('enter_email_address')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-amber-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('phone_number')} <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t('enter_phone_number')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-amber-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Gender Field */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('gender')} <span className="text-orange-400">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-amber-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      required
                    >
                      <option value="male">{t('male')}</option>
                      <option value="female">{t('female')}</option>
                      <option value="other">{t('other')}</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('date_of_birth')} <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-amber-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Time of Birth */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('time_of_birth')} <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="time"
                      name="timeOfBirth"
                      value={formData.timeOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-amber-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      {t('exact_time_critical_for_dasha')}
                    </p>
                  </div>

                  {/* Place of Birth */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('place_of_birth')} <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleInputChange}
                      placeholder={t('place_of_birth_placeholder')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-amber-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Language Selection */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('preferred_language')} <span className="text-orange-400">*</span>
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-amber-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      required
                    >
                      <option value="en">{t('english')}</option>
                      <option value="hi">{t('hindi')}</option>
                      <option value="te">{t('telugu')}</option>
                      <option value="kn">{t('kannada')}</option>
                    </select>
                    <p className="text-gray-400 text-sm mt-2">
                      {t('language_note')}
                    </p>
                  </div>

                  {/* Pricing Information */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-4">
                      {t('service_price')}
                    </label>
                    <div className="bg-gradient-to-r from-amber-400/10 to-orange-400/10 border-2 border-amber-400/50 rounded-lg p-6">
                      <div className="text-center">
                        <h4 className="text-xl font-semibold text-white mb-2">{t('complete_dasha_phal_analysis')}</h4>
                        <div className="text-4xl font-bold text-amber-400 mb-4">₹499</div>
                        <ul className="text-gray-300 text-sm space-y-2 text-left max-w-sm mx-auto">
                          <li className="flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <span>{t('current_dasha_period_analysis')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <span>{t('planetary_influence_detailed')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <span>{t('future_dasha_predictions')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <span>{t('career_and_finance_guidance')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <span>{t('remedial_measures')}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <span>{t('pdf_download')}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-3 text-center">
                      {t('comprehensive_dasha_analysis_note')}
                    </p>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={isGenerating || isProcessingPayment}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                  >
                    {isProcessingPayment ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('processing_payment')}...
                      </span>
                    ) : isGenerating ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('processing_request')}...
                      </span>
                    ) : (
                      `${t('pay_and_generate_analysis')} - ₹499`
                    )}
                  </button>
                </form>

                {/* Features List */}
                <div className="mt-8 pt-6 border-t border-amber-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {t('what_you_get')}:
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400">✓</span>
                      <span className="text-gray-300">{t('current_mahadasha_antardasha')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400">✓</span>
                      <span className="text-gray-300">{t('planetary_effects_detailed')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400">✓</span>
                      <span className="text-gray-300">{t('timing_of_events')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400">✓</span>
                      <span className="text-gray-300">{t('future_dasha_timeline')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual Content */}
            <div className="space-y-8">
              {/* Thank You Section */}
              {showThankYou ? (
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-amber-700/50">
                  <div className="text-center">
                    {/* Success Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>

                    {/* Thank You Message */}
                    <h3 className="text-3xl font-bold text-white mb-4">
                      🎉 {t('thank_you')} {formData.name}!
                    </h3>
                    
                    <div className="bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-xl p-6 mb-6">
                      <h4 className="text-xl font-semibold text-amber-400 mb-3">
                        {t('payment_successful')}
                      </h4>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {t('dasha_phal_analysis_processing')}
                      </p>
                      
                      {/* Order Details */}
                      {analysisData && (
                        <div className="bg-black/30 rounded-lg p-4 mb-4">
                          <div className="text-left text-sm">
                            <p className="text-gray-400 mb-1">
                              <span className="font-semibold text-white">{t('order_id')}:</span> {analysisData.requestId}
                            </p>
                            <p className="text-gray-400 mb-1">
                              <span className="font-semibold text-white">{t('payment_id')}:</span> {analysisData.paymentId}
                            </p>
                            <p className="text-gray-400">
                              <span className="font-semibold text-white">{t('amount_paid')}:</span> ₹499
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delivery Information */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-2 border-blue-400/30 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="text-4xl text-blue-400 mr-3">📧</div>
                        <h4 className="text-xl font-semibold text-white">{t('delivery_information')}</h4>
                      </div>
                      
                      <div className="space-y-4 text-left">
                        <div className="flex items-start gap-3">
                          <span className="text-blue-400 text-lg mt-1">⏰</span>
                          <div>
                            <p className="text-white font-semibold">{t('delivery_time')}</p>
                            <p className="text-gray-300 text-sm">{t('within_12_hours_delivery_note')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <span className="text-blue-400 text-lg mt-1">📱</span>
                          <div>
                            <p className="text-white font-semibold">{t('whatsapp_notification')}</p>
                            <p className="text-gray-300 text-sm">{t('whatsapp_delivery_note')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <span className="text-blue-400 text-lg mt-1">📧</span>
                          <div>
                            <p className="text-white font-semibold">{t('email_delivery')}</p>
                            <p className="text-gray-300 text-sm">{t('email_delivery_note')}: {formData.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* What You'll Receive */}
                    <div className="bg-gradient-to-r from-amber-400/10 to-orange-400/10 border-2 border-amber-400/30 rounded-lg p-6 mb-6">
                      <h4 className="text-xl font-semibold text-white mb-4 flex items-center justify-center">
                        <span className="text-amber-400 mr-2">🪐</span>
                        {t('what_youll_receive')}
                      </h4>
                      <ul className="text-left space-y-2">
                        <li className="flex items-center gap-3">
                          <span className="text-amber-400">✓</span>
                          <span className="text-gray-300">{t('detailed_dasha_phal_report_pdf')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="text-amber-400">✓</span>
                          <span className="text-gray-300">{t('current_planetary_periods')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="text-amber-400">✓</span>
                          <span className="text-gray-300">{t('future_dasha_predictions_timeline')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="text-amber-400">✓</span>
                          <span className="text-gray-300">{t('planetary_remedies_guidance')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="text-amber-400">✓</span>
                          <span className="text-gray-300">{t('career_finance_predictions')}</span>
                        </li>
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row">
                      <a 
                        href="tel:+91 93922 77389"
                        className="px-6 py-3 text-amber-400 border-2 border-amber-400 hover:bg-amber-400 hover:text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                      >
                        {t('contact_support')}
                      </a>
                    </div>

                    {/* Contact Information */}
                    <div className="mt-6 pt-4 border-t border-amber-700/50">
                      <p className="text-gray-400 text-sm mb-2">
                        {t('need_help')} {t('contact_us_at')}:
                      </p>
                      <div className="flex justify-center gap-4 text-sm">
                        <a href="mailto:customercareproductcenter@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                          customercareproductcenter@gmail.com
                        </a>
                        <span className="text-gray-600">|</span>
                        <a href="tel:+919392277389" className="text-blue-400 hover:text-blue-300 transition-colors">
                          +91-93922 77389
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : !showAnalysis ? (
                <>
                  {/* Sample Dasha Phal Display */}
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-amber-700/50">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <span className="text-amber-400 mr-3">🪐</span>
                      {t('sample_dasha_phal_analysis')}
                    </h3>
                    <div className="relative">
                      <img
                        src={dashaPhalImage}
                        alt={t('sample_dasha_phal_analysis')}
                        className="w-full rounded-xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-xl"></div>
                    </div>
                    <p className="text-gray-300 mt-4 text-center">
                      {t('sample_dasha_phal_description')}
                    </p>
                  </div>

                  {/* Planetary Periods */}
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-amber-700/50">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="text-amber-400 mr-3">⏰</span>
                      {t('major_planetary_periods')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-amber-600/30">
                        <div className="text-2xl mb-2 text-amber-400">☀️</div>
                        <div className="text-gray-300 text-sm">{t('sun_dasha')}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-amber-600/30">
                        <div className="text-2xl mb-2 text-amber-400">🌙</div>
                        <div className="text-gray-300 text-sm">{t('moon_dasha')}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-amber-600/30">
                        <div className="text-2xl mb-2 text-amber-400">♂️</div>
                        <div className="text-gray-300 text-sm">{t('mars_dasha')}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-amber-600/30">
                        <div className="text-2xl mb-2 text-amber-400">☿️</div>
                        <div className="text-gray-300 text-sm">{t('mercury_dasha')}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-amber-600/30">
                        <div className="text-2xl mb-2 text-amber-400">♃</div>
                        <div className="text-gray-300 text-sm">{t('jupiter_dasha')}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-amber-600/30">
                        <div className="text-2xl mb-2 text-amber-400">♀️</div>
                        <div className="text-gray-300 text-sm">{t('venus_dasha')}</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Generated Analysis Result
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-amber-700/50">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="text-amber-400 mr-3">🪐</span>
                    {t('your_dasha_phal_analysis_status')}
                  </h3>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-xl p-8 mb-6">
                      <div className="text-6xl text-amber-400 mb-4">⏳</div>
                      <h4 className="text-xl font-semibold text-white mb-2">
                        {t('processing_your_analysis')}
                      </h4>
                      <p className="text-gray-300 mb-4">
                        {t('analysis_processing_message')}
                      </p>
                      {analysisData && (
                        <div className="mt-4 text-left bg-black/30 rounded-lg p-4">
                          <p className="text-gray-400 text-sm mb-1">
                            <span className="font-semibold text-white">{t('request_id')}:</span> {analysisData.requestId}
                          </p>
                          <p className="text-gray-400 text-sm">
                            <span className="font-semibold text-white">{t('status')}:</span> {analysisData.status === 'processing' ? t('processing') : t('pending')}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-blue-400">📧</span>
                        <span className="text-gray-300">{t('email_notification_sent')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-blue-400">📱</span>
                        <span className="text-gray-300">{t('whatsapp_update_coming')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-amber-400">⏰</span>
                        <span className="text-gray-300">{t('delivery_within_12_hours')}</span>
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

export default DashaPhalAnalysis;
