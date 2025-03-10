import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Blog.css';

const Blog = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/blog';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'education', name: 'Education' },
    { id: 'technology', name: 'Technology' },
    { id: 'training', name: 'Training' },
    { id: 'community', name: 'Community' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Supporting Education in Rural Communities",
      date: "March 15, 2024",
      author: "Sarah Johnson",
      category: "education",
      image: "https://source.unsplash.com/800x400/?education",
      excerpt: "Exploring innovative approaches to strengthen educational resources in rural areas of Zambia.",
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "Technology Integration in Classrooms",
      date: "March 10, 2024",
      author: "Michael Tembo",
      category: "technology",
      image: "https://source.unsplash.com/800x400/?technology,classroom",
      excerpt: "How digital tools are transforming the learning experience in local schools.",
      readTime: "4 min read",
      featured: true
    },
    {
      id: 3,
      title: "Teacher Training Success Stories",
      date: "March 5, 2024",
      author: "Grace Mwanza",
      category: "training",
      image: "/api/placeholder/800/400",
      excerpt: "Celebrating the achievements of our teacher development programs.",
      readTime: "6 min read"
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [location]);

  return (
    <section className={`blog ${isStandalonePage ? 'standalone' : ''}`} id="blog">
      <div className="blog-container">
        {isStandalonePage && (
          <div className="blog-header">
            <h1>Our Blog</h1>
            <p>Discover stories, insights, and updates from our educational journey</p>
            
            <div className="blog-filters">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {isStandalonePage && featuredPosts.length > 0 && (
          <div className="featured-posts">
            <h2>Featured Posts</h2>
            <div className="featured-grid">
              {featuredPosts.map(post => (
                <article className="featured-card" key={post.id}>
                  <div className="featured-image">
                    <img src={post.image} alt={post.title} />
                    <span className="featured-tag">Featured</span>
                    <span className="blog-category">{post.category}</span>
                  </div>
                  <div className="featured-content">
                    <div className="blog-meta">
                      <span className="blog-date">{post.date}</span>
                      <span className="blog-read-time">{post.readTime}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="blog-footer">
                      <span className="blog-author">By {post.author}</span>
                      <Link to={`/blog/${post.id}`} className="read-more">Read More</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="blog-main">
          {isStandalonePage && <h2>Latest Articles</h2>}
          <div className="blog-grid">
            {filteredPosts.map(post => (
              <article className="blog-card" key={post.id}>
                <div className="blog-image">
                  <img src={post.image} alt={post.title} />
                  <span className="blog-category">{post.category}</span>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-read-time">{post.readTime}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-footer">
                    <span className="blog-author">By {post.author}</span>
                    <Link to={`/blog/${post.id}`} className="read-more">Read More</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog; 