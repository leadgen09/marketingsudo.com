import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    MarketingSudo
                </Link>
                
                <nav className="nav-links">
                    <Link to="/features">Features</Link>
                    <Link to="/how-it-works">How It Works</Link>
                    <Link to="/pricing">Pricing</Link>
                    <Link to="/contact">Contact</Link>
                </nav>

                <div className="user-actions">
                    <button className="cta-button">Try It Free</button>
                    <div className="user-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className="user-icon">👤</span>
                        {isMenuOpen && (
                            <div className="dropdown-menu">
                                <Link to="/dashboard">Dashboard</Link>
                                <Link to="/profile">Profile</Link>
                                <Link to="/settings">Settings</Link>
                                <button>Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 