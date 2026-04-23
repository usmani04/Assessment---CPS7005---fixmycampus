import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from './server/models/User.js';
import { connectDB } from './config/db.js';

dotenv.config();

const createTestUsers = async () => {
  try {
    await connectDB();

    const users = [
      {
        name: 'Admin User',
        email: 'admin@fixmycampus.com',
        password: 'admin123',
        studentId: 'ST-2024001',
        department: 'Computer Science',
        role: 'admin'
      },
      {
        name: 'Student User',
        email: 'student@fixmycampus.com',
        password: 'student123',
        studentId: 'ST-2024002',
        department: 'Computer Science',
        role: 'student'
      },
      {
        name: 'Staff User',
        email: 'staff@fixmycampus.com',
        password: 'staff123',
        studentId: 'ST-2024003',
        department: 'Computer Science',
        role: 'staff'
      }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        // Always update password to ensure it's hashed correctly
        const salt = await bcryptjs.genSalt(10);
        existingUser.password = await bcryptjs.hash(userData.password, salt);
        existingUser.name = userData.name;
        existingUser.studentId = userData.studentId;
        existingUser.department = userData.department;
        existingUser.role = userData.role;
        await existingUser.save();
        console.log(`Existing user ${userData.email} updated.`);
        continue;
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(userData.password, salt);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      await user.save();
      console.log(`User ${userData.email} created successfully!`);
      console.log(`Email: ${userData.email}`);
      console.log(`Password: ${userData.password}`);
      console.log('---');
    }

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestUsers();