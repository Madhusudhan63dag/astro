import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Four from './components/Four';
import Five from './components/Five';
import Footer from './components/Footer';
import Personal from './pages/Personal';
import Horoscope from './pages/Horoscope';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';


function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      <Hero />
      <Services />
      <Four />
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
          <Route path="/" element={<Home />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/horoscope" element={<Horoscope />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}


export default App;