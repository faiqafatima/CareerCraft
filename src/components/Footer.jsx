import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-column">
          <h2 className="footer-brand">CareerCraft</h2>
          <p className="footer-tagline">
            Building careers with AI-powered solutions for the modern workforce.
          </p>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Follow Us</h3>
          <div className="footer-icons">
            <a href="#" title="LinkedIn (Coming Soon)"><FontAwesomeIcon icon={faLinkedin} /></a>
            <a href="#" title="Twitter (Coming Soon)"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="https://instagram.com/faiqarana._" target="_blank" rel="noopener noreferrer" title="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {currentYear} CareerCraft. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
