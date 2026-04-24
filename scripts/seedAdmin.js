import Admin from '../src/models/Admin.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-desi-crew');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: 'admin@royaldesicrew.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = new Admin({
      name: 'Admin',
      email: 'admin@royaldesicrew.com',
      password: hashedPassword,
      role: 'super-admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@royaldesicrew.com');
    console.log('🔐 Password: Admin@123');
    console.log('⚠️  Change password after first login');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
