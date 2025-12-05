import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from './api';

const API_URL = API_CONFIG.API_URL;

function clamp(n, min, max) {
  const x = Number.isFinite(+n) ? +n : 0;
  return Math.min(Math.max(x, min), max);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

const DateTimeInput = ({ value, onChange }) => {
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

  // FIX 1: Add debouncing to reduce re-renders
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce updates by 300ms
    timeoutRef.current = setTimeout(() => {
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
      const time12Str = hh && mins ? `${pad2(clampedH12)}:${MM}` : '';
      
      if (onChange) {
        onChange({ 
          dateOfBirth: dateStr, 
          timeOfBirth: timeStr, 
          time12Hour: time12Str,
          timePeriod: ap
        });
      }
    }, 300);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
    <div className="space-y-4">
      <label className="text-gray-700 font-semibold block">Date & Time of Birth *</label>
      
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          <input
            ref={dRef}
            value={dd}
            onChange={onDD}
            placeholder="DD"
            inputMode="numeric"
            aria-label="Day"
            className="w-16 h-12 rounded-lg border-2 border-gray-300 px-3 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
          <input
            ref={mRef}
            value={mm}
            onChange={onMM}
            placeholder="MM"
            inputMode="numeric"
            aria-label="Month"
            className="w-16 h-12 rounded-lg border-2 border-gray-300 px-3 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
          <input
            ref={yRef}
            value={yyyy}
            onChange={onYYYY}
            placeholder="YYYY"
            inputMode="numeric"
            aria-label="Year"
            className="w-20 h-12 rounded-lg border-2 border-gray-300 px-3 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>

        <div className="flex gap-2">
          <input
            ref={hRef}
            value={hh}
            onChange={onHH}
            placeholder="HH"
            inputMode="numeric"
            aria-label="Hour"
            className="w-16 h-12 rounded-lg border-2 border-gray-300 px-3 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
          <input
            ref={iRef}
            value={mins}
            onChange={onMin}
            placeholder="MM"
            inputMode="numeric"
            aria-label="Minutes"
            className="w-16 h-12 rounded-lg border-2 border-gray-300 px-3 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="ap"
              value="AM"
              checked={ap === 'AM'}
              onChange={() => setAP('AM')}
              className="w-4 h-4 accent-blue-500"
            />
            <span className="font-medium">AM</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="ap"
              value="PM"
              checked={ap === 'PM'}
              onChange={() => setAP('PM')}
              className="w-4 h-4 accent-blue-500"
            />
            <span className="font-medium">PM</span>
          </label>
        </div>
      </div>
    </div>
  );
};

// FIX 2: Memoize DateTimeInput to prevent unnecessary re-renders
const MemoizedDateTimeInput = React.memo(DateTimeInput);

const KundliFillupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    dateOfBirth: '',
    timeOfBirth: '',
    time12Hour: '',        // FIX 3: Initialize these fields
    timePeriod: 'AM',
    placeOfBirth: '',
    language: 'en',
    email: '',
    phone: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // FIX 4: Update callback to receive ALL parameters
  const handleDateTimeChange = useCallback(({ dateOfBirth, timeOfBirth, time12Hour, timePeriod }) => {
    setFormData(prev => ({ 
      ...prev, 
      dateOfBirth, 
      timeOfBirth,
      time12Hour,      // Now captures 12-hour format
      timePeriod       // Now captures AM/PM
    }));
  }, []);

  const isFormValid = () => {
    const { name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth } = formData;
    const hasName = name && name.trim().length >= 2;
    const hasEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const hasPhone = phone && /^\+?[\d\s\-()]{10,}$/.test(phone.trim());
    const hasDateOfBirth = dateOfBirth && dateOfBirth.length === 10;
    const hasTimeOfBirth = timeOfBirth && timeOfBirth.length === 5;
    const hasPlaceOfBirth = placeOfBirth && placeOfBirth.trim().length >= 2;
    
    return hasName && hasEmail && hasPhone && hasDateOfBirth && hasTimeOfBirth && hasPlaceOfBirth;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isFormValid()) {
      setError('Please complete all required fields correctly.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth,
        time12Hour: formData.time12Hour,
        timePeriod: formData.timePeriod,
        placeOfBirth: formData.placeOfBirth,
        gender: formData.gender,
        language: formData.language === 'en' ? 'English' : 
                formData.language === 'hi' ? 'Hindi' :
                formData.language === 'te' ? 'Telugu' :
                formData.language === 'kn' ? 'Kannada' :
                formData.language === 'ta' ? 'Tamil' :
                formData.language === 'mr' ? 'Marathi' :
                formData.language === 'bn' ? 'Bengali' : 'English'
      };
      
      const response = await fetch(`${API_URL}/submit-kundli-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        sessionStorage.setItem('kundliFormData', JSON.stringify(formData));
        navigate('/thank');
      } else {
        setError(data.message || 'Failed to submit form. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Network error. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Kundli Report Request</h1>
          <p className="text-gray-600">Fill in your details to generate your personalized astrology report</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">Personal Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-700 font-semibold block mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your complete name"
                  className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Birth Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">Birth Details</h2>
            
            <div className="space-y-6">
              <MemoizedDateTimeInput 
                value={{ dateOfBirth: formData.dateOfBirth, timeOfBirth: formData.timeOfBirth }}
                onChange={handleDateTimeChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-700 font-semibold block mb-2">
                    Birth Place <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    placeholder="City, State, Country"
                    className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-semibold block mb-2">Preferred Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className={`w-full h-14 rounded-xl font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              isFormValid() && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg cursor-pointer transform hover:scale-[1.02]'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <span>{isFormValid() ? 'Submit Form' : 'Complete All Fields'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KundliFillupForm;


// import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API_CONFIG from './api';

// const API_URL = API_CONFIG.API_URL;

// function clamp(n, min, max) {
//   const x = Number.isFinite(+n) ? +n : 0;
//   return Math.min(Math.max(x, min), max);
// }

// function pad2(n) {
//   return String(n).padStart(2, '0');
// }

// const DateTimeInput = ({ value, onChange }) => {
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

//   // FIX: Remove onChange from dependencies and use useCallback
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
//     const time12Str = hh && mins ? `${pad2(clampedH12)}:${MM}` : ''; // 12-hour format
    
//     if (onChange) {
//       onChange({ 
//         dateOfBirth: dateStr, 
//         timeOfBirth: timeStr, 
//         time12Hour: time12Str, // Add 12-hour format
//         timePeriod: ap // Add AM/PM
//       });
//     }
//   }, [dd, mm, yyyy, hh, mins, ap]);

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
//     <div className="space-y-4">
//       <label className="text-gray-700 font-semibold block">Date & Time of Birth *</label>
      
//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="flex gap-2">
//           <input
//             ref={dRef}
//             value={dd}
//             onChange={onDD}
//             placeholder="DD"
//             inputMode="numeric"
//             aria-label="Day"
//             className="w-16 h-12 rounded-lg border-2 border-gray-300 px-3 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//           />
//           <input
//             ref={mRef}
//             value={mm}
//             onChange={onMM}
//             placeholder="MM"
//             inputMode="numeric"
//             aria-label="Month"
//             className="w-16 h-12 rounded-lg border-2 border-gray-300 px-3 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//           />
//           <input
//             ref={yRef}
//             value={yyyy}
//             onChange={onYYYY}
//             placeholder="YYYY"
//             inputMode="numeric"
//             aria-label="Year"
//             className="w-20 h-12 rounded-lg border-2 border-gray-300 px-3 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//           />
//         </div>

//         <div className="flex gap-2">
//           <input
//             ref={hRef}
//             value={hh}
//             onChange={onHH}
//             placeholder="HH"
//             inputMode="numeric"
//             aria-label="Hour"
//             className="w-16 h-12 rounded-lg border-2 border-gray-300 px-3 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//           />
//           <input
//             ref={iRef}
//             value={mins}
//             onChange={onMin}
//             placeholder="MM"
//             inputMode="numeric"
//             aria-label="Minutes"
//             className="w-16 h-12 rounded-lg border-2 border-gray-300 px-3 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//           />
//         </div>

//         <div className="flex gap-4">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="radio"
//               name="ap"
//               value="AM"
//               checked={ap === 'AM'}
//               onChange={() => setAP('AM')}
//               className="w-4 h-4 accent-blue-500"
//             />
//             <span className="font-medium">AM</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="radio"
//               name="ap"
//               value="PM"
//               checked={ap === 'PM'}
//               onChange={() => setAP('PM')}
//               className="w-4 h-4 accent-blue-500"
//             />
//             <span className="font-medium">PM</span>
//           </label>
//         </div>
//       </div>
//     </div>
//   );
// };

// const KundliFillupForm = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     gender: 'male',
//     dateOfBirth: '',
//     timeOfBirth: '',
//     timePeriod: 'AM',
//     placeOfBirth: '',
//     language: 'en',
//     email: '',
//     phone: ''
//   });

//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // FIX: Use useCallback to prevent re-creation on every render
//   const handleDateTimeChange = useCallback(({ dateOfBirth, timeOfBirth }) => {
//     setFormData(prev => ({ ...prev, dateOfBirth, timeOfBirth }));
//   }, []);

//   const isFormValid = () => {
//     const { name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth } = formData;
//     const hasName = name && name.trim().length >= 2;
//     const hasEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
//     const hasPhone = phone && /^\+?[\d\s\-()]{10,}$/.test(phone.trim());
//     const hasDateOfBirth = dateOfBirth && dateOfBirth.length === 10;
//     const hasTimeOfBirth = timeOfBirth && timeOfBirth.length === 5;
//     const hasPlaceOfBirth = placeOfBirth && placeOfBirth.trim().length >= 2;
    
//     return hasName && hasEmail && hasPhone && hasDateOfBirth && hasTimeOfBirth && hasPlaceOfBirth;
//   };
  
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setError('');
    
//   //   if (!isFormValid()) {
//   //     setError('Please complete all required fields correctly.');
//   //     return;
//   //   }

//   //   setIsSubmitting(true);
    
//   //   try {
//   //     // FIX: Use the existing /send-astro-email endpoint with correct payload
//   //     const payload = {
//   //       name: formData.name,
//   //       email: formData.email,
//   //       phone: formData.phone,
//   //       service: 'kundli-form-submission',
//   //       reportType: 'Kundli Report',
//   //       birthDetails: {
//   //         dateOfBirth: formData.dateOfBirth,
//   //         timeOfBirth: formData.timeOfBirth, // 24-hour format
//   //         time12Hour: formData.time12Hour, // 12-hour format
//   //         timePeriod: formData.timePeriod, // AM or PM
//   //         placeOfBirth: formData.placeOfBirth,
//   //         gender: formData.gender
//   //       },
//   //       language: formData.language === 'en' ? 'English' : 
//   //               formData.language === 'hi' ? 'Hindi' :
//   //               formData.language === 'te' ? 'Telugu' :
//   //               formData.language === 'kn' ? 'Kannada' :
//   //               formData.language === 'ta' ? 'Tamil' :
//   //               formData.language === 'mr' ? 'Marathi' :
//   //               formData.language === 'bn' ? 'Bengali' : 'English',
//   //       additionalInfo: null,
//   //       paymentDetails: null,
//   //       specialRequests: null
//   //     };

//   //     // FIX: Use the correct endpoint
//   //     const response = await fetch(`${API_URL}/send-astro-form`, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify(payload)
//   //     });
//   //     const data = await response.json();
//   //     if (response.ok && data.success) {
//   //       // Store form data in sessionStorage
//   //       sessionStorage.setItem('kundliFormData', JSON.stringify(formData));
        
//   //       // Navigate to thank you page
//   //       navigate('/thank');
//   //     } else {
//   //       setError(data.message || 'Failed to submit form. Please try again.');
//   //       setIsSubmitting(false);
//   //     }
//   //   } catch (err) {
//   //     console.error('Form submission error:', err);
//   //     setError('Network error. Please check your connection and try again.');
//   //     setIsSubmitting(false);
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     if (!isFormValid()) {
//       setError('Please complete all required fields correctly.');
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       const payload = {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         dateOfBirth: formData.dateOfBirth,
//         timeOfBirth: formData.timeOfBirth,
//         time12Hour: formData.time12Hour,
//         timePeriod: formData.timePeriod,
//         placeOfBirth: formData.placeOfBirth,
//         gender: formData.gender,
//         language: formData.language === 'en' ? 'English' : 
//                 formData.language === 'hi' ? 'Hindi' :
//                 formData.language === 'te' ? 'Telugu' :
//                 formData.language === 'kn' ? 'Kannada' :
//                 formData.language === 'ta' ? 'Tamil' :
//                 formData.language === 'mr' ? 'Marathi' :
//                 formData.language === 'bn' ? 'Bengali' : 'English'
//       };
      
//       // FIX: Change endpoint to match backend
//       const response = await fetch(`${API_URL}/submit-kundli-form`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload)
//       });
      
//       // Better error handling
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Server response:', errorText);
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.success) {
//         // Store form data in sessionStorage
//         sessionStorage.setItem('kundliFormData', JSON.stringify(formData));
        
//         // Navigate to thank you page
//         navigate('/thank');
//       } else {
//         setError(data.message || 'Failed to submit form. Please try again.');
//         setIsSubmitting(false);
//       }
//     } catch (err) {
//       console.error('Form submission error:', err);
//       setError('Network error. Please check your connection and try again.');
//       setIsSubmitting(false);
//     }
//   };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="bg-white rounded-2xl shadow-xl p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Kundli Report Request</h1>
//           <p className="text-gray-600">Fill in your details to generate your personalized astrology report</p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
//             <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Personal Details */}
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">Personal Details</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="text-gray-700 font-semibold block mb-2">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Enter your complete name"
//                   className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="text-gray-700 font-semibold block mb-2">Gender</label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
//                 >
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-gray-700 font-semibold block mb-2">
//                   Email Address <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="your@email.com"
//                   className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="text-gray-700 font-semibold block mb-2">
//                   Phone Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="+91 9876543210"
//                   className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Birth Details */}
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">Birth Details</h2>
            
//             <div className="space-y-6">
//               <DateTimeInput 
//                 value={{ dateOfBirth: formData.dateOfBirth, timeOfBirth: formData.timeOfBirth }}
//                 onChange={handleDateTimeChange}
//               />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="text-gray-700 font-semibold block mb-2">
//                     Birth Place <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="placeOfBirth"
//                     value={formData.placeOfBirth}
//                     onChange={handleChange}
//                     placeholder="City, State, Country"
//                     className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="text-gray-700 font-semibold block mb-2">Preferred Language</label>
//                   <select
//                     name="language"
//                     value={formData.language}
//                     onChange={handleChange}
//                     className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
//                   >
//                     <option value="en">English</option>
//                     <option value="hi">हिंदी (Hindi)</option>
//                     <option value="te">తెలుగు (Telugu)</option>
//                     <option value="kn">ಕನ್ನಡ (Kannada)</option>
//                     <option value="ta">தமிழ் (Tamil)</option>
//                     <option value="mr">मराठी (Marathi)</option>
//                     <option value="bn">বাংলা (Bengali)</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={!isFormValid() || isSubmitting}
//             className={`w-full h-14 rounded-xl font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
//               isFormValid() && !isSubmitting
//                 ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg cursor-pointer transform hover:scale-[1.02]'
//                 : 'bg-gray-400 cursor-not-allowed'
//             }`}
//           >
//             {isSubmitting ? (
//               <>
//                 <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                 </svg>
//                 <span>Submitting...</span>
//               </>
//             ) : (
//               <span>{isFormValid() ? 'Submit Form' : 'Complete All Fields'}</span>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default KundliFillupForm;