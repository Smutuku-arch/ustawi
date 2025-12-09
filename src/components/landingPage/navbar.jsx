import React, { useState, useEffect } from 'react';
import './navbar.css';

function Navbar({ onLoginClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-logo">🌱</div>
          <div>
            <h1>Ustawi</h1>
            <p>...your therapist</p>
          </div>
        </div>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        
        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
          <a href="#howItWorks" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
          <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)}>About Us</a>
          <a href="#chatfeature" onClick={() => setIsMobileMenuOpen(false)}>AI Therapist</a>
          <button className="btn-get-started" onClick={onLoginClick}>
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
