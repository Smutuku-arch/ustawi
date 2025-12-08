import React from 'react';
import './howItWorks.css';

function HowItWorks() {
  const steps = [
    { number: 1, title: 'Sign Up', description: 'Create your free account in seconds' },
    { number: 2, title: 'Share Your Goals', description: 'Tell us about your mental health and career aspirations' },
    { number: 3, title: 'Get Support', description: 'Receive personalized guidance and track your progress' }
  ];

  return (
    <div className="how-it-works">
      <h2>How It Works</h2>
      <div className="steps-container">
        {steps.map((step) => (
          <div key={step.number} className="step">
            <div className="step-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;