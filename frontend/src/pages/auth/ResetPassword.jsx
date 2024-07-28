import React, { useEffect, useState } from 'react';
import { useAuth } from './firebase';
import { toast } from 'react-toastify';
import './auth.css';
import { Link, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await resetPassword(email);
            toast.success("Password reset email sent");
            navigate('/login');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
      document.title = "Reset Password"
    },[])

    return (
        <div className='auth-container'>
            <form onSubmit={handleSubmit} className='auth-form'>
                <div className="auth-form-header">Reset Your Password</div>
                <input type="email" name="email" placeholder='Email' onChange={handleChange} required />
                <button type='submit' className='reset-btn' disabled={loading}>
                    {loading ? 'Sending...' : 'Reset Password'}
                </button>
                <div className="auth-form-footer">
                    Remember your password? <Link to="/login">Login here</Link>
                </div>
            </form>
        </div>
    );
}
