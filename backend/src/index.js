const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// CORS with credentials
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

app.use(express.json());

// Serve uploaded files with proper headers for PDFs
app.use('/uploads', (req, res, next) => {
  const filePath = req.path;
  if (filePath.endsWith('.pdf')) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  next();
}, express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    env: process.env.NODE_ENV || 'development', 
    time: new Date().toISOString(),
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Mount routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const moodsRoutes = require('./routes/moods');
const resourcesRoutes = require('./routes/resources');
const appointmentsRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const booksRoutes = require('./routes/books');
const articlesAdminRoutes = require('./routes/articles');
const articlesPublicRoutes = require('./routes/articlesPublic');
const videosRoutes = require('./routes/videos');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/moods', moodsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/admin/articles', articlesAdminRoutes);
app.use('/api/articles', articlesPublicRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/admin/videos', videosRoutes); // Admin uses same routes with auth middleware

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ 
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

// Connect to MongoDB (remove deprecated options)
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // Sync indexes (ensures indexes from models are created)
    await Promise.all(
      Object.values(mongoose.connection.models).map(model => model.syncIndexes())
    );
    console.log('Indexes synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
