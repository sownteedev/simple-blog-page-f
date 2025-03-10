import React from 'react';
import './Team.css';
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin, FaDiscord } from 'react-icons/fa';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Duong Quang Hao",
      role: "Member",
      image: "https://images.squarespace-cdn.com/content/v1/placeholder-team1.jpg",
      bio: "Dev is life. Life is dev.",
      social: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        discord: "https://discord.com"
      }
    },
    {
      id: 2,
      name: "Nguyen Thanh Son",
      role: "Member",
      image: "https://images.squarespace-cdn.com/content/v1/placeholder-team2.jpg",
      bio: "I love coding.",
      social: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        discord: "https://discord.com"
      }
    },
  ];

  return (
    <section className="team" id="team">
      <div className="team-container">
        <div className="section-header">
          <h2>Our Team</h2>
          <p>Members who participated in the project</p>
        </div>
        
        <div className="team-grid">
          {teamMembers.map(member => (
            <div className="team-card" key={member.id}>
              <div className="team-image">
                <img src={`/api/placeholder/300/300`} alt={member.name} />
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.bio}</p>
                <div className="social-links">
                  <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className="social-btn">
                    <FaFacebook />
                  </a>
                  <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="social-btn">
                    <FaInstagram />
                  </a>
                  <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="social-btn">
                    <FaGithub />
                  </a>
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn">
                    <FaLinkedin />
                  </a>
                  <a href={member.social.discord} target="_blank" rel="noopener noreferrer" className="social-btn">
                    <FaDiscord />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;