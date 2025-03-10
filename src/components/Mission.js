import React from 'react';
import './Mission.css';

const Mission = () => {
  return (
    <section className="mission" id="vision">
      <div className="mission-container">
        <div className="mission-content">
          <div className="mission-left">
            <h2>Supporting education and innovation.</h2>
            <a href="#vision-details" className="vision-btn">Our Vision</a>
          </div>
          
          <div className="mission-right">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
              dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
              non proident, sunt in culpa qui officia deserunt mollit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;