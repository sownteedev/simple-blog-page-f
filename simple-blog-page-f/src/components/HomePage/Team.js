import React from 'react';
import './Team.css';
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin, FaDiscord } from 'react-icons/fa';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Duong Quang Hao",
      role: "Member",
      image: "https://haonika.id.vn/images/hao.jpg",
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
      image: "https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-1/467896530_122189603000206736_6809568542440186347_n.jpg?stp=dst-jpg_s160x160_tt6&_nc_cat=103&ccb=1-7&_nc_sid=111fe6&_nc_ohc=Hvmae8mNxs8Q7kNvwF9oRHZ&_nc_oc=Adm-lQzfI-vGyMx2-_lKzTpi_N3Gncb5V3qEqTE_z5gGec6c7TGmz60s_W7JcP5wd2pspTVqEPswbWu9UlyxmEy9&_nc_zt=24&_nc_ht=scontent.fhan20-1.fna&_nc_gid=o5Mp0cZzZ3hvtsI76zx1Tw&oh=00_AfG0yElcyA22LMD8bBuOXGLUQpiPp4zzoYXW6gCqNDJhDw&oe=681EA8C2",
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
                <img src={member.image} alt={member.name} />
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