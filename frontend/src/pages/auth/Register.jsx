import React, { useEffect, useState } from 'react';
import { useAuth } from './firebase';
import { toast } from 'react-toastify';
import './auth.css';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register, signInWithGoogle } = useAuth();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cart: [],
    wishList: []
  });

  useEffect(() => {
    document.title = "Sign-Up"
  }, [])


  const [loading, setLoading] = useState({ register: false, google: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, register: true });
    try {
      const userCredential = await register(userData.email, userData.password);
      const user = userCredential.user;
      if (user) {
        toast.success("Registration successful!");
        navigate('/login');
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Please use a different email or login.');
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading({ ...loading, register: false });
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading({ ...loading, google: true });
    try {
      const userCredential = await signInWithGoogle();
      toast.success("Google sign-up successful!");
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading({ ...loading, google: false });
    }
  };

  return (
    <div className="auth-container">
      <form className='auth-form' onSubmit={handleSubmit}>
        <div className="auth-form-header">Create Your Account</div>
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required autoComplete="given-name" />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required autoComplete="family-name" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required autoComplete="email" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required autoComplete="new-password" />
        {!loading.google && (
          <button type="submit" className="login-button">
            {loading.register ? "Registering..." : "Register"}
          </button>
        )}
        {!loading.register && (
          <button type="button" onClick={handleGoogleSignUp} className="google-button">
            <div className="google-icon-wrapper">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" className="google-icon">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="google-button-text">{loading.google ? "Signing up..." : "Sign up with Google"}</span>
          </button>
        )}
        <div className="auth-form-footer">Already have an account? <a href="/login">Login here</a></div>
      </form>
    </div>
  );
}
