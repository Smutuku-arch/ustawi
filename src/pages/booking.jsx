import React, { useState, useEffect } from "react";
import { Form, redirect, useNavigation } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function action({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const resource = formData.get("resource");
  const start = formData.get("start");
  const end = formData.get("end");

  try {
    await axios.post(
      `${API_BASE}/api/appointments`,
      { title, description, resource, start, end },
      { headers: authHeaders() }
    );
    return redirect("/appointments");
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
}

export default function Booking() {
  const navigation = useNavigation();
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResources() {
      try {
        const { data } = await axios.get(`${API_BASE}/api/resources`);
        setResources(data);
      } catch (err) {
        setError("Failed to load resources");
      }
    }
    loadResources();
  }, []);

  return (
    <div className="booking-container">
      <h2>Book an Appointment</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Form method="post">
        <div>
          <label>
            Title
            <input type="text" name="title" required />
          </label>
        </div>
        <div>
          <label>
            Description
            <textarea name="description" />
          </label>
        </div>
        <div>
          <label>
            Resource
            <select name="resource" required>
              <option value="">Select a resource</option>
              {resources.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Start Date/Time
            <input type="datetime-local" name="start" required />
          </label>
        </div>
        <div>
          <label>
            End Date/Time
            <input type="datetime-local" name="end" required />
          </label>
        </div>
        <button type="submit" disabled={navigation.state === "submitting"}>
          {navigation.state === "submitting" ? "Booking..." : "Book"}
        </button>
      </Form>
    </div>
  );
}