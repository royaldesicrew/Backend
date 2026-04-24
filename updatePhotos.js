import mongoose from 'mongoose';
import Photo from './src/models/Photo.js';

const MONGO_URI = 'mongodb://localhost:27017/royal-desi-crew';

async function updatePhotos() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const photos = await Photo.find({ url: { $regex: '^/static/Images' } });
    console.log(Found \ photos to update);

    for (const photo of photos) {
      const placeholderUrl = \https://via.placeholder.com/400x300?text=\\;
      const oldUrl = photo.url;
      photo.url = placeholderUrl;
      await photo.save();
      console.log(\Updated photo: "\" | Old URL: \ -> New URL: \\);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updatePhotos();
