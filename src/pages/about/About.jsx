import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import videoMP4 from '../../assets/SnapSave.io-Ecommerce promotion-(1080p).mp4';
import videoOGG from '../../assets/SnapSave.io-Ecommerce promotion-(1080p).ogg';
import videoWEBM from '../../assets/SnapSave.io-Ecommerce promotion-(1080p).webm';
import './about.css';

export default function About() {
  useEffect(() => {
    document.title = "About Us"
  }, [])
  return (
    <main className="about">
      <div className="link-position">
        <p>
          <Link to="/">Home</Link> / <Link to="/about-us">About</Link>
        </p>
        <h2 className="about-h2">About Us</h2>
      </div>
      <div className="content">
        <div className="text-section">
          <div className="section">
            <h2 className="section-header">Our Mission</h2>
            <p className="section-text">
              Our mission at QuickCart is to empower individuals and businesses to shop smarter and more
              conveniently, ensuring that every transaction from the smallest to the largest is seamless, secure,
              and satisfactory. We aim to provide a platform that not only meets but exceeds customer expectations,
              enabling a shopping experience that saves time, money, and effort.
            </p>
          </div>
          <div className="section">
            <h2 className="section-header">Our Vision</h2>
            <p className="section-text">
              At QuickCart, our vision is to redefine the online shopping experience by creating a universal marketplace
              that connects consumers and vendors with ease and efficiency. We envision a future where our platform
              becomes the go-to destination for all shopping needs, recognized for its unparalleled customer service,
              innovative technology, and commitment to sustainability.
            </p>
          </div>
        </div>
        <div className="video-section">
          <div className="video-wrapper">
            <video className="responsive-video" controls>
              <source src={videoMP4} type="video/mp4" />
              <source src={videoOGG} type="video/webm" />
              <source src={videoWEBM} type="video/ogg" />
            </video>
          </div>
        </div>
      </div>
    </main>
  );
}
