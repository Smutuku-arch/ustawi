const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded files
app.use('/uploads', express.static('uploads'));

// routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const appointmentsRoutes = require('./routes/appointments');
const resourcesRoutes = require('./routes/resources');
const moodsRoutes = require('./routes/moods');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/moods', moodsRoutes);
app.use('/api/admin', adminRoutes);

// quick liveness probe
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development', time: new Date().toISOString() });
});

// error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });
