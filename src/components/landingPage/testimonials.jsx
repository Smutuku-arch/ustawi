import React from 'react';
import './testimonials.css';

function Testimonials() {
  const testimonials = [
    {
      text: 'Ustawi helped me manage my anxiety during my final year at KU. The mood tracker and AI chatbot were lifesavers!',
      author: 'Jane M.',
      role: 'Student, Kenyatta University'
    },
    {
      text: 'The career guidance feature helped me identify my strengths and land my dream job. Highly recommended!',
      author: 'David K.',
      role: 'Graduate, JKUAT'
    }
  ];

  return (
    <div>
      <h2>What Our Users Say</h2>
      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <p className="testimonial-text">{testimonial.text}</p>
            <div className="testimonial-author">
              <div className="author-avatar">{testimonial.author[0]}</div>
              <div className="author-info">
                <h4>{testimonial.author}</h4>
                <p>{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
