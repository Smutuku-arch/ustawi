#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Resource = require('../models/Resource');
const Post = require('../models/Post');

async function main() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ustawi';
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      admin = await User.create({ name: 'Admin', email: adminEmail, password: hashed, role: 'admin' });
      console.log('Created admin user:', adminEmail);
    } else {
      console.log('Admin user already exists:', adminEmail);
    }

    // Create sample user
    const userEmail = 'user@example.com';
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      const hashed = await bcrypt.hash('password123', 10);
      user = await User.create({ name: 'John Doe', email: userEmail, password: hashed, role: 'user' });
      console.log('Created sample user:', userEmail);
    }

    // Create sample resources
    const resourceNames = ['Counselor Office', 'Career Advisor', 'Mental Health Clinic'];
    for (const name of resourceNames) {
      const exists = await Resource.findOne({ name });
      if (!exists) {
        await Resource.create({ name, type: 'office', location: 'Main Campus', capacity: 5 });
        console.log('Created resource:', name);
      }
    }

    // Create sample post
    const postTitle = 'Welcome to Ustawi';
    const exists = await Post.findOne({ title: postTitle });
    if (!exists) {
      await Post.create({
        title: postTitle,
        content: 'This is a sample post. Ustawi helps Kenyan youth with mental health and career guidance.',
        author: admin._id
      });
      console.log('Created sample post');
    }

    console.log('Seed complete');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

main();
