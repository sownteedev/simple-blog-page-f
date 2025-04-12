import React from 'react';
import './Contact.css';

const Contact = () => {
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
          
          <div className="contact-form">
            <form>
              <div className="form-group">
                <input type="text" placeholder="Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Email" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Message" rows="5" required></textarea>
              </div>
              <div className="form-group">
                <button type="submit" className="submit-btn">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;