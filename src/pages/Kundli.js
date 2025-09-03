import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ThankYouPage from '../components/ThankYouPage';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getRawPrice, getFormattedPrice, PRICE_KEYS } from '../config/prices';
import dayjs from 'dayjs';
import API_CONFIG from './api';


const API_URL = API_CONFIG.API_URL;


const Kundli = () => {
  const BC_PRICE_NUMBER = getRawPrice(PRICE_KEYS.kundli);
  const BC_PRICE_FORMATTED = getFormattedPrice(PRICE_KEYS.kundli);
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
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
  
  // Previous state variables remain the same
  const [isGenerating, setIsGenerating] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [userAbandoned, setUserAbandoned] = useState(false);
  // Default meridiem for time selection (keeps AM/PM default visible)
  const [meridiem, setMeridiem] = useState('AM');


  useEffect(() => {
    setSessionStartTime(Date.now());
  }, []);

  // Keep meridiem in sync if timeOfBirth changes elsewhere
  useEffect(() => {
    if (formData.timeOfBirth) {
      const hours = parseInt(formData.timeOfBirth.split(':')[0], 10);
      setMeridiem(hours >= 12 ? 'PM' : 'AM');
    }
  }, [formData.timeOfBirth]);


  const modernTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#06B6D4', // Cyan
      },
      secondary: {
        main: '#F97316', // Orange
      },
      background: {
        paper: 'rgba(15, 23, 42, 0.95)',
        default: 'rgba(15, 23, 42, 0.8)',
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(6, 182, 212, 0.3)',
              borderWidth: '2px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(6, 182, 212, 0.6)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#06B6D4',
              borderWidth: '2px',
              boxShadow: '0 0 0 4px rgba(6, 182, 212, 0.1)',
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


  // Helper function to calculate form completion
  const calculateFormCompletion = useCallback(() => {
    const fields = ['name', 'email', 'phone', 'dateOfBirth', 'timeOfBirth', 'placeOfBirth'];
    const filledFields = fields.filter(field => formData[field] && formData[field].trim() !== '');
    return Math.round((filledFields.length / fields.length) * 100);
  }, [formData]);

  // Send abandonment email (memoized)
  const sendAbandonmentEmail = useCallback(async (reason = t('payment_cancelled_by_user') || 'Payment cancelled by user') => {
    // Check if we should send abandonment email
    if (userAbandoned || paymentCompleted || showThankYou) return;

    setUserAbandoned(true);
    try {
      const abandonmentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: 'kundli',
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
          hasUserInteracted: true,
          currentStep: currentStep,
          formCompletionPercentage: calculateFormCompletion()
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };

      // Add retry logic for abandonment email too
      let emailSent = false;
      let retryCount = 0;
      const maxRetries = 2;

      while (!emailSent && retryCount < maxRetries) {
        try {
          const response = await fetch(`${API_URL}/abandoned-payment-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(abandonmentData),
            signal: AbortSignal.timeout(10000) // 10 second timeout
          });

          if (response.ok) {
            emailSent = true;
            console.log('Abandonment email sent successfully');
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (emailError) {
          retryCount++;
          console.error(`Abandonment email attempt ${retryCount} failed:`, emailError.message);

          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }

      if (!emailSent) {
        console.warn('Failed to send abandonment email after retries');
      }
    } catch (error) {
      console.error('Error in abandonment email process:', error);
    }
  }, [userAbandoned, paymentCompleted, showThankYou, formData, currentStep, sessionStartTime, t, calculateFormCompletion]);


  
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
        // Enhanced astrology service email with retry logic
        const astroEmailData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: 'kundli',
          reportType: 'kundli',
          birthDetails: {
            dateOfBirth: formData.dateOfBirth,
            timeOfBirth: formData.timeOfBirth,
            placeOfBirth: formData.placeOfBirth,
            gender: formData.gender
          },
          language: formData.language,
          additionalInfo: t('complete_career_guidance_request') || 'Complete Career Path Guidance (Kundli) Analysis Request',
          paymentDetails: {
            status: 'paid',
            amount: BC_PRICE_NUMBER,
            paymentId: paymentData.razorpay_payment_id,
            orderId: paymentData.razorpay_order_id
          }
        };

        // Add retry logic for email sending
        let emailSent = false;
        let retryCount = 0;
        const maxRetries = 3;

        while (!emailSent && retryCount < maxRetries) {
          try {
            const emailResponse = await fetch(`${API_URL}/send-astro-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(astroEmailData)
            });

            if (emailResponse.ok) {
              const emailResult = await emailResponse.json();
              if (emailResult.success) {
                emailSent = true;
              } else {
                throw new Error(emailResult.message || 'Email service failed');
              }
            } else {
              // Handle specific HTTP status codes
              if (emailResponse.status === 500) {
                throw new Error(`Email server error (${emailResponse.status}): Please try again later`);
              } else {
                throw new Error(`Email API returned ${emailResponse.status}: ${emailResponse.statusText}`);
              }
            }
          } catch (emailError) {
            retryCount++;
            console.error(`Email attempt ${retryCount} failed:`, emailError.message);
            
            if (retryCount < maxRetries) {
              // Wait before retry (exponential backoff)
              const delayMs = 1000 * retryCount;
              await new Promise(resolve => setTimeout(resolve, delayMs));
            }
          }
        }

        if (emailSent) {
          setAnalysisData({
            orderId: paymentData.razorpay_order_id,
            paymentId: paymentData.razorpay_payment_id,
            requestId: paymentData.razorpay_order_id,
            service: t('birth_chart_analysis') || 'Birth Chart Analysis',
            amount: BC_PRICE_FORMATTED,
            status: 'completed'
          });

          setShowThankYou(true);
          setIsGenerating(false);
          setIsProcessingPayment(false);
        } else {
          // Even if email fails, show success since payment is completed
          console.warn('Email delivery failed after retries, but payment was successful');
          
          setAnalysisData({
            orderId: paymentData.razorpay_order_id,
            paymentId: paymentData.razorpay_payment_id,
            requestId: paymentData.razorpay_order_id,
            service: t('birth_chart_analysis') || 'Birth Chart Analysis',
            amount: BC_PRICE_FORMATTED,
            status: 'completed',
            emailStatus: 'pending' // Track email status
          });

          setShowThankYou(true);
          setIsGenerating(false);
          setIsProcessingPayment(false);
          
          // Optional: Show user notification about email delay
          setError(t('payment_successful_email_delayed') || 'Payment successful! Confirmation email may be delayed due to server issues.');
          setTimeout(() => setError(null), 5000);
        }
      } else {
        throw new Error(verifyResult.message || t('payment_verification_failed') || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setError(`${t('failed_to_process_astrology_request') || 'Failed to process astrology service request'}: ${error.message}`);
      setIsProcessingPayment(false);
    }
  };


  // Handle payment failure/cancellation
  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    setPaymentInProgress(false);
    setIsProcessingPayment(false);
    setIsGenerating(false);
    
    let reason = t('payment_failed') || 'Payment failed';
    if (error.code === 'BAD_REQUEST_ERROR') {
      reason = t('user_cancelled_payment') || 'User cancelled payment';
    } else if (error.description) {
      reason = error.description;
    }
    
    sendAbandonmentEmail(reason);
    setError(t('payment_failed_message') || 'Payment failed. Please try again or contact support.');
  };


  // Initialize Razorpay payment
  // Enhanced initializePayment with better abandonment tracking
  const initializePayment = async (orderData) => {
    const res = await loadRazorpay();
    if (!res) {
      setError(t('failed_to_load_payment') || 'Failed to load payment gateway. Please try again.');
      return;
    }

    setPaymentInProgress(true);

    const options = {
      key: orderData.key,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: 'SriAstroVeda',
      description: t('complete_kundli_report') || 'Birth Chart Analysis - Complete Kundli Report',
      image: '/logo192.png',
      order_id: orderData.order.id,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#06B6D4'
      },
      modal: {
        ondismiss: () => {
          if (paymentInProgress && !paymentCompleted) {
            setPaymentInProgress(false);
            setIsProcessingPayment(false);
            setIsGenerating(false);
            
            // Send abandonment email when modal is dismissed
            sendAbandonmentEmail(t('user_closed_payment_modal') || 'User closed payment modal without completing payment');
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
      sendAbandonmentEmail(t('error_opening_payment_gateway') || 'Error opening payment gateway');
      setError(t('failed_to_open_payment_gateway') || 'Failed to open payment gateway. Please try again.');
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


    // Validate phone number
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
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
        throw new Error(t('failed_to_create_order') || 'Failed to create order');
      }


      const orderData = await orderResponse.json();


      if (orderData.success) {
        setIsProcessingPayment(true);
        await initializePayment(orderData);
      } else {
        throw new Error(orderData.message || t('failed_to_create_payment_order') || 'Failed to create payment order');
      }


    } catch (error) {
      console.error('Order creation error:', error);
      setError(error.message || t('failed_to_initialize_payment') || 'Failed to initialize payment. Please try again.');
      setIsGenerating(false);
      sendAbandonmentEmail(`${t('technical_error_during_order') || 'Technical error during order creation'}: ${error.message}`);
    }
  };


  // Step-based wizard configuration
  const steps = [
    {
      id: 'personal',
      title: t('personal_identity') || 'Personal Identity',
      icon: '👤',
      description: t('tell_us_about_yourself') || 'Tell us about yourself',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'birth',
      title: t('birth_details') || 'Birth Details',
      icon: '🌟',
      description: t('your_cosmic_coordinates') || 'Your cosmic coordinates',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'timing',
      title: t('time_and_place') || 'Time & Place',
      icon: '⏰',
      description: t('when_and_where_arrived') || 'When and where you arrived',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'preferences',
      title: t('your_preferences') || 'Your Preferences',
      icon: '⚙️',
      description: t('customize_experience') || 'Customize your experience',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'payment',
      title: t('unlock_your_destiny') || 'Unlock Your Destiny',
      icon: '💎',
      description: t('complete_cosmic_journey') || 'Complete your cosmic journey',
      color: 'from-rose-500 to-orange-500'
    }
  ];


  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Details
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('who_are_you') || 'Who Are You?'}</h2>
              <p className="text-slate-400 text-sm sm:text-base px-2">{t('start_with_basics') || "Let's start with the basics about yourself"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-white font-medium text-base sm:text-lg">{t('full_name') || 'Full Name'}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('enter_complete_name') || "Enter your complete name"}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-800/60 border-2 border-cyan-500/30 text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all duration-300 text-base sm:text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-medium text-base sm:text-lg">{t('gender') || 'Gender'}</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {['male', 'female', 'other'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gender }))}
                      className={`py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                        formData.gender === gender
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105'
                          : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border-2 border-slate-600/50'
                      }`}
                    >
                      {t(gender) || gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-white font-medium text-base sm:text-lg">{t('email_address') || 'Email Address'}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('email_placeholder') || "your@email.com"}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-800/60 border-2 border-cyan-500/30 text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all duration-300 text-base sm:text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-medium text-base sm:text-lg">{t('phone_number') || 'Phone Number'}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('phone_placeholder') || "+91 9876543210"}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-800/60 border-2 border-cyan-500/30 text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all duration-300 text-base sm:text-lg"
                  required
                />
              </div>
            </div>
          </div>
        );


      case 1: // Birth Date
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('your_birth_date') || 'Your Birth Date'}</h2>
              <p className="text-slate-400 text-sm sm:text-base px-2">{t('cosmic_journey_begin') || 'When did your cosmic journey begin?'}</p>
            </div>

            <div className="max-w-md mx-auto px-4 sm:px-0">
              <ThemeProvider theme={modernTheme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="bg-slate-800/60 border-2 border-blue-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
                    <DatePicker
                      label={t('your_birth_date') || 'Your Birth Date'}
                      format="DD/MM/YYYY"
                      disableFuture
                      maxDate={dayjs()}
                      value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                      onChange={(newValue) => {
                        const dateString = newValue ? newValue.format('YYYY-MM-DD') : '';
                        setFormData(prev => ({ ...prev, dateOfBirth: dateString }));
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                          sx: {
                            '& .MuiInputBase-root': {
                              fontSize: { xs: '16px', sm: '18px' },
                              fontWeight: 600,
                            },
                          },
                          helperText: t('select_birth_date') || 'Please select your birth date (DD/MM/YYYY)',
                        }
                      }}
                    />
                  </div>
                </LocalizationProvider>
              </ThemeProvider>

              {formData.dateOfBirth && (
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-xl sm:rounded-2xl border border-blue-400/30">
                  <div className="text-center">
                    <div className="text-3xl sm:text-5xl mb-3 sm:mb-4">🎂</div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                      {dayjs(formData.dateOfBirth).format('dddd, DD MMMM YYYY')}
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base">
                      {t('age_label') || 'Age'}: {dayjs().diff(dayjs(formData.dateOfBirth), 'year')} {t('years') || 'years'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );


      case 2: // Time & Place
        return (
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('time_and_place_title') || 'Time & Place'}</h2>
                <p className="text-slate-400 text-sm sm:text-base px-2">{t('precise_moment_location') || 'The precise moment and location matter'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Time Picker */}
                <div className="space-y-4">
                  <label className="text-white font-medium text-base sm:text-lg">{t('birth_time') || 'Birth Time'}</label>
                  <ThemeProvider theme={modernTheme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="bg-slate-800/60 border-2 border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                        <TimePicker
                          label={t('select_exact_time') || "Select exact time"}
              ampm
              format="hh:mm "
                          timeSteps={{ minutes: 1 }}
                          views={['hours', 'minutes']}
                          openTo="hours"
                          referenceDate={dayjs('2000-01-01')}
                          value={formData.timeOfBirth ? dayjs(`2000-01-01T${formData.timeOfBirth}`) : null}
                          onChange={(newValue) => {
                            const timeString = newValue ? newValue.format('HH:mm') : '';
                            setFormData(prev => ({ ...prev, timeOfBirth: timeString }));
                            if (newValue) {
                              setMeridiem(newValue.hour() >= 12 ? 'PM' : 'AM');
                            }
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: 'outlined',
                placeholder: 'e.g., 10:30 AM',
                helperText: t('enter_time_helper_12h') || 'Type or pick time with AM/PM, e.g., 10:30 AM',
                              sx: {
                                '& .MuiInputBase-root': {
                                  fontSize: { xs: '16px', sm: '18px' },
                                  fontWeight: 600,
                                },
                              },
                            }
                          }}
                        />
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-slate-400 text-sm">{t('meridiem') || 'AM/PM'}:</span>
                          <select
                            className="bg-slate-800/60 border border-slate-600/60 text-white text-sm rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                            value={meridiem}
                            onChange={(e) => {
                              const sel = e.target.value; // 'AM' | 'PM'
                              setMeridiem(sel);
                              const hasTime = Boolean(formData.timeOfBirth);
                              let hours = 10; // default hour when no time selected
                              let minutes = 0;
                              if (hasTime) {
                                const [hStr, mStr] = formData.timeOfBirth.split(':');
                                hours = parseInt(hStr, 10);
                                minutes = parseInt(mStr, 10) || 0;
                              }
                              if (sel === 'AM') {
                                if (hours >= 12) hours = hours - 12; // 12..23 -> 0..11
                              } else {
                                if (hours < 12) hours = hours + 12; // 0..11 -> 12..23
                              }
                              const hh = String(hours).padStart(2, '0');
                              const mm = String(minutes).padStart(2, '0');
                              setFormData(prev => ({ ...prev, timeOfBirth: `${hh}:${mm}` }));
                            }}
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </LocalizationProvider>
                  </ThemeProvider>

                  {formData.timeOfBirth && (
                    <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-400/30">
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">
                          {(() => {
                            const hour = parseInt(formData.timeOfBirth.split(':')[0]);
                            if (hour >= 5 && hour < 12) return '🌅';
                            if (hour >= 12 && hour < 17) return '☀️';
                            if (hour >= 17 && hour < 21) return '🌆';
                            return '🌙';
                          })()}
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-white">
                          {new Date(`2000-01-01T${formData.timeOfBirth}`).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Place Input */}
                <div className="space-y-4">
                  <label className="text-white font-medium text-base sm:text-lg">{t('birth_place') || 'Birth Place'}</label>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleInputChange}
                    placeholder={t('city_state_country') || "City, State, Country"}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-800/60 border-2 border-purple-500/30 text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300 text-base sm:text-lg"
                    required
                  />
                  <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-400/30">
                    <div className="flex items-start sm:items-center gap-3 text-slate-300">
                      <span className="text-xl sm:text-2xl">🌍</span>
                      <div>
                        <p className="font-medium text-sm sm:text-base">{t('location_accuracy') || 'Location Accuracy'}</p>
                        <p className="text-xs sm:text-sm text-slate-400">{t('exact_birthplace_ensures') || 'Exact birthplace ensures precise planetary calculations'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );


      case 3: // Preferences
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('your_preferences_title') || 'Your Preferences'}</h2>
              <p className="text-slate-400 text-sm sm:text-base px-2">{t('life_kundali_20_years') || 'Customize your astrological experience'}</p>
            </div>

            <div className="max-w-lg mx-auto space-y-6 px-4 sm:px-0">
              <div className="space-y-3">
                <label className="text-white font-medium text-base sm:text-lg">{t('preferred_language') || 'Preferred Language'}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'en', label: t('english') || '🇺🇸 English', flag: '🇺🇸' },
                    { value: 'hi', label: t('hindi') || '🇮🇳 हिंदी', flag: '🇮🇳' },
                    { value: 'te', label: t('telugu') || '🇮🇳 తెలుగు', flag: '🇮🇳' },
                    { value: 'kn', label: t('kannada') || '🇮🇳 ಕನ್ನಡ', flag: '🇮🇳' },
                    { value: 'ta', label: t('tamil') || '🇮🇳 தமிழ்', flag: '🇮🇳' },
                    { value: 'mr', label: t('marathi') || '🇮🇳 मराठी', flag: '🇮🇳' },
                    { value: 'bn', label: t('bengali') || '🇮🇳 বাংলা', flag: '🇮🇳' }
                  ].map((lang) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, language: lang.value }))}
                      className={`py-3 sm:py-4 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                        formData.language === lang.value
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg transform scale-105'
                          : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border-2 border-slate-600/50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-900/40 to-rose-900/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-pink-400/30">
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <span>📋</span> {t('what_youll_receive') || "What You'll Receive"}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    t('life_kundali_20_years') || 'Life Kundali with 20 Years of Future Predictions — Year-by-Year Guidance',
                    t('detailed_career_path_analysis') || 'Detailed Career Path Analysis',
                    t('planetary_position_interpretations') || 'Planetary Position Interpretations',
                    t('dasha_system_predictions') || 'Dasha System Predictions',
                    t('personalized_remedial_suggestions') || 'Personalized Remedial Suggestions',
                    t('digital_pdf_report') || 'Digital PDF Report'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-pink-400">✨</span>
                      <span className="text-slate-200 text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );


      case 4: // Payment
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('unlock_your_destiny_title') || 'Unlock Your Destiny'}</h2>
              <p className="text-slate-400 text-sm sm:text-base px-2">{t('complete_cosmic_journey_desc') || 'Complete your cosmic journey'}</p>
            </div>

            <div className="max-w-lg mx-auto px-4 sm:px-0">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-orange-500/30 relative overflow-hidden">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('career_path_analysis') || 'Career Path Analysis'}</h3>
                  <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-xl sm:text-2xl text-slate-500 line-through">₹1,299</span>
                    <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">{BC_PRICE_FORMATTED}</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-bold">54% {t('off_label') || 'OFF'}</span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <h4 className="text-base sm:text-lg font-semibold text-white mb-3">{t('summary_of_details') || 'Summary of Your Details'}:</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-slate-400">{t('name_label') || 'Name'}:</span>
                      <span className="text-white font-medium text-right ml-2">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-400">{t('birth_date_label') || 'Birth Date'}:</span>
                      <span className="text-white font-medium text-right ml-2">{formData.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-400">{t('birth_time_label') || 'Birth Time'}:</span>
                      <span className="text-white font-medium text-right ml-2">{formData.timeOfBirth}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-400">{t('birth_place_label') || 'Birth Place'}:</span>
                      <span className="text-white font-medium text-right ml-2 break-words">{formData.placeOfBirth}</span>
                    </div>
                  </div>
                </div>

                <button
                id="completepayment"
                  onClick={handleGenerateAnalysis}
                  disabled={isGenerating || isProcessingPayment}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-xl"
                >
                  {isProcessingPayment ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 sm:mr-3"></div>
                      <span className="text-sm sm:text-base">{t('processing_payment') || 'Processing Payment...'}</span>
                    </span>
                  ) : isGenerating ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 sm:mr-3"></div>
                      <span className="text-sm sm:text-base">{t('preparing_analysis') || 'Preparing Analysis...'}</span>
                    </span>
                  ) : (
                    <span className="text-sm sm:text-base">{t('complete_payment_get_report') || `Complete Payment & Get Report`}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        );


      default:
        return null;
    }
  };


  // Lifecycle hooks for abandonment tracking
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (paymentInitiated && !paymentCompleted && !userAbandoned && !showThankYou) {
        const hasFormData = formData.name && formData.email && formData.phone;
        if (hasFormData) {
          sendAbandonmentEmail(t('user_left_page_with_filled_form') || 'User left page with filled form details');
        }
      }
    };


    const handleVisibilityChange = () => {
      if (document.hidden && paymentInProgress && !paymentCompleted) {
        setTimeout(() => {
          if (document.hidden && paymentInProgress && !paymentCompleted && !userAbandoned) {
            sendAbandonmentEmail(t('user_switched_away_during_payment') || 'User switched away during payment process');
          }
        }, 30000);
      }
    };


    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [paymentInitiated, paymentCompleted, userAbandoned, showThankYou, formData, paymentInProgress, sendAbandonmentEmail, t]);


  if (showThankYou) {
    return (
      <ThankYouPage 
        userName={formData.name}
        userEmail={formData.email}
        chartData={analysisData}
        serviceAmount={BC_PRICE_FORMATTED}
        serviceFeatures={[
          t('detailed_career_guidance_pdf') || "Detailed Career Path Guidance (PDF)",
          t('comprehensive_astrological_analysis') || "Comprehensive Astrological Analysis",
          t('planetary_positions_interpretations') || "Planetary Positions & Interpretations",
          t('dasha_system_predictions_feature') || "Dasha System Predictions",
          t('personalized_remedial_suggestions_feature') || "Personalized Remedial Suggestions"
        ]}
        bgGradient="from-slate-900 via-cyan-900 to-slate-900"
        onClose={() => setShowThankYou(false)}
      />
    );
  }


  // Rolling banner items
  const bannerItems = [
    t('life_kundali_20_years') || 'Life Kundali with 20 Years Prediction',
    t('detailed_career_path_analysis') || 'Detailed Career Path Analysis',
    // t('planetary_position_interpretations') || 'Planetary Position Interpretations',
    t('dasha_system_predictions') || 'Dasha System Predictions',
    t('digital_pdf_report') || 'Digital PDF Report'
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 relative overflow-hidden">
      {/* Rolling Text Banner */}
        <div className="marquee-container bg-gradient-to-r from-cyan-900/30 via-slate-800/30 to-purple-900/30 border-y border-cyan-500/20 py-2 sm:py-3 mb-6 sm:mb-10">
          <div className="marquee-inner">
            <div className="flex items-center gap-8 pr-8 whitespace-nowrap">
              {bannerItems.map((txt, i) => (
                <div key={`a-${i}`} className="flex items-center gap-3 text-slate-200 text-sm sm:text-base font-medium">
                  <span className="text-cyan-400">✦</span>
                  <span>{txt}</span>
                </div>
              ))}
            </div>
            {/* duplicate for seamless loop */}
            <div className="flex items-center gap-8 pr-8 whitespace-nowrap" aria-hidden="true">
              {bannerItems.map((txt, i) => (
                <div key={`b-${i}`} className="flex items-center gap-3 text-slate-200 text-sm sm:text-base font-medium">
                  <span className="text-cyan-400">✦</span>
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      <div className="relative z-10 py-6 sm:py-12 px-3 sm:px-4">
        {/* Rolling text banner styles */}
        <style>{`
          .marquee-container { position: relative; overflow: hidden; }
          .marquee-inner { display: flex; width: max-content; animation: sav-scroll-h 28s linear infinite; }
          @keyframes sav-scroll-h { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @media (prefers-reduced-motion: reduce) { .marquee-inner { animation: none; } }
        `}</style>
        {/* Header - Make text responsive */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-2 sm:mb-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {t('cosmic_career') || 'Cosmic Career'}
            </span>
            <br />
            <span className="text-white">{t('journey') || 'Journey'}</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto px-4">
            {t('discover_professional_destiny') || 'Discover your professional destiny through the wisdom of Vedic astrology'}
          </p>
        </div>

        


        {/* Main Content Card */}
        <div className="max-w-4xl mx-auto px-2 sm:px-0">
          <div className={`bg-slate-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 transition-all duration-500 ${
            currentStep === 0 ? 'border-cyan-500/30' :
            currentStep === 1 ? 'border-blue-500/30' :
            currentStep === 2 ? 'border-purple-500/30' :
            currentStep === 3 ? 'border-pink-500/30' :
            'border-orange-500/30'
          } shadow-2xl`}>
            
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/50 border border-red-500/50 rounded-xl sm:rounded-2xl">
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg sm:text-xl">⚠️</span>
                  <p className="text-red-300 text-sm sm:text-base leading-relaxed">{error}</p>
                </div>
              </div>
            )}


            {renderStepContent()}


            {/* Navigation */}
            {currentStep < 4 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 sm:mt-12 gap-4 sm:gap-0">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl sm:rounded-2xl transition-all duration-300 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {t('previous') || '← Previous'}
                </button>
                
                <div className="text-slate-400 flex items-center text-sm sm:text-base order-first sm:order-none">
                  {t('step_of') || 'Step'} {currentStep + 1} {t('of') || 'of'} {steps.length}
                </div>
                
                <button
                  id='reviewandpay'
                  onClick={() => {
                    // Validation logic for each step
                    if (currentStep === 0 && (!formData.name || !formData.email || !formData.phone)) {
                      setError(t('fill_personal_details') || 'Please fill in all personal details');
                      return;
                    }
                    if (currentStep === 1 && !formData.dateOfBirth) {
                      setError(t('select_birth_date') || 'Please select your birth date');
                      return;
                    }
                    if (currentStep === 2 && (!formData.timeOfBirth || !formData.placeOfBirth)) {
                      setError(t('provide_birth_time_place') || 'Please provide birth time and place');
                      return;
                    }
                    
                    setError(null);
                    setCurrentStep(prev => Math.min(4, prev + 1));
                  }}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r ${steps[currentStep]?.color} text-white rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 text-sm sm:text-base`}
                >
                  {currentStep === 3 ? t('review_and_pay') || 'Review & Pay' : t('next') || 'Next →'}
                </button>
              </div>
            )}
          </div>
        </div>


        {/* Trust Indicators */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-slate-400 text-xs sm:text-sm px-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>{t('reports_generated') || '15,000+ Reports Generated'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">★★★★★</span>
              <span>{t('rating') || '4.9/5 Rating'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{t('secure') || '🔒 100% Secure'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Kundli;
