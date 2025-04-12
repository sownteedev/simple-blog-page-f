import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Post.css';
import { postService, categoryService, authService } from '../../services/api';

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    status: 'draft',
    image_url: '',
    excerpt: '',
    is_featured: false
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = () => {
      const isAdmin = authService.isAdmin();
      if (!isAdmin) {
        navigate('/login');
      }
    };
    
    checkAdmin();
  }, [navigate]);

  // Fetch post and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch post data
        const postData = await postService.getPost(id);
        
        // Fetch categories
        const categoriesData = await categoryService.getCategories();
        
        // Set state
        setFormData({
          title: postData.title,
          content: postData.content,
          category_id: postData.category_id,
          status: postData.status,
          image_url: postData.image_url || '',
          excerpt: postData.excerpt || '',
          is_featured: postData.is_featured
        });
        
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load post data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Ensure category_id is a number
      const postData = {
        ...formData,
        category_id: parseInt(formData.category_id)
      };
      
      await postService.updatePost(id, postData);
      navigate('/admin');
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.detail || 'Failed to update post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading post data...</div>;

  return (
    <div className="post-form-container">
      <div className="post-form-header">
        <h1>Edit Post</h1>
      </div>
      
      {error && <div className="form-error">{error}</div>}
      
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category_id">Category</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            disabled={submitting}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <input
            type="text"
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Brief summary of the post (optional)"
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image_url">Featured Image URL</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="URL to the featured image"
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="15"
            required
            disabled={submitting}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              disabled={submitting}
            />
            Featured Post
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate('/admin')}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
