import Admin from '../src/models/Admin.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const checkAdminCredentials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const admins = await Admin.find().select('-password');
    
    console.log('📊 Current Admin Users in Database:\n');
    
    if (admins.length === 0) {
      console.log('❌ No admin users found in database!');
    } else {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Email: ${admin.email}`);
        console.log(`   Name: ${admin.name}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Active: ${admin.isActive}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log('');
      });
    }

    console.log('🔑 Expected Login Credentials:');
    console.log('   Email: royaldesicrew@gmail.com');
    console.log('   Password: Royaldesicrew@2017');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

checkAdminCredentials();
