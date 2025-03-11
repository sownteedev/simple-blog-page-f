import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Post.css';

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    status: '',
    image: ''
  });

  useEffect(() => {
    // Simulated API call to fetch post data
    const fetchPost = async () => {
      // This is mock data - replace with actual API call
      const mockPost = {
        title: "Supporting Education in Rural Communities",
        content: "Lorem ipsum dolor sit amet...",
        category: "education",
        status: "published",
        image: "https://example.com/image.jpg"
      };
      setFormData(mockPost);
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    navigate('/admin'); // Redirect to admin dashboard after submission
  };

  return (
    <div className="post-form-container">
      <div className="post-form-header">
        <h1>Edit Post</h1>
      </div>
      
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
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="education">Education</option>
            <option value="technology">Technology</option>
            <option value="community">Community</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Featured Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
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
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/admin')}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
