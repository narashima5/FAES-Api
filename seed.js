import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/faes');
    const existingAdmin = await User.findOne({ email: 'admin@faes.com' });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'System Admin',
        email: 'admin@faes.com',
        password,
        role: 'admin'
      });
      console.log('Admin user seeded successfully');
    } else {
      console.log('Admin already exists');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
