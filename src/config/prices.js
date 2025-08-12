// Centralized price table. Edit this file to change prices or switch location.

export const CURRENT_LOCATION = 'IN'; // Change to 'US' | 'UK' | 'AU' | 'EU' etc.

const LOCATION_CURRENCY = {
  IN: { code: 'INR', locale: 'en-IN', symbol: '₹' },
  default: { code: 'INR', locale: 'en-IN', symbol: '₹' },
};

// Base prices by service (defaults). Override per location below.
// Fill/change these numbers as you need.
const BASE_PRICES = {
  // Core Horoscope
  birthChart: 599,
  matchHoroscope: 499,
  ascendant: 699,
  dashaAnalysis: 799,
  nakshatra: 199,
  numerology: 299,

  // Predictions
  lifePredictions: 999,
  personalizedReport2025: 1499,
  yearAnalysis: 1299,
  dailyHoroscope: 49,
  loveReport: 499,
  careerReport: 599,
  natureReport: 399,
  healthReport: 599,

  // Remedial
  lalKitab: 699,
  sadeSati: 799,
  askQuestion: 199,
  gemstones: 999,

  // Other
  kundli: 299,
};


function getCurrencyInfo(location = CURRENT_LOCATION) {
  return LOCATION_CURRENCY[location] || LOCATION_CURRENCY.default;
}

export function getRawPrice(serviceKey, location = CURRENT_LOCATION) {
  const base = BASE_PRICES[serviceKey];
  // const overrides = LOCATION_OVERRIDES[location] || {};
  const value = base;
  return typeof value === 'number' ? value : null;
}

export function getFormattedPrice(serviceKey, location = CURRENT_LOCATION) {
  const amount = getRawPrice(serviceKey, location);
  const { code, locale } = getCurrencyInfo(location);
  if (amount == null) return '—';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: code, maximumFractionDigits: code === 'INR' ? 0 : 2 }).format(amount);
  } catch {
    const { symbol } = getCurrencyInfo(location);
    return `${symbol}${amount}`;
  }
}

// Optional: export keys to avoid typos elsewhere
export const PRICE_KEYS = {
  birthChart: 'birthChart',
  matchHoroscope: 'matchHoroscope',
  ascendant: 'ascendant',
  dashaAnalysis: 'dashaAnalysis',
  nakshatra: 'nakshatra',
  numerology: 'numerology',
  lifePredictions: 'lifePredictions',
  personalizedReport2025: 'personalizedReport2025',
  yearAnalysis: 'yearAnalysis',
  dailyHoroscope: 'dailyHoroscope',
  loveReport: 'loveReport',
  careerReport: 'careerReport',
  natureReport: 'natureReport',
  healthReport: 'healthReport',
  lalKitab: 'lalKitab',
  sadeSati: 'sadeSati',
  askQuestion: 'askQuestion',
  gemstones: 'gemstones',
  kundli: 'kundli',
};