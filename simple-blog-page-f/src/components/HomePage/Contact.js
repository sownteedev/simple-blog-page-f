import React, { useState } from 'react';
import './Contact.css';
import { messageService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Contact = () => {
  const { isAuthenticated, user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Gửi cả username và content
      const messageData = {
        content: content,
        username: user?.username || "Anonymous"
      };
      
      console.log("Sending message data:", messageData);
      const response = await messageService.sendMessage(messageData);
      console.log("Message response:", response);
      
      if (response.success) {
        setSuccess(true);
        setContent('');
        // Close popup after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
          setSuccess(false);
        }, 3000);
      } else {
        console.error('Error response:', response);
        setError(response.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        setError(err.response.data?.message || err.message || 'Failed to send message');
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('No response received from server. Is the backend running?');
      } else {
        setError(err.message || 'Failed to send message');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you about our programs or how you can get involved.</p>
            <div className="contact-details">
              <div className="contact-item">
                <h3>Email</h3>
                <p>info@sonhao.com</p>
              </div>
              <div className="contact-item">
                <h3>Phone</h3>
                <p>+84 123456789</p>
              </div>
              <div className="contact-item">
                <h3>Address</h3>
                <p>96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội</p>
              </div>
            </div>
          </div>
          
          <div className="contact-mail-icon" onClick={() => setShowPopup(true)}>
            <i className="fas fa-envelope"></i>
            <span>Send Message</span>
          </div>
        </div>
      </div>

      {/* Message Popup */}
      {showPopup && (
        <div className="message-popup-overlay">
          <div className="message-popup">
            <div className="message-popup-header">
              <h3>Send a Message</h3>
              <button 
                className="close-popup-btn"
                onClick={() => setShowPopup(false)}
              >
                &times;
              </button>
            </div>
            
            {!isAuthenticated ? (
              <div className="login-required">
                <i className="fas fa-user-lock"></i>
                <p>You need to be logged in to send a message.</p>
                <Link to="/login" className="login-link">Login</Link>
                <span className="or-text">or</span>
                <Link to="/signup" className="signup-link">Create Account</Link>
              </div>
            ) : success ? (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <p>Your message has been sent successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>From: {user?.username} ({user?.email})</label>
                </div>
                <div className="form-group">
                  <textarea 
                    name="content" 
                    placeholder="Message" 
                    rows="5" 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    disabled={loading}
                  ></textarea>
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;