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
    
    const brokenPhotos = await Photo.find({ url: { $regex: '^/static/Images' } });
    
    console.log(`Found ${brokenPhotos.length} photos with broken URLs\n`);
    
    for (const photo of brokenPhotos) {
      const encodedTitle = encodeURIComponent(photo.title);
      const newUrl = `http://localhost:5000/placeholder/400/300?text=${encodedTitle}`;
      await Photo.findByIdAndUpdate(photo._id, { url: newUrl });
      console.log(`✓ ${photo.title}`);
    }
    
    console.log(`\n✅ Updated ${brokenPhotos.length} photos!`);
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
