const express = require('express');
const Mood = require('../models/Mood');
const auth = require('../middleware/auth');

const router = express.Router();

// create mood entry
router.post('/', auth, async (req, res, next) => {
  try {
    const { mood, score, note } = req.body;
    if (!mood) return res.status(400).json({ error: 'Mood required' });
    const entry = await Mood.create({
      user: req.userId,
      mood,
      score,
      note
    });
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

// list current user's moods (latest first)
router.get('/', auth, async (req, res, next) => {
  try {
    const entries = await Mood.find({ user: req.userId }).sort({ createdAt: -1 }).lean();
    res.json(entries);
  } catch (err) {
    next(err);
  }
});

// get one
router.get('/:id', auth, async (req, res, next) => {
  try {
    const entry = await Mood.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    if (!entry.user.equals(req.userId)) return res.status(403).json({ error: 'Forbidden' });
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

// delete (owner)
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const entry = await Mood.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    if (!entry.user.equals(req.userId)) return res.status(403).json({ error: 'Forbidden' });
    await entry.remove();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// simple stats: average score and counts by mood for the current user
router.get('/stats/summary', auth, async (req, res, next) => {
  try {
    const userId = req.userId;
    const agg = await Mood.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId), score: { $exists: true } } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' },
          count: { $sum: 1 }
        }
      }
    ]);
    const moodCounts = await Mood.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$mood', count: { $sum: 1 } } }
    ]);
    res.json({
      summary: agg[0] || { avgScore: null, count: 0 },
      moodCounts
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
