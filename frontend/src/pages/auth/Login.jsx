import React, { useEffect, useState } from 'react';
import { useAuth } from './firebase';
import { toast } from 'react-toastify';
import './auth.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, signInWithGoogle } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '', rememberMe: false });
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login"
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingLogin(true);

    try {
      await login(credentials.email, credentials.password, credentials.rememberMe);
      toast.success(`Login successful, hello ${credentials.email}`);
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const remember = credentials.rememberMe;  
    setLoadingGoogle(true);
    try {
      await signInWithGoogle(remember);
      toast.success(`Google-Login successful, hello ${credentials.email}`);
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingGoogle(false);
    }
  };


  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-header">Login to Your Account</div>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <div className="checkbox-container">
          <input type="checkbox" name="rememberMe" checked={credentials.rememberMe} onChange={handleChange} />
          <label>Remember Me</label>
        </div>
        <button type="submit" className="login-button" disabled={loadingLogin || loadingGoogle}>
          {loadingLogin ? 'Logging in...' : 'Login'}
        </button>
        <button type="button" onClick={handleGoogleSignIn} className="google-button" disabled={loadingGoogle || loadingLogin}>
          <div className="google-icon-wrapper">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" className="google-icon">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          <span className="google-button-text">{loadingGoogle ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>
        <p className="reset-password">
          Forgot your password? <Link to="/reset-password">Reset here</Link>
        </p>

        <div className="auth-form-footer">
          New here? <a href="/register">Create an account</a>
        </div>
      </form>
    </div>
  );
}
