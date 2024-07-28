import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/cart.png';
import './Footer.css';

export default function Footer() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const body = document.body
        if (isDarkMode) {
            body.classList.add('dark_mode'); 
        } else {
            body.classList.remove('dark_mode');  
        }

        return () => {
            body.classList.remove("dark_mode")
        }
    }, [isDarkMode])
    return (
        <footer>
            <div className="container-footer">
                <div className="content_footer">
                    <div className="profile">
                        <div className="logo_area">
                            <Link to="/"><img src={logo} alt="quickcart" /></Link>
                            <span className="logo-name"><Link to="/">QuickCart</Link></span>
                            <button id="dark-mode" className={isDarkMode ? "hide" : ""} onClick={() => setIsDarkMode(true)}><i className="fa-solid fa-moon"></i></button>
                            <button id="light-mode" className={!isDarkMode ? 'hide' : ""} onClick={() => setIsDarkMode(false)}><i className="fa-solid fa-sun"></i></button>
                        </div>
                        <div className="desc_area">
                            <p>Explore QuickCart for a fast, reliable, and delightful shopping experience with exclusive
                                deals just a click away! </p>
                        </div>
                        <div className="social_media">
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin"></i></a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook"></i></a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>
                        </div>
                    </div>

                    <div className="service_area">
                        <ul className="service_header">
                            <li className="service_name">Services</li>
                            <li><Link to="/order-tracking">Order Tracking</Link></li>
                            <li><Link to="/shipping-delivery">Shipping & Delivery</Link></li>
                            <li><Link to="/returns-exchanges">Returns & Exchanges</Link></li>
                        </ul>
                    </div>
                    <div className="service_area">
                        <ul className="service_header">
                            <li className="service_name">Quick Links</li>
                            <li><Link to="/special-offers">Special Offers</Link></li>
                            <li><Link to="/best-sellers">Best Sellers</Link></li>
                            <li><Link to="/contact-us">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="service_area">
                        <ul className="service_header">
                            <li className="service_name">About QuickCart</li>
                            <li><Link to="/about-us">About Us</Link></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/terms-service">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="icon-container">
                    <i className="fab fa-cc-visa" style={{ color: 'navy' }}></i>
                    <i className="fab fa-cc-amex" style={{ color: 'blue' }}></i>
                    <i className="fab fa-cc-mastercard" style={{ color: 'red' }}></i>
                    <i className="fab fa-cc-discover" style={{ color: 'orange' }}></i>
                </div>
                <hr />
                <div className="footer_bottom">
                    <span>© 2024 QuickCart | All rights reserved</span>
                    <div className="copy_right">
                    </div>
                    <div className="tou">
                        <Link to="/terms-of-use">Term of Use</Link>
                        <Link to="/privacy-policy">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
