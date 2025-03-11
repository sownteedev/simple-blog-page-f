import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BlogPost.css';

const BlogPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  // Simulated blog post data (replace with actual API call)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Simulated data for demonstration
        const demoPost = {
          id: id,
          title: "Supporting Education in Rural Communities",
          content: `
            <p>Education is the cornerstone of development in rural communities. Through our recent initiatives, we've witnessed remarkable transformations in how learning is approached and delivered in remote areas.</p>

            <h2>The Challenge</h2>
            <p>Rural communities often face unique challenges in accessing quality education:</p>
            <ul>
              <li>Limited access to modern educational resources</li>
              <li>Shortage of qualified teachers</li>
              <li>Infrastructure constraints</li>
              <li>Geographic isolation</li>
            </ul>

            <h2>Our Approach</h2>
            <p>We've implemented a multi-faceted strategy that combines traditional teaching methods with modern technology. This hybrid approach ensures that students receive quality education while preserving local cultural values.</p>

            <blockquote>
              "Education is not preparation for life; education is life itself." - John Dewey
            </blockquote>

            <h2>Key Initiatives</h2>
            <p>Our program focuses on several key areas:</p>
            <ol>
              <li>Teacher Training and Development</li>
              <li>Digital Resource Integration</li>
              <li>Community Engagement</li>
              <li>Infrastructure Development</li>
            </ol>

            <h2>Impact and Results</h2>
            <p>The results of our initiatives have been encouraging:</p>
            <ul>
              <li>30% increase in student enrollment</li>
              <li>85% improvement in teacher retention</li>
              <li>Significant boost in academic performance</li>
            </ul>
          `,
          author: "Sarah Johnson",
          date: "March 15, 2024",
          category: "Education",
          image: "https://source.unsplash.com/1200x600/?education,rural",
          readTime: "5 min read",
          authorImage: "https://source.unsplash.com/100x100/?portrait",
          relatedPosts: [
            {
              id: 2,
              title: "Technology Integration in Classrooms",
              image: "https://source.unsplash.com/400x300/?technology,classroom",
              category: "Technology"
            },
            {
              id: 3,
              title: "Teacher Training Success Stories",
              image: "https://source.unsplash.com/400x300/?teaching",
              category: "Training"
            }
          ]
        };

        setPost(demoPost);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blog post');
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [id]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="error">Post not found</div>;

  return (
    <div className="blog-post-page">
      <div className="blog-post-hero">
        <img src={post.image} alt={post.title} className="hero-image" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="post-meta">
            <span className="post-category">{post.category}</span>
            <span className="post-date">{post.date}</span>
            <span className="post-read-time">{post.readTime}</span>
          </div>
          <h1>{post.title}</h1>
        </div>
      </div>

      <div className="blog-post-container">
        <aside className="blog-post-sidebar">
          <div className="author-card">
            <img src={post.authorImage} alt={post.author} className="author-image" />
            <h3>{post.author}</h3>
            <p>{post.authorBio}</p>
            <div className="social-links">
              <a href="#twitter" className="social-link">Twitter</a>
              <a href="#linkedin" className="social-link">LinkedIn</a>
            </div>
          </div>

          <div className="table-of-contents">
            <h3>Table of Contents</h3>
            <ul>
              <li><a href="#challenge">The Challenge</a></li>
              <li><a href="#approach">Our Approach</a></li>
              <li><a href="#initiatives">Key Initiatives</a></li>
              <li><a href="#impact">Impact and Results</a></li>
            </ul>
          </div>
        </aside>

        <article className="blog-post-content">
          <div className="content" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          <div className="post-footer">
            <div className="post-tags">
              <span className="tag">Education</span>
              <span className="tag">Rural Development</span>
              <span className="tag">Community</span>
            </div>
            
            <div className="share-buttons">
              <button className="share-btn twitter">Share on Twitter</button>
              <button className="share-btn linkedin">Share on LinkedIn</button>
            </div>
          </div>
        </article>
      </div>

      <div className="related-posts">
        <h2>Related Articles</h2>
        <div className="related-posts-grid">
          {post.relatedPosts.map(relatedPost => (
            <Link to={`/blog/${relatedPost.id}`} key={relatedPost.id} className="related-post-card">
              <div className="related-post-image">
                <img src={relatedPost.image} alt={relatedPost.title} />
                <span className="related-post-category">{relatedPost.category}</span>
              </div>
              <h3>{relatedPost.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      <div className="post-navigation">
        <Link to="/blog" className="back-to-blog">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
};

export default BlogPost; 