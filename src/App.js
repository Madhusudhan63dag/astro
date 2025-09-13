import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './i18n'

// Navigation Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingIcons from './components/FloatingIcons';

// Home Components
import Hero from './components/Hero';
import Services from './components/Services';
import Four from './components/Four';
import Five from './components/Five';
import Two from './components/Two';
import Three from './components/Three';
import Loader from './components/Loader';

// Contact Page
import Contact from './pages/Contact';

// Blog Page
import Blog from './pages/Blog';
import BlogPost from './pages/blogs/BlogPost';


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
import LoveReport from './pages/Predictions/LoveReport';
import CareerReport from './pages/Predictions/CareerReport';
import NatureReport from './pages/Predictions/NatureReport';
import HealthReport from './pages/Predictions/HealthReport';

// Remedial Solutions Pages
import LalKitab from './pages/Remedial/LalKitab';
import SadeSati from './pages/Remedial/SadeSati';
import AskQuestion from './pages/Remedial/AskQuestion';
import Gemstones from './pages/Remedial/Gemstones';

// Full kundli
import Kundli from './pages/Kundli';


//policy
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import Thank from './pages/Thank';



function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      <Hero />
      <Two />
      {/* <Services /> */}
      <Three />
      <Four />
      <Five />
    </div>
  );
}

function RouteContainer() {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);

  // Initial load animation
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Show loader briefly on route changes
  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className="overflow-hidden">
      <Loader show={loading} />
      <Navbar />
      <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/kundli" element={<Kundli />} />
          <Route path="/thank-you" element={<Thank />} />
          {/* <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} /> 
          
          <Route path="/birth-chart" element={<BirthChart />} />
          <Route path="/match-kundli" element={<MatchHoroscope />} />
          <Route path="/ascendant" element={<Ascendant />} />
          <Route path="/dasha-analysis" element={<DashaAnalysis />} />
          <Route path="/nakshatra" element={<Nakshatra />} />
          <Route path="/numerology" element={<Numerology />} />
          
          <Route path="/life-predictions" element={<LifePredictions />} />
          <Route path="/2025-predictions" element={<PersonalizedReport2025 />} />
          <Route path="/year-analysis" element={<YearAnalysis />} />
          <Route path="/love-report" element={<LoveReport />} />
          <Route path="/career-report" element={<CareerReport />} />
          <Route path="/nature-report" element={<NatureReport />} />
          <Route path="/health-report" element={<HealthReport />} />
          
          <Route path="/lal-kitab" element={<LalKitab />} />
          <Route path="/sade-sati" element={<SadeSati />} />
          <Route path="/ask-question" element={<AskQuestion />} />
          <Route path="/gemstones" element={<Gemstones />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} /> */}

          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
        <Footer />
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-transparent">
      <BrowserRouter>
        <RouteContainer />
      </BrowserRouter>
  {/* Floating icons rendered outside Router so they persist across routes */}
  <FloatingIcons whatsappNumber="+919059821555" phoneNumber="+919059821555" email="support@sriastroveda.com" />
    </div>
  );
}

export default App;
