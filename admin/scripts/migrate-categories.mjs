import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const migrateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('CONNECTED_TO_DB');

    const PhotoSchema = new mongoose.Schema({
      category: String
    }, { strict: false });

    const Photo = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);

    // Migration Mapping
    const mapping = {
      'Birthday Celebrations': 'Birthday',
      'Decor and Design': 'Design and Decor',
      'Luxury Weddings': 'Luxury Wedding', // Fixing plural
      'gallery': 'Luxury Wedding' // Defaulting old placeholder
    };

    let updatedCount = 0;
    for (const [oldCat, newCat] of Object.entries(mapping)) {
      const result = await Photo.updateMany(
        { category: oldCat },
        { category: newCat }
      );
      updatedCount += result.modifiedCount;
      console.log(`Updated ${result.modifiedCount} photos from "${oldCat}" to "${newCat}"`);
    }

    console.log(`MIGRATION_COMPLETE: ${updatedCount} photos updated.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrateCategories();
