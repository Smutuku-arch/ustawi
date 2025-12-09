const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const Article = require('../models/Article');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../utils/upload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// --- Users ---
router.get('/users', auth, admin, async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.patch('/users/:id/role', auth, admin, async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('name email role createdAt');
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// --- Books ---
router.post('/books', auth, admin, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res, next) => {
  try {
    const { title, author } = req.body;
    if (!req.files || !req.files.file || !req.files.file[0]) {
      return res.status(400).json({ error: 'Book file required' });
    }

    const file = req.files.file[0];
    const cover = req.files.cover && req.files.cover[0];

    // Use full URL for frontend access
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;
    const coverUrl = cover ? `${baseUrl}/uploads/${cover.filename}` : undefined;

    const book = await Book.create({
      title: title || file.originalname,
      author,
      fileUrl,
      coverUrl,
      uploadedBy: req.userId
    });

    const populated = await Book.findById(book._id).populate('uploadedBy', 'name');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
});

router.get('/books', auth, admin, async (req, res, next) => {
  try {
    const books = await Book.find().populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    next(err);
  }
});

router.delete('/books/:id', auth, admin, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Not found' });

    if (book.fileUrl) {
      const fp = path.join(process.cwd(), book.fileUrl.replace(/^\//, ''));
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    if (book.coverUrl) {
      const cp = path.join(process.cwd(), book.coverUrl.replace(/^\//, ''));
      if (fs.existsSync(cp)) fs.unlinkSync(cp);
    }

    await book.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// --- Articles ---
router.post('/articles', auth, admin, async (req, res, next) => {
  try {
    const { title, content, summary, category } = req.body;
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

router.get('/articles', auth, admin, async (req, res, next) => {
  try {
    const articles = await Article.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

router.delete('/articles/:id', auth, admin, async (req, res, next) => {
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
