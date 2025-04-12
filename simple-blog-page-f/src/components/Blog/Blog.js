import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Blog.css';
import { postService, categoryService } from '../../services/api';

const Blog = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/blog';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and posts on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await categoryService.getCategories();
        const formattedCategories = [
          { id: 'all', name: 'All Posts' },
          ...categoriesData.map(category => ({
            id: category.slug,
            name: category.name
          }))
        ];
        setCategories(formattedCategories);
        
        // Fetch posts
        await fetchPosts('all');
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load blog data');
        setLoading(false);
      }
    };
    
    fetchData();
    
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [location]);

  // Fetch posts with filters
  const fetchPosts = async (category) => {
    try {
      const params = {};
      
      // Add category filter if not 'all'
      if (category !== 'all') {
        params.category = category;
      }
      
      // Add search filter if present
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const postsData = await postService.getPosts(params);
      setPosts(postsData);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchPosts(categoryId);
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(selectedCategory);
  };

  // Filter posts for display
  const filteredPosts = posts.filter(post => post.status === 'published');
  const featuredPosts = filteredPosts.filter(post => post.is_featured);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <section className={`blog ${isStandalonePage ? 'standalone' : ''}`} id="blog">
      <div className="blog-container">
        {isStandalonePage && (
          <div className="blog-header">
            <h1>Our Blog</h1>
            <p>Discover stories, insights, and updates from our Blog</p>
            
            <div className="blog-filters">
              <div className="search-box">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" style={{ display: 'none' }}>Search</button>
                </form>
              </div>
              
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.id)}
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
                    <img src={post.image_url || 'https://source.unsplash.com/800x400/?blog'} alt={post.title} />
                    <span className="featured-tag">Featured</span>
                    <span className="blog-category">{post.category.name}</span>
                  </div>
                  <div className="featured-content">
                    <div className="blog-meta">
                      <span className="blog-date">{new Date(post.created_at).toLocaleDateString()}</span>
                      <span className="blog-read-time">{post.read_time}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="blog-footer">
                      <span className="blog-author">By {post.author.username}</span>
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
                  <img src={post.image_url || 'https://source.unsplash.com/800x400/?blog'} alt={post.title} />
                  <span className="blog-category">{post.category.name}</span>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-date">{new Date(post.created_at).toLocaleDateString()}</span>
                    <span className="blog-read-time">{post.read_time}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-footer">
                    <span className="blog-author">By {post.author.username}</span>
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