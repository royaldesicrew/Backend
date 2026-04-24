import Admin from '../src/models/Admin.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const updateAdminCredentials = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-desi-crew');
    console.log('✅ Connected to MongoDB');

    const newEmail = 'royaldesicrew@gmail.com';
    const newPassword = 'Royaldesicrew@2017';

    // Find existing admin
    const existingAdmin = await Admin.findOne({ role: 'super-admin' });

    if (!existingAdmin) {
      console.log('❌ No admin user found');
      process.exit(1);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin credentials
    existingAdmin.email = newEmail;
    existingAdmin.password = hashedPassword;
    await existingAdmin.save();

    console.log('\n' + '='.repeat(60));
    console.log('✅ ADMIN CREDENTIALS UPDATED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n🔐 New Login Credentials:');
    console.log(`   📧 Email: ${newEmail}`);
    console.log(`   🔑 Password: ${newPassword}`);
    console.log('\n📌 These credentials are now stored securely in MongoDB');
    console.log('   (Password is hashed with bcrypt)');
    console.log('\n🚀 You can now login to the admin panel at:');
    console.log('   http://localhost:3000/admin');
    console.log('\n⚠️  IMPORTANT:');
    console.log('   - Only this email/password combination will work');
    console.log('   - To change credentials in future, let the developer know');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating credentials:', err.message);
    process.exit(1);
  }
};

updateAdminCredentials();
