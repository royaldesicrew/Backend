import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '.env.local');
console.log(`📁 Looking for .env.local at: ${envPath}`);
console.log(`📁 File exists: ${fs.existsSync(envPath)}`);

dotenv.config({ path: envPath });

console.log(`📡 MONGODB_URI from env: ${process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + '...' : 'NOT SET'}`);

import Photo from './src/models/Photo.js';

(async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-desi-crew';
    console.log(`📡 Connecting to: ${mongoUri.substring(0, 70)}...\n`);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const photos = await Photo.find().sort({ category: 1, createdAt: -1 });
    
    console.log(`📸 Total photos in database: ${photos.length}\n`);
    console.log('━'.repeat(120));

    const byCategory = {};
    photos.forEach(photo => {
      if (!byCategory[photo.category]) {
        byCategory[photo.category] = [];
      }
      byCategory[photo.category].push(photo);
    });

    for (const [category, photoList] of Object.entries(byCategory)) {
      console.log(`\n📂 ${category} (${photoList.length} photos)`);
      console.log('─'.repeat(120));
      
      photoList.forEach((photo, idx) => {
        console.log(`  ${idx + 1}. Title: "${photo.title}"`);
        console.log(`     ID: ${photo._id}`);
        console.log(`     URL: ${photo.url}`);
        console.log(`     Description: ${photo.description || 'N/A'}`);
        console.log(`     Views: ${photo.views || 0}`);
        
        // Check if file exists
        if (photo.url && photo.url.startsWith('/uploads')) {
          const filePath = path.join(__dirname, `..${photo.url}`);
          const exists = fs.existsSync(filePath);
          console.log(`     File exists: ${exists ? '✅ YES' : '❌ NO'}`);
        } else if (photo.url && photo.url.startsWith('http')) {
          console.log(`     URL Type: Remote/Cloud URL`);
        }
        console.log();
      });
    }

    console.log('\n' + '━'.repeat(120));
    console.log(`\n📊 Summary by Category:`);
    Object.entries(byCategory).forEach(([cat, list]) => {
      console.log(`   ${cat}: ${list.length} photos`);
    });

    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();
