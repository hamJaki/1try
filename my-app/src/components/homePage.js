import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logotype.png';
import '../styles/homePage.css';

function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="App">
            <header className="header">
                <nav className="navbar">
                    <div className="logo">
                        <img src={logo} alt="Your Logo" className="logo-image"/>
                    </div>
                    <div className={`burger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <ul className={`nav-links ${menuOpen ? "nav-active" : ""}`}>
                        <li><a href="#home" onClick={toggleMenu}>Home</a></li>
                        <li><a href="#about" onClick={toggleMenu}>About</a></li>
                        <li><a href="#learners" onClick={toggleMenu}>For Learners</a></li>
                        <li><a href="#contact" onClick={toggleMenu}>Contact</a></li>
                    </ul>
                    <div className="auth-buttons">
                        <Link to="/login" className="btn auth-btn" onClick={toggleMenu}>Sign In</Link>
                        <Link to="/register" className="btn auth-btn" onClick={toggleMenu}>Sign Up</Link>
                    </div>
                </nav>
            </header>

            <main className="container">
                <section id="home" className="hero-section">
                    <div className="overlay"></div>
                    <div className="hero-content">
                        <h1>Your Personalized Discrete Math AI Tutor</h1>
                        <p>Learn at your own pace with our interactive and personalized AI tutor.</p>
                        <Link to="/register" className="btn">Get Started</Link>
                    </div>
                </section>

                <section id="learners" className="section">
                    <h2>For Learners</h2>
                    <div className="cards">
                        <div className="card">
                            <h3>For Beginners</h3>
                            <p>Launch your journey from the inception</p>
                            <Link to="/register" className="btn">Get Started</Link>
                        </div>
                        <div className="card">
                            <h3>For Experts</h3>
                            <p>Already skilled? Test and expand here.</p>
                            <Link to="/register" className="btn">Get Started</Link>
                        </div>
                        <div className="card">
                            <h3>For Preparation</h3>
                            <p>Want to practice for your exam? Test for any topic.</p>
                            <Link to="/register" className="btn">Get Started</Link>
                        </div>
                    </div>
                </section>

                <section id="about" className="section">
                    <h2>On-demand AI-powered support for education.</h2>
                    <div className="info-sections">
                        <div className="info-card">
                            <h3>For Teachers</h3>
                            <p>Experience the best AI for teachers. Built for educators by educators, with your needs in mind. Our AI tutor simplifies your workflow while keeping your work and your student data private and secure.</p>
                            <div className="buttons">
                                <Link to="/register" className="btn">Sign up for free</Link>
                                <Link to="/learn-more" className="learn-more">Learn more</Link>
                            </div>
                        </div>
                        <div className="info-card">
                            <img src={`${process.env.PUBLIC_URL}/3.jpg`} alt="Teacher Image" />
                            <p>Create detailed lesson plans and assessments for your students.</p>
                        </div>
                    </div>
                    <div className="info-sections">
                        <div className="info-card">
                            <img src={`${process.env.PUBLIC_URL}/2.jpg`} alt="Learner Image" />
                            <p>Enhance your learning experience with personalized AI support.</p>
                        </div>
                        <div className="info-card">
                            <h3>For Learners</h3>
                            <p>Build your brain power. Our AI tutor challenges you to think critically and solve problems without giving you direct answers. Learn new skills anytime, whether it's discrete math, algebra, or problem-solving.</p>
                            <div className="buttons">
                                <Link to="/register" className="btn">Get Started</Link>
                                <Link to="/learn-more" className="learn-more">Learn more</Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="contact" className="section">
                    <h2>Contact Us</h2>
                    <p>If you have any questions or need support, feel free to reach out to us at <a href="mailto:support@discretemathtutor.com">support@discretemathtutor.com</a>.</p>
                </section>
            </main>

            <footer className="footer">
                <p>&copy; 2024 Discrete Math AI Tutor. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default HomePage;
