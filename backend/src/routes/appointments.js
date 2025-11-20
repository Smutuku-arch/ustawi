const express = require('express');
const Appointment = require('../models/Appointment');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

const router = express.Router();

// helper: check overlap for a resource
async function hasConflict(resourceId, start, end, excludeId) {
  const q = {
    resource: resourceId,
    status: { $ne: 'cancelled' },
    start: { $lt: new Date(end) },
    end: { $gt: new Date(start) }
  };
  if (excludeId) q._id = { $ne: excludeId };
  return !!(await Appointment.findOne(q).lean());
}

// list (user's appointments or filter by resource)
router.get('/', auth, async (req, res, next) => {
  try {
    const { resource } = req.query;
    const filter = { user: req.userId };
    if (resource) filter.resource = resource;
    const appts = await Appointment.find(filter).populate('resource').sort({ start: 1 });
    res.json(appts);
  } catch (err) {
    next(err);
  }
});

// get one
router.get('/:id', auth, async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id).populate('resource user', 'name email');
    if (!appt) return res.status(404).json({ error: 'Not found' });
    if (!appt.user.equals(req.userId)) return res.status(403).json({ error: 'Forbidden' });
    res.json(appt);
  } catch (err) {
    next(err);
  }
});

// create
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, description, resource, start, end } = req.body;
    if (!title || !resource || !start || !end) return res.status(400).json({ error: 'Missing fields' });
    if (new Date(start) >= new Date(end)) return res.status(400).json({ error: 'Invalid time range' });

    const resDoc = await Resource.findById(resource);
    if (!resDoc) return res.status(404).json({ error: 'Resource not found' });

    if (await hasConflict(resource, start, end)) return res.status(409).json({ error: 'Time slot conflict' });

    const appt = await Appointment.create({
      title,
      description,
      resource,
      user: req.userId,
      start: new Date(start),
      end: new Date(end)
    });

    res.status(201).json(appt);
  } catch (err) {
    next(err);
  }
});

// update (only owner)
router.patch('/:id', auth, async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Not found' });
    if (!appt.user.equals(req.userId)) return res.status(403).json({ error: 'Forbidden' });

    const { start, end, resource } = req.body;
    const newStart = start ? new Date(start) : appt.start;
    const newEnd = end ? new Date(end) : appt.end;
    const newResource = resource || appt.resource;

    if (newStart >= newEnd) return res.status(400).json({ error: 'Invalid time range' });

    if (await hasConflict(newResource, newStart, newEnd, appt._id)) return res.status(409).json({ error: 'Time slot conflict' });

    Object.assign(appt, req.body);
    appt.start = newStart;
    appt.end = newEnd;
    appt.resource = newResource;

    await appt.save();
    res.json(appt);
  } catch (err) {
    next(err);
  }
});

// delete (owner)
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Not found' });
    if (!appt.user.equals(req.userId)) return res.status(403).json({ error: 'Forbidden' });
    // soft-cancel
    appt.status = 'cancelled';
    await appt.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
