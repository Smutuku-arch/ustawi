require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const admins = await User.find({ role: 'admin' });
    
    if (admins.length === 0) {
      console.log('No admin users found.');
    } else {
      console.log('\n--- Admin Users ---');
      admins.forEach(admin => {
        console.log(`Name: ${admin.name || 'No Name'}`);
        console.log(`Email: ${admin.email}`);
        console.log(`ID: ${admin._id}`);
        console.log('-------------------');
      });
    }
  } catch (error) {
    console.error('Error checking admins:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

checkAdmins();
