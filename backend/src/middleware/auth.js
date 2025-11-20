const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(id, opts = {}) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set in environment');
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: opts.expiresIn || '7d' });
}

function extractToken(req) {
  // Authorization header (Bearer token or raw)
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2) return parts[1];
    return authHeader;
  }
  // cookie (requires cookie-parser middleware)
  if (req.cookies && (req.cookies.token || req.cookies.authorization)) {
    return req.cookies.token || req.cookies.authorization;
  }
  // query param fallback (useful for testing)
  if (req.query && req.query.token) return req.query.token;
  return null;
}

async function authMiddleware(req, res, next) {
  // allow preflight
  if (req.method === 'OPTIONS') return next();

  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: 'No token provided' });

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired' });
      return res.status(401).json({ error: 'Token invalid' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Auth middleware error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = authMiddleware;
module.exports.signToken = signToken;
