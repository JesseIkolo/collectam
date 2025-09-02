const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createSuperAdmin() {
  try {
    // Connect to MongoDB (force local for now)
    const mongoUri = 'mongodb://localhost:27017/collectam';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: 'admin', email: 'admin@collectam.com' });
    if (existingAdmin) {
      console.log('Super admin already exists:', existingAdmin.email);
      return;
    }

    // Create super admin
    const superAdmin = new User({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@collectam.com',
      password: 'SuperAdmin123!', // Will be hashed automatically
      phone: '+33123456789',
      role: 'admin',
      organizationId: null, // Global access
      subscription: {
        plan: 'premium',
        expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      },
      preferences: {
        notifications: {
          sms: true,
          email: true,
          push: true
        }
      }
    });

    await superAdmin.save();
    console.log('✅ Super admin created successfully!');
    console.log('Email:', superAdmin.email);
    console.log('Password: SuperAdmin123!');
    console.log('Role:', superAdmin.role);

  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
createSuperAdmin();
