import React from 'react';
import './services.css';

function Services() {
  const services = [
    {
      icon: '🧠',
      title: 'Mental Health Support',
      description: 'Personalized therapy and counseling to help you navigate stress, anxiety, and emotional challenges with expert guidance.'
    },
    {
      icon: '💼',
      title: 'Career Guidance',
      description: 'AI-powered career recommendations tailored to your strengths, interests, and professional goals for success.'
    },
    {
      icon: '🤖',
      title: 'AI Chatbot Assistant',
      description: 'Get instant, empathetic support 24/7 from our intelligent chatbot trained in mental wellness and career advice.'
    },
    {
      icon: '📚',
      title: 'Resource Library',
      description: 'Access a curated collection of articles, videos, and exercises designed to support your personal growth journey.'
    }
  ];

  return (
    <>
      <h2>Our Services</h2>
      <p>Comprehensive support tailored to your mental health and career development needs</p>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <span className="service-icon">{service.icon}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Services;
