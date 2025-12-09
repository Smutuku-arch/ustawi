const express = require('express');
const mongoose = require('mongoose');
const Mood = require('../models/Mood');
const auth = require('../middleware/auth');

const router = express.Router();

// create mood entry
router.post('/', auth, async (req, res, next) => {
  try {
    const { mood, score, note } = req.body;
    if (!mood) return res.status(400).json({ error: 'Mood is required' });

    const entry = await Mood.create({
      user: req.userId,
      mood,
      score: score || 5,
      note: note || ''
    });

    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

// stats: recent moods, average score, mood distribution
router.get('/stats', auth, async (req, res, next) => {
  try {
    const moods = await Mood.find({ user: req.userId }).sort({ date: -1 }).limit(30);
    
    const avgScore = moods.length > 0
      ? moods.reduce((sum, m) => sum + m.score, 0) / moods.length
      : 0;

    const moodCounts = {};
    moods.forEach(m => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    });

    res.json({
      recentMoods: moods.slice(0, 7),
      averageScore: avgScore.toFixed(1),
      moodDistribution: moodCounts,
      totalEntries: moods.length
    });
  } catch (err) {
    next(err);
  }
});

// list current user's moods (latest first)
router.get('/', auth, async (req, res, next) => {
  try {
    const moods = await Mood.find({ user: req.userId })
      .sort({ date: -1 })
      .limit(100);
    res.json(moods);
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
    await entry.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// simple stats: average score and counts by mood for the current user
router.get('/stats/summary', auth, async (req, res, next) => {
  try {
    // Block anonymous users
    if (req.isAnonymous) {
      return res.status(403).json({ error: 'Create an account to view mood statistics' });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);
    
    // Get all moods with scores
    const allMoods = await Mood.find({ user: userId, score: { $exists: true } })
      .sort({ createdAt: -1 })
      .lean();
    
    // Define sentiment weights for each mood type
    const moodSentiments = {
      'happy': 1.0,      // Positive: score as-is
      'excited': 1.0,    // Positive: score as-is
      'neutral': 0.5,    // Neutral: half weight
      'sad': -0.8,       // Negative: reduces score
      'anxious': -0.7,   // Negative: reduces score
      'angry': -0.9      // Very negative: strongly reduces score
    };
    
    // Calculate weighted average score
    let totalWeightedScore = 0;
    let count = 0;
    
    allMoods.forEach(entry => {
      const sentiment = moodSentiments[entry.mood] || 0;
      let weightedScore;
      
      if (sentiment > 0) {
        // Positive moods: scale score up (0-10 becomes weighted)
        weightedScore = entry.score * sentiment;
      } else if (sentiment === 0.5) {
        // Neutral: use 50% of score
        weightedScore = entry.score * sentiment;
      } else {
        // Negative moods: invert and reduce
        // A sad score of 8/10 intensity should reduce the average more than 3/10
        weightedScore = (10 - entry.score) * Math.abs(sentiment);
      }
      
      totalWeightedScore += weightedScore;
      count++;
    });
    
    const avgScore = count > 0 ? (totalWeightedScore / count) : null;
    
    // Mood counts by type
    const moodCounts = await Mood.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Calculate streak - get all check-in dates
    const allEntries = await Mood.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('createdAt')
      .lean();
    
    let streak = 0;
    if (allEntries.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let currentDate = new Date(today);
      const seenDates = new Set();
      
      for (let i = 0; i < allEntries.length; i++) {
        const entryDate = new Date(allEntries[i].createdAt);
        entryDate.setHours(0, 0, 0, 0);
        const dateStr = entryDate.toISOString().split('T')[0];
        
        // Skip duplicate dates
        if (seenDates.has(dateStr)) continue;
        seenDates.add(dateStr);
        
        // Check if entry is from current date
        if (entryDate.getTime() === currentDate.getTime()) {
          streak++;
          // Move to previous day
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (entryDate.getTime() < currentDate.getTime()) {
          // Gap found, stop counting
          break;
        }
      }
    }
    
    res.json({ 
      summary: { 
        avgScore: avgScore !== null ? Number(avgScore.toFixed(1)) : null, 
        count: allMoods.length 
      }, 
      moodCounts,
      streak
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
