const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../utils/upload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// list users (admin)
router.get('/users', auth, admin, async (req, res, next) => {
  try {
    const users = await User.find().select('name email role createdAt').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// change user role
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

// upload book (multipart: file, optional cover)
router.post('/books', auth, admin, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res, next) => {
  try {
    const { title, author } = req.body;
    if (!req.files || !req.files.file || !req.files.file[0]) return res.status(400).json({ error: 'Book file required' });

    const file = req.files.file[0];
    const cover = req.files.cover && req.files.cover[0];

    const fileUrl = `/uploads/${path.basename(file.path)}`;
    const coverUrl = cover ? `/uploads/${path.basename(cover.path)}` : undefined;

    const book = await Book.create({
      title: title || file.originalname,
      author,
      fileUrl,
      coverUrl,
      uploadedBy: req.userId
    });

    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

// list books
router.get('/books', auth, admin, async (req, res, next) => {
  try {
    const books = await Book.find().populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// delete book (remove files from disk if present)
router.delete('/books/:id', auth, admin, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Not found' });

    // remove files
    if (book.fileUrl) {
      const fp = path.join(process.cwd(), book.fileUrl.replace(/^\//, ''));
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    if (book.coverUrl) {
      const cp = path.join(process.cwd(), book.coverUrl.replace(/^\//, ''));
      if (fs.existsSync(cp)) fs.unlinkSync(cp);
    }

    await book.remove();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
