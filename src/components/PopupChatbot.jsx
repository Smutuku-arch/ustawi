import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './PopupChatbot.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

function PopupChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 👋 I\'m Ustawi, your AI wellness companion. I\'m here to provide support, guidance, and a listening ear. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const prompts = [
    "I'm feeling stressed",
    "Need career advice",
    "Feeling anxious",
    "Mental health tips"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function sendMessage(text = input) {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage].slice(-10);
      
      const { data } = await axios.post(
        `${API_BASE}/api/ai/chat`,
        {
          message: text,
          conversationHistory
        }
      );

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err.response?.data?.error || 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage();
  }

  if (!isOpen) return null;

  return (
    <div className="popup-chatbot">
      <div className="popup-header">
        <div className="popup-header-content">
          <div className="popup-avatar">🌱</div>
          <div>
            <h3>Ustawi AI</h3>
            <span className="popup-status">Online • Anonymous Session</span>
          </div>
        </div>
        <button className="popup-close" onClick={onClose}>×</button>
      </div>

      <div className="popup-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`popup-message ${msg.role}`}>
            {msg.role === 'assistant' && <div className="popup-message-avatar">🌱</div>}
            <div className="popup-message-bubble">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="popup-message assistant">
            <div className="popup-message-avatar">🌱</div>
            <div className="popup-message-bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="popup-prompts">
          {prompts.map((prompt, idx) => (
            <button
              key={idx}
              className="popup-prompt-btn"
              onClick={() => sendMessage(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <form className="popup-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          ➤
        </button>
      </form>

      <div className="popup-footer">
        <small>🔒 Anonymous • No data stored • <a href="#" onClick={onClose}>Create account</a> for full features</small>
      </div>
    </div>
  );
}

export default PopupChatbot;
