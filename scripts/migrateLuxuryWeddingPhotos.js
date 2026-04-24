import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Photo from '../src/models/Photo.js';
import Admin from '../src/models/Admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const luxuryWeddingPhotos = [
    { title: 'Wedding Couple', filename: 'wedding-couple.jpeg' },
    { title: 'Luxury Wedding 1', filename: 'WhatsApp Image 2026-04-06 at 5.47.58 PM.jpeg' },
    { title: 'Luxury Wedding 2', filename: 'WhatsApp Image 2026-04-06 at 5.49.01 PM.jpeg' },
    { title: 'Luxury Wedding 3', filename: 'WhatsApp Image 2026-04-06 at 5.49.17 PM.jpeg' },
    { title: 'Luxury Wedding 4', filename: 'WhatsApp Image 2026-04-06 at 5.50.02 PM.jpeg' },
    { title: 'Luxury Wedding 5', filename: 'WhatsApp Image 2026-04-06 at 5.50.04 PM.jpeg' },
    { title: 'Luxury Wedding 6', filename: 'WhatsApp Image 2026-04-06 at 5.50.08 PM.jpeg' },
    { title: 'Luxury Wedding 7', filename: 'WhatsApp Image 2026-04-06 at 5.50.09 PM.jpeg' },
    { title: 'Luxury Wedding 8', filename: 'WhatsApp Image 2026-04-06 at 5.50.15 PM.jpeg' },
    { title: 'Luxury Wedding 9', filename: 'WhatsApp Image 2026-04-06 at 5.51.30 PM.jpeg' },
    { title: 'Luxury Wedding 10', filename: 'WhatsApp Image 2026-04-06 at 5.53.15 PM.jpeg' },
    { title: 'Luxury Wedding 11', filename: 'WhatsApp Image 2026-04-06 at 5.53.18 PM.jpeg' },
    { title: 'Luxury Wedding 12', filename: 'WhatsApp Image 2026-04-06 at 5.55.31 PM.jpeg' },
    { title: 'Luxury Wedding 13', filename: 'WhatsApp Image 2026-04-06 at 5.55.36 PM.jpeg' },
    { title: 'Luxury Wedding 14', filename: 'WhatsApp Image 2026-04-06 at 5.55.38 PM.jpeg' },
    { title: 'Luxury Wedding 15', filename: 'WhatsApp Image 2026-04-06 at 5.56.35 PM.jpeg' }
];

async function migrate() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Get admin user
        const admin = await Admin.findOne({ email: 'royaldesicrew@gmail.com' });
        if (!admin) {
            console.error('❌ Admin user not found');
            process.exit(1);
        }

        let added = 0;
        let skipped = 0;

        // Migrate photos
        for (const photoData of luxuryWeddingPhotos) {
            // Check if photo already exists
            const existing = await Photo.findOne({ 
                title: photoData.title,
                category: 'Luxury Weddings'
            });

            if (existing) {
                console.log(`⏭️  Skipped: ${photoData.title} (already exists)`);
                skipped++;
                continue;
            }

            // Create new photo document
            const photo = new Photo({
                title: photoData.title,
                description: 'Beautiful luxury wedding photography',
                url: `/static/Images/COllection/${photoData.filename}`,
                category: 'Luxury Weddings',
                views: 0,
                uploadedBy: admin._id
            });

            await photo.save();
            console.log(`✅ Added: ${photoData.title}`);
            added++;
        }

        console.log('\n==================================================');
        console.log('📊 Migration Summary:');
        console.log(`   ✅ Added: ${added}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log('==================================================\n');

        // Disconnect
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();
