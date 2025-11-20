module.exports = function (req, res, next) {
  // auth middleware should have populated req.user
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
};
