const express = require('express');
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../utils/upload');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Public: list all videos
router.get('/', async (req, res, next) => {
  try {
    const videos = await Video.find().populate('uploadedBy', 'name').sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    next(err);
  }
});

// Public: get one video
router.get('/:id', async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!video) return res.status(404).json({ error: 'Not found' });
    
    // Increment views
    video.views += 1;
    await video.save();
    
    res.json(video);
  } catch (err) {
    next(err);
  }
});

// Admin: upload video
router.post('/', auth, admin, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res, next) => {
  try {
    const { title, description, duration } = req.body;
    if (!req.files || !req.files.file || !req.files.file[0]) {
      return res.status(400).json({ error: 'Video file required' });
    }

    const file = req.files.file[0];
    const thumbnail = req.files.thumbnail && req.files.thumbnail[0];

    const videoUrl = `/uploads/${file.filename}`;
    const thumbnailUrl = thumbnail ? `/uploads/${thumbnail.filename}` : undefined;

    const video = await Video.create({
      title: title || file.originalname,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      uploadedBy: req.userId
    });

    res.status(201).json(video);
  } catch (err) {
    next(err);
  }
});

// Admin: delete video
router.delete('/:id', auth, admin, async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Not found' });

    // Remove files from disk
    if (video.videoUrl) {
      const vp = path.join(process.cwd(), video.videoUrl.replace(/^\//, ''));
      if (fs.existsSync(vp)) fs.unlinkSync(vp);
    }
    if (video.thumbnailUrl) {
      const tp = path.join(process.cwd(), video.thumbnailUrl.replace(/^\//, ''));
      if (fs.existsSync(tp)) fs.unlinkSync(tp);
    }

    await video.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
