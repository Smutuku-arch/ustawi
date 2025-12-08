import React, { useState, useEffect } from 'react';
import MoodTracker from '../components/MoodTracker';
import AdminDashboard from '../components/AdminDashboard';
import AIChatbot from '../components/AIChatbot';
import Resources from './Resources';
import BookSession from './BookSession';
import { getMoodStats } from '../api/moods';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await getMoodStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate streak from backend data
  function getStreak() {
    return stats?.streak || 0;
  }

  // Get overall mood based on weighted average score
  function getOverallMood() {
    if (!stats || !stats.summary || !stats.summary.avgScore) return 'Unknown';
    const avg = stats.summary.avgScore;
    if (avg >= 7.5) return 'Excellent';
    if (avg >= 5.5) return 'Good';
    if (avg >= 3.5) return 'Fair';
    if (avg >= 1.5) return 'Needs Care';
    return 'Critical';
  }

  // Get mood emoji
  function getMoodEmoji() {
    const mood = getOverallMood();
    const emojiMap = {
      'Excellent': '😊',
      'Good': '🙂',
      'Fair': '😐',
      'Needs Care': '😟',
      'Critical': '😰',
      'Unknown': '❓'
    };
    return emojiMap[mood] || '❓';
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>Ustawi</h1>
          <p>...your therapist</p>
        </div>
        <div className="nav-links">
          <button 
            className={activeTab === 'home' ? 'active' : ''} 
            onClick={() => setActiveTab('home')}
          >
            <span className="icon">🏠</span> Home
          </button>
          <button 
            className={activeTab === 'mood' ? 'active' : ''} 
            onClick={() => setActiveTab('mood')}
          >
            <span className="icon">📊</span> Mood Tracker
          </button>
          <button 
            className={activeTab === 'chat' ? 'active' : ''} 
            onClick={() => setActiveTab('chat')}
          >
            <span className="icon">💬</span> AI Chat
          </button>
          <button 
            className={activeTab === 'resources' || activeTab.startsWith('view-') ? 'active' : ''} 
            onClick={() => setActiveTab('resources')}
          >
            <span className="icon">📚</span> Resources
          </button>
          <button 
            className={activeTab === 'book' ? 'active' : ''} 
            onClick={() => setActiveTab('book')}
          >
            <span className="icon">📅</span> Book Session
          </button>
          {user.role === 'admin' && (
            <button 
              className={activeTab === 'admin' ? 'active' : ''} 
              onClick={() => setActiveTab('admin')}
            >
              <span className="icon">⚙️</span> Admin
            </button>
          )}
        </div>
        <div className="nav-user">
          <div className="user-info">
            <div className="user-avatar">{(user.name || user.email)[0].toUpperCase()}</div>
            <div>
              <p className="user-name">{user.name || 'User'}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        {activeTab === 'home' && (
          <div className="dashboard-home">
            <div className="welcome-card">
              <h1>Welcome back, {user.name || 'there'}! 👋</h1>
              <p>How are you feeling today? Let's continue your wellness journey.</p>
            </div>
            
            <div className="quick-actions">
              <div className="action-card" onClick={() => setActiveTab('mood')}>
                <span className="action-icon">📊</span>
                <h3>Track Your Mood</h3>
                <p>Log how you're feeling today</p>
              </div>
              <div className="action-card" onClick={() => setActiveTab('chat')}>
                <span className="action-icon">💬</span>
                <h3>Talk to AI</h3>
                <p>Get instant support and guidance</p>
              </div>
              <div className="action-card" onClick={() => setActiveTab('resources')}>
                <span className="action-icon">📚</span>
                <h3>Resources</h3>
                <p>Explore articles and videos</p>
              </div>
              <div className="action-card" onClick={() => setActiveTab('book')}>
                <span className="action-icon">📅</span>
                <h3>Book Session</h3>
                <p>Schedule a therapy session</p>
              </div>
            </div>

            <div className="stats-cards">
              {loading ? (
                <div className="loading-stats-home">Loading your stats...</div>
              ) : (
                <>
                  <div className="stat-card">
                    <span className="stat-icon">🔥</span>
                    <div>
                      <h3>{getStreak()} Days</h3>
                      <p>Current Streak</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">✅</span>
                    <div>
                      <h3>{stats?.summary?.count || 0}</h3>
                      <p>Check-ins</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">{getMoodEmoji()}</span>
                    <div>
                      <h3>{getOverallMood()}</h3>
                      <p>Overall Mood</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'mood' && <MoodTracker />}
        {activeTab === 'chat' && <AIChatbot />}
        {(activeTab === 'resources' || activeTab.startsWith('view-')) && (
          <Resources activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {activeTab === 'book' && <BookSession />}
        {activeTab === 'admin' && user.role === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}

export default Dashboard;
