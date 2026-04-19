import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from './server/models/User.js';
import { connectDB } from './config/db.js';

dotenv.config();

const createTestUser = async () => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email: 'admin@fixmycampus.com' });
    if (existingUser) {
      console.log('Test user already exists!');
      console.log('Email: admin@fixmycampus.com');
      console.log('Password: admin123');
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('admin123', salt);
    
    const user = new User({
      name: 'Admin User',
      email: 'admin@fixmycampus.com',
      password: hashedPassword,
      studentId: 'ST-2024001',
      department: 'Computer Science',
      role: 'admin'
    });

    await user.save();
    console.log('Test user created successfully!');
    console.log('Email: admin@fixmycampus.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestUser();