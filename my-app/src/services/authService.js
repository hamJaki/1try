// authService.js
import axios from 'axios';

const API_URL = 'https://1try-production.up.railway.app/api/auth/';

const register = async (userData) => {
    try {
        const response = await axios.post(API_URL + 'register', userData);
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        throw error;
    }
};

const login = async (userData) => {
    try {
        const response = await axios.post(API_URL + 'login', userData);
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

export default {
    register,
    login,
    logout,
};
