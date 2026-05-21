import mongoose from 'mongoose';

const REQUIRED_ENV = [
  'MONGODB_URI', 
  // 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET',
  // 'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY',
];

export async function connectDB() {
  // Validate env vars
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
}
