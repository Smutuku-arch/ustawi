const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, enum: ['happy', 'sad', 'neutral', 'anxious', 'excited', 'angry'], required: true },
  score: { type: Number, min: 1, max: 10 }, // optional numeric rating
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mood', MoodSchema);
