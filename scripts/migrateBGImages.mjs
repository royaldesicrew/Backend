import mongoose from 'mongoose';
import Photo from '../src/models/Photo.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const photosData = [
  {
    title: 'Wedding Background',
    filename: 'Wedding.png',
    description: 'Elegant wedding background carousel image'
  },
  {
    title: 'Background Image 2',
    filename: 'background image 2.jpg',
    description: 'Beautiful background carousel image'
  },
  {
    title: 'Background Image 3',
    filename: 'background 3.jpg',
    description: 'Premium background carousel image'
  },
  {
    title: 'Elegant Background',
    filename: 'Background.png',
    description: 'Sophisticated background carousel image'
  }
];

const migrateBackgroundImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-desi-crew');
    console.log('✅ Connected to MongoDB');
    
    let addedCount = 0;
    let skippedCount = 0;

    for (const photoData of photosData) {
      const existingPhoto = await Photo.findOne({ 
        title: photoData.title,
        category: 'Background Images'
      });

      if (existingPhoto) {
        console.log(`⏭️  Skipped: ${photoData.title} (already exists)`);
        skippedCount++;
      } else {
        const photoUrl = `/static/Images/${photoData.filename}`;
        const photo = new Photo({
          title: photoData.title,
          description: photoData.description,
          url: photoUrl,
          category: 'Background Images',
          views: 0
        });

        await photo.save();
        console.log(`✅ Added: ${photoData.title}`);
        addedCount++;
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Added: ${addedCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
};

migrateBackgroundImages();
