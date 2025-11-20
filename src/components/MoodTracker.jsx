import React, { useEffect, useState } from 'react';
import { createMood, getMoods, getMoodStats } from '../api/moods';

const MOODS = ['happy', 'sad', 'neutral', 'anxious', 'excited', 'angry'];

export default function MoodTracker() {
  const [mood, setMood] = useState('neutral');
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([getMoods(), getMoodStats()]);
      setEntries(list);
      setStats(s);
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
      await load();
    } catch (err) {
      setError(err.message || 'Failed to save mood');
    }
  }

  return (
    <div>
      <h3>Mood Tracker</h3>
      <form onSubmit={onSubmit}>
        <label>
          Mood
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label>
          Score (1-10)
          <input type="number" min="1" max="10" value={score} onChange={(e) => setScore(e.target.value)} />
        </label>
        <label>
          Note
          <textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <button type="submit">Save</button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <section>
        <h4>Stats</h4>
        {stats ? (
          <div>
            <div>Average score: {stats.summary && stats.summary.avgScore ? stats.summary.avgScore.toFixed(2) : 'N/A'}</div>
            <div>Total entries: {stats.summary ? stats.summary.count : 0}</div>
            <ul>
              {(stats.moodCounts || []).map((mc) => (
                <li key={mc._id}>{mc._id}: {mc.count}</li>
              ))}
            </ul>
          </div>
        ) : <div>Loading stats...</div>}
      </section>

      <section>
        <h4>Recent entries</h4>
        {loading ? <div>Loading...</div> : (
          <ul>
            {entries.map(e => (
              <li key={e._id}>
                <strong>{e.mood}</strong> ({e.score ?? '—'}) — {new Date(e.createdAt).toLocaleString()}
                {e.note ? <div>{e.note}</div> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
