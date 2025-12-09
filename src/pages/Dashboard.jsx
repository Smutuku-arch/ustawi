import React, { useState, useEffect } from 'react';
import MoodTracker from '../components/MoodTracker';
import AdminDashboard from '../components/AdminDashboard';
import AIChatbot from '../components/AIChatbot';
import Resources from './Resources';
import BookSession from './BookSession';
import axios from 'axios';
import './Dashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const { data } = await axios.get(`${API_BASE}/api/moods/stats`);
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="navbar-container">
          <div className="nav-brand">
            <div className="logo">🌱</div>
            <div>
              <h1>Ustawi</h1>
              <p>...your therapist</p>
            </div>
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
            <div className="user-avatar">
              {user.name ? user.name[0].toUpperCase() : '?'}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        {activeTab === 'home' && (
          <div className="dashboard-home">
            <div className="welcome-card">
              <h1>Welcome back, {user.name || 'Friend'}! 👋</h1>
              <p>How are you feeling today?</p>
            </div>

            <div className="stats-grid">
              {loading ? (
                <div className="loading">Loading your stats...</div>
              ) : stats ? (
                <>
                  <div className="stat-card">
                    <span className="stat-icon">😊</span>
                    <h3>Average Mood</h3>
                    <p className="stat-value">{stats.averageScore}/10</p>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">📝</span>
                    <h3>Total Entries</h3>
                    <p className="stat-value">{stats.totalEntries}</p>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">🎯</span>
                    <h3>This Week</h3>
                    <p className="stat-value">{stats.recentMoods?.length || 0}</p>
                  </div>
                </>
              ) : (
                <div className="stat-card">
                  <p>Start tracking your mood to see stats!</p>
                </div>
              )}
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button onClick={() => setActiveTab('mood')} className="action-btn">
                  📊 Track Mood
                </button>
                <button onClick={() => setActiveTab('chat')} className="action-btn">
                  💬 Talk to AI
                </button>
                <button onClick={() => setActiveTab('resources')} className="action-btn">
                  📚 Browse Resources
                </button>
                <button onClick={() => setActiveTab('book')} className="action-btn">
                  📅 Book Session
                </button>
              </div>
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
