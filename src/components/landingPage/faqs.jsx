import React, { useState } from 'react';
import './faqs.css';

function Faqs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'Is Ustawi free to use?',
      answer: 'Yes! Ustawi offers a free tier with access to basic features including mood tracking and AI chatbot support.'
    },
    {
      question: 'How does the AI chatbot work?',
      answer: 'Our AI chatbot uses advanced language models trained on mental health and career guidance data, with a special focus on Kenyan context and bilingual support.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use industry-standard encryption and never share your personal information with third parties.'
    },
    {
      question: 'Can I access Ustawi on mobile?',
      answer: 'Yes! Ustawi is fully responsive and works seamlessly on all devices including smartphones and tablets.'
    }
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <h2>Frequently Asked Questions</h2>
      <div className="faqs-container">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
            <button className="faq-question" onClick={() => toggleFaq(index)}>
              <span>{faq.question}</span>
              <span className="faq-icon">+</span>
            </button>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faqs;
