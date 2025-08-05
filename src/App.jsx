import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import Services from './components/Services';

import Cv from './pages/resume-builder/Cv';
import ResumeForm from './pages/resume-builder/ResumeForm';
import CvPreview from './pages/resume-builder/CvPreview';

import InterviewPractice from './pages/interview/InterviewPractice';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import JobSearch from './pages/JobSearch';
import CareerGuidance from './pages/CareerGuidance';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';

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
        path="/resume-builder/preview"
        element={
          <Layout>
            <CvPreview />
          </Layout>
        }
      />
      <Route
        path="/interview-practice"
        element={
          <Layout>
            <InterviewPractice />
          </Layout>
        }
      />
      <Route
        path="/job-search"
        element={
          <Layout>
            <JobSearch />
          </Layout>
        }
      />
      <Route
        path="/career-guidance"
        element={
          <Layout>
            <CareerGuidance />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/signup"
        element={
          <Layout>
            <Signup />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      <Route
        path="/feedback"
        element={
          <Layout>
            <Feedback />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
