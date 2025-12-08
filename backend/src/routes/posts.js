const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router();

// list
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// get one
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// create (auth + optional file)
router.post('/', auth, upload.single('file'), async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const post = await Post.create({ title, content, imageUrl, author: req.user._id });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

// update (only author)
router.patch('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (!post.author.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// delete (only author)
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (!post.author.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
    await post.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
