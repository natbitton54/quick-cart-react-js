import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './pages/home/Home';
import Contact from './pages/contact/Contact';
import About from './pages/about/About';
import Products from './pages/product/Products';
import Cart from './pages/cart/Cart';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './ProtectedRoute';
import ResetPassword from './pages/auth/ResetPassword';
import NotFound from './pages/NotFound/NotFound';
import StripeSuccess from './pages/checkout/StripeSuccess';

const Layout = () => {
    const location = useLocation();
    const showFooter = !['/checkout', '/register', '/login', '/reset-password'].includes(location.pathname);

    return (
        <>
            <Navbar />
             <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/contact-us" element={<Contact />} />
                    <Route path="/about-us" element={<About />} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/success" element={<StripeSuccess />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                {showFooter && <Footer />}
            </div>
        </>
    );
};

export default Layout;
