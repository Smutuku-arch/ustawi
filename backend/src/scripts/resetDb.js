#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

async function main() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ustawi';
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Drop all collections
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
      console.log(`Dropped collection: ${collection.collectionName}`);
    }

    console.log('Database reset complete');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Reset error:', err);
    process.exit(1);
  }
}

main();
