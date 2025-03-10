import React from 'react';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Teacher Training",
      image: "https://images.squarespace-cdn.com/content/v1/placeholder-image1.jpg",
      description: "Professional development programs for educators in Lusaka.",
    },
    {
      id: 2,
      title: "Classroom Resources",
      image: "https://images.squarespace-cdn.com/content/v1/placeholder-image2.jpg",
      description: "Providing essential learning materials to underserved schools.",
    },
    {
      id: 3,
      title: "Technology Integration",
      image: "https://images.squarespace-cdn.com/content/v1/placeholder-image3.jpg",
      description: "Bringing digital learning tools to classrooms across the region.",
    }
  ];

  return (
    <section className="projects" id="projects">
      <div className="projects-container">
        <div className="section-header">
          <h2>Our Projects</h2>
          <p>Initiatives that are making a difference in education</p>
        </div>
        
        <div className="projects-grid">
          {projects.map(project => (
            <div className="project-card" key={project.id}>
              <div className="project-image">
                <img src={`/api/placeholder/400/300`} alt={project.title} />
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a href={`#project-${project.id}`} className="project-link">Learn More</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;