import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PreventBackNavigation = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handlePopState = (event) => {
            event.preventDefault();
            navigate('/');
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    return children;
};

export default PreventBackNavigation;
