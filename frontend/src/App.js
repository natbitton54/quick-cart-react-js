import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './Layout'; // Ensures all your routes and pages are structured properly
import { ToastContainer } from 'react-toastify'; // Provides nice alerts and notifications
import 'react-toastify/dist/ReactToastify.css'; // Styling for the notifications
import { AuthProvider } from './pages/auth/firebase'; // Context provider for authentication
import { CartProvider } from './pages/cart/CartProvider'; // Assuming you have a CartProvider based on previous discussions
import './App.css'

function App() {
  return (
    <AuthProvider> 
      <CartProvider> 
          <div>
            <Layout /> 
            <div style={{ position: 'absolute', top: 100, width: '100%' }}>
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
