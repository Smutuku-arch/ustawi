import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './AIChatbot.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 👋 I\'m Ustawi, your AI wellness companion. I\'m here to provide support, guidance, and a listening ear. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    '💭 I\'m feeling stressed about exams',
    '💼 Help me choose a career path',
    '😰 I\'m dealing with anxiety',
    '🎯 I need motivation tips'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function onSend(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = [...messages, userMsg].slice(-10);
      
      const { data } = await axios.post(
        `${API_BASE}/api/ai/chat`,
        {
          message: input,
          conversationHistory
        }
      );

      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err.response?.data?.error || 'Sorry, I encountered an error. Please try again.';
      setMessages((m) => [...m, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  }

  const handlePromptClick = (prompt) => {
    setInput(prompt.split(' ').slice(1).join(' '));
  };

  return (
    <div className="ai-chatbot">
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="bot-avatar">
            <span>🤖</span>
          </div>
          <div>
            <h1>Ustawi AI Assistant</h1>
            <p className="bot-status">
              <span className="status-dot"></span>
              Online - Here to help 24/7
            </p>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? (
                <span>👤</span>
              ) : (
                <span>🤖</span>
              )}
            </div>
            <div className="message-content">
              <div className="message-bubble">
                {msg.content}
              </div>
              <span className="message-time">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message assistant">
            <div className="message-avatar">
              <span>🤖</span>
            </div>
            <div className="message-content">
              <div className="message-bubble typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="quick-prompts">
          <p>Quick suggestions:</p>
          <div className="prompts-grid">
            {quickPrompts.map((prompt, i) => (
              <button 
                key={i} 
                className="prompt-btn"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <form className="chat-input-form" onSubmit={onSend}>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="input-hint">
          Press Enter to send • Shift + Enter for new line
        </p>
      </form>
    </div>
  );
}
