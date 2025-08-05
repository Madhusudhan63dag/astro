import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ascendantImage from '../../assets/2.webp'; // Different image for ascendant
import ThankYouPage from '../../components/ThankYouPage'; // Import the ThankYouPage component
import API_CONFIG from '../api';

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
          service: 'ascendant-analysis',
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
          amount: 399, // Different price for ascendant analysis
          currency: 'INR',
          receipt: `ascendant_analysis_${Date.now()}`,
          notes: {
            service: 'ascendant_analysis',
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
        description: 'Ascendant Analysis',
        order_id: orderData.order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#8B5CF6' // Purple theme for ascendant
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
            service: 'ascendant-analysis',
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
              amount: 399,
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
          service: 'ascendant-analysis',
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
            amount: 399,
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

  // Utility functions
  const validateFormData = (data) => {
    return data.name && data.email && data.phone && data.dateOfBirth && data.timeOfBirth && data.placeOfBirth;
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
      
      const existingHistory = JSON.parse(localStorage.getItem('ascendantHistory') || '[]');
      existingHistory.unshift(historyItem);
      
      const limitedHistory = existingHistory.slice(0, 10);
      localStorage.setItem('ascendantHistory', JSON.stringify(limitedHistory));
    } catch (error) {
      console.warn('Failed to save to history:', error);
    }
  };
 
  return (
    // <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
    //   <div className="relative z-10 py-16 px-4">
    //     {/* Header Section */}
    //     <div className="max-w-7xl mx-auto text-center mb-16">
    //       <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
    //         {t('discover_your')} <span className="text-purple-400">{t('ascendant')}</span>
    //         <br />
    //         <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-violet-500 bg-clip-text text-transparent">
    //           {t('rising_sign_analysis')}
    //         </span>
    //       </h1>
    //       <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
    //         {t('ascendant_description')}
    //       </p>
    //     </div>

    //     <div className="max-w-7xl mx-auto">
    //       <div className="grid lg:grid-cols-2 gap-12 items-start">
    //         {/* Left Side - Form */}
    //         <div className="space-y-8">
    //           <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-purple-700/50">
    //             <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
    //               {t('enter_birth_details')}
    //             </h2>

    //             {/* Error Display */}
    //             {error && (
    //               <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
    //                 <p className="text-red-300 flex items-center">
    //                   <span className="mr-2">⚠️</span>
    //                   {error}
    //                 </p>
    //               </div>
    //             )}

    //             <form onSubmit={handleGenerateAnalysis} className="space-y-6">
    //               {/* Name Field */}
    //               <div>
    //                 <label className="block text-gray-100 font-semibold text-lg mb-2">
    //                   {t('full_name')} <span className="text-pink-400">*</span>
    //                 </label>
    //                 <input
    //                   type="text"
    //                   name="name"
    //                   value={formData.name}
    //                   onChange={handleInputChange}
    //                   placeholder={t('enter_full_name')}
    //                   className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    //                   required
    //                 />
    //               </div>

    //               {/* Email Field */}
    //               <div>
    //                 <label className="block text-gray-100 font-semibold text-lg mb-2">
    //                   {t('email_address')} <span className="text-pink-400">*</span>
    //                 </label>
    //                 <input
    //                   type="email"
    //                   name="email"
    //                   value={formData.email}
    //                   onChange={handleInputChange}
    //                   placeholder={t('enter_email_address')}
    //                   className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    //                   required
    //                 />
    //               </div>

    //               {/* Phone Field */}
    //               <div>
    //                 <label className="block text-gray-100 font-semibold text-lg mb-2">
    //                   {t('phone_number')} <span className="text-pink-400">*</span>
    //                 </label>
    //                 <input
    //                   type="tel"
    //                   name="phone"
    //                   value={formData.phone}
    //                   onChange={handleInputChange}
    //                   placeholder={t('enter_phone_number')}
    //                   className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    //                   required
    //                 />
    //               </div>

    //               {/* Gender Field */}
    //               <div>
    //                 <label className="block text-gray-100 font-semibold text-lg mb-2">
    //                   {t('gender')} <span className="text-pink-400">*</span>
    //                 </label>
    //                 <select
    //                   name="gender"
    //                   value={formData.gender}
    //                   onChange={handleInputChange}
    //                   className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    //                   required
    //                 >
    //                   <option value="male">{t('male')}</option>
    //                   <option value="female">{t('female')}</option>
    //                   <option value="other">{t('other')}</option>
    //                 </select>
    //               </div>

    //               {/* Date of Birth */}
    //               <div>
    //                 <label className="block text-gray-100 font-semibold text-lg mb-2">
    //                   {t('date_of_birth')} <span className="text-pink-400">*</span>
    //                 </label>
    //                 <input
    //                   type="date"
    //                   name="dateOfBirth"
    //                   value={formData.dateOfBirth}
    //                   onChange={handleInputChange}
    //                   className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    //                   required
    //                 />
    //               </div>

    //               {/* Time of Birth */}
    //               <div>
    //                 <label className="block text-gray-100 font-semibold text-lg mb-2">
    //                   {t('time_of_birth')} <span className="text-pink-400">*</span>
    //                 </label>
    //                 <input
    //                   type="time"
    //                   name="timeOfBirth"
    //                   value={formData.timeOfBirth}
    //                   onChange={handleInputChange}
    //                   className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    //                   required
    //                 />
    //                 <p className="text-gray-400 text-sm mt-2">
    //                   {t('exact_time_critical_for_ascendant')}
    //                 </p>
    //               </div>

    //               {/* Place of Birth */}
    //               <div>
    //                 <label className="block text-gray-100 font-semibold text-lg mb-2">
    //                   {t('place_of_birth')} <span className="text-pink-400">*</span>
    //                 </label>
    //                 <input
    //                   type="text"
    //                   name="placeOfBirth"
    //                   value={formData.placeOfBirth}
    //                   onChange={handleInputChange}
    //                   placeholder={t('place_of_birth_placeholder')}
    //                   className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    //                   required
    //                 />
    //                 <p className="text-gray-400 text-sm mt-2">
    //                   {t('location_essential_for_ascendant')}
    //                 </p>
    //               </div>

    //               {/* Language Selection */}
    //               <div>
    //                 <label className="block text-gray-100 font-semibold text-lg mb-2">
    //                   {t('preferred_language')} <span className="text-pink-400">*</span>
    //                 </label>
    //                 <select
    //                   name="language"
    //                   value={formData.language}
    //                   onChange={handleInputChange}
    //                   className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    //                   required
    //                 >
    //                   <option value="en">{t('english')}</option>
    //                   <option value="hi">{t('hindi')}</option>
    //                   <option value="te">{t('telugu')}</option>
    //                   <option value="kn">{t('kannada')}</option>
    //                 </select>
    //                 <p className="text-gray-400 text-sm mt-2">
    //                   {t('language_note')}
    //                 </p>
    //               </div>

    //               {/* Pricing Information */}
    //               <div>
    //                 <label className="block text-gray-100 font-semibold text-lg mb-4">
    //                   {t('service_price')}
    //                 </label>
    //                 <div className="bg-gradient-to-r from-purple-400/10 to-pink-400/10 border-2 border-purple-400/50 rounded-lg p-6">
    //                   <div className="text-center">
    //                     <h4 className="text-xl font-semibold text-white mb-2">{t('complete_ascendant_analysis')}</h4>
    //                     <div className="text-4xl font-bold text-purple-400 mb-4">₹399</div>
    //                     <ul className="text-gray-300 text-sm space-y-2 text-left max-w-sm mx-auto">
    //                       <li className="flex items-center gap-2">
    //                         <span className="text-purple-400">✓</span>
    //                         <span>{t('rising_sign_identification')}</span>
    //                       </li>
    //                       <li className="flex items-center gap-2">
    //                         <span className="text-purple-400">✓</span>
    //                         <span>{t('personality_traits_analysis')}</span>
    //                       </li>
    //                       <li className="flex items-center gap-2">
    //                         <span className="text-purple-400">✓</span>
    //                         <span>{t('first_impression_insights')}</span>
    //                       </li>
    //                       <li className="flex items-center gap-2">
    //                         <span className="text-purple-400">✓</span>
    //                         <span>{t('life_path_guidance')}</span>
    //                       </li>
    //                       <li className="flex items-center gap-2">
    //                         <span className="text-purple-400">✓</span>
    //                         <span>{t('pdf_download')}</span>
    //                       </li>
    //                     </ul>
    //                   </div>
    //                 </div>
    //                 <p className="text-gray-400 text-sm mt-3 text-center">
    //                   {t('focused_ascendant_analysis_note')}
    //                 </p>
    //               </div>

    //               {/* Generate Button */}
    //               <button
    //                 type="submit"
    //                 disabled={isGenerating || isProcessingPayment}
    //                 className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
    //               >
    //                 {isProcessingPayment ? (
    //                   <span className="flex items-center justify-center">
    //                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    //                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    //                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    //                     </svg>
    //                     {t('processing_payment')}...
    //                   </span>
    //                 ) : isGenerating ? (
    //                   <span className="flex items-center justify-center">
    //                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    //                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    //                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    //                     </svg>
    //                     {t('processing_request')}...
    //                   </span>
    //                 ) : (
    //                   `${t('pay_and_generate_analysis')} - ₹399`
    //                 )}
    //               </button>
    //             </form>

    //             {/* Features List */}
    //             <div className="mt-8 pt-6 border-t border-purple-700/50">
    //               <h3 className="text-lg font-semibold text-white mb-4">
    //                 {t('what_you_get')}:
    //               </h3>
    //               <div className="space-y-3">
    //                 <div className="flex items-center gap-3">
    //                   <span className="text-purple-400">✓</span>
    //                   <span className="text-gray-300">{t('your_rising_sign_detailed')}</span>
    //                 </div>
    //                 <div className="flex items-center gap-3">
    //                   <span className="text-purple-400">✓</span>
    //                   <span className="text-gray-300">{t('personality_mask_analysis')}</span>
    //                 </div>
    //                 <div className="flex items-center gap-3">
    //                   <span className="text-purple-400">✓</span>
    //                   <span className="text-gray-300">{t('appearance_and_style_insights')}</span>
    //                 </div>
    //                 <div className="flex items-center gap-3">
    //                   <span className="text-purple-400">✓</span>
    //                   <span className="text-gray-300">{t('life_approach_patterns')}</span>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Right Side - Visual Content */}
    //        <ThankYouPage 
    //           userName="John Doe"
    //           userEmail="john@example.com"
    //           analysisData={{ requestId: "123", paymentId: "456" }}
    //           serviceAmount="₹599"
    //           serviceFeatures={["Feature 1", "Feature 2", "Feature 3"]}
    //           bgGradient="from-blue-900 via-indigo-900 to-purple-900"
    //         />
 
    //       </div>
    //     </div>
    //   </div>
    // </div>
     <>
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
            <div className=" text-center mb-16">
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

                    {/* Your existing form code here */}
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
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('date_of_birth')} <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Time of Birth */}
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('time_of_birth')} <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="time"
                      name="timeOfBirth"
                      value={formData.timeOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-purple-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      {t('exact_time_critical_for_ascendant')}
                    </p>
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
    </>
  );
};

export default Ascendant;
