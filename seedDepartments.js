import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/Department.js';

dotenv.config();

const seedDepartments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const depts = ["IT", "CSE", "AI&DS", "Cybersecurity", "ETC"];
    
    for (const name of depts) {
      const existing = await Department.findOne({ name });
      if (!existing) {
        await Department.create({ name });
        console.log(`Created department: ${name}`);
      } else {
        console.log(`Department already exists: ${name}`);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

seedDepartments();
