import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SonHao Blog</h3>
            <p>Contact with us</p>
            <div className="social-links">
              <a href="#facebook" aria-label="Facebook"><FaFacebook /></a>
              <a href="#twitter" aria-label="Twitter"><FaTwitter /></a>
              <a href="#instagram" aria-label="Instagram"><FaInstagram /></a>
              <a href="#linkedin" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#team">Our Team</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#donate">Donate</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Newsletter</h3>
            <p>Subscribe to our newsletter for updates on our work.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your Email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 SonHao Blog Page. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;