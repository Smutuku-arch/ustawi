import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/ai';
import './AIChatbot.css';

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m Ustawi AI, your compassionate mental health and career guidance assistant. How can I support you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
      const { reply } = await sendChatMessage(input);
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { 
        role: 'assistant', 
        content: `I apologize, but I'm having trouble connecting right now. Error: ${err.message}. Please try again in a moment.`,
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  }

  const quickPrompts = [
    '💭 I\'m feeling stressed about exams',
    '💼 Help me choose a career path',
    '😰 I\'m dealing with anxiety',
    '🎯 I need motivation tips'
  ];

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
          <div key={i} className={`message ${msg.role} ${msg.isError ? 'error' : ''}`}>
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
                onClick={() => setInput(prompt.split(' ').slice(1).join(' '))}
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
