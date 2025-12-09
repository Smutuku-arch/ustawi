import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookSession.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

function BookSession() {
  const [resources, setResources] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    resourceId: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resourcesRes, appointmentsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/resources`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE}/api/appointments`).catch(() => ({ data: [] }))
      ]);
      
      setResources(resourcesRes.data || []);
      setAppointments(appointmentsRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_BASE}/api/appointments`, formData);
      setSuccess('Appointment booked successfully!');
      setFormData({ resourceId: '', date: '', time: '', notes: '' });
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book appointment');
    }
  }

  if (loading) {
    return <div className="book-session-loading">Loading...</div>;
  }

  return (
    <div className="book-session">
      <div className="session-header">
        <h1>Book a Session</h1>
        <p>Connect with professional therapists and career advisors</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!showForm ? (
        <>
          <div className="available-resources">
            <h2>Available Professionals</h2>
            {resources.length === 0 ? (
              <div className="no-resources">
                <span className="icon">👥</span>
                <p>No professionals available at the moment</p>
              </div>
            ) : (
              <div className="resources-grid">
                {resources.map(resource => (
                  <div key={resource._id} className="resource-card">
                    <div className="resource-icon">{resource.type === 'therapist' ? '🧠' : '💼'}</div>
                    <h3>{resource.name}</h3>
                    <p className="resource-type">{resource.type}</p>
                    <p className="resource-specialty">{resource.specialty}</p>
                    <button 
                      className="btn-book"
                      onClick={() => {
                        setFormData({ ...formData, resourceId: resource._id });
                        setShowForm(true);
                      }}
                    >
                      Book Session
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="my-appointments">
            <h2>My Appointments</h2>
            {appointments.length === 0 ? (
              <div className="no-appointments">
                <span className="icon">📅</span>
                <p>No appointments booked yet</p>
              </div>
            ) : (
              <div className="appointments-list">
                {appointments.map(apt => (
                  <div key={apt._id} className="appointment-card">
                    <div className="appointment-icon">
                      {apt.resource?.type === 'therapist' ? '🧠' : '💼'}
                    </div>
                    <div className="appointment-details">
                      <h3>{apt.resource?.name}</h3>
                      <p className="appointment-date">
                        📅 {new Date(apt.date).toLocaleDateString()} at {apt.time}
                      </p>
                      <p className="appointment-status">Status: {apt.status}</p>
                      {apt.notes && <p className="appointment-notes">Notes: {apt.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="booking-form-container">
          <button 
            className="btn-back"
            onClick={() => {
              setShowForm(false);
              setFormData({ resourceId: '', date: '', time: '', notes: '' });
            }}
          >
            ← Back to Resources
          </button>

          <form onSubmit={handleSubmit} className="booking-form" autoComplete="off">
            <h2>Book Your Session</h2>
            
            <div className="form-group">
              <label>Professional *</label>
              <select
                value={formData.resourceId}
                onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                required
                autoComplete="off"
              >
                <option value="">Select a professional</option>
                {resources.map(r => (
                  <option key={r._id} value={r._id}>
                    {r.name} - {r.type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any specific concerns or topics you'd like to discuss?"
                rows="4"
                autoComplete="off"
              />
            </div>

            <button type="submit" className="btn-submit">
              Book Appointment
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default BookSession;
