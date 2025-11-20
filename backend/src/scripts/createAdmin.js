#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// models path relative to this file
const User = require('../models/User');

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    if (arg === '--help' || arg === '-h') {
      args.help = true;
      return;
    }
    const [k, ...rest] = arg.split('=');
    const key = k.replace(/^--/, '');
    args[key] = rest.join('=') || true;
  });
  return args;
}

async function createOrUpdateAdmin({ email, password, name, mongoUri, jwtExpiresIn = '30d' } = {}) {
  const MONGO_URI = mongoUri || process.env.MONGO_URI || 'mongodb://localhost:27017/ustawi';
  if (!MONGO_URI) {
    throw new Error('MONGO_URI not set. Set it in .env or pass via environment.');
  }

  await mongoose.connect(MONGO_URI, {});

  const foundEmail = email || process.env.ADMIN_EMAIL || 'admin@example.com';
  const foundPassword = password || process.env.ADMIN_PASSWORD || 'admin123';
  const foundName = name || 'Admin';

  let user = await User.findOne({ email: foundEmail });
  const hashed = await bcrypt.hash(foundPassword, 10);

  if (user) {
    user.role = 'admin';
    user.name = foundName;
    user.password = hashed;
    await user.save();
    console.log(`Updated existing user to admin: ${foundEmail}`);
  } else {
    user = await User.create({ name: foundName, email: foundEmail, password: hashed, role: 'admin' });
    console.log(`Created new admin user: ${foundEmail}`);
  }

  const secret = process.env.JWT_SECRET || 'dev-insecure-secret';
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET not set in environment; using insecure default token (do NOT use in production).');
  }
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: jwtExpiresIn });

  // cleanup connection
  await mongoose.disconnect();

  return { email: foundEmail, password: foundPassword, token };
}

// CLI entry (preserve existing behavior)
async function mainCli() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node src/scripts/createAdmin.js --email=admin@example.com --password=secret --name="Admin Name"');
    process.exit(0);
  }

  const email = args.email || process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = args.password || process.env.ADMIN_PASSWORD || 'admin123';
  const name = args.name || 'Admin';

  try {
    const result = await createOrUpdateAdmin({ email, password, name });
    console.log('--- Admin credentials ---');
    console.log('email:', result.email);
    console.log('password:', result.password);
    console.log('JWT (store securely):', result.token);
    console.log('You can use this token in Authorization: Bearer <token>');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
}

// If run directly, act as CLI
if (require.main === module) {
  mainCli();
}

// If environment requests auto-create, run automatically when required/imported
if (process.env.AUTO_CREATE_ADMIN === 'true' && (process.env.ADMIN_EMAIL || process.env.ADMIN_PASSWORD)) {
  // run in background, do not block module load
  createOrUpdateAdmin().then((r) => {
    console.log('AUTO_CREATE_ADMIN: admin ensured:', r.email);
  }).catch((err) => {
    console.error('AUTO_CREATE_ADMIN error:', err);
  });
}

// export function so other modules (eg. src/index.js) can call it
module.exports = { createOrUpdateAdmin };
