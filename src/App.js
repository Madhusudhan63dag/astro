import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './i18n'

// Navigation Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Home Components
import Hero from './components/Hero';
import Services from './components/Services';
import Four from './components/Four';
import Five from './components/Five';
import Two from './components/Two';
import Three from './components/Three';

// Core Horoscope Pages
import BirthChart from './pages/Horoscope/BirthChart';
import MatchHoroscope from './pages/Horoscope/MatchHoroscope';
import Ascendant from './pages/Horoscope/Ascendant';
import DashaAnalysis from './pages/Horoscope/DashaAnalysis';
import Nakshatra from './pages/Horoscope/Nakshatra';
import Numerology from './pages/Horoscope/Numerology';

// Life Predictions Pages
import LifePredictions from './pages/Predictions/LifePredictions';
import PersonalizedReport2025 from './pages/Predictions/PersonalizedReport2025';
import YearAnalysis from './pages/Predictions/YearAnalysis';
import DailyHoroscope from './pages/Predictions/DailyHoroscope';
import LoveReport from './pages/Predictions/LoveReport';
import CareerReport from './pages/Predictions/CareerReport';
import NatureReport from './pages/Predictions/NatureReport';
import HealthReport from './pages/Predictions/HealthReport';

// Remedial Solutions Pages
import LalKitab from './pages/Remedial/LalKitab';
import SadeSati from './pages/Remedial/SadeSati';
import AskQuestion from './pages/Remedial/AskQuestion';
import Gemstones from './pages/Remedial/Gemstones';

// About Page
import About from './pages/About';

// Contact Page
import Contact from './pages/Contact';

// Pricing Page
import Pricing from './pages/Pricing';
import Kundli from './pages/Kundli';

//policy
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';


function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      <Hero />
      <Two />
      <Services />
      <Three />
      {/* <Four /> */}
      <Five />
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-transparent">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />
          
          {/* Existing Routes */}
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          
          {/* Core Horoscope Routes */}
          <Route path="/birth-chart" element={<BirthChart />} />
          <Route path="/match-horoscope" element={<MatchHoroscope />} />
          <Route path="/ascendant" element={<Ascendant />} />
          <Route path="/dasha-analysis" element={<DashaAnalysis />} />
          <Route path="/nakshatra" element={<Nakshatra />} />
          <Route path="/numerology" element={<Numerology />} />
          
          {/* Life Predictions Routes */}
          <Route path="/life-predictions" element={<LifePredictions />} />
          <Route path="/2025-predictions" element={<PersonalizedReport2025 />} />
          <Route path="/year-analysis" element={<YearAnalysis />} />
          <Route path="/daily-horoscope" element={<DailyHoroscope />} />
          <Route path="/love-report" element={<LoveReport />} />
          <Route path="/career-report" element={<CareerReport />} />
          <Route path="/nature-report" element={<NatureReport />} />
          <Route path="/health-report" element={<HealthReport />} />
          
          {/* Remedial Solutions Routes */}
          <Route path="/lal-kitab" element={<LalKitab />} />

          <Route path="/sade-sati" element={<SadeSati />} />
          <Route path="/ask-question" element={<AskQuestion />} />
          <Route path="/gemstones" element={<Gemstones />} />

          <Route path="/kundli" element={<Kundli />} />

          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
