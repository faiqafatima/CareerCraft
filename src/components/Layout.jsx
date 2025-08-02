// src/components/Layout.jsx
import React from 'react';
import GoBackButton from './GoBackButton';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <GoBackButton />
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
