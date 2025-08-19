const mongoose = require('mongoose');
const winston = require('winston');

const connectDB = async () => {
  let retries = 3;
  
  while (retries > 0) {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/collectam';
      console.log('Attempting to connect to MongoDB:', mongoUri);
      
      const conn = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4
      });
      
      winston.info('MongoDB connected successfully');
      return;
    } catch (error) {
      retries--;
      winston.error(`MongoDB connection failed. Retries left: ${retries}`, error);
      
      if (retries === 0) {
        winston.error('Failed to connect to MongoDB after 3 attempts');
        console.log('⚠️  MongoDB connection failed. Server will continue without database.');
        return;
      }
      
      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

module.exports = connectDB;
