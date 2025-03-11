import React from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const AdminDashboard = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Supporting Education in Rural Communities",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      status: "published"
    },
    {
      id: 2,
      title: "Technology Integration in Classrooms",
      author: "Michael Tembo",
      date: "March 10, 2024",
      status: "draft"
    }
  ];

  const handleDelete = (id) => {
    // Handle delete logic
    console.log('Delete post:', id);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Blog Management</h1>
        <Link to="/admin/new-post" className="new-post-btn">Create New Post</Link>
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
            {blogPosts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{post.date}</td>
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