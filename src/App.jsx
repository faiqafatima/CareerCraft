// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Services from './components/Services';
import Footer from './components/Footer';

import Cv from './pages/resume-builder/Cv'; // ✅ Your Cv landing
// Optional: import ResumeForm from './pages/resume-builder/ResumeForm'; // when you create it

import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <Services />
            </>
          }
        />
        <Route path="/resume-builder" element={<Cv />} />
        {/* <Route path="/resume-builder/create" element={<ResumeForm />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
