import React from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Welcome to Our Blog Web</h1>
        <a href="blog" className="hero-btn">
          <Link to="/blog" >
            Visit Blog
        </Link></a>
      </div>
    </section>
  );
};

export default Hero;