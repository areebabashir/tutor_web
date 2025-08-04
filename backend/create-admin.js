import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import auth from './models/authModel.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await auth.findOne({ email: 'admin@tutor.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin123', 10);

    // Create admin user
    const adminUser = new auth({
      name: 'Admin User',
      email: 'admin@tutor.com',
      password: hashedPassword,
      phone: '1234567890',
      address: 'Admin Address',
      answer: 'admin',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@tutor.com');
    console.log('Password: Admin123');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin(); 