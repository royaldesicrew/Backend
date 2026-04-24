import Admin from '../src/models/Admin.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

console.log('\n' + '='.repeat(80));
console.log('🔐 MONGODB ATLAS - LOGIN VERIFICATION TEST');
console.log('='.repeat(80) + '\n');

const testLoginFlow = async () => {
  try {
    // Step 1: Connect to MongoDB Atlas
    console.log('📡 Step 1: Connecting to MongoDB Atlas...');
    console.log('   Connection String:', process.env.MONGODB_URI.substring(0, 60) + '...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('   ✅ Connected to MongoDB Atlas\n');

    // Step 2: Query admin by email
    console.log('📋 Step 2: Querying MongoDB for admin user...');
    console.log('   Query: Admin.findOne({ email: "royaldesicrew@gmail.com" })');
    
    const admin = await Admin.findOne({ email: 'royaldesicrew@gmail.com' });
    
    if (!admin) {
      console.log('   ❌ Admin not found in database!');
      process.exit(1);
    }
    
    console.log('   ✅ Admin found in MongoDB Atlas');
    console.log('   Admin ID:', admin._id.toString());
    console.log('   Admin Name:', admin.name);
    console.log('   Admin Role:', admin.role);
    console.log('   Admin Email:', admin.email);
    console.log('   Account Active:', admin.isActive);
    console.log('   Password Hash:', admin.password.substring(0, 20) + '...');
    console.log('');

    // Step 3: Verify password with bcrypt
    console.log('🔑 Step 3: Verifying password with bcrypt...');
    console.log('   Plain Password: "Royaldesicrew@2017"');
    console.log('   Hashed Password:', admin.password);
    
    const isPasswordValid = await bcrypt.compare('Royaldesicrew@2017', admin.password);
    
    if (!isPasswordValid) {
      console.log('   ❌ Password verification FAILED!');
      process.exit(1);
    }
    
    console.log('   ✅ Password verification SUCCESSFUL');
    console.log('');

    // Step 4: Check if account is active
    console.log('✨ Step 4: Checking account status...');
    console.log('   Is Active:', admin.isActive);
    
    if (!admin.isActive) {
      console.log('   ❌ Account is disabled!');
      process.exit(1);
    }
    
    console.log('   ✅ Account is active and ready\n');

    // Step 5: Update last login
    console.log('⏱️  Step 5: Updating last login timestamp in MongoDB...');
    const oldLastLogin = admin.lastLogin;
    admin.lastLogin = new Date();
    await admin.save();
    
    console.log('   Previous Last Login:', oldLastLogin || 'Never');
    console.log('   New Last Login:', admin.lastLogin);
    console.log('   ✅ Last login updated in MongoDB Atlas\n');

    // Step 6: Generate JWT Token
    console.log('🎟️  Step 6: Generating JWT Token...');
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    console.log('   Token Generated:', token.substring(0, 50) + '...');
    console.log('   Token Expires In: 7 days');
    console.log('   ✅ JWT token ready for authentication\n');

    // Final Summary
    console.log('='.repeat(80));
    console.log('✅ LOGIN FLOW VERIFICATION - ALL STEPS PASSED');
    console.log('='.repeat(80));
    console.log('\n📊 Summary:\n');
    console.log('✅ MongoDB Atlas connected successfully');
    console.log('✅ Admin user found in database');
    console.log('✅ Password verified with bcrypt');
    console.log('✅ Account is active');
    console.log('✅ Last login updated in MongoDB');
    console.log('✅ JWT token generated successfully');
    console.log('\n🎯 Login is ready for admin panel!\n');
    console.log('Response that will be sent to Admin Panel:\n');
    
    const response = {
      token: token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    };
    
    console.log(JSON.stringify(response, null, 2));
    console.log('\n' + '='.repeat(80) + '\n');

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error('\n❌ Error during login verification:', err.message);
    if (err.message.includes('querySrv ETIMEOUT')) {
      console.error('\n⚠️  DNS/MongoDB Atlas Connection Issue');
      console.error('Please check:');
      console.error('1. Internet connection');
      console.error('2. DNS set to 8.8.8.8');
      console.error('3. MongoDB Atlas IP whitelist');
    }
    process.exit(1);
  }
};

testLoginFlow();
