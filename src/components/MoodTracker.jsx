import React, { useEffect, useState } from 'react';
import { createMood, getMoods, getMoodStats } from '../api/moods';
import './MoodTracker.css';

const MOODS = [
  { value: 'happy', emoji: '😊', label: 'Happy', color: '#4caf50' },
  { value: 'sad', emoji: '😢', label: 'Sad', color: '#2196f3' },
  { value: 'neutral', emoji: '😐', label: 'Neutral', color: '#9e9e9e' },
  { value: 'anxious', emoji: '😰', label: 'Anxious', color: '#ff9800' },
  { value: 'excited', emoji: '🤩', label: 'Excited', color: '#e91e63' },
  { value: 'angry', emoji: '😠', label: 'Angry', color: '#f44336' }
];

export default function MoodTracker() {
  const [mood, setMood] = useState('neutral');
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([getMoods(), getMoodStats()]);
      setEntries(list);
      setStats(s);
      setError('');
    } catch (err) {
      setError(err.message || 'Error loading moods');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await createMood({ mood, score: Number(score), note });
      setNote('');
      setScore(5);
      setMood('neutral');
      setShowForm(false);
      await load();
      setTimeout(() => setShowForm(true), 300);
    } catch (err) {
      setError(err.message || 'Failed to save mood');
    }
  }

  function getScoreCategory(score) {
    if (!score) return 'unknown';
    if (score >= 7.5) return 'excellent';
    if (score >= 5.5) return 'good';
    if (score >= 3.5) return 'fair';
    return 'needs-care';
  }

  const selectedMoodData = MOODS.find(m => m.value === mood);

  return (
    <div className="mood-tracker">
      <div className="mood-header">
        <h1>Mood Tracker</h1>
        <p>Track your emotional journey and discover patterns in your well-being</p>
      </div>

      {showForm && (
        <div className="mood-form-card">
          <h2>How are you feeling today?</h2>
          <form onSubmit={onSubmit}>
            <div className="mood-selector">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={`mood-option ${mood === m.value ? 'active' : ''}`}
                  style={{ '--mood-color': m.color }}
                  onClick={() => setMood(m.value)}
                >
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-label">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="score-section">
              <label>Intensity (1-10)</label>
              <div className="score-slider-container">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="score-slider"
                  style={{ '--slider-value': `${(score - 1) * 11.11}%`, '--mood-color': selectedMoodData.color }}
                />
                <div className="score-display" style={{ backgroundColor: selectedMoodData.color }}>
                  {score}
                </div>
              </div>
            </div>

            <div className="note-section">
              <label>Add a note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind?"
                rows="4"
              />
            </div>

            <button type="submit" className="btn-save" style={{ backgroundColor: selectedMoodData.color }}>
              Save Mood Entry
            </button>
          </form>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="stats-section">
        <h2>Your Stats</h2>
        {stats ? (
          <div className="stats-grid">
            <div className="stat-card-mood">
              <span className="stat-icon-mood">📊</span>
              <div className="stat-content">
                <h3>
                  {stats.summary && stats.summary.avgScore ? stats.summary.avgScore.toFixed(1) : 'N/A'}
                  {stats.summary && stats.summary.avgScore && (
                    <span className={`score-indicator ${getScoreCategory(stats.summary.avgScore)}`}>
                      /10
                    </span>
                  )}
                </h3>
                <p>Weighted Average</p>
              </div>
            </div>
            <div className="stat-card-mood">
              <span className="stat-icon-mood">📝</span>
              <div className="stat-content">
                <h3>{stats.summary?.count || 0}</h3>
                <p>Total Entries</p>
              </div>
            </div>
            {(stats.moodCounts || []).slice(0, 3).map((mc) => {
              const moodData = MOODS.find(m => m.value === mc._id);
              return (
                <div key={mc._id} className="stat-card-mood">
                  <span className="stat-icon-mood">{moodData?.emoji || '😊'}</span>
                  <div className="stat-content">
                    <h3>{mc.count}</h3>
                    <p>{moodData?.label || mc._id}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="loading-stats">Loading stats...</div>
        )}
      </div>

      <div className="entries-section">
        <h2>Recent Entries</h2>
        {loading ? (
          <div className="loading-entries">Loading entries...</div>
        ) : entries.length === 0 ? (
          <div className="no-entries">
            <span className="no-entries-icon">📝</span>
            <p>No mood entries yet. Start tracking your mood today!</p>
          </div>
        ) : (
          <div className="entries-list">
            {entries.map(e => {
              const moodData = MOODS.find(m => m.value === e.mood);
              return (
                <div key={e._id} className="entry-card">
                  <div className="entry-header">
                    <span className="entry-emoji" style={{ backgroundColor: moodData?.color }}>
                      {moodData?.emoji}
                    </span>
                    <div className="entry-info">
                      <h4>{moodData?.label || e.mood}</h4>
                      <p className="entry-date">{new Date(e.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="entry-score" style={{ backgroundColor: moodData?.color }}>
                      {e.score || '—'}
                    </div>
                  </div>
                  {e.note && <p className="entry-note">{e.note}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
