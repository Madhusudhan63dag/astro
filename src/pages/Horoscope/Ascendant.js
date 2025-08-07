import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ascendantImage from '../../assets/2.webp';
import ThankYouPage from '../../components/ThankYouPage';
import API_CONFIG from '../api';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';


const API_URL = API_CONFIG.API_URL;

const Ascendant = () => {
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
   const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [userAbandoned, setUserAbandoned] = useState(false);

  // Initialize session tracking
  useEffect(() => {
    setSessionStartTime(Date.now());
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#9333EA', // Purple
      },
      background: {
        paper: 'rgba(31, 41, 55, 0.8)',
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(147, 51, 234, 0.5)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(147, 51, 234, 0.8)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#9333EA',
            },
          },
        },
      },
    },
  });

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
  const sendAbandonmentEmail = async (reason = 'Payment cancelled by user') => {
    // Prevent multiple abandonment emails
    if (userAbandoned || paymentCompleted || showThankYou) return;
    
    setUserAbandoned(true);
    
    try {
      const abandonmentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: 'ascendant-analysis',
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
          service: 'ascendant-analysis', // Make sure this matches backend expectation
          reportType: 'ascendant',
          birthDetails: {
            dateOfBirth: formData.dateOfBirth,
            timeOfBirth: formData.timeOfBirth,
            placeOfBirth: formData.placeOfBirth,
            gender: formData.gender
          },
          language: formData.language,
          additionalInfo: 'Ascendant (Rising Sign) Analysis Request',
          paymentDetails: {
            status: 'paid',
            amount: 399, // Send as number, not string
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
            service: 'Ascendant Analysis',
            amount: '₹399',
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
      description: 'Ascendant Analysis - Rising Sign Report',
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
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError(t('invalid_phone_format') || 'Please enter a valid phone number.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setFormCompletedTime(Date.now());
    setPaymentInitiated(true);

        try {
      const orderResponse = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 399,
          currency: 'INR',
          receipt: `ascendant_${Date.now()}`,
          notes: {
            service: 'ascendant_analysis',
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
    }, [paymentInitiated, paymentCompleted, userAbandoned, showThankYou, formData]);


  return (
    <div>
      {showThankYou ? (
        <ThankYouPage 
          userName={formData.name}
          userEmail={formData.email}
          analysisData={analysisData}
          serviceAmount="₹399"
          serviceFeatures={[
            t('detailed_ascendant_report_pdf') || "Detailed Ascendant Report (PDF)",
            t('rising_sign_characteristics') || "Rising Sign Characteristics",
            t('personality_presentation_insights') || "Personality Presentation Insights",
            t('first_impression_analysis') || "First Impression Analysis",
            t('life_approach_guidance') || "Life Approach Guidance"
          ]}
          bgGradient="from-indigo-900 via-purple-900 to-pink-900"
          onClose={() => setShowThankYou(false)}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
          <div className="relative z-10 py-16 px-4">
            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                {t('discover_your')} <span className="text-purple-400">{t('ascendant')}</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-violet-500 bg-clip-text text-transparent">
                  {t('rising_sign_analysis')}
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {t('ascendant_description')}
              </p>
            </div>

            <div className="">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Left Side - Form */}
                <div className="space-y-8">
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-purple-700/50">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
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

                    {/* Form */}
                    <form onSubmit={handleGenerateAnalysis} className="space-y-6">
                      {/* Name Field */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-lg mb-2">
                          {t('full_name')} <span className="text-pink-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={t('enter_full_name')}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-lg mb-2">
                          {t('email_address')} <span className="text-pink-400">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t('enter_email_address')}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>

                      {/* Phone Field */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-lg mb-2">
                          {t('phone_number')} <span className="text-pink-400">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={t('enter_phone_number')}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>

                      {/* Gender Field */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-lg mb-2">
                          {t('gender')} <span className="text-pink-400">*</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          required
                        >
                          <option value="male">{t('male')}</option>
                          <option value="female">{t('female')}</option>
                          <option value="other">{t('other')}</option>
                        </select>
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-lg mb-3">
                          {t('date_of_birth')} <span className="text-pink-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            max={new Date().toISOString().split('T')[0]} // Prevent future dates
                            className="w-full px-4 py-4 pl-12 rounded-xl bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg
                            [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer
                            [&::-webkit-datetime-edit]:text-gray-100 [&::-webkit-datetime-edit-fields-wrapper]:text-gray-100"
                            required
                          />
                          {/* Custom Calendar Icon */}
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                          {/* Custom Calendar Icon for Picker */}
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </div>
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

                      {/* Time of Birth */}
                      <div>
                          <label className="block text-gray-100 font-semibold text-lg mb-3">
                            {t('time_of_birth')} <span className="text-pink-400">*</span>
                          </label>
                          
                          <div className="space-y-4">
                            {/* MUI Time Picker */}
                            <ThemeProvider theme={darkTheme}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div className="bg-gray-800/80 border border-purple-600/50 rounded-xl p-4">
                                  <TimePicker
                                    label="Select Birth Time"
                                    value={formData.timeOfBirth ? dayjs(`2000-01-01T${formData.timeOfBirth}`) : null}
                                    onChange={(newValue) => {
                                      const timeString = newValue ? newValue.format('HH:mm') : '';
                                      setFormData(prev => ({ ...prev, timeOfBirth: timeString }));
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                          '& .MuiInputBase-root': {
                                            borderRadius: '12px',
                                            backgroundColor: 'rgba(55, 65, 81, 0.8)',
                                          },
                                          '& .MuiInputLabel-root': {
                                            color: 'rgba(209, 213, 219, 0.8)',
                                          },
                                          '& .MuiInputBase-input': {
                                            color: 'rgb(243, 244, 246)',
                                          },
                                        }}
                                      />
                                    )}
                                  />
                                </div>
                              </LocalizationProvider>
                            </ThemeProvider>

                            {/* Time Visualization */}
                            {formData.timeOfBirth && (
                              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-xl p-6">
                                <div className="text-center">
                                  <div className="text-6xl mb-4">
                                    {(() => {
                                      const hour = parseInt(formData.timeOfBirth.split(':')[0]);
                                      if (hour >= 5 && hour < 12) return '🌅';
                                      if (hour >= 12 && hour < 17) return '☀️';
                                      if (hour >= 17 && hour < 21) return '🌆';
                                      return '🌙';
                                    })()}
                                  </div>
                                  <div className="text-2xl font-bold text-gray-200 mb-2">
                                    {new Date(`2000-01-01T${formData.timeOfBirth}`).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </div>
                                  <div className="text-sm text-gray-400">
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
                        </div>

                      {/* Place of Birth */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-lg mb-2">
                          {t('place_of_birth')} <span className="text-pink-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="placeOfBirth"
                          value={formData.placeOfBirth}
                          onChange={handleInputChange}
                          placeholder={t('place_of_birth_placeholder')}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                        <p className="text-gray-400 text-sm mt-2">
                          {t('location_essential_for_ascendant')}
                        </p>
                      </div>

                      {/* Language Selection */}
                      <div>
                        <label className="block text-gray-100 font-semibold text-lg mb-2">
                          {t('preferred_language')} <span className="text-pink-400">*</span>
                        </label>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                        <div className="bg-gradient-to-r from-purple-400/10 to-pink-400/10 border-2 border-purple-400/50 rounded-lg p-6">
                          <div className="text-center">
                            <h4 className="text-xl font-semibold text-white mb-2">{t('complete_ascendant_analysis')}</h4>
                            <div className="text-4xl font-bold text-purple-400 mb-4">₹399</div>
                            <ul className="text-gray-300 text-sm space-y-2 text-left max-w-sm mx-auto">
                              <li className="flex items-center gap-2">
                                <span className="text-purple-400">✓</span>
                                <span>{t('rising_sign_identification')}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-purple-400">✓</span>
                                <span>{t('personality_traits_analysis')}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-purple-400">✓</span>
                                <span>{t('first_impression_insights')}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-purple-400">✓</span>
                                <span>{t('life_path_guidance')}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-purple-400">✓</span>
                                <span>{t('pdf_download')}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mt-3 text-center">
                          {t('focused_ascendant_analysis_note')}
                        </p>
                      </div>

                      {/* Generate Button */}
                      <button
                        type="submit"
                        disabled={isGenerating || isProcessingPayment}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
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
                          `${t('pay_and_generate_analysis')} - ₹399`
                        )}
                      </button>
                    </form>

                    {/* Features List */}
                    <div className="mt-8 pt-6 border-t border-purple-700/50">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {t('what_you_get')}:
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300">{t('your_rising_sign_detailed')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300">{t('personality_mask_analysis')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300">{t('appearance_and_style_insights')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300">{t('life_approach_patterns')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Visual Content */}
                <div className="space-y-8">
                  {!showAnalysis ? (
                    <>
                      {/* Sample Ascendant Display */}
                      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-purple-700/50">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                          {t('sample_ascendant_analysis')}
                        </h3>
                        <div className="relative">
                          <img
                            src={ascendantImage}
                            alt={t('sample_ascendant_analysis')}
                            className="w-full rounded-xl shadow-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-xl"></div>
                        </div>
                        <p className="text-gray-300 mt-4 text-center">
                          {t('sample_ascendant_description')}
                        </p>
                      </div>

                      {/* Rising Signs */}
                      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-purple-700/50">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                          <span className="text-purple-400 mr-3">⚡</span>
                          {t('rising_signs')}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                            <div className="text-2xl mb-2 text-purple-400">♈</div>
                            <div className="text-gray-300 text-sm">{t('aries_rising')}</div>
                          </div>
                          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                            <div className="text-2xl mb-2 text-purple-400">♉</div>
                            <div className="text-gray-300 text-sm">{t('taurus_rising')}</div>
                          </div>
                          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                            <div className="text-2xl mb-2 text-purple-400">♊</div>
                            <div className="text-gray-300 text-sm">{t('gemini_rising')}</div>
                          </div>
                          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                            <div className="text-2xl mb-2 text-purple-400">♋</div>
                            <div className="text-gray-300 text-sm">{t('cancer_rising')}</div>
                          </div>
                          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                            <div className="text-2xl mb-2 text-purple-400">♌</div>
                            <div className="text-gray-300 text-sm">{t('leo_rising')}</div>
                          </div>
                          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-purple-600/30">
                            <div className="text-2xl mb-2 text-purple-400">♍</div>
                            <div className="text-gray-300 text-sm">{t('virgo_rising')}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Generated Analysis Result
                    <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-purple-700/50">
                      {/* Your existing analysis result code */}
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

export default Ascendant;

