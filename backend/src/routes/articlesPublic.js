const express = require('express');
const Article = require('../models/Article');

const router = express.Router();

// Public: list all articles
router.get('/', async (req, res, next) => {
  try {
    const articles = await Article.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

// Public: get single article
router.get('/:id', async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name email');
    if (!article) return res.status(404).json({ error: 'Not found' });
    
    // Increment views
    article.views += 1;
    await article.save();
    
    res.json(article);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
