// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB URI
const mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (!mongoURI) {
    console.error('❌ MongoDB URI is not defined in .env file.');
    process.exit(1);
  }

  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      tlsAllowInvalidCertificates: true,  // Allow SSL if needed (for self-signed certs)
      tlsAllowInvalidHostnames: true       // Allow host mismatches (only in dev/testing)
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit if DB connection fails
  }
};

module.exports = connectDB;
