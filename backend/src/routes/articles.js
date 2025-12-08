const express = require('express');
const Article = require('../models/Article');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Public: list all published articles
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    const articles = await Article.find(filter).populate('uploadedBy', 'name').sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

// Public: get one article
router.get('/:id', async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!article) return res.status(404).json({ error: 'Not found' });
    
    // Increment views
    article.views += 1;
    await article.save();
    
    res.json(article);
  } catch (err) {
    next(err);
  }
});

// Admin: create article
router.post('/', auth, admin, async (req, res, next) => {
  try {
    const { title, content, summary, category } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

    const article = await Article.create({
      title,
      content,
      summary,
      category,
      author: req.userId
    });

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
});

// Admin: update article
router.patch('/:id', auth, admin, async (req, res, next) => {
  try {
    req.body.updatedAt = new Date();
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ error: 'Not found' });
    res.json(article);
  } catch (err) {
    next(err);
  }
});

// Update article (admin only)
router.put('/:id', auth, admin, async (req, res, next) => {
  try {
    const { title, content, summary, category } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Not found' });

    article.title = title;
    article.content = content;
    article.summary = summary;
    article.category = category;
    
    await article.save();
    
    const updated = await Article.findById(article._id).populate('author', 'name email');
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Admin: delete article
router.delete('/:id', auth, admin, async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Not found' });

    await article.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
