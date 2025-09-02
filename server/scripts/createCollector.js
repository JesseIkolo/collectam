const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createCollector() {
  try {
    // Connect to MongoDB
    const mongoUri = 'mongodb://localhost:27017/collectam';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if collector already exists
    const existingCollector = await User.findOne({ role: 'collector', email: 'collector@collectamm.com' });
    if (existingCollector) {
      console.log('Collector already exists:', existingCollector.email);
      return;
    }

    // Create collector user
    const collector = new User({
      firstName: 'Jean',
      lastName: 'Collecteur',
      email: 'collector@collectamm.com',
      password: 'Collector123!', // Will be hashed automatically
      phone: '+33123456790',
      role: 'collector',
      organizationId: null, // Can be assigned to an organization later
      subscription: {
        plan: 'basic',
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

    await collector.save();
    console.log('✅ Collector created successfully!');
    console.log('Email:', collector.email);
    console.log('Password: Collector123!');
    console.log('Role:', collector.role);
    console.log('');
    console.log('🔑 Login credentials:');
    console.log('Email: collector@collectamm.com');
    console.log('Password: Collector123!');

  } catch (error) {
    console.error('❌ Error creating collector:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
createCollector();
