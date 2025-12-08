import React, { useEffect, useState } from 'react';
import { getResources } from '../api/resources';
import { createAppointment, getAvailableSlots } from '../api/appointments';
import './BookSession.css';

export default function BookSession() {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    try {
      const data = await getResources();
      setResources(data);
    } catch (err) {
      setError('Failed to load resources');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const startDateTime = new Date(`${date}T${time}`);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 1);

      await createAppointment({
        title,
        description,
        resource: selectedResource,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString()
      });

      setSuccess(true);
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setSelectedResource(null);

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book session');
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="book-session-page">
      <div className="booking-header">
        <h1>Book a Session</h1>
        <p>Schedule a session with our mental health professionals or career advisors</p>
      </div>

      {success && (
        <div className="success-message">
          ✅ Session booked successfully! You'll receive a confirmation email shortly.
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="booking-container">
        <div className="resources-selection">
          <h2>Select a Resource</h2>
          <div className="resources-list">
            {resources.map((resource) => (
              <div
                key={resource._id}
                className={`resource-item ${selectedResource === resource._id ? 'selected' : ''}`}
                onClick={() => setSelectedResource(resource._id)}
              >
                <div className="resource-icon">
                  {resource.type === 'office' ? '🏢' : '👤'}
                </div>
                <div className="resource-info">
                  <h3>{resource.name}</h3>
                  <p>{resource.location || 'Available'}</p>
                  {resource.capacity && <span className="capacity">Capacity: {resource.capacity}</span>}
                </div>
                {selectedResource === resource._id && (
                  <span className="check-mark">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="booking-form-section">
          <h2>Session Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Session Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Career Guidance Session"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={today}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us what you'd like to discuss..."
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="btn-book"
              disabled={loading || !selectedResource}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
