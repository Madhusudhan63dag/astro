import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getRawPrice, getFormattedPrice, PRICE_KEYS } from '../config/prices';
import API_CONFIG from './api';

const API_URL = API_CONFIG.API_URL;

function clamp(n, min, max) {
  const x = Number.isFinite(+n) ? +n : 0;
  return Math.min(Math.max(x, min), max);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    const base = src.split('?');
    if (document.querySelector(`script[src^="${base}"]`)) return resolve(true);
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(s);
  });
}

async function loadRazorpayScript() {
  return loadScriptOnce('https://checkout.razorpay.com/v1/checkout.js');
}

const isFormValid = (formData) => {
  const { name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth } = formData;
  
  const hasName = name && name.trim().length >= 2;
  const hasEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const hasPhone = phone && /^\+?[\d\s\-()]{10,}$/.test(phone.trim());
  const hasDateOfBirth = dateOfBirth && dateOfBirth.length === 10;
  const hasTimeOfBirth = timeOfBirth && timeOfBirth.length === 5;
  const hasPlaceOfBirth = placeOfBirth && placeOfBirth.trim().length >= 2;
  
  return hasName && hasEmail && hasPhone && hasDateOfBirth && hasTimeOfBirth && hasPlaceOfBirth;
};

const DateTimeOfBirthInput = ({ value, onChange }) => {
  const { t } = useTranslation();
  const initial = useMemo(() => {
    const [yy, mm, dd] = (value?.dateOfBirth || '').split('-');
    const [HH = '', MM = ''] = (value?.timeOfBirth || '').split(':');
    let hour12 = '';
    let ap = 'AM';
    if (HH !== '') {
      const H = parseInt(HH, 10);
      ap = H >= 12 ? 'PM' : 'AM';
      const h12 = H % 12 || 12;
      hour12 = String(h12);
    }
    return { dd: dd || '', mm: mm || '', yyyy: yy || '', hh: hour12, min: MM || '', ap };
  }, [value?.dateOfBirth, value?.timeOfBirth]);

  const [dd, setDD] = useState(initial.dd);
  const [mm, setMM] = useState(initial.mm);
  const [yyyy, setYYYY] = useState(initial.yyyy);
  const [hh, setHH12] = useState(initial.hh);
  const [mins, setMins] = useState(initial.min);
  const [ap, setAP] = useState(initial.ap);

  const dRef = useRef(null);
  const mRef = useRef(null);
  const yRef = useRef(null);
  const hRef = useRef(null);
  const iRef = useRef(null);

  useEffect(() => {
    const year = yyyy.padStart(4, '0');
    const month = mm.padStart(2, '0');
    const day = dd.padStart(2, '0');
    const rawH = parseInt(hh || '0', 10);
    const rawM = parseInt(mins || '0', 10);
    const clampedH12 = clamp(rawH, 1, 12);
    const clampedM = clamp(rawM, 0, 59);
    let H24 = clampedH12 % 12;
    if (ap === 'PM') H24 += 12;
    const HH = pad2(H24);
    const MM = pad2(clampedM);
    const dateStr = yyyy && mm && dd ? `${year}-${month}-${day}` : '';
    const timeStr = hh && mins ? `${HH}:${MM}` : '';
    onChange?.({ dateOfBirth: dateStr, timeOfBirth: timeStr });
  }, [dd, mm, yyyy, hh, mins, ap, onChange]);

  const onDD = (e) => {
    const v = e.target.value.replace(/\D+/g, '').slice(0, 2);
    const n = clamp(v === '' ? '' : +v, 1, 31);
    const s = v === '' ? '' : String(n);
    setDD(s);
    if (s.length === 2) mRef.current?.focus();
  };

  const onMM = (e) => {
    const v = e.target.value.replace(/\D+/g, '').slice(0, 2);
    const n = clamp(v === '' ? '' : +v, 1, 12);
    const s = v === '' ? '' : String(n);
    setMM(s);
    if (s.length === 2) yRef.current?.focus();
  };

  const onYYYY = (e) => {
    const v = e.target.value.replace(/\D+/g, '').slice(0, 4);
    setYYYY(v);
    if (v.length === 4) hRef.current?.focus();
  };

  const onHH = (e) => {
    const v = e.target.value.replace(/\D+/g, '').slice(0, 2);
    const n = clamp(v === '' ? '' : +v, 1, 12);
    const s = v === '' ? '' : String(n);
    setHH12(s);
    if (s.length === 2) iRef.current?.focus();
  };

  const onMin = (e) => {
    const v = e.target.value.replace(/\D+/g, '').slice(0, 2);
    const n = clamp(v === '' ? '' : +v, 0, 59);
    const s = v === '' ? '' : String(n);
    setMins(s);
  };

  return (
    <fieldset
      className="rounded-2xl border-2 border-cyan-500/30 bg-slate-800/40 p-6 shadow-sm"
      aria-labelledby="dob_heading"
      role="group"
    >
      <div className="grid grid-cols-1 gap-4 md:flex md:items-center md:gap-6">
        <div className="md:min-w-[200px]">
          <div id="dob_heading" className="text-white font-semibold text-base tracking-wide flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {t('time_and_place_title', { defaultValue: 'Date & Time of Birth' })}
          </div>
        </div>
        
        <div className="grid w-full gap-4 sm:grid-cols-2 md:flex md:items-center md:gap-4">
          <div className="grid grid-cols-3 gap-3 sm:max-w-[320px] md:max-w-none">
            <input
              ref={dRef}
              value={dd}
              onChange={onDD}
              placeholder="DD"
              inputMode="numeric"
              aria-label="Day"
              className="h-12 min-h-[44px] rounded-xl border-2 border-slate-600 bg-slate-700/50 px-3 text-white text-base text-center focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
            />
            <input
              ref={mRef}
              value={mm}
              onChange={onMM}
              placeholder="MM"
              inputMode="numeric"
              aria-label="Month"
              className="h-12 min-h-[44px] rounded-xl border-2 border-slate-600 bg-slate-700/50 px-3 text-white text-base text-center focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
            />
            <input
              ref={yRef}
              value={yyyy}
              onChange={onYYYY}
              placeholder="YYYY"
              inputMode="numeric"
              aria-label="Year"
              className="h-12 min-h-[44px] rounded-xl border-2 border-slate-600 bg-slate-700/50 px-3 text-white text-base text-center focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:max-w-[220px] md:max-w-none">
            <input
              ref={hRef}
              value={hh}
              onChange={onHH}
              placeholder="HH"
              inputMode="numeric"
              aria-label="Hour (1-12)"
              className="h-12 min-h-[44px] rounded-xl border-2 border-slate-600 bg-slate-700/50 px-3 text-white text-base text-center focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
            />
            <input
              ref={iRef}
              value={mins}
              onChange={onMin}
              placeholder="MM"
              inputMode="numeric"
              aria-label="Minutes"
              className="h-12 min-h-[44px] rounded-xl border-2 border-slate-600 bg-slate-700/50 px-3 text-white text-base text-center focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="ap"
                value="AM"
                checked={ap === 'AM'}
                onChange={() => setAP('AM')}
                className="h-4 w-4 accent-cyan-500"
              />
              <span className="text-white text-sm font-medium">AM</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="ap"
                value="PM"
                checked={ap === 'PM'}
                onChange={() => setAP('PM')}
                className="h-4 w-4 accent-cyan-500"
              />
              <span className="text-white text-sm font-medium">PM</span>
            </label>
          </div>
        </div>
      </div>
      <style>{`
        input::placeholder { color: #94a3b8; opacity: 1; }
      `}</style>
    </fieldset>
  );
};

