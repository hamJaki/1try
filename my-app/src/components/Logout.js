import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('authToken');
        navigate('/login', { replace: true }); // Redirect to login
    }, [navigate]);

    return null;
}

export default Logout;
