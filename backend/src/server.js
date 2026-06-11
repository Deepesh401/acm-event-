import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import { seed } from './utils/seed.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    // Seed database if it is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database is empty. Seeding database...');
      await seed(false);
    }
  } catch (err) {
    console.error('Database connection or seeding failed. Continuing server start:', err.message);
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
