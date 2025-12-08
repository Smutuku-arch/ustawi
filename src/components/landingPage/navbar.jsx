import React from 'react';
import './navbar.css';

function Navbar({ onLoginClick }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Ustawi</h1>
          <p>...your therapist</p>
        </div>
        <div className="navbar-menu">
          <button onClick={() => scrollToSection('services')}>Services</button>
          <button onClick={() => scrollToSection('howItWorks')}>How It Works</button>
          <button onClick={() => scrollToSection('testimonials')}>About Us</button>
          <button onClick={() => scrollToSection('contact')}>AI Therapist</button>
          <button className="btn-get-started" onClick={onLoginClick}>Get Started</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
