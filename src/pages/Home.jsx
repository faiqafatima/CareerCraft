import React from 'react';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
// import HomeHelpSection from '../components/HomeHelpSection';


const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      {/* <HomeHelpSection /> */}
        <Services />
    </div>
  );
};

export default Home;
