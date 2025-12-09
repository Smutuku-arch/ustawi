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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="#services" onClick={closeMobileMenu}>Services</a>
          <a href="#howItWorks" onClick={closeMobileMenu}>How It Works</a>
          <a href="#testimonials" onClick={closeMobileMenu}>About Us</a>
          <a href="#chatfeature" onClick={closeMobileMenu}>AI Therapist</a>
          <button className="btn-get-started" onClick={() => { closeMobileMenu(); onLoginClick(); }}>
            Get Started
          </button>
        </div>
        
        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && <div className="navbar-overlay" onClick={closeMobileMenu}></div>}
      </div>
    </nav>
  );
}

export default Navbar;
