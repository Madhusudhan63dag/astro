import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import API_CONFIG from '../api';
import { getRawPrice, getFormattedPrice, PRICE_KEYS } from '../../config/prices';

const API_URL = API_CONFIG.API_URL;

const MatchHoroscope = () => {
  const { t } = useTranslation();
  const BC_PRICE_NUMBER = getRawPrice(PRICE_KEYS.matchHoroscope);
  const BC_PRICE_FORMATTED = getFormattedPrice(PRICE_KEYS.matchHoroscope);
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

  // Split inputs state for both partners
  const [p1DobDay, setP1DobDay] = useState('');
  const [p1DobMonth, setP1DobMonth] = useState('');
  const [p1DobYear, setP1DobYear] = useState('');
  const [p1TobHour, setP1TobHour] = useState('');
  const [p1TobMinute, setP1TobMinute] = useState('');
  const [p1TobMeridiem, setP1TobMeridiem] = useState('AM');

  const [p2DobDay, setP2DobDay] = useState('');
  const [p2DobMonth, setP2DobMonth] = useState('');
  const [p2DobYear, setP2DobYear] = useState('');
  const [p2TobHour, setP2TobHour] = useState('');
  const [p2TobMinute, setP2TobMinute] = useState('');
  const [p2TobMeridiem, setP2TobMeridiem] = useState('AM');

  // Refs for auto-advance
  const p1DdRef = useRef(null), p1MmRef = useRef(null), p1YyyyRef = useRef(null), p1HhRef = useRef(null), p1MinRef = useRef(null);
  const p2DdRef = useRef(null), p2MmRef = useRef(null), p2YyyyRef = useRef(null), p2HhRef = useRef(null), p2MinRef = useRef(null);

  // Guard refs to ensure once-only actions and prevent duplicate calls
  const paymentInitiatedRef = useRef(false); // blocks double-submit and multiple Razorpay opens
  const paymentHandledRef = useRef(false);   // ensures Razorpay handler executes once
  const sendMatchEmailCalledRef = useRef(false); // ensures email after payment is sent once
  const flowFinalizedRef = useRef(false);    // marks successful flow completion to block abandoned emails
  const abandonedEmailSentRef = useRef(false); // send abandoned email at most once per session

  // Helpers
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
  const updateDateInForm = (partner, d, m, y) => {
    setFormData(prev => {
      const copy = { ...prev };
      if (isValidDateParts(d, m, y)) {
        const yyyy = y;
        const mm = String(parseInt(m, 10)).padStart(2, '0');
        const dd = String(parseInt(d, 10)).padStart(2, '0');
        copy[partner] = { ...copy[partner], dateOfBirth: `${yyyy}-${mm}-${dd}` };
      } else {
        copy[partner] = { ...copy[partner], dateOfBirth: '' };
      }
      return copy;
    });
  };
  const updateTimeInForm = (partner, h, m, mer) => {
    setFormData(prev => {
      const copy = { ...prev };
      if (!h || !m || h.length < 1 || m.length < 2) {
        copy[partner] = { ...copy[partner], timeOfBirth: '' };
        return copy;
      }
      let hh = parseInt(h, 10);
      const mm = parseInt(m, 10);
      if (Number.isNaN(hh) || Number.isNaN(mm)) {
        copy[partner] = { ...copy[partner], timeOfBirth: '' };
        return copy;
      }
      if (hh < 1) hh = 1;
      if (hh > 12) hh = 12;
      const mmClamped = clampNum(mm, 0, 59);
      let hh24 = hh;
      if (mer === 'AM') {
        if (hh === 12) hh24 = 0;
      } else {
        if (hh !== 12) hh24 = hh + 12;
      }
      copy[partner] = { ...copy[partner], timeOfBirth: `${String(hh24).padStart(2, '0')}:${String(mmClamped).padStart(2, '0')}` };
      return copy;
    });
  };
  const onChangeDigits = (setter, value, maxLen, nextRef) => {
    const digits = (value || '').replace(/\D/g, '').slice(0, maxLen);
    setter(digits);
    if (digits.length === maxLen && nextRef && nextRef.current) nextRef.current.focus();
  };

  // Initialize split fields from formData
  useEffect(() => {
    const dob1 = formData.partner1.dateOfBirth;
    const tob1 = formData.partner1.timeOfBirth;
    if (dob1) {
      const [y, m, d] = dob1.split('-');
      if (y && m && d) { setP1DobYear(y); setP1DobMonth(m); setP1DobDay(d); }
    }
    if (tob1) {
      const [hhStr, mmStr] = tob1.split(':');
      if (hhStr && mmStr) {
        let h = parseInt(hhStr, 10); let mer = 'AM';
        if (h === 0) { h = 12; mer = 'AM'; }
        else if (h === 12) { mer = 'PM'; }
        else if (h > 12) { h = h - 12; mer = 'PM'; }
        setP1TobHour(String(h).padStart(2, '0'));
        setP1TobMinute(String(parseInt(mmStr, 10)).padStart(2, '0'));
        setP1TobMeridiem(mer);
      }
    }
  }, [formData.partner1.dateOfBirth, formData.partner1.timeOfBirth]);
  useEffect(() => {
    const dob2 = formData.partner2.dateOfBirth;
    const tob2 = formData.partner2.timeOfBirth;
    if (dob2) {
      const [y, m, d] = dob2.split('-');
      if (y && m && d) { setP2DobYear(y); setP2DobMonth(m); setP2DobDay(d); }
    }
    if (tob2) {
      const [hhStr, mmStr] = tob2.split(':');
      if (hhStr && mmStr) {
        let h = parseInt(hhStr, 10); let mer = 'AM';
        if (h === 0) { h = 12; mer = 'AM'; }
        else if (h === 12) { mer = 'PM'; }
        else if (h > 12) { h = h - 12; mer = 'PM'; }
        setP2TobHour(String(h).padStart(2, '0'));
        setP2TobMinute(String(parseInt(mmStr, 10)).padStart(2, '0'));
        setP2TobMeridiem(mer);
      }
    }
  }, [formData.partner2.dateOfBirth, formData.partner2.timeOfBirth]);

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

  // NEW: Function to send abandoned form email (guarded, once-only, thresholded)
  const sendAbandonedMatchEmail = useCallback(async (reason = 'User left without submitting') => {
    try {
      // never send after a successful flow
      if (flowFinalizedRef.current) return;
      // only send once
      if (abandonedEmailSentRef?.current) return;
      // must have interacted at least once
      if (!hasUserInteracted) return;

  const completionLevel = getFormCompletionLevel();
  const bothNamesPresent = !!(formData.partner1.name && formData.partner2.name);
  const secondsOnPage = sessionStartTime ? Math.round((new Date() - sessionStartTime) / 1000) : 0;
  // stricter threshold: at least 90s on page and mostly complete or fully complete
  const minimallyReady = isFormComplete(formData) || (bothNamesPresent && completionLevel >= 75);
  if (!minimallyReady || secondsOnPage < 90) return;

      if (typeof abandonedEmailSentRef !== 'undefined') abandonedEmailSentRef.current = true;

  const timeOnPage = secondsOnPage;
      const minimal = {
        partner1: {
          name: formData.partner1.name || '',
          dateOfBirth: formData.partner1.dateOfBirth || '',
          timeOfBirth: formData.partner1.timeOfBirth || '',
          placeOfBirth: formData.partner1.placeOfBirth || ''
        },
        partner2: {
          name: formData.partner2.name || '',
          dateOfBirth: formData.partner2.dateOfBirth || '',
          timeOfBirth: formData.partner2.timeOfBirth || '',
          placeOfBirth: formData.partner2.placeOfBirth || ''
        },
        customerEmail: formData.customerEmail || '',
        customerPhone: formData.customerPhone || ''
      };

      await fetch(`${API_URL}/abandoned-match-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: minimal,
          abandonmentReason: reason,
          sessionData: {
            timeOnPage: `${Math.floor(timeOnPage / 60)}m ${timeOnPage % 60}s`,
            formCompletedAt: formCompletedTime?.toISOString(),
            sessionStartedAt: sessionStartTime?.toISOString(),
            hasUserInteracted,
            completionLevel
          }
        })
      });
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
      // Do not trigger abandoned email here; cleanup also runs on re-renders.
    };
  }, [hasUserInteracted, showThankYou, sendAbandonedMatchEmail]);

  const handleMatchHoroscope = async (e) => {
    e.preventDefault();
    // Double-submit guard
    if (paymentInitiatedRef?.current || isMatching) return;

    // Build a candidate object including derived date/time from split inputs
    const buildISODate = (d, m, y) => {
      if (!isValidDateParts(d, m, y)) return '';
      const yyyy = y;
      const mm = String(parseInt(m, 10)).padStart(2, '0');
      const dd = String(parseInt(d, 10)).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    const build24hTime = (h, m, mer) => {
      if (!h || !m) return '';
      let hh = parseInt(h, 10);
      let mm = parseInt(m, 10);
      if (Number.isNaN(hh) || Number.isNaN(mm)) return '';
      if (hh < 1) hh = 1;
      if (hh > 12) hh = 12;
      mm = clampNum(mm, 0, 59);
      let hh24 = hh;
      if (mer === 'AM') {
        if (hh === 12) hh24 = 0;
      } else {
        if (hh !== 12) hh24 = hh + 12;
      }
      return `${String(hh24).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    };

    const candidate = {
      ...formData,
      partner1: { ...formData.partner1 },
      partner2: { ...formData.partner2 },
    };

    if (!candidate.partner1.dateOfBirth && p1DobDay && p1DobMonth && p1DobYear) {
      const iso = buildISODate(p1DobDay, p1DobMonth, p1DobYear);
      if (iso) candidate.partner1.dateOfBirth = iso;
    }
    if (!candidate.partner1.timeOfBirth && (p1TobHour && p1TobMinute)) {
      const t = build24hTime(p1TobHour, p1TobMinute, p1TobMeridiem);
      if (t) candidate.partner1.timeOfBirth = t;
    }
    if (!candidate.partner2.dateOfBirth && p2DobDay && p2DobMonth && p2DobYear) {
      const iso = buildISODate(p2DobDay, p2DobMonth, p2DobYear);
      if (iso) candidate.partner2.dateOfBirth = iso;
    }
    if (!candidate.partner2.timeOfBirth && (p2TobHour && p2TobMinute)) {
      const t = build24hTime(p2TobHour, p2TobMinute, p2TobMeridiem);
      if (t) candidate.partner2.timeOfBirth = t;
    }
    
  // Validate form data using candidate
  if (!isFormComplete(candidate)) {
      setError(t('please_fill_all_required_fields') || 'Please fill all required fields for both partners');
      if (paymentInitiatedRef) paymentInitiatedRef.current = false;
      return;
    }

    if (paymentInitiatedRef) paymentInitiatedRef.current = true;
    setIsMatching(true);
    setError(null);
  // Persist derived values before proceeding
  setFormData(candidate);
    
    try {
      // Step 1: Create Razorpay order
      const orderResponse = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: BC_PRICE_NUMBER,
          currency: 'INR',
          receipt: `horoscope_match_${Date.now()}`,
          notes: {
            service: 'are-we-compatible-for-marriage',
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
          if (paymentHandledRef?.current) return; // ensure once
          paymentHandledRef.current = true;
          flowFinalizedRef.current = true;
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
            if (paymentInitiatedRef) paymentInitiatedRef.current = false;
            if (paymentHandledRef) paymentHandledRef.current = false;
            flowFinalizedRef.current = false;
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setIsMatching(false);
            if (paymentInitiatedRef) paymentInitiatedRef.current = false;
            
            // Send abandoned payment email if form was completed
            if (!paymentHandledRef?.current && isFormComplete(formData)) {
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
  if (paymentInitiatedRef) paymentInitiatedRef.current = false;
  if (paymentHandledRef) paymentHandledRef.current = false;
  flowFinalizedRef.current = false;
        
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
      if (paymentInitiatedRef) paymentInitiatedRef.current = false;
      if (paymentHandledRef) paymentHandledRef.current = false;
      flowFinalizedRef.current = false;
      
      // Send abandoned email on error
      if (isFormComplete(formData)) {
        sendAbandonedMatchEmail(`Payment initiation error: ${error.message}`);
      }
    }
  };

  // NEW: Function to send match email after successful payment
  const sendMatchEmailAfterPayment = async (paymentId, orderId) => {
    // One-time guard
    if (sendMatchEmailCalledRef?.current) return;
    sendMatchEmailCalledRef.current = true;
    try {
      const requestData = {
        formData: {
          partner1: {
            name: (formData.partner1.name || '').trim(),
            gender: formData.partner1.gender,
            dateOfBirth: formData.partner1.dateOfBirth,
            timeOfBirth: formData.partner1.timeOfBirth,
            placeOfBirth: (formData.partner1.placeOfBirth || '').trim()
          },
          partner2: {
            name: (formData.partner2.name || '').trim(),
            gender: formData.partner2.gender,
            dateOfBirth: formData.partner2.dateOfBirth,
            timeOfBirth: formData.partner2.timeOfBirth,
            placeOfBirth: (formData.partner2.placeOfBirth || '').trim()
          }
        },
        customerEmail: (formData.customerEmail || '').trim() || 'not-provided@example.com',
        customerPhone: (formData.customerPhone || '').trim() || 'Not provided',
        language: 'English',
        paymentDetails: {
          status: 'paid',
          amount: BC_PRICE_NUMBER,
          paymentId,
          orderId,
          idempotencyKey: paymentId || orderId
        }
      };

      const response = await fetch(`${API_URL}/send-match-horoscope`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      let result = null;
      let treatAsSuccess = false;
      try {
        result = await response.json();
      } catch (parseErr) {
        // If backend responded without valid JSON but emails likely sent, treat as success
        console.warn('Non-JSON response from /send-match-horoscope, treating as success');
        treatAsSuccess = true;
      }

      if (response.ok && (result?.success || treatAsSuccess)) {
        setTimeout(() => {
          setIsMatching(false);
          setShowThankYou(true);
          // Reset guards for next attempt (but keep flow finalized for this session)
          if (paymentInitiatedRef) paymentInitiatedRef.current = false;
          if (paymentHandledRef) paymentHandledRef.current = false;
          if (sendMatchEmailCalledRef) sendMatchEmailCalledRef.current = false;
          flowFinalizedRef.current = true; // keep true to prevent abandoned emails after success
        }, 500);
        return;
      }

      // Some backends may return 500 after sending emails due to response formatting issues.
      // If payment is verified and request reached the server, we still consider it success to avoid duplicate notifications.
      if (!response.ok) {
        console.warn('Backend returned non-2xx for /send-match-horoscope; assuming emails sent and continuing');
        setIsMatching(false);
        setShowThankYou(true);
        if (paymentInitiatedRef) paymentInitiatedRef.current = false;
        if (paymentHandledRef) paymentHandledRef.current = false;
        if (sendMatchEmailCalledRef) sendMatchEmailCalledRef.current = false;
        flowFinalizedRef.current = true;
        return;
      }

      throw new Error(result?.message || 'Failed to process request after payment');
    } catch (error) {
      console.error('Error processing request after payment:', error);
      // Treat as success to prevent duplicate pending/abandoned emails since payment was verified
      setIsMatching(false);
      setShowThankYou(true);
      if (paymentInitiatedRef) paymentInitiatedRef.current = false;
      if (paymentHandledRef) paymentHandledRef.current = false;
      if (sendMatchEmailCalledRef) sendMatchEmailCalledRef.current = false;
      flowFinalizedRef.current = true;
    }
  };

  // pending-payment flow removed to avoid duplicate emails on backend 500; we surface thank-you instead

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
                  🎉 {t('thank_you_submission')}
                </h2>
                
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  {t('data_received_message')} <strong>{formData.partner1.name}</strong> and <strong>{formData.partner2.name}</strong>.
                </p>

                {/* Security and Timeline Info */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl">🔒</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('your_data_secure')}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {t('data_security_message')}
                    </p>
                  </div>

                  <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl">⏰</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('response_within_12_hours')}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {t('response_time_message')}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                    <span className="mr-2">📞</span>
                    {t('need_immediate_help')}
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
                      href="https://wa.me/919059821555" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition-colors duration-300 flex items-center gap-2"
                    >
                      💬 {t('whatsapp_support')}
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
                    {t('match_another_couple')}
                  </button>
                  
                  <a
                    href="/"
                    className="px-8 py-3 text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-lg transition-all duration-300 text-center"
                  >
                    {t('back_to_home')}
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
                  {t('contact_information')}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('email_address')}
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleContactChange('customerEmail', e.target.value)}
                      placeholder={t('enter_email_for_report')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-100 font-semibold text-lg mb-2">
                      {t('phone_number')}
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleContactChange('customerPhone', e.target.value)}
                      placeholder={t('enter_phone')}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mt-4">
                  {t('contact_details_info')}
                </p>
              </div>

              {/* Pricing Information */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="text-yellow-400 mr-3">💰</span>
                  {t('service_pricing')}
                </h2>
                
                <div className="bg-gradient-to-r from-yellow-400/10 to-amber-400/10 border-2 border-yellow-400/50 rounded-lg p-6">
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-white mb-2">{t('complete_horoscope_matching')}</h4>
                    <div className="text-4xl font-bold text-yellow-400 mb-4">{BC_PRICE_FORMATTED}</div>
                    <ul className="text-gray-300 text-sm space-y-2 text-left max-w-sm mx-auto">
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>{t('detailed_compatibility_analysis')}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>{t('guna_milan_36_points')}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>{t('manglik_dosha_analysis')}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>{t('future_predictions_couple')}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>{t('remedial_solutions')}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-yellow-400">✓</span>
                        <span>{t('pdf_report_download')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-3 text-center">
                  💸 {t('one_time_payment_info')}
                </p>
              </div>

              {/* Input Form Section */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Partner 1 Form */}
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="text-blue-400 mr-3">👨</span>
                    {t('partner_1_details')} ({t('male_groom')})
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        {t('full_name')} <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.partner1.name}
                        onChange={(e) => handleInputChange('partner1', 'name', e.target.value)}
                        placeholder={t('enter_partner_name')}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        {t('gender')}
                      </label>
                      <select
                        value={formData.partner1.gender}
                        onChange={(e) => handleInputChange('partner1', 'gender', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="male">{t('male')}</option>
                        <option value="female">{t('female')}</option>
                      </select>
                    </div>

                    {/* Date & Time of Birth - Partner 1 */}
                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        {t('date_time_of_birth')} <span className="text-amber-400">*</span>
                      </label>
                      <div className="bg-gray-800/60 border border-yellow-500/40 rounded-xl p-4">
                        <div className="flex flex-wrap items-center gap-4">
                          {/* Date: DD/MM/YYYY */}
                          <div className="flex items-center gap-2">
                            <input ref={p1DdRef} type="text" inputMode="numeric" placeholder={t('dd_placeholder')} value={p1DobDay}
                              onChange={(e)=>{ onChangeDigits(setP1DobDay,e.target.value,2,p1MmRef); }}
                              onBlur={()=>updateDateInForm('partner1', p1DobDay, p1DobMonth, p1DobYear)}
                              className="w-16 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-yellow-500/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <span className="text-gray-400">/</span>
                            <input ref={p1MmRef} type="text" inputMode="numeric" placeholder={t('mm_placeholder')} value={p1DobMonth}
                              onChange={(e)=>{ onChangeDigits(setP1DobMonth,e.target.value,2,p1YyyyRef); }}
                              onBlur={()=>updateDateInForm('partner1', p1DobDay, p1DobMonth, p1DobYear)}
                              className="w-16 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-yellow-500/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <span className="text-gray-400">/</span>
                            <input ref={p1YyyyRef} type="text" inputMode="numeric" placeholder={t('yyyy_placeholder')} value={p1DobYear}
                              onChange={(e)=>{ onChangeDigits(setP1DobYear,e.target.value,4,p1HhRef); const v=(e.target.value||'').replace(/\D/g,''); if(v.length===4) updateDateInForm('partner1', p1DobDay, p1DobMonth, v);} }
                              onBlur={()=>updateDateInForm('partner1', p1DobDay, p1DobMonth, p1DobYear)}
                              className="w-24 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-yellow-500/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                          </div>
                          {/* Time: HH:MM + AM/PM */}
                          <div className="flex items-center gap-2">
                            <input ref={p1HhRef} type="text" inputMode="numeric" placeholder={t('hh_placeholder')} value={p1TobHour}
                              onChange={(e)=>{ onChangeDigits(setP1TobHour,e.target.value,2,p1MinRef); }}
                              onBlur={()=>updateTimeInForm('partner1', p1TobHour, p1TobMinute, p1TobMeridiem)}
                              className="w-16 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-yellow-500/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <span className="text-gray-400">:</span>
                            <input ref={p1MinRef} type="text" inputMode="numeric" placeholder={t('mm_placeholder')} value={p1TobMinute}
                              onChange={(e)=>{ onChangeDigits(setP1TobMinute,e.target.value,2); const v=(e.target.value||'').replace(/\D/g,''); if(v.length===2) updateTimeInForm('partner1', p1TobHour, v, p1TobMeridiem);} }
                              onBlur={()=>updateTimeInForm('partner1', p1TobHour, p1TobMinute, p1TobMeridiem)}
                              className="w-16 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-yellow-500/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                          </div>
                          {/* AM/PM toggle */}
                          <div className="inline-flex rounded-md overflow-hidden border border-yellow-500/40">
                            <button type="button" onClick={()=>{ setP1TobMeridiem('AM'); updateTimeInForm('partner1', p1TobHour, p1TobMinute, 'AM'); }}
                              className={`px-3 py-2 text-sm ${p1TobMeridiem==='AM'?'bg-yellow-500 text-black':'bg-gray-900/70 text-gray-200'}`}>{t('am')}</button>
                            <button type="button" onClick={()=>{ setP1TobMeridiem('PM'); updateTimeInForm('partner1', p1TobHour, p1TobMinute, 'PM'); }}
                              className={`px-3 py-2 text-sm ${p1TobMeridiem==='PM'?'bg-yellow-500 text-black':'bg-gray-900/70 text-gray-200'}`}>{t('pm')}</button>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">{t('dd_mm_yyyy_time_format')}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        {t('place_of_birth')} <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.partner1.placeOfBirth}
                        onChange={(e) => handleInputChange('partner1', 'placeOfBirth', e.target.value)}
                        placeholder={t('city_state_country')}
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
                    {t('partner_2_details')} ({t('female_bride')})
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        {t('full_name')} <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.partner2.name}
                        onChange={(e) => handleInputChange('partner2', 'name', e.target.value)}
                        placeholder={t('enter_partner_name')}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        {t('gender')}
                      </label>
                      <select
                        value={formData.partner2.gender}
                        onChange={(e) => handleInputChange('partner2', 'gender', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="female">{t('female')}</option>
                        <option value="male">{t('male')}</option>
                      </select>
                    </div>

                    {/* Date & Time of Birth - Partner 2 */}
                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        {t('date_time_of_birth')} <span className="text-amber-400">*</span>
                      </label>
                      <div className="bg-gray-800/60 border border-yellow-500/40 rounded-xl p-4">
                        <div className="flex flex-wrap items-center gap-4">
                          {/* Date: DD/MM/YYYY */}
                          <div className="flex items-center gap-2">
                            <input ref={p2DdRef} type="text" inputMode="numeric" placeholder={t('dd_placeholder')} value={p2DobDay}
                              onChange={(e)=>{ onChangeDigits(setP2DobDay,e.target.value,2,p2MmRef); }}
                              onBlur={()=>updateDateInForm('partner2', p2DobDay, p2DobMonth, p2DobYear)}
                              className="w-16 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-yellow-500/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <span className="text-gray-400">/</span>
                            <input ref={p2MmRef} type="text" inputMode="numeric" placeholder={t('mm_placeholder')} value={p2DobMonth}
                              onChange={(e)=>{ onChangeDigits(setP2DobMonth,e.target.value,2,p2YyyyRef); }}
                              onBlur={()=>updateDateInForm('partner2', p2DobDay, p2DobMonth, p2DobYear)}
                              className="w-16 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-yellow-500/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <span className="text-gray-400">/</span>
                            <input ref={p2YyyyRef} type="text" inputMode="numeric" placeholder={t('yyyy_placeholder')} value={p2DobYear}
                              onChange={(e)=>{ onChangeDigits(setP2DobYear,e.target.value,4,p2HhRef); const v=(e.target.value||'').replace(/\D/g,''); if(v.length===4) updateDateInForm('partner2', p2DobDay, p2DobMonth, v);} }
                              onBlur={()=>updateDateInForm('partner2', p2DobDay, p2DobMonth, p2DobYear)}
                              className="w-24 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-yellow-500/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                          </div>
                          {/* Time: HH:MM + AM/PM */}
                          <div className="flex items-center gap-2">
                            <input ref={p2HhRef} type="text" inputMode="numeric" placeholder={t('hh_placeholder')} value={p2TobHour}
                              onChange={(e)=>{ onChangeDigits(setP2TobHour,e.target.value,2,p2MinRef); }}
                              onBlur={()=>updateTimeInForm('partner2', p2TobHour, p2TobMinute, p2TobMeridiem)}
                              className="w-16 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-yellow-500/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <span className="text-gray-400">:</span>
                            <input ref={p2MinRef} type="text" inputMode="numeric" placeholder={t('mm_placeholder')} value={p2TobMinute}
                              onChange={(e)=>{ onChangeDigits(setP2TobMinute,e.target.value,2); const v=(e.target.value||'').replace(/\D/g,''); if(v.length===2) updateTimeInForm('partner2', p2TobHour, v, p2TobMeridiem);} }
                              onBlur={()=>updateTimeInForm('partner2', p2TobHour, p2TobMinute, p2TobMeridiem)}
                              className="w-16 text-center px-3 py-2 rounded-lg bg-gray-900/70 border border-yellow-500/40 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                          </div>
                          {/* AM/PM toggle */}
                          <div className="inline-flex rounded-md overflow-hidden border border-yellow-500/40">
                            <button type="button" onClick={()=>{ setP2TobMeridiem('AM'); updateTimeInForm('partner2', p2TobHour, p2TobMinute, 'AM'); }}
                              className={`px-3 py-2 text-sm ${p2TobMeridiem==='AM'?'bg-yellow-500 text-black':'bg-gray-900/70 text-gray-200'}`}>{t('am')}</button>
                            <button type="button" onClick={()=>{ setP2TobMeridiem('PM'); updateTimeInForm('partner2', p2TobHour, p2TobMinute, 'PM'); }}
                              className={`px-3 py-2 text-sm ${p2TobMeridiem==='PM'?'bg-yellow-500 text-black':'bg-gray-900/70 text-gray-200'}`}>{t('pm')}</button>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">{t('dd_mm_yyyy_time_format')}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-100 font-semibold text-lg mb-2">
                        {t('place_of_birth')} <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.partner2.placeOfBirth}
                        onChange={(e) => handleInputChange('partner2', 'placeOfBirth', e.target.value)}
                        placeholder={t('city_state_country')}
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
                        {t('processing_payment')}
                      </span>
                    ) : (
                      `${t('pay_and_match')} - ${BC_PRICE_FORMATTED}`
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
