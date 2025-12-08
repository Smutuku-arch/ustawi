import React from 'react';
import './chatFeature.css';

function ChatbotFeature() {
  return (
    <div className="chat-feature">
      <h2>AI-Powered Support</h2>
      <p>Our intelligent chatbot is trained to understand Kenyan context and provide culturally relevant advice in both English and Swahili.</p>
      <div className="chat-preview">
        <div className="chat-message">Hello, I'm feeling stressed about exams...</div>
        <div className="chat-message bot">I understand exam stress can be overwhelming. Let's work through this together. First, have you tried breaking your study material into smaller chunks?</div>
      </div>
    </div>
  );
}

export default ChatbotFeature;