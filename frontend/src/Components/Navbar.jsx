import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/cart.png';
import { useAuth } from '../pages/auth/firebase';
import { toast } from 'react-toastify';
import './Navbar.css';
import { useCart } from '../pages/cart/CartProvider';
import { ExpandableSearchBar } from './ExpandableSearchBar';

export default function Navbar() {
    const [menuActive, setMenuActive] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const dropdownRef = useRef()

    const handleLogout = async () => {
        try {
            await logout();
            toast.success(`Logout successful`);
            navigate('/login');
        } catch (error) {
            toast.error(`Logout Failed: ${error.message}`);
        }
    };

    const toggleMenu = () => {
        console.log("Current state before toggle:", menuActive);
        setMenuActive(prev => !prev);
        console.log("State after toggle:", !menuActive);  
    };


    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (dropdownOpen && dropdownRef.current) {
                setDropdownOpen(false)
            }
        };

        if (dropdownOpen && dropdownRef.current) {
            window.addEventListener('scroll', handleScroll);
        }


      return () => {
          window.removeEventListener('scroll', handleScroll);
      }
    }, [dropdownOpen])

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (menuActive && !e.target.closest('#nav')) {
                setMenuActive(false);
                setDropdownOpen(false);
            }
        };

        const handleScroll = () => {
            if (menuActive) {
                setMenuActive(false);
            }
        };

        if (menuActive) {
            document.addEventListener('click', handleOutsideClick);
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [menuActive]);

    return (
        <nav className="navbar" id='nav'>
            <div className={`nav-link desktop-nav ${menuActive ? 'active' : ''}`}>
                <Link to="/" onClick={() => setMenuActive(false)}>Home</Link>
                <Link to="/products" onClick={() => setMenuActive(false)}>Products</Link>
                <Link to="/contact-us" onClick={() => setMenuActive(false)}>Contact us</Link>
                <Link to="/about-us" onClick={() => setMenuActive(false)}>About us</Link>
                {menuActive && <ExpandableSearchBar className="ExpandableSearchBar" />}
            </div>
            <div className={`hamburger-menu ${menuActive ? 'is-active' : ''}`} onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>

            <div className="logo">
                <Link to="/" className="logo"><img src={logo} alt="cart-logo" /> QuickCart </Link>
            </div>

            <div className="nav-link desktop-nav">
                <ExpandableSearchBar  />

                <div className="user-icon" onClick={toggleDropdown} ref={dropdownRef}>
                    <i className="fas fa-user"></i>
                    <div className={`user-dropdown ${dropdownOpen ? 'show' : 'hide'}`}>
                        {currentUser ? (
                            <div className="user-info">
                                <div className="user-email">Hello, {currentUser.email}</div>
                                <Link to="#" onClick={handleLogout} className="logout-button">Logout</Link>
                            </div>
                        ) : (
                            <Link to="/login" className="login-button">Login</Link>
                        )}
                    </div>
                </div>
                
                <Link to="/cart">
                    <i className="fas fa-shopping-bag"></i>
                    <span id="cart-count" className="cart-count">
                        {Array.isArray(cartItems) ? cartItems.reduce((count, item) => count + item.quantity, 0) : 0}
                    </span>
                </Link>
            </div>
            <div className="shop-bag">
                <div className="user-icon" onClick={toggleDropdown} ref={dropdownRef}>
                    <i className="fas fa-user"></i>
                    <div className={`user-dropdown ${dropdownOpen ? 'show' : 'hide'}`}>
                        {currentUser ? (
                            <div className="user-info">
                                <div className="user-email">Hello, {currentUser.email}</div>
                                <Link to="#" onClick={handleLogout} className="logout-button">Logout</Link>
                            </div>
                        ) : (
                            <Link to="/login" className="login-button">Login</Link>
                        )}
                    </div>
                </div>
                <Link to="/cart" style={{ marginLeft: '10px' }}>
                    <i className="fas fa-shopping-bag"></i>
                    <span id="cart-count" className="cart-count">
                        {Array.isArray(cartItems) ? cartItems.reduce((count, item) => count + item.quantity, 0) : 0}
                    </span>
                </Link>
            </div>
        </nav>
    );
}
