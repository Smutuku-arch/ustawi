const express = require('express');
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const path = require('path');

const router = express.Router();

// Public: list all books
router.get('/', async (req, res, next) => {
  try {
    const books = await Book.find().populate('uploadedBy', 'name').sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// Public: get one book
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!book) return res.status(404).json({ error: 'Not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
});

// Serve book file for viewing
router.get('/view/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Not found' });
    
    const filePath = path.join(process.cwd(), book.fileUrl.replace(/^\//, ''));
    
    // Set headers for inline viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
