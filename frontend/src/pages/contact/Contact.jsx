import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = "Contact Us"
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://quick-cart-react-js-server.vercel.app/send-email', formData);
      setSent(true)
      setTimeout(() => setSent(false), 3000 )

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      console.error('Error sending email: ', err);
    }
  };

  return (
    <main className="contact">
      <div className="link-position">
        <p>
          <Link to="/">Home</Link> / <Link to="/contact-us">Contact</Link>
        </p>
        <h2 className="contact-h2">Contact Us</h2>
      </div>

      <section className="contact-section">
        <h1 className="contact-h1">Contact QuickCart</h1>
        <p className="p">
          <span>Need help? Fill out the form below.</span>
          <i>If you have any questions, please don't hesitate to reach out to us.</i>
          <span>You can also reach out directly to our customer service team at <a href="mailto:quickcart_@hotmail.com">support@quickcart.com</a></span>
        </p>
        <form id="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">*First Name:</label>
            <input type="text" id="firstName" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">*Last Name:</label>
            <input type="text" id="lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">*Email:</label>
            <input type="email" id="email" name="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input type="tel" id="phone" name="phone" placeholder="(123) 456-7890" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="message">*Message:</label>
            <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} required></textarea>
          </div>
          <button type="submit" className="submit-button">Send Message</button>
        </form>
        {sent && <p className="sent" style={{ margin: '10px', color: 'green' }}>Message sent successfully!</p>}
      </section>
    </main>
  );
}