const BrandNeutralKundli = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const PRICE_NUMBER = getRawPrice(PRICE_KEYS.kundli);
  const PRICE_FORMATTED = getFormattedPrice(PRICE_KEYS.kundli);

  // ✅ ADD: Price options and selection
  const PRICE_OPTIONS = [149, 199, 249, 299, 349, 399, 449, 499, 549, 599];
  const [selectedAmount, setSelectedAmount] = useState(PRICE_OPTIONS[0]);

  const formRef = useRef(null);
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

  const [error, setError] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const [pendingEmailSent, setPendingEmailSent] = useState(false);
  const [formCompletionTimeout, setFormCompletionTimeout] = useState(null);
  const sessionStartTime = useRef(Date.now());

  const isFormComplete = useMemo(() => isFormValid(formData), [formData]);

  const hasSignificantFormData = useCallback(() => {
    const { name, email, phone, dateOfBirth, placeOfBirth } = formData;
    return name.trim() || email.trim() || phone.trim() || dateOfBirth || placeOfBirth.trim();
  }, [formData]);

  // ✅ CHANGE: Use selectedAmount instead of PRICE_NUMBER
  const sendPendingPaymentNotification = useCallback(async () => {
    if (pendingEmailSent || !hasSignificantFormData()) return;

    try {
      const payload = {
        name: formData.name || 'Anonymous User',
        email: formData.email || 'not-provided@email.com',
        phone: formData.phone || 'Not provided',
        service: 'kundli',
        amount: selectedAmount, // ✅ FIXED
        birthDetails: {
          dateOfBirth: formData.dateOfBirth,
          timeOfBirth: formData.timeOfBirth,
          placeOfBirth: formData.placeOfBirth,
          gender: formData.gender
        },
        language: formData.language,
        paymentDetails: {
          status: 'pending',
          amount: selectedAmount, // ✅ FIXED
          orderId: `pending_${Date.now()}`,
          sessionStartTime: sessionStartTime.current,
          formAbandonedAt: Date.now()
        }
      };

      await fetch(`${API_URL}/abandoned-payment-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setPendingEmailSent(true);
      console.log('Pending payment notification sent');
    } catch (error) {
      console.error('Failed to send pending payment notification:', error);
    }
  }, [formData, hasSignificantFormData, pendingEmailSent, selectedAmount]); // ✅ Added selectedAmount to deps

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (!formStarted && value.trim()) {
      setFormStarted(true);
    }

    if (formCompletionTimeout) {
      clearTimeout(formCompletionTimeout);
    }

    const timeout = setTimeout(() => {
      if (hasSignificantFormData() && !isPaying) {
        sendPendingPaymentNotification();
      }
    }, 5 * 60 * 1000);

    setFormCompletionTimeout(timeout);
  }, [formStarted, formCompletionTimeout, hasSignificantFormData, isPaying, sendPendingPaymentNotification]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && formStarted && hasSignificantFormData() && !pendingEmailSent && !isPaying) {
        setTimeout(() => {
          if (document.hidden && !pendingEmailSent && !isPaying) {
            sendPendingPaymentNotification();
          }
        }, 2 * 60 * 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [formStarted, hasSignificantFormData, pendingEmailSent, isPaying, sendPendingPaymentNotification]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formStarted && hasSignificantFormData() && !pendingEmailSent && !isPaying) {
        sendPendingPaymentNotification();
        
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formStarted, hasSignificantFormData, pendingEmailSent, isPaying, sendPendingPaymentNotification]);

  useEffect(() => {
    return () => {
      if (formCompletionTimeout) {
        clearTimeout(formCompletionTimeout);
      }
    };
  }, [formCompletionTimeout]);

  function updateDOBTime({ dateOfBirth, timeOfBirth }) {
    setFormData((prev) => {
      const newData = { ...prev, dateOfBirth, timeOfBirth };
      
      if ((dateOfBirth || timeOfBirth) && !formStarted) {
        setFormStarted(true);
      }
      
      return newData;
    });

    if (formCompletionTimeout) {
      clearTimeout(formCompletionTimeout);
    }

    const timeout = setTimeout(() => {
      if (hasSignificantFormData() && !isPaying) {
        sendPendingPaymentNotification();
      }
    }, 5 * 60 * 1000);

    setFormCompletionTimeout(timeout);
  }

  const onChange = useCallback((e) => {
    handleFormChange(e);
  }, [handleFormChange]);

  async function handlePay(e) {
    e.preventDefault();
    
    if (!isFormComplete) {
      setError(t('please_complete_all_fields', { defaultValue: 'Please complete all required fields correctly.' }));
      return;
    }
    
    if (formCompletionTimeout) {
      clearTimeout(formCompletionTimeout);
      setFormCompletionTimeout(null);
    }

    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const phoneOk = /^\+?[\d\s\-()]{10,}$/.test(formData.phone);

    if (!emailOk) return setError(t('invalid_email_format', { defaultValue: 'Please enter a valid email address.' }));
    if (!phoneOk) return setError(t('invalid_phone_format', { defaultValue: 'Please enter a valid phone number.' }));

    setError(null);
    setIsPaying(true);

    try {
      // ✅ CHANGE: Use selectedAmount * 100 for Razorpay (paise)
      const orderRes = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedAmount, // ✅ FIXED
          currency: 'INR',
          receipt: `kundli_${Date.now()}`,
          notes: {
            service: 'kundli',
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone
          }
        })
      });

      if (!orderRes.ok) throw new Error(t('failed_to_create_order', { defaultValue: 'Failed to create order' }));
      const orderData = await orderRes.json();

      if (!orderData?.success)
        throw new Error(orderData?.message || t('failed_to_create_payment_order', { defaultValue: 'Failed to create payment order' }));

      await loadRazorpayScript();

      const key = orderData?.key ?? orderData?.key_id ?? orderData?.keyId ?? orderData?.razorpayKeyId;
      const order = orderData?.order ?? orderData;
      const orderId = order?.id ?? order?.order_id;
      const amount = order?.amount;
      const currency = order?.currency ?? 'INR';

      if (!key || !orderId || typeof amount !== 'number') throw new Error('Missing payment key/order info');

      const rzp = new window.Razorpay({
        key,
        order_id: orderId,
        amount,
        currency,
        name: 'SriAstroVeda',
        description: t('complete_kundli_report', { defaultValue: 'Complete Kundli Report' }),
        image: '/logo192.png',
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: '#06B6D4' },
        handler: async (paymentData) => {
          try {
            const verifyRes = await fetch(`${API_URL}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentData.razorpay_order_id,
                razorpay_payment_id: paymentData.razorpay_payment_id,
                razorpay_signature: paymentData.razorpay_signature
              })
            });

            const verify = await verifyRes.json();
            if (!verify?.success) throw new Error(verify?.message || 'Payment verification failed');

            // ✅ CHANGE: Use selectedAmount
            const payload = {
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
              additionalInfo:
                t('complete_career_guidance_request', { defaultValue: 'Complete Career Path Guidance (Kundli) Analysis Request' }) ||
                'Complete Career Path Guidance (Kundli) Analysis Request',
              paymentDetails: {
                status: 'paid',
                amount: selectedAmount, // ✅ FIXED
                paymentId: paymentData.razorpay_payment_id,
                orderId: paymentData.razorpay_order_id
              }
            };

            fetch(`${API_URL}/send-astro-email`, { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify(payload) 
            }).catch(() => {});

            // ✅ CHANGE: Use selectedAmount
            const analysisData = {
              orderId: paymentData.razorpay_order_id,
              paymentId: paymentData.razorpay_payment_id,
              requestId: paymentData.razorpay_order_id,
              service: t('birth_chart_analysis', { defaultValue: 'Personalized Astrology Report' }),
              amount: `₹${selectedAmount}`, // ✅ FIXED
              status: 'completed',
              customerName: formData.name,
              customerEmail: formData.email,
              serviceFeatures: [
                t('detailed_career_guidance_pdf', { defaultValue: 'Detailed Career Path Guidance (PDF)' }),
                t('comprehensive_astrological_analysis', { defaultValue: 'Comprehensive Astrological Analysis' }),
                t('dasha_system_predictions_feature', { defaultValue: 'Dasha System Predictions' }),
                t('personalized_remedial_suggestions_feature', { defaultValue: 'Personalized Remedial Suggestions' })
              ]
            };

            sessionStorage.setItem('paymentSuccess', JSON.stringify(analysisData));
            
            navigate('/thank-you');

          } catch (err) {
            setError(
              (t('failed_to_process_astrology_request', { defaultValue: 'Failed to process astrology service request' }) + `: ${err.message}`) ||
                `Failed to process astrology service request: ${err.message}`
            );
          } finally {
            setIsPaying(false);
          }
        },
        modal: { ondismiss: () => setIsPaying(false) },
        timeout: 300
      });

      rzp.on('payment.failed', () => {
        setIsPaying(false);
        setError(t('payment_failed_message', { defaultValue: 'Payment failed. Please try again or contact support.' }));
      });

      rzp.open();
    } catch (err) {
      setIsPaying(false);
      setError(err.message || t('failed_to_initialize_payment', { defaultValue: 'Failed to initialize payment' }));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 py-10 px-0 md:px-3 lg:px-3">
      <div className=" space-y-12">
        
        <section id="pay" className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/15 rounded-3xl p-8 sm:p-10 shadow-2xl">

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/50 border border-red-500/50 text-red-200 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form ref={formRef} onSubmit={handlePay} className="space-y-6">
            {/* Personal Details Section */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white block font-medium mb-2">
                    {t('full_name', { defaultValue: 'Full Name' })}
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={onChange}
                    placeholder={t('enter_complete_name', { defaultValue: 'Enter your complete name' })}
                    className={`w-full h-12 min-h-[44px] rounded-xl bg-slate-700/50 border-2 text-white placeholder-slate-400 px-4 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all ${
                      formData.name.trim().length >= 2 ? 'border-green-500/50' : 'border-slate-600'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="text-white block font-medium mb-2">{t('gender', { defaultValue: 'Gender' })}</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={onChange}
                    autoComplete="sex"
                    className="w-full h-12 min-h-[44px] rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white px-4 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all"
                  >
                    <option value="male">{t('male', { defaultValue: 'Male' })}</option>
                    <option value="female">{t('female', { defaultValue: 'Female' })}</option>
                    <option value="other">{t('other', { defaultValue: 'Other' })}</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-white block font-medium mb-2">
                    {t('email_address', { defaultValue: 'Email Address' })}
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder={t('email_placeholder', { defaultValue: 'your@email.com' })}
                    className={`w-full h-12 min-h-[44px] rounded-xl bg-slate-700/50 border-2 text-white placeholder-slate-400 px-4 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all ${
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'border-green-500/50' : 'border-slate-600'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="text-white block font-medium mb-2">
                    {t('phone_number', { defaultValue: 'Phone Number' })}
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={onChange}
                    placeholder={t('phone_placeholder', { defaultValue: '+91 9876543210' })}
                    className={`w-full h-12 min-h-[44px] rounded-xl bg-slate-700/50 border-2 text-white placeholder-slate-400 px-4 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all ${
                      /^\+?[\d\s\-()]{10,}$/.test(formData.phone) ? 'border-green-500/50' : 'border-slate-600'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Birth Details Section */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                Birth Details
                <span className="text-red-400 text-sm">* Required</span>
              </h3>
              
              <div className="space-y-6">
                <DateTimeOfBirthInput 
                  value={{ dateOfBirth: formData.dateOfBirth, timeOfBirth: formData.timeOfBirth }} 
                  onChange={updateDOBTime} 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white block font-medium mb-2">
                      {t('birth_place', { defaultValue: 'Birth Place' })}
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="placeOfBirth"
                      required
                      autoComplete="address-level2"
                      value={formData.placeOfBirth}
                      onChange={onChange}
                      placeholder={t('city_state_country', { defaultValue: 'City, State, Country' })}
                      className={`w-full h-12 min-h-[44px] rounded-xl bg-slate-700/50 border-2 text-white placeholder-slate-400 px-4 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all ${
                        formData.placeOfBirth.trim().length >= 2 ? 'border-green-500/50' : 'border-slate-600'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className="text-white block font-medium mb-2">{t('preferred_language', { defaultValue: 'Preferred Language' })}</label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={onChange}
                      className="w-full h-12 min-h-[44px] rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white px-4 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all"
                    >
                      <option value="en">{t('english', { defaultValue: 'English' })}</option>
                      <option value="hi">{t('hindi', { defaultValue: 'हिंदी' })}</option>
                      <option value="te">{t('telugu', { defaultValue: 'తెలుగు' })}</option>
                      <option value="kn">{t('kannada', { defaultValue: 'ಕನ್ನಡ' })}</option>
                      <option value="ta">{t('tamil', { defaultValue: 'தமிழ்' })}</option>
                      <option value="mr">{t('marathi', { defaultValue: 'मराठी' })}</option>
                      <option value="bn">{t('bengali', { defaultValue: 'বাংলা' })}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ NEW: Price Selection Section */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                Select Your Offering Amount
                <span className="text-red-400 text-sm">* Required</span>
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {PRICE_OPTIONS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedAmount(amount)}
                    className={`px-4 py-3 rounded-xl text-base font-bold border-2 transition-all duration-200 ${
                      selectedAmount === amount
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-400 shadow-lg shadow-orange-500/25 scale-105'
                        : 'bg-slate-800/50 text-slate-200 border-slate-600 hover:border-orange-400 hover:text-white hover:scale-105'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              
              <p className="mt-4 text-slate-400 text-sm">
                💝 Your contribution supports our Goshala and spiritual services
              </p>
            </div>

            {/* Enhanced Price Summary */}
            <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-2 border-orange-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between flex-col md:flex-row lg:flex-row gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{t('career_path_analysis', { defaultValue: 'Complete Life Analysis Report' })}</h4>
                    <p className="text-slate-300 text-sm">• Digital PDF • 24-hour delivery</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                      ₹{selectedAmount}
                    </span>
                  </div>
                  <div className="text-green-400 text-sm font-medium">Flexible donation amount</div>
                </div>
              </div>
            </div>
            
            <a href="/GoshalaCharitySection" className="text-cyan-400 hover:text-cyan-300 block font-medium text-lg transition-colors">
              Learn more about our Goshala Seva →
            </a>

            {!isFormComplete && (
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-amber-300 text-sm">
                    Please complete all required fields to proceed with payment
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormComplete || isPaying}
              className={`w-full h-14 rounded-xl font-bold text-white text-lg shadow-xl transition-all duration-300 focus:outline-none flex items-center justify-center gap-3 ${
                isFormComplete && !isPaying
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-2xl hover:shadow-orange-500/25 hover:scale-[1.02] cursor-pointer'
                  : 'bg-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              {isPaying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('processing_payment', { defaultValue: 'Processing Payment...' })}
                </>
              ) : isFormComplete ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  {t('complete_payment_get_report', { defaultValue: 'Complete Payment & Get Report' })}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Complete All Fields to Continue
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secured by 256-bit SSL encryption • Your data is protected</span>
            </div>
          </form>

          {isPaying && (
            <div
              className="fixed inset-0 z-[21] bg-black/60 backdrop-blur-sm flex items-center justify-center"
              aria-busy="true"
              role="progressbar"
              aria-label="Processing payment"
            >
              <div className="bg-slate-900/90 rounded-2xl p-8 border border-cyan-500/30 flex flex-col items-center gap-4 max-w-sm mx-4">
                <div
                  className="h-12 w-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin"
                  style={{ animationDuration: '800ms' }}
                />
                <div className="text-center">
                  <p className="text-white font-semibold mb-1">
                    {t('processing_payment', { defaultValue: 'Processing Payment...' })}
                  </p>
                  <p className="text-slate-400 text-sm">Please wait while we secure your transaction</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BrandNeutralKundli;



// import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import { getRawPrice, getFormattedPrice, PRICE_KEYS } from '../config/prices';
// import API_CONFIG from './api';
// // import services from '../assets/services.webp';

// const API_URL = API_CONFIG.API_URL;

// function clamp(n, min, max) {
//   const x = Number.isFinite(+n) ? +n : 0;
//   return Math.min(Math.max(x, min), max);
// }

// function pad2(n) {
//   return String(n).padStart(2, '0');
// }

// /* Load script once */
// function loadScriptOnce(src) {
//   return new Promise((resolve, reject) => {
//     const base = src.split('?');
//     if (document.querySelector(`script[src^="${base}"]`)) return resolve(true);
//     const s = document.createElement('script');
//     s.src = src;
//     s.async = true;
//     s.defer = true;
//     s.onload = () => resolve(true);
//     s.onerror = () => reject(new Error(`Failed to load: ${src}`));
//     document.head.appendChild(s);
//   });
// }

// async function loadRazorpayScript() {
//   return loadScriptOnce('https://checkout.razorpay.com/v1/checkout.js');
// }

// // NEW: Form validation function
// const isFormValid = (formData) => {
//   const { name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth } = formData;
  
//   // Check if all required fields are filled
//   const hasName = name && name.trim().length >= 2;
//   const hasEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
//   const hasPhone = phone && /^\+?[\d\s\-()]{10,}$/.test(phone.trim());
//   const hasDateOfBirth = dateOfBirth && dateOfBirth.length === 10; // YYYY-MM-DD format
//   const hasTimeOfBirth = timeOfBirth && timeOfBirth.length === 5; // HH:MM format
//   const hasPlaceOfBirth = placeOfBirth && placeOfBirth.trim().length >= 2;
  
//   return hasName && hasEmail && hasPhone && hasDateOfBirth && hasTimeOfBirth && hasPlaceOfBirth;
// };


// /* Responsive Date & Time input */
// const DateTimeOfBirthInput = ({ value, onChange }) => {
//   const { t } = useTranslation();
//   const initial = useMemo(() => {
//     const [yy, mm, dd] = (value?.dateOfBirth || '').split('-');
//     const [HH = '', MM = ''] = (value?.timeOfBirth || '').split(':');
//     let hour12 = '';
//     let ap = 'AM';
//     if (HH !== '') {
//       const H = parseInt(HH, 10);
//       ap = H >= 12 ? 'PM' : 'AM';
//       const h12 = H % 12 || 12;
//       hour12 = String(h12);
//     }
//     return { dd: dd || '', mm: mm || '', yyyy: yy || '', hh: hour12, min: MM || '', ap };
//   }, [value?.dateOfBirth, value?.timeOfBirth]);

//   const [dd, setDD] = useState(initial.dd);
//   const [mm, setMM] = useState(initial.mm);
//   const [yyyy, setYYYY] = useState(initial.yyyy);
//   const [hh, setHH12] = useState(initial.hh);
//   const [mins, setMins] = useState(initial.min);
//   const [ap, setAP] = useState(initial.ap);

//   const dRef = useRef(null);
//   const mRef = useRef(null);
//   const yRef = useRef(null);
//   const hRef = useRef(null);
//   const iRef = useRef(null);

//   useEffect(() => {
//     const year = yyyy.padStart(4, '0');
//     const month = mm.padStart(2, '0');
//     const day = dd.padStart(2, '0');
//     const rawH = parseInt(hh || '0', 10);
//     const rawM = parseInt(mins || '0', 10);
//     const clampedH12 = clamp(rawH, 1, 12);
//     const clampedM = clamp(rawM, 0, 59);
//     let H24 = clampedH12 % 12;
//     if (ap === 'PM') H24 += 12;
//     const HH = pad2(H24);
//     const MM = pad2(clampedM);
//     const dateStr = yyyy && mm && dd ? `${year}-${month}-${day}` : '';
//     const timeStr = hh && mins ? `${HH}:${MM}` : '';
//     onChange?.({ dateOfBirth: dateStr, timeOfBirth: timeStr });
//   }, [dd, mm, yyyy, hh, mins, ap, onChange]);

//   const onDD = (e) => {
//     const v = e.target.value.replace(/\D+/g, '').slice(0, 2);
//     const n = clamp(v === '' ? '' : +v, 1, 31);
//     const s = v === '' ? '' : String(n);
//     setDD(s);
//     if (s.length === 2) mRef.current?.focus();
//   };

//   const onMM = (e) => {
//     const v = e.target.value.replace(/\D+/g, '').slice(0, 2);
//     const n = clamp(v === '' ? '' : +v, 1, 12);
//     const s = v === '' ? '' : String(n);
//     setMM(s);
//     if (s.length === 2) yRef.current?.focus();
//   };

//   const onYYYY = (e) => {
//     const v = e.target.value.replace(/\D+/g, '').slice(0, 4);
//     setYYYY(v);
//     if (v.length === 4) hRef.current?.focus();
//   };

//   const onHH = (e) => {
//     const v = e.target.value.replace(/\D+/g, '').slice(0, 2);
//     const n = clamp(v === '' ? '' : +v, 1, 12);
//     const s = v === '' ? '' : String(n);
//     setHH12(s);
//     if (s.length === 2) iRef.current?.focus();
//   };

//   const onMin = (e) => {
//     const v = e.target.value.replace(/\D+/g, '').slice(0, 2);
//     const n = clamp(v === '' ? '' : +v, 0, 59);
//     const s = v === '' ? '' : String(n);
//     setMins(s);
//   };

//   return (
//     <fieldset
//       className="rounded-2xl border-2 border-cyan-500/30 bg-slate-800/40 p-6 shadow-sm"
//       aria-labelledby="dob_heading"
//       role="group"
//     >
//       <div className="grid grid-cols-1 gap-4 md:flex md:items-center md:gap-6">
//         <div className="md:min-w-[200px]">
//           <div id="dob_heading" className="text-white font-semibold text-base tracking-wide flex items-center gap-2">
//             <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
//             </svg>
//             {t('time_and_place_title', { defaultValue: 'Date & Time of Birth' })}
//           </div>
//         </div>
        
//         <div className="grid w-full gap-4 sm:grid-cols-2 md:flex md:items-center md:gap-4">
//           <div className="grid grid-cols-3 gap-3 sm:max-w-[320px] md:max-w-none">
//             <input
//               ref={dRef}
//               value={dd}
//               onChange={onDD}
//               placeholder="DD"
//               inputMode="numeric"
//               aria-label="Day"
//               className="h-12 min-h-[44px] rounded-xl border-2 border-slate-600 bg-slate-700/50 px-3 text-white text-base text-center focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
//             />
//             <input
//               ref={mRef}
//               value={mm}
//               onChange={onMM}
//               placeholder="MM"
//               inputMode="numeric"
//               aria-label="Month"
//               className="h-12 min-h-[44px] rounded-xl border-2 border-slate-600 bg-slate-700/50 px-3 text-white text-base text-center focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
//             />
//             <input
//               ref={yRef}
//               value={yyyy}
//               onChange={onYYYY}
//               placeholder="YYYY"
//               inputMode="numeric"
//               aria-label="Year"
//               className="h-12 min-h-[44px] rounded-xl border-2 border-slate-600 bg-slate-700/50 px-3 text-white text-base text-center focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
//             />
//           </div>
          
//           <div className="grid grid-cols-2 gap-3 sm:max-w-[220px] md:max-w-none">
//             <input
//               ref={hRef}
//               value={hh}
//               onChange={onHH}
//               placeholder="HH"
//               inputMode="numeric"
//               aria-label="Hour (1-12)"
//               className="h-12 min-h-[44px] rounded-xl border-2 border-slate-600 bg-slate-700/50 px-3 text-white text-base text-center focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
//             />
//             <input
//               ref={iRef}
//               value={mins}
//               onChange={onMin}
//               placeholder="MM"
//               inputMode="numeric"
//               aria-label="Minutes"
//               className="h-12 min-h-[44px] rounded-xl border-2 border-slate-600 bg-slate-700/50 px-3 text-white text-base text-center focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
//             />
//           </div>
          
//           <div className="flex items-center gap-6">
//             <label className="inline-flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="ap"
//                 value="AM"
//                 checked={ap === 'AM'}
//                 onChange={() => setAP('AM')}
//                 className="h-4 w-4 accent-cyan-500"
//               />
//               <span className="text-white text-sm font-medium">AM</span>
//             </label>
//             <label className="inline-flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="ap"
//                 value="PM"
//                 checked={ap === 'PM'}
//                 onChange={() => setAP('PM')}
//                 className="h-4 w-4 accent-cyan-500"
//               />
//               <span className="text-white text-sm font-medium">PM</span>
//             </label>
//           </div>
//         </div>
//       </div>
//       <style>{`
//         input::placeholder { color: #94a3b8; opacity: 1; }
//       `}</style>
//     </fieldset>
//   );
// };

// const BrandNeutralKundli = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const PRICE_NUMBER = getRawPrice(PRICE_KEYS.kundli);
//   const PRICE_FORMATTED = getFormattedPrice(PRICE_KEYS.kundli);

//   const formRef = useRef(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     gender: 'male',
//     dateOfBirth: '',
//     timeOfBirth: '',
//     placeOfBirth: '',
//     language: 'en',
//     email: '',
//     phone: ''
//   });

//   const [error, setError] = useState(null);
//   const [isPaying, setIsPaying] = useState(false);

//   // NEW: Add state variables for pending payment tracking
//   const [formStarted, setFormStarted] = useState(false);
//   const [pendingEmailSent, setPendingEmailSent] = useState(false);
//   const [formCompletionTimeout, setFormCompletionTimeout] = useState(null);
//   const sessionStartTime = useRef(Date.now());

//   // NEW: Check if form is valid for submission
//   const isFormComplete = useMemo(() => isFormValid(formData), [formData]);

//   // NEW: Check if form has meaningful data
//   const hasSignificantFormData = useCallback(() => {
//     const { name, email, phone, dateOfBirth, placeOfBirth } = formData;
//     return name.trim() || email.trim() || phone.trim() || dateOfBirth || placeOfBirth.trim();
//   }, [formData]);

//   // NEW: Send pending payment notification
//   const sendPendingPaymentNotification = useCallback(async () => {
//     if (pendingEmailSent || !hasSignificantFormData()) return;

//     try {
//       const payload = {
//         name: formData.name || 'Anonymous User',
//         email: formData.email || 'not-provided@email.com',
//         phone: formData.phone || 'Not provided',
//         service: 'kundli',
//         amount: PRICE_NUMBER,
//         birthDetails: {
//           dateOfBirth: formData.dateOfBirth,
//           timeOfBirth: formData.timeOfBirth,
//           placeOfBirth: formData.placeOfBirth,
//           gender: formData.gender
//         },
//         language: formData.language,
//         paymentDetails: {
//           status: 'pending',
//           amount: PRICE_NUMBER,
//           orderId: `pending_${Date.now()}`,
//           sessionStartTime: sessionStartTime.current,
//           formAbandonedAt: Date.now()
//         }
//       };

//       await fetch(`${API_URL}/abandoned-payment-email`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       setPendingEmailSent(true);
//       console.log('Pending payment notification sent');
//     } catch (error) {
//       console.error('Failed to send pending payment notification:', error);
//     }
//   }, [formData, hasSignificantFormData, pendingEmailSent, PRICE_NUMBER]);

//   // NEW: Handle form data changes and set up timeout
//   const handleFormChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     // Mark form as started when user begins typing
//     if (!formStarted && value.trim()) {
//       setFormStarted(true);
//     }

//     // Clear existing timeout and set new one
//     if (formCompletionTimeout) {
//       clearTimeout(formCompletionTimeout);
//     }

//     // Set timeout to send pending email after 5 minutes of inactivity
//     const timeout = setTimeout(() => {
//       if (hasSignificantFormData() && !isPaying) {
//         sendPendingPaymentNotification();
//       }
//     }, 5 * 60 * 1000); // 5 minutes

//     setFormCompletionTimeout(timeout);
//   }, [formStarted, formCompletionTimeout, hasSignificantFormData, isPaying, sendPendingPaymentNotification]);

//   // NEW: Handle page visibility change (when user switches tabs/minimizes)
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden && formStarted && hasSignificantFormData() && !pendingEmailSent && !isPaying) {
//         // User switched away from tab, set shorter timeout
//         setTimeout(() => {
//           if (document.hidden && !pendingEmailSent && !isPaying) {
//             sendPendingPaymentNotification();
//           }
//         }, 2 * 60 * 1000); // 2 minutes after switching away
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
//   }, [formStarted, hasSignificantFormData, pendingEmailSent, isPaying, sendPendingPaymentNotification]);

//   // NEW: Handle before page unload
//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       if (formStarted && hasSignificantFormData() && !pendingEmailSent && !isPaying) {
//         // Send notification immediately before leaving
//         sendPendingPaymentNotification();
        
//         // Show browser warning (optional)
//         e.preventDefault();
//         e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
//         return e.returnValue;
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//   }, [formStarted, hasSignificantFormData, pendingEmailSent, isPaying, sendPendingPaymentNotification]);

//   // NEW: Cleanup timeout on unmount
//   useEffect(() => {
//     return () => {
//       if (formCompletionTimeout) {
//         clearTimeout(formCompletionTimeout);
//       }
//     };
//   }, [formCompletionTimeout]);

//   // MODIFIED: Update date/time change handler
//   function updateDOBTime({ dateOfBirth, timeOfBirth }) {
//     setFormData((prev) => {
//       const newData = { ...prev, dateOfBirth, timeOfBirth };
      
//       // Trigger form change logic for DOB/time changes
//       if ((dateOfBirth || timeOfBirth) && !formStarted) {
//         setFormStarted(true);
//       }
      
//       return newData;
//     });

//     // Set up timeout for DOB changes too
//     if (formCompletionTimeout) {
//       clearTimeout(formCompletionTimeout);
//     }

//     const timeout = setTimeout(() => {
//       if (hasSignificantFormData() && !isPaying) {
//         sendPendingPaymentNotification();
//       }
//     }, 5 * 60 * 1000);

//     setFormCompletionTimeout(timeout);
//   }

//   // MODIFIED: Update onChange function
//   const onChange = useCallback((e) => {
//     handleFormChange(e);
//   }, [handleFormChange]);

//   // MODIFIED: Payment handler with form validation check
//   async function handlePay(e) {
//     e.preventDefault();
    
//     // NEW: Check form validation before proceeding
//     if (!isFormComplete) {
//       setError(t('please_complete_all_fields', { defaultValue: 'Please complete all required fields correctly.' }));
//       return;
//     }
    
//     // Clear pending email timeout since user is proceeding with payment
//     if (formCompletionTimeout) {
//       clearTimeout(formCompletionTimeout);
//       setFormCompletionTimeout(null);
//     }

//     if (formRef.current && !formRef.current.checkValidity()) {
//       formRef.current.reportValidity();
//       return;
//     }

//     const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
//     const phoneOk = /^\+?[\d\s\-()]{10,}$/.test(formData.phone);

//     if (!emailOk) return setError(t('invalid_email_format', { defaultValue: 'Please enter a valid email address.' }));
//     if (!phoneOk) return setError(t('invalid_phone_format', { defaultValue: 'Please enter a valid phone number.' }));

//     setError(null);
//     setIsPaying(true);

//     try {
//       const orderRes = await fetch(`${API_URL}/create-order`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           amount: PRICE_NUMBER,
//           currency: 'INR',
//           receipt: `kundli_${Date.now()}`,
//           notes: {
//             service: 'kundli',
//             customer_name: formData.name,
//             customer_email: formData.email,
//             customer_phone: formData.phone
//           }
//         })
//       });

//       if (!orderRes.ok) throw new Error(t('failed_to_create_order', { defaultValue: 'Failed to create order' }));
//       const orderData = await orderRes.json();

//       if (!orderData?.success)
//         throw new Error(orderData?.message || t('failed_to_create_payment_order', { defaultValue: 'Failed to create payment order' }));

//       await loadRazorpayScript();

//       const key = orderData?.key ?? orderData?.key_id ?? orderData?.keyId ?? orderData?.razorpayKeyId;
//       const order = orderData?.order ?? orderData;
//       const orderId = order?.id ?? order?.order_id;
//       const amount = order?.amount;
//       const currency = order?.currency ?? 'INR';

//       if (!key || !orderId || typeof amount !== 'number') throw new Error('Missing payment key/order info');

//       const rzp = new window.Razorpay({
//         key,
//         order_id: orderId,
//         amount,
//         currency,
//         name: 'SriAstroVeda',
//         description: t('complete_kundli_report', { defaultValue: 'Complete Kundli Report' }),
//         image: '/logo192.png',
//         prefill: { name: formData.name, email: formData.email, contact: formData.phone },
//         theme: { color: '#06B6D4' },
//         handler: async (paymentData) => {
//           try {
//             const verifyRes = await fetch(`${API_URL}/verify-payment`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 razorpay_order_id: paymentData.razorpay_order_id,
//                 razorpay_payment_id: paymentData.razorpay_payment_id,
//                 razorpay_signature: paymentData.razorpay_signature
//               })
//             });

//             const verify = await verifyRes.json();
//             if (!verify?.success) throw new Error(verify?.message || 'Payment verification failed');

//             const payload = {
//               name: formData.name,
//               email: formData.email,
//               phone: formData.phone,
//               service: 'kundli',
//               reportType: 'kundli',
//               birthDetails: {
//                 dateOfBirth: formData.dateOfBirth,
//                 timeOfBirth: formData.timeOfBirth,
//                 placeOfBirth: formData.placeOfBirth,
//                 gender: formData.gender
//               },
//               language: formData.language,
//               additionalInfo:
//                 t('complete_career_guidance_request', { defaultValue: 'Complete Career Path Guidance (Kundli) Analysis Request' }) ||
//                 'Complete Career Path Guidance (Kundli) Analysis Request',
//               paymentDetails: {
//                 status: 'paid',
//                 amount: PRICE_NUMBER,
//                 paymentId: paymentData.razorpay_payment_id,
//                 orderId: paymentData.razorpay_order_id
//               }
//             };

//             // Send email notification
//             fetch(`${API_URL}/send-astro-email`, { 
//               method: 'POST', 
//               headers: { 'Content-Type': 'application/json' }, 
//               body: JSON.stringify(payload) 
//             }).catch(() => {});

//             // Store payment data in sessionStorage for thank you page
//             const analysisData = {
//               orderId: paymentData.razorpay_order_id,
//               paymentId: paymentData.razorpay_payment_id,
//               requestId: paymentData.razorpay_order_id,
//               service: t('birth_chart_analysis', { defaultValue: 'Personalized Astrology Report' }),
//               amount: PRICE_FORMATTED,
//               status: 'completed',
//               customerName: formData.name,
//               customerEmail: formData.email,
//               serviceFeatures: [
//                 t('detailed_career_guidance_pdf', { defaultValue: 'Detailed Career Path Guidance (PDF)' }),
//                 t('comprehensive_astrological_analysis', { defaultValue: 'Comprehensive Astrological Analysis' }),
//                 t('dasha_system_predictions_feature', { defaultValue: 'Dasha System Predictions' }),
//                 t('personalized_remedial_suggestions_feature', { defaultValue: 'Personalized Remedial Suggestions' })
//               ]
//             };

//             sessionStorage.setItem('paymentSuccess', JSON.stringify(analysisData));
            
//             // Redirect to thank you page
//             navigate('/thank-you');

//           } catch (err) {
//             setError(
//               (t('failed_to_process_astrology_request', { defaultValue: 'Failed to process astrology service request' }) + `: ${err.message}`) ||
//                 `Failed to process astrology service request: ${err.message}`
//             );
//           } finally {
//             setIsPaying(false);
//           }
//         },
//         modal: { ondismiss: () => setIsPaying(false) },
//         timeout: 300
//       });

//       rzp.on('payment.failed', () => {
//         setIsPaying(false);
//         setError(t('payment_failed_message', { defaultValue: 'Payment failed. Please try again or contact support.' }));
//       });

//       rzp.open();
//     } catch (err) {
//       setIsPaying(false);
//       setError(err.message || t('failed_to_initialize_payment', { defaultValue: 'Failed to initialize payment' }));
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 py-10 px-0 md:px-3 lg:px-3">
//       <div className=" space-y-12">
//         {/* <AstroFeatureSection /> */}
        
//         <section id="pay" className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/15 rounded-3xl p-8 sm:p-10 shadow-2xl">
//           {/* Header */}
//           {/* <div className="text-center mb-10">
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-4">
//               <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//               <span className="text-orange-300 text-sm font-medium">Limited Time Offer</span>
//             </div>
            
//             <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
//               <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
//                 {t('cosmic_career', { defaultValue: '200+ Page Kundli Report' })}
//               </span>
//             </h1>
//             <h2 className="text-2xl sm:text-3xl font-bold text-slate-300 mb-4">
//               {t('journey', { defaultValue: 'Your Complete Life Analysis' })}
//             </h2>
//             <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
//               {t('discover_professional_destiny', {
//                 defaultValue: 'Personalized Vedic astrology report covering career, relationships, health, and remedies — delivered within 24 hours.'
//               })}
//             </p>
//           </div> */}

//           {/* <WhatYoullGetSection />
//           <ReportFormatSection /> */}

//           {error && (
//             <div className="mb-6 p-4 rounded-xl bg-red-900/50 border border-red-500/50 text-red-200 flex items-center gap-3">
//               <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               {error}
//             </div>
//           )}

//           <form ref={formRef} onSubmit={handlePay} className="space-y-6">
//             {/* Personal Details Section */}
//             <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
//               <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
//                   <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 Personal Details
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="text-white block font-medium mb-2">
//                     {t('full_name', { defaultValue: 'Full Name' })}
//                     <span className="text-red-400 ml-1">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     required
//                     autoComplete="name"
//                     value={formData.name}
//                     onChange={onChange}
//                     placeholder={t('enter_complete_name', { defaultValue: 'Enter your complete name' })}
//                     className={`w-full h-12 min-h-[44px] rounded-xl bg-slate-700/50 border-2 text-white placeholder-slate-400 px-4 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all ${
//                       formData.name.trim().length >= 2 ? 'border-green-500/50' : 'border-slate-600'
//                     }`}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="text-white block font-medium mb-2">{t('gender', { defaultValue: 'Gender' })}</label>
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={onChange}
//                     autoComplete="sex"
//                     className="w-full h-12 min-h-[44px] rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white px-4 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all"
//                   >
//                     <option value="male">{t('male', { defaultValue: 'Male' })}</option>
//                     <option value="female">{t('female', { defaultValue: 'Female' })}</option>
//                     <option value="other">{t('other', { defaultValue: 'Other' })}</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="text-white block font-medium mb-2">
//                     {t('email_address', { defaultValue: 'Email Address' })}
//                     <span className="text-red-400 ml-1">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     required
//                     autoComplete="email"
//                     value={formData.email}
//                     onChange={onChange}
//                     placeholder={t('email_placeholder', { defaultValue: 'your@email.com' })}
//                     className={`w-full h-12 min-h-[44px] rounded-xl bg-slate-700/50 border-2 text-white placeholder-slate-400 px-4 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all ${
//                       /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'border-green-500/50' : 'border-slate-600'
//                     }`}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="text-white block font-medium mb-2">
//                     {t('phone_number', { defaultValue: 'Phone Number' })}
//                     <span className="text-red-400 ml-1">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     required
//                     inputMode="tel"
//                     autoComplete="tel"
//                     value={formData.phone}
//                     onChange={onChange}
//                     placeholder={t('phone_placeholder', { defaultValue: '+91 9876543210' })}
//                     className={`w-full h-12 min-h-[44px] rounded-xl bg-slate-700/50 border-2 text-white placeholder-slate-400 px-4 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all ${
//                       /^\+?[\d\s\-()]{10,}$/.test(formData.phone) ? 'border-green-500/50' : 'border-slate-600'
//                     }`}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Birth Details Section */}
//             <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
//               <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
//                   <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 Birth Details
//                 <span className="text-red-400 text-sm">* Required</span>
//               </h3>
              
//               <div className="space-y-6">
//                 <DateTimeOfBirthInput 
//                   value={{ dateOfBirth: formData.dateOfBirth, timeOfBirth: formData.timeOfBirth }} 
//                   onChange={updateDOBTime} 
//                 />
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="text-white block font-medium mb-2">
//                       {t('birth_place', { defaultValue: 'Birth Place' })}
//                       <span className="text-red-400 ml-1">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="placeOfBirth"
//                       required
//                       autoComplete="address-level2"
//                       value={formData.placeOfBirth}
//                       onChange={onChange}
//                       placeholder={t('city_state_country', { defaultValue: 'City, State, Country' })}
//                       className={`w-full h-12 min-h-[44px] rounded-xl bg-slate-700/50 border-2 text-white placeholder-slate-400 px-4 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all ${
//                         formData.placeOfBirth.trim().length >= 2 ? 'border-green-500/50' : 'border-slate-600'
//                       }`}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="text-white block font-medium mb-2">{t('preferred_language', { defaultValue: 'Preferred Language' })}</label>
//                     <select
//                       name="language"
//                       value={formData.language}
//                       onChange={onChange}
//                       className="w-full h-12 min-h-[44px] rounded-xl bg-slate-700/50 border-2 border-slate-600 text-white px-4 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all"
//                     >
//                       <option value="en">{t('english', { defaultValue: 'English' })}</option>
//                       <option value="hi">{t('hindi', { defaultValue: 'हिंदी' })}</option>
//                       <option value="te">{t('telugu', { defaultValue: 'తెలుగు' })}</option>
//                       <option value="kn">{t('kannada', { defaultValue: 'ಕನ್ನಡ' })}</option>
//                       <option value="ta">{t('tamil', { defaultValue: 'தமிழ்' })}</option>
//                       <option value="mr">{t('marathi', { defaultValue: 'मराठी' })}</option>
//                       <option value="bn">{t('bengali', { defaultValue: 'বাংলা' })}</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Price Summary */}
//             <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-2 border-orange-500/30 rounded-2xl p-6">
//               <div className="flex items-center justify-between flex-col md:flex-row lg:flex-row">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
//                     <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <h4 className="text-white font-bold text-lg">{t('career_path_analysis', { defaultValue: 'Complete Life Analysis Report' })}</h4>
//                     <p className="text-slate-300 text-sm">• Digital PDF • 24-hour delivery</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="flex items-center gap-3">
//                     <span className="text-slate-400 line-through text-lg">₹990</span>
//                     <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">{PRICE_FORMATTED}</span>
//                   </div>
//                   <div className="text-green-400 text-sm font-medium">Save ₹541 Today!</div>
//                 </div>
//               </div>
//             </div>
//             <a href="/GoshalaCharitySection" className="text-white block font-medium mb-4 text-lg">
//               Support Goshala Seva with Every Purchase
//             </a>

//             {/* Form Completion Status */}
//             {!isFormComplete && (
//               <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
//                 <div className="flex items-center gap-3">
//                   <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   <p className="text-amber-300 text-sm">
//                     Please complete all required fields to proceed with payment
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Enhanced Submit Button */}
//             <button
//               type="submit"
//               disabled={!isFormComplete || isPaying}
//               className={`w-full h-14 rounded-xl font-bold text-white text-lg shadow-xl transition-all duration-300 focus:outline-none flex items-center justify-center gap-3 ${
//                 isFormComplete && !isPaying
//                   ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-2xl hover:shadow-orange-500/25 hover:scale-[1.02] cursor-pointer'
//                   : 'bg-slate-600 cursor-not-allowed opacity-50'
//               }`}
//             >
//               {isPaying ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   {t('processing_payment', { defaultValue: 'Processing Payment...' })}
//                 </>
//               ) : isFormComplete ? (
//                 <>
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                   </svg>
//                   {t('complete_payment_get_report', { defaultValue: 'Complete Payment & Get Report' })}
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   Complete All Fields to Continue
//                 </>
//               )}
//             </button>

//             {/* Security Notice */}
//             <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
//               <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//               </svg>
//               <span>Secured by 256-bit SSL encryption • Your data is protected</span>
//             </div>
//           </form>

//           {isPaying && (
//             <div
//               className="fixed inset-0 z-[21] bg-black/60 backdrop-blur-sm flex items-center justify-center"
//               aria-busy="true"
//               role="progressbar"
//               aria-label="Processing payment"
//             >
//               <div className="bg-slate-900/90 rounded-2xl p-8 border border-cyan-500/30 flex flex-col items-center gap-4 max-w-sm mx-4">
//                 <div
//                   className="h-12 w-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin"
//                   style={{ animationDuration: '800ms' }}
//                 />
//                 <div className="text-center">
//                   <p className="text-white font-semibold mb-1">
//                     {t('processing_payment', { defaultValue: 'Processing Payment...' })}
//                   </p>
//                   <p className="text-slate-400 text-sm">Please wait while we secure your transaction</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default BrandNeutralKundli;
