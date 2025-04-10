import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const handleTryFree = () => {
        // Temporary: Set authenticated to true for demo
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = '/app';
    };

    return (
        <div className="landing-page">
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1>Supercharge Your Lead Generation with AI-Powered Lead Magnets</h1>
                            <p>Discover, create, and distribute high-converting lead magnets in minutes. Powered by advanced AI to help you grow your email list and boost conversions.</p>
                            <button onClick={handleTryFree} className="cta-button">Try It Free</button>
                        </div>
                        <div className="hero-image">
                            <img src="https://placehold.co/600x400" alt="MarketingSudo Platform Preview" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <div className="section-title">
                        <h2>Powerful Features for Modern Marketers</h2>
                        <p>Everything you need to create and distribute effective lead magnets</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>AI-Powered Generation</h3>
                            <p>Create professional lead magnets in minutes using our advanced AI technology. No design skills required.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Smart Distribution</h3>
                            <p>Automatically distribute your lead magnets to relevant communities and platforms to maximize reach.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Analytics & Tracking</h3>
                            <p>Monitor performance and optimize your lead magnets with detailed analytics and insights.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Transform Your Lead Generation?</h2>
                    <p>Join thousands of marketers who are already using MarketingSudo to grow their businesses.</p>
                    <button onClick={handleTryFree} className="cta-button light">Start Free Trial</button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage; 