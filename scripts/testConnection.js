import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI.substring(0, 50) + '...\n');

const testConnection = async () => {
  try {
    console.log('⏳ Attempting to connect to MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    console.log('✅ Successfully connected to MongoDB!');
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Collections: ${(await conn.connection.db.listCollections().toArray()).length}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection Failed!');
    console.error('\n📋 Error Details:');
    console.error(`   Type: ${err.name}`);
    console.error(`   Message: ${err.message}`);
    console.error('\n🔧 Troubleshooting Tips:');
    console.error('   1. Check your internet connection');
    console.error('   2. Verify the MongoDB URI is correct in .env.local');
    console.error('   3. Check MongoDB Atlas IP Whitelist:');
    console.error('      - Go to MongoDB Atlas Dashboard');
    console.error('      - Network Access → IP Whitelist');
    console.error('      - Add your current IP or use 0.0.0.0/0 for testing');
    console.error('   4. Verify your MongoDB username and password');
    console.error('   5. Check if firewall is blocking port 27017');
    
    process.exit(1);
  }
};

testConnection();
