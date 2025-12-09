import React, { useState } from 'react';
import { useApp } from './context/appContext';
import Dashboard from './pages/Dashboard';
import Homepage from './pages/home';
import AuthForm from './components/AuthForm';
import PopupChatbot from './components/PopupChatbot';
import './App.css';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showPopupChat, setShowPopupChat] = useState(false);
  const { user, login, logout } = useApp();

  function handleLoginClick() {
    setAuthMode('login');
    setShowAuth(true);
  }

  if (!user) {
    return (
      <>
        <Homepage onLoginClick={handleLoginClick} />
        {showAuth && (
          <div className="modal-overlay" onClick={() => setShowAuth(false)}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setShowAuth(false)}>×</button>
              <AuthForm 
                mode={authMode} 
                onSuccess={() => setShowAuth(false)}
                onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              />
            </div>
          </div>
        )}
        
        {/* Popup Chatbot for non-logged-in users */}
        <PopupChatbot isOpen={showPopupChat} onClose={() => setShowPopupChat(false)} />
        
        {/* Floating Chat Button */}
        {!showPopupChat && (
          <button 
            className="floating-chat-button" 
            onClick={() => setShowPopupChat(true)}
            title="Chat with AI Therapist"
          >
            💬
          </button>
        )}
      </>
    );
  }

  return <Dashboard user={user} onLogout={logout} />;
}

export default App;
