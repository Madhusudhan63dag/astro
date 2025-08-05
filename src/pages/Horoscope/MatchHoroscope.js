import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import API_CONFIG from '../api';

const API_URL = API_CONFIG.API_URL;

const MatchHoroscope = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    // Partner 1 (Male/Primary)
    partner1: {
      name: '',
      gender: 'male',
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: ''
    },
    // Partner 2 (Female/Secondary)
    partner2: {
      name: '',
      gender: 'female',
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: ''
    },
    // Contact details
    customerEmail: '',
    customerPhone: ''
  });
  
  const [isMatching, setIsMatching] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [error, setError] = useState(null);

  // NEW STATE VARIABLES FOR TRACKING
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [formCompletedTime, setFormCompletedTime] = useState(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // NEW: Track session start time
  useEffect(() => {
    setSessionStartTime(new Date());
  }, []);

  // NEW: Track form completion
  useEffect(() => {
    if (isFormComplete(formData) && !formCompletedTime) {
      setFormCompletedTime(new Date());
    }
  }, [formData, formCompletedTime]);

  // NEW: Track user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('input', handleUserInteraction);
    document.addEventListener('change', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('input', handleUserInteraction);
      document.removeEventListener('change', handleUserInteraction);
    };
  }, [hasUserInteracted]);

  const handleInputChange = (partner, field, value) => {
    setFormData(prev => ({
      ...prev,
      [partner]: {
        ...prev[partner],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // NEW: Function to check if form is complete
  const isFormComplete = (data) => {
    return (
      data.partner1.name && data.partner1.dateOfBirth && 
      data.partner1.timeOfBirth && data.partner1.placeOfBirth &&
      data.partner2.name && data.partner2.dateOfBirth && 
      data.partner2.timeOfBirth && data.partner2.placeOfBirth
    );
  };

  // NEW: Get form completion percentage
  const getFormCompletionLevel = useCallback(() => {
    const fields = [
      formData.partner1.name, formData.partner1.dateOfBirth, 
      formData.partner1.timeOfBirth, formData.partner1.placeOfBirth,
      formData.partner2.name, formData.partner2.dateOfBirth, 
      formData.partner2.timeOfBirth, formData.partner2.placeOfBirth
    ];
    
    const filledFields = fields.filter(field => field && field.trim()).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [formData]);

  // NEW: Function to send abandoned form email
  const sendAbandonedMatchEmail = useCallback(async (reason = 'User left without submitting') => {
    try {
      // Only send if user has interacted and filled some data
      if (!hasUserInteracted || (!formData.partner1.name && !formData.partner2.name)) {
        return;
      }

      const timeOnPage = sessionStartTime 
        ? Math.round((new Date() - sessionStartTime) / 1000) 
        : 0;

      const response = await fetch(`${API_URL}/abandoned-match-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          abandonmentReason: reason,
          sessionData: {
            timeOnPage: `${Math.floor(timeOnPage / 60)}m ${timeOnPage % 60}s`,
            formCompletedAt: formCompletedTime?.toISOString(),
            sessionStartedAt: sessionStartTime?.toISOString(),
            hasUserInteracted,
            completionLevel: getFormCompletionLevel()
          }
        })
      });

      const result = await response.json();
      console.log('Abandoned match email sent:', result);
    } catch (error) {
      console.error('Failed to send abandoned match email:', error);
    }
  }, [hasUserInteracted, formData, sessionStartTime, formCompletedTime, getFormCompletionLevel]);

  // NEW: Handle page unload (user leaving page)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUserInteracted && !showThankYou) {
        sendAbandonedMatchEmail('User left page');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also send on component unmount
      if (hasUserInteracted && !showThankYou) {
        sendAbandonedMatchEmail('Component unmounted');
      }
    };
  }, [hasUserInteracted, showThankYou, sendAbandonedMatchEmail]);

  const handleMatchHoroscope = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!isFormComplete(formData)) {
      setError(t('please_fill_all_required_fields') || 'Please fill all required fields for both partners');
      return;
    }

    setIsMatching(true);
    setError(null);
    
    try {
      // Step 1: Create Razorpay order
      const orderResponse = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 599,
          currency: 'INR',
          receipt: `horoscope_match_${Date.now()}`,
          notes: {
            service: 'horoscope_matching',
            partner1_name: formData.partner1.name,
            partner2_name: formData.partner2.name,
            customer_email: formData.customerEmail,
            customer_phone: formData.customerPhone
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
        description: 'Horoscope Matching Analysis',
        order_id: orderData.order.id,
        prefill: {
          name: formData.partner1.name,
          email: formData.customerEmail,
          contact: formData.customerPhone
        },
        theme: {
          color: '#F59E0B'
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
              // Step 4: Send match horoscope email after successful payment
              await sendMatchEmailAfterPayment(response.razorpay_payment_id, response.razorpay_order_id);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please contact support.');
            setIsMatching(false);
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setIsMatching(false);
            
            // Send abandoned payment email if form was completed
            if (isFormComplete(formData)) {
              sendAbandonedMatchEmail('User closed payment modal');
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      // Handle payment failure
      rzp.on('payment.failed', function (response) {
        console.log('Payment failed:', response);
        setIsMatching(false);
        setError('Payment failed. Please try again.');
        
        // Send abandoned payment email for failed payments
        if (isFormComplete(formData)) {
          sendAbandonedMatchEmail(`Payment failed: ${response.error.description}`);
        }
      });

      rzp.open();

    } catch (error) {
      console.error('Error initiating payment:', error);
      setIsMatching(false);
      setError(t('network_error') || 'Payment initiation failed. Please try again.');
      
      // Send abandoned email on error
      if (isFormComplete(formData)) {
        sendAbandonedMatchEmail(`Payment initiation error: ${error.message}`);
      }
    }
  };

  // NEW: Function to send match email after successful payment
  const sendMatchEmailAfterPayment = async (paymentId, orderId) => {
    try {
      const requestData = {
        formData: {
          partner1: {
            name: formData.partner1.name.trim(),
            gender: formData.partner1.gender,
            dateOfBirth: formData.partner1.dateOfBirth,
            timeOfBirth: formData.partner1.timeOfBirth,
            placeOfBirth: formData.partner1.placeOfBirth.trim()
          },
          partner2: {
            name: formData.partner2.name.trim(),
            gender: formData.partner2.gender,
            dateOfBirth: formData.partner2.dateOfBirth,
            timeOfBirth: formData.partner2.timeOfBirth,
            placeOfBirth: formData.partner2.placeOfBirth.trim()
          }
        },
        customerEmail: formData.customerEmail?.trim() || 'not-provided@example.com',
        customerPhone: formData.customerPhone?.trim() || 'Not provided',
        language: 'English',
        paymentDetails: {
          status: 'paid',
          amount: 599,
          paymentId: paymentId,
          orderId: orderId
        }
      };

      const response = await fetch(`${API_URL}/send-match-horoscope`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (result.success) {
        // Show thank you message after successful submission
        setTimeout(() => {
          setIsMatching(false);
          setShowThankYou(true);
        }, 1000);
      } else {
        throw new Error(result.message || 'Failed to process request after payment');
      }
    } catch (error) {
      console.error('Error processing request after payment:', error);
      setIsMatching(false);
      setError('Payment successful but failed to process request. Please contact support with your payment ID: ' + paymentId);
      
      // Send pending payment email for successful payment but failed processing
      try {
        await sendPendingPaymentEmail(paymentId, orderId);
      } catch (emailError) {
        console.error('Failed to send pending payment email:', emailError);
      }
    }
  };

  // NEW: Function to send pending payment email
  const sendPendingPaymentEmail = async (paymentId, orderId) => {
    try {
      const pendingData = {
        name: formData.partner1.name || 'Customer',
        email: formData.customerEmail || 'not-provided@example.com',
        phone: formData.customerPhone || 'Not provided',
        service: 'horoscope-matching',
        birthDetails: {
          partner1: formData.partner1,
          partner2: formData.partner2
        },
        language: 'English',
        paymentDetails: {
          status: 'paid_pending_processing',
          amount: 599,
          paymentId: paymentId,
          orderId: orderId
        }
      }; 

      await fetch(`${API_URL}/pending-payment-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingData)
      });
    } catch (error) {
      console.error('Failed to send pending payment notification:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl text-yellow-400">✦</div>
        <div className="absolute top-40 right-20 text-4xl text-amber-400">✧</div>
        <div className="absolute bottom-40 left-20 text-5xl text-yellow-400">✦</div>
        <div className="absolute bottom-20 right-10 text-3xl text-amber-400">✧</div>
        <div className="absolute top-1/2 left-1/4 text-3xl text-yellow-300">✦</div>
        <div className="absolute top-1/3 right-1/3 text-2xl text-amber-300">✧</div>
      </div>

      <div className="relative z-10 py-16 px-4">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            {t('match_your')} <span className="text-yellow-400">{t('horoscopes')}</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              {t('for_perfect_union')}
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('match_horoscope_description')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Error Display */}
          {error && (
            <div className="mb-8 max-w-4xl mx-auto">
              <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-300 flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Thank You Message */}
          {showThankYou && (
            <div className="mb-12 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-8 border border-green-500/30 text-center">                
                <h2 className="text-3xl font-bold text-white mb-4">
                  🎉 Thank You for Your Submission!
                </h2>
                
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  We have received your horoscope matching request for <strong>{formData.partner1.name}</strong> and <strong>{formData.partner2.name}</strong>.
                </p>

                {/* Security and Timeline Info */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl">🔒</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Your Data is Secure
                    </h3>
                    <p className="text-gray-300 text-sm">
                      All birth details are encrypted and will only be used for astrological analysis.
                    </p>
                  </div>

                  <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl">⏰</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Response Within 12 Hours
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Our expert astrologers will analyze compatibility and send detailed report.
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                    <span className="mr-2">📞</span>
                    Need Immediate Help?
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
                    <a 
                      href="tel:+919392277389" 
                      className="text-yellow-400 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2"
                    >
                      📞 +91 93922 77389
                    </a>
                    <span className="text-gray-500 hidden sm:inline">|</span>
                    <a 
                      href="https://wa.me/919573999254" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition-colors duration-300 flex items-center gap-2"
                    >
                      💬 WhatsApp Support
                    </a>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => {
                      setShowThankYou(false);
                      setFormData({
                        partner1: { name: '', gender: 'male', dateOfBirth: '', timeOfBirth: '', placeOfBirth: '' },
                        partner2: { name: '', gender: 'female', dateOfBirth: '', timeOfBirth: '', placeOfBirth: '' },
                        customerEmail: '',
                        customerPhone: ''
                      });
                      setHasUserInteracted(false);
                      setFormCompletedTime(null);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Match Another Couple
                  </button>
                  
                  <a
                    href="/"
                    className="px-8 py-3 text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-all duration-300 text-center"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            </div>
          )}

          {!showThankYou ? (
            <div className="space-y-8">
              {/* Contact Information Section */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="text-yellow-400 mr-3">📧</span>
                  Contact Information (Optional)
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleContactChange('customerEmail', e.target.value)}
                      placeholder="Enter your email for detailed report"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleContactChange('customerPhone', e.target.value)}
                      placeholder="Enter your phone for follow-up"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mt-4">
                  📧 Providing contact details ensures you receive the detailed compatibility report directly.
                </p>
              </div>

              {/* Pricing Information */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="text-yellow-400 mr-3">💰</span>
                  Service Pricing
                </h2>
                
                <div className="bg-gradient-to-r from-yellow-400/10 to-amber-400/10 border-2 border-yellow-400/50 rounded-lg p-6">
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-white mb-2">Complete Horoscope Matching Analysis</h4>
                    <div className="text-4xl font-bold text-yellow-400 mb-4">₹599</div>
                    <ul className="text-gray-300 text-sm space-y-2 text-left max-w-sm mx-auto">
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>Detailed Compatibility Analysis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>Guna Milan (36 Points System)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>Manglik Dosha Analysis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>Future Predictions for Couple</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>Remedial Solutions & Suggestions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>PDF Report Download</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-3 text-center">
                  💸 One-time payment for complete horoscope matching analysis by expert astrologers
                </p>
              </div>

              {/* Input Form Section */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Partner 1 Form */}
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="text-blue-400 mr-3">👨</span>
                    Partner 1 Details (Male/Groom)
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        Full Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.partner1.name}
                        onChange={(e) => handleInputChange('partner1', 'name', e.target.value)}
                        placeholder="Enter partner 1 name"
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        Gender
                      </label>
                      <select
                        value={formData.partner1.gender}
                        onChange={(e) => handleInputChange('partner1', 'gender', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        Date of Birth <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.partner1.dateOfBirth}
                        onChange={(e) => handleInputChange('partner1', 'dateOfBirth', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        Time of Birth <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="time"
                        value={formData.partner1.timeOfBirth}
                        onChange={(e) => handleInputChange('partner1', 'timeOfBirth', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        Place of Birth <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.partner1.placeOfBirth}
                        onChange={(e) => handleInputChange('partner1', 'placeOfBirth', e.target.value)}
                        placeholder="City, State, Country"
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Partner 2 Form */}
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="text-pink-400 mr-3">👩</span>
                    Partner 2 Details (Female/Bride)
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        Full Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.partner2.name}
                        onChange={(e) => handleInputChange('partner2', 'name', e.target.value)}
                        placeholder="Enter partner 2 name"
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        Gender
                      </label>
                      <select
                        value={formData.partner2.gender}
                        onChange={(e) => handleInputChange('partner2', 'gender', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        Date of Birth <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.partner2.dateOfBirth}
                        onChange={(e) => handleInputChange('partner2', 'dateOfBirth', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        Time of Birth <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="time"
                        value={formData.partner2.timeOfBirth}
                        onChange={(e) => handleInputChange('partner2', 'timeOfBirth', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        Place of Birth <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.partner2.placeOfBirth}
                        onChange={(e) => handleInputChange('partner2', 'placeOfBirth', e.target.value)}
                        placeholder="City, State, Country"
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Button */}
              <div className="text-center">
                <form onSubmit={handleMatchHoroscope}>
                  <button
                    type="submit"
                    disabled={isMatching}
                    className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                  >
                    {isMatching ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </span>
                    ) : (
                      'Pay & Match Horoscopes - ₹599'
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MatchHoroscope;
