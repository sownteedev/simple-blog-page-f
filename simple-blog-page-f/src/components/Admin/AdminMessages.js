// src/components/Admin/AdminMessages.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { messageService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminMessages = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // flag XSS
  const [xssEnabled, setXssEnabled] = useState(false);

  // 0. Redirect nếu ko phải admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  // 1. Load vulnerability XSS (id = 1)
  useEffect(() => {
    const loadXssFlag = async () => {
      try {
        const res = await api.get('/settings');
        // res.data là danh sách VulnerabilityOut
        const xssVuln = res.data.find(v => v.id === 1);
        setXssEnabled(xssVuln?.status === 'Yes');
      } catch (err) {
        console.error('Error fetching XSS setting:', err);
      }
    };
    loadXssFlag();
  }, []);

  // 2. Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await messageService.getMessages();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
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
          setMessages(prev => prev.filter(m => m.id !== id));
          if (selectedMessage?.id === id) {
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
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="admin-messages">
      <div className="admin-header">
        <h1>Messages</h1>
        <button onClick={() => navigate('/admin')} className="admin-btn">
          Back to Dashboard
        </button>
      </div>

      <div className="messages-container">
        <div className="messages-list">
          <h2>Inbox</h2>
          {messages.length === 0 ? (
            <div className="no-messages">No messages found</div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`message-item ${
                  selectedMessage?.id === message.id ? 'selected' : ''
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="message-item-header">
                  <span className="sender-name">{message.username}</span>
                  <span className="message-date">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="message-preview">{message.content}</div>
              </div>
            ))
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
                  <div className="detail-date">
                    {formatDate(selectedMessage.created_at)}
                  </div>
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
                {xssEnabled ? (
                  // render raw HTML nếu XSS được bật
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedMessage.content }}
                  />
                ) : (
                  // render plain text nếu XSS tắt
                  <p>{selectedMessage.content}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
