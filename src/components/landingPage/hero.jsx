import React from 'react';
import './hero.css';

function Hero({ onLoginClick }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Your Journey to Wellness Starts Here</h1>
        <p>
          Expert-led therapy tailored to your unique needs. At Ustawi, we're here to guide you toward healing, growth, and lasting wellness in a supportive and inclusive environment.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={onLoginClick}>
            Get Started
          </button>
          <a href="#services" className="btn-secondary">
            Learn More
          </a>
        </div>
      </div>
      <div className="hero-image">
        <img 
          src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=400&fit=crop" 
          alt="Person meditating peacefully" 
        />
      </div>
    </section>
  );
}

export default Hero;
