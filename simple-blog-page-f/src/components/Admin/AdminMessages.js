import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminMessages = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await messageService.getMessages();
        setMessages(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await messageService.deleteMessage(id);
        if (response.success) {
          // Remove message from state
          setMessages(messages.filter(message => message.id !== id));
          // If selected message was deleted, clear selection
          if (selectedMessage && selectedMessage.id === id) {
            setSelectedMessage(null);
          }
        }
      } catch (err) {
        console.error('Error deleting message:', err);
        alert('Failed to delete message');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) return <div className="loading">Loading messages...</div>;
  if (error) return <div className="error">{error}</div>;

  // try {
  //   const xssStatus = await api.get('/')
  // }

  return (
    <div className="admin-messages">
      <div className="admin-header">
        <h1>Messages</h1>
        <button 
          onClick={() => navigate('/admin')}
          className="admin-btn"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="messages-container">
        <div className="messages-list">
          <h2>Inbox</h2>
          
          {messages.length === 0 ? (
            <div className="no-messages">No messages found</div>
          ) : (
            <div className="message-items">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={`message-item ${selectedMessage && selectedMessage.id === message.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="message-item-header">
                    <div className="message-sender">
                      <span className="sender-name">{message.username}</span>
                    </div>
                    <span className="message-date">{new Date(message.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="message-preview">{message.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="message-detail">
          {!selectedMessage ? (
            <div className="no-message-selected">
              <p>Select a message to view details</p>
            </div>
          ) : (
            <>
              <div className="message-detail-header">
                <div>
                  <h3>Message from {selectedMessage.username}</h3>
                  <div className="detail-date">{formatDate(selectedMessage.created_at)}</div>
                </div>
                <div className="message-actions">
                  <button 
                    className="delete-message-btn"
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="message-detail-content">
                <p>{selectedMessage.content}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages; 