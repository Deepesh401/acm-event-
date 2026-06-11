import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/web-sprint-2026';
  
  try {
    // Try to connect with a short timeout to fail fast if MongoDB is not running
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB connected successfully: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`Failed to connect to MongoDB at ${uri}: ${err.message}`);
    console.log('Spinning up an In-Memory MongoDB Server for development...');
    
    try {
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`In-Memory MongoDB connected: ${mongoose.connection.host}`);
    } catch (memErr) {
      console.error('Failed to start In-Memory MongoDB Server:', memErr.message);
      throw memErr;
    }
  }
};
