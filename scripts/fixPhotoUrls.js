import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const photoSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  category: String,
  createdAt: { type: Date, default: Date.now }
});

const Photo = mongoose.model('Photo', photoSchema);

async function fixUrls() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('📝 Fetching all photos...');
    const photos = await Photo.find({});
    console.log(`Found ${photos.length} photos`);
    
    let updated = 0;
    
    for (const photo of photos) {
      const oldUrl = photo.url;
      
      // Remove hardcoded localhost URLs
      if (photo.url && photo.url.includes('http://localhost:5000')) {
        // Convert placeholder URLs to just the placeholder path
        // e.g., http://localhost:5000/placeholder/400/300?text=Title -> /placeholder/400/300?text=Title
        const placeholderMatch = photo.url.match(/\/placeholder\/.*/);
        if (placeholderMatch) {
          photo.url = placeholderMatch[0];
          await photo.save();
          console.log(`✅ Updated ${photo.title}: ${oldUrl} → ${photo.url}`);
          updated++;
        }
      }
      // Ensure file URLs are stored as relative paths
      else if (photo.url && photo.url.includes('/uploads/')) {
        const uploadsMatch = photo.url.match(/\/uploads\/.*/);
        if (uploadsMatch) {
          photo.url = uploadsMatch[0];
          await photo.save();
          console.log(`✅ Normalized ${photo.title}: → ${photo.url}`);
          updated++;
        }
      }
    }
    
    console.log(`\n✨ Successfully updated ${updated} photo URLs`);
    console.log('📌 All URLs are now dynamic - they will be constructed from API_BASE_URL');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

fixUrls();
