const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['therapist', 'counselor', 'career-coach'],
    required: true
  },
  specialty: String,
  availability: [String], // Array of available days/times
  imageUrl: String,
  description: String
});

module.exports = mongoose.model('Resource', resourceSchema);
