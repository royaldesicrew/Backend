import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

import Photo from './src/models/Photo.js';

(async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-desi-crew';
    console.log('Connecting to MongoDB with URI:', mongoUri.substring(0, 50) + '...');
    await mongoose.connect(mongoUri);
    
    // Find all photos with placeholder URLs that need local endpoint
    const photos = await Photo.find({ 
      url: { $regex: 'via.placeholder.com' }
    });
    
    console.log(`Found ${photos.length} photos to update\n`);
    
    for (const photo of photos) {
      const encodedTitle = encodeURIComponent(photo.title);
      const newUrl = `http://localhost:5000/placeholder/400/300?text=${encodedTitle}`;
      await Photo.findByIdAndUpdate(photo._id, { url: newUrl });
      console.log(`✓ ${photo.title}`);
    }
    
    console.log(`\n✅ Updated ${photos.length} photos to local placeholder URLs!`);
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
