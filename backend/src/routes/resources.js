const express = require('express');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

const router = express.Router();

// list resources
router.get('/', async (req, res, next) => {
  try {
    const resources = await Resource.find().sort({ name: 1 });
    res.json(resources);
  } catch (err) {
    next(err);
  }
});

// get one
router.get('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Not found' });
    res.json(resource);
  } catch (err) {
    next(err);
  }
});

// create
router.post('/', auth, async (req, res, next) => {
  try {
    const { name, type, location, capacity, metadata } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const resource = await Resource.create({ name, type, location, capacity, metadata });
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
});

// update
router.patch('/:id', auth, async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) return res.status(404).json({ error: 'Not found' });
    res.json(resource);
  } catch (err) {
    next(err);
  }
});

// delete
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Not found' });
    await resource.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
