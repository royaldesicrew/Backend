import mongoose from 'mongoose';
import Photo from '../src/models/Photo.js';
import Admin from '../src/models/Admin.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const migratePhotos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-desi-crew');
    console.log('✅ Connected to MongoDB');

    // Get admin user
    const admin = await Admin.findOne({ email: 'royaldesicrew@gmail.com' });
    if (!admin) {
      console.error('❌ Admin user not found');
      process.exit(1);
    }

    // Photos data from static folder
    const photosData = [
      {
        title: 'Wedding Couple',
        description: 'Beautiful wedding couple photography',
        url: '/static/Images/COllection/wedding-couple.jpeg',
        category: 'Luxury Weddings'
      },
      {
        title: 'Corporate Event 1',
        description: 'Professional corporate event coverage',
        url: '/static/Images/corporate event1.jpeg',
        category: 'Corporate Events'
      },
      {
        title: 'Birthday Party',
        description: 'Joyful birthday celebration',
        url: '/static/Images/birthday party .png',
        category: 'Birthday Celebrations'
      },
      {
        title: 'Theme Based Party',
        description: 'Artistic theme-based party decoration',
        url: '/static/Images/theam based party.png',
        category: 'Decor and Design'
      },
      {
        title: 'Wedding Background',
        description: 'Elegant wedding setting',
        url: '/static/Images/Wedding.png',
        category: 'Luxury Weddings'
      },
      {
        title: 'Background Image',
        description: 'Beautiful background for events',
        url: '/static/Images/Background.png',
        category: 'Decor and Design'
      },
      {
        title: 'Corporate Event Setup',
        description: 'Professional corporate event setup',
        url: '/static/Images/corporate event1.jpeg',
        category: 'Corporate Events'
      }
    ];

    let added = 0;
    let skipped = 0;

    for (const photoData of photosData) {
      const exists = await Photo.findOne({ title: photoData.title });
      if (!exists) {
        await Photo.create({
          ...photoData,
          uploadedBy: admin._id,
          views: 0
        });
        added++;
        console.log(`✅ Added: ${photoData.title}`);
      } else {
        skipped++;
        console.log(`⏭️  Skipped (already exists): ${photoData.title}`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`📊 Migration Summary:`);
    console.log(`   ✅ Added: ${added}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log('='.repeat(50) + '\n');

    await mongoose.connection.close();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error migrating photos:', error);
    process.exit(1);
  }
};

migratePhotos();
