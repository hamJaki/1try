// Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../services/authService';
import '../styles/Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authService.login({ username, password });
            navigate('/chat');
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <motion.div
            className="auth-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
        >
            <motion.form
                onSubmit={handleSubmit}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 120 }}
            >
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <motion.input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    whileFocus={{ scale: 1.05 }}
                />
                <motion.input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    whileFocus={{ scale: 1.05 }}
                />
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Login
                </motion.button>
                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </motion.form>
        </motion.div>
    );
};

export default Login;
