import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import LeadMagnetGenerator from './components/LeadMagnetGenerator/LeadMagnetGenerator';
import LandingPage from './components/Landing/LandingPage';
import './App.css';

// Temporary auth check - will be replaced with proper auth
const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true';
};

// Protected route component
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={
              <ProtectedRoute>
                <LeadMagnetGenerator />
              </ProtectedRoute>
            } />
            <Route path="/features" element={<div>Features Page</div>} />
            <Route path="/how-it-works" element={<div>How It Works Page</div>} />
            <Route path="/pricing" element={<div>Pricing Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div>Dashboard</div>
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 