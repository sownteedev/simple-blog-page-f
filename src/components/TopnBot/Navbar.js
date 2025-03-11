import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (sectionId) => {
    setMenuOpen(false);
    
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBlogClick = () => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">Personal Blog</Link>
        </div>
        
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className="navbar-menu">
          <ul>
            <li>
              <button 
                onClick={() => handleNavClick('projects')} 
                className="nav-link"
              >
                Projects
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('team')} 
                className="nav-link"
              >
                Our Team
              </button>
            </li>
            <li>
              <Link 
                to="/blog" 
                className="nav-link"
                onClick={handleBlogClick}
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="navbar-cta">
          <Link to="/login" className="auth-btn">Login</Link>
          <Link to="/signup" className="auth-btn signup">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;