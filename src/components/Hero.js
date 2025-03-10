import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Welcome to Our Blog Web</h1>
        <a href="#learn-more" className="hero-btn">Learn More</a>
      </div>
    </section>
  );
};

export default Hero;