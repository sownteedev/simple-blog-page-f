import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';
import { postService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsData = await postService.getAllPosts();
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await postService.deletePost(id);
        if (response.success) {
          // Remove post from state
          setPosts(posts.filter(post => post.id !== id));
        }
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Blog Management</h1>
        <div className="admin-nav">
          <Link to="/admin/new-post" className="new-post-btn">Create New Post</Link>
          <Link to="/admin/messages" className="admin-btn">Messages</Link>
          <Link to="/admin/settings" className="admin-btn">Settings</Link>
        </div>
      </div>

      <div className="blog-list">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.author.username}</td>
                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${post.status}`}>
                    {post.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/admin/edit/${post.id}`} className="edit-btn">Edit</Link>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard; 