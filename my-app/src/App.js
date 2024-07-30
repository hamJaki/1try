import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import { Analytics } from "@vercel/analytics/react"
import Home from './components/homePage';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/chat" element={<ProtectedRoute component={Chat} />} />
                </Routes>
                <Analytics />
            </div>
        </Router>
    );
};

export default App;
