import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout'; // ✅ Layout with Navbar/Footer
import HeroSection from './components/HeroSection';
import Services from './components/Services';

import Cv from './pages/resume-builder/Cv';
import ResumeForm from './pages/resume-builder/ResumeForm';
import CvPreview from './pages/resume-builder/CvPreview'; // ✅ Import Preview

import InterviewPractice from './pages/interview/InterviewPractice'; // ✅ Import Interview Page

import './App.css';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HeroSection />
            <Services />
          </Layout>
        }
      />
      <Route
        path="/resume-builder"
        element={
          <Layout>
            <Cv />
          </Layout>
        }
      />
      <Route
        path="/resume-builder/create"
        element={
          <Layout>
            <ResumeForm />
          </Layout>
        }
      />
      <Route
        path="/resume-builder/preview" // ✅ Added this new route
        element={
          <Layout>
            <CvPreview />
          </Layout>
        }
      />
      <Route
        path="/interview-practice" // ✅ New AI Interview Practice Route
        element={
          <Layout>
            <InterviewPractice />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
