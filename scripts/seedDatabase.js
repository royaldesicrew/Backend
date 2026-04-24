import Admin from '../src/models/Admin.js';
import Blog from '../src/models/Blog.js';
import Photo from '../src/models/Photo.js';
import Discount from '../src/models/Discount.js';
import Analytics from '../src/models/Analytics.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-desi-crew');
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to preserve data)
    // await Admin.deleteMany({});
    // await Blog.deleteMany({});
    // await Photo.deleteMany({});
    // await Discount.deleteMany({});
    // await Analytics.deleteMany({});
    // console.log('🗑️  Cleared existing data');

    // ===== SEED ADMIN =====
    const existingAdmin = await Admin.findOne({ email: 'admin@royaldesicrew.com' });
    let adminId;
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      const admin = new Admin({
        name: 'Admin User',
        email: 'admin@royaldesicrew.com',
        password: hashedPassword,
        role: 'super-admin',
        isActive: true
      });
      await admin.save();
      adminId = admin._id;
      console.log('✅ Admin user created');
      console.log('   📧 Email: admin@royaldesicrew.com');
      console.log('   🔐 Password: Admin@123');
    } else {
      adminId = existingAdmin._id;
      console.log('✅ Admin user already exists');
    }

    // ===== SEED BLOGS =====
    const blogs = [
      {
        title: 'Royal Desi Crew - Welcome',
        content: 'Welcome to Royal Desi Crew! Discover the finest desi photography and culture.',
        author: 'Admin',
        image: 'https://via.placeholder.com/300x200?text=Royal+Desi+Crew',
        published: true
      },
      {
        title: 'Photography Tips for Desi Events',
        content: 'Learn the best practices for capturing beautiful moments during desi celebrations and events.',
        author: 'Admin',
        image: 'https://via.placeholder.com/300x200?text=Photography+Tips',
        published: true
      },
      {
        title: 'Behind the Scenes: Our Latest Photoshoot',
        content: 'Get an exclusive look at how we capture stunning images for our portfolio.',
        author: 'Admin',
        image: 'https://via.placeholder.com/300x200?text=Behind+Scenes',
        published: false
      },
      {
        title: 'Cultural Heritage Through Photography',
        content: 'Exploring the richness of desi culture through the lens of professional photography.',
        author: 'Admin',
        image: 'https://via.placeholder.com/300x200?text=Cultural+Heritage',
        published: true
      }
    ];

    for (const blog of blogs) {
      const existingBlog = await Blog.findOne({ slug: blog.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') });
      if (!existingBlog) {
        await Blog.create(blog);
      }
    }
    console.log('✅ Blogs seeded');

    // ===== SEED PHOTOS =====
    const photos = [
      {
        title: 'Luxury Wedding - Bridal Shoot',
        description: 'Beautiful bridal photography for luxury weddings',
        url: 'https://via.placeholder.com/300x300?text=Bridal+Shoot',
        category: 'Luxury Weddings',
        uploadedBy: adminId
      },
      {
        title: 'Corporate Event - Conference',
        description: 'Professional corporate event coverage',
        url: 'https://via.placeholder.com/300x300?text=Corporate+Event',
        category: 'Corporate Events',
        uploadedBy: adminId
      },
      {
        title: 'Birthday Celebration - Party Setup',
        description: 'Joyful birthday celebration photography',
        url: 'https://via.placeholder.com/300x300?text=Birthday+Party',
        category: 'Birthday Celebrations',
        uploadedBy: adminId
      },
      {
        title: 'Decor & Design - Theme Setup',
        description: 'Artistic decor and design photography',
        url: 'https://via.placeholder.com/300x300?text=Decor+Design',
        category: 'Decor and Design',
        uploadedBy: adminId
      },
      {
        title: 'Wedding Reception - Golden Hour',
        description: 'Stunning wedding reception in golden light',
        url: 'https://via.placeholder.com/300x300?text=Wedding+Reception',
        category: 'Luxury Weddings',
        uploadedBy: adminId
      }
    ];

    for (const photo of photos) {
      const existingPhoto = await Photo.findOne({ title: photo.title });
      if (!existingPhoto) {
        await Photo.create(photo);
      }
    }
    console.log('✅ Photos seeded');

    // ===== SEED DISCOUNTS =====
    const discounts = [
      {
        code: 'WELCOME10',
        percentage: 10,
        description: 'Welcome offer - 10% off',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        maxUses: 100,
        isActive: true,
        createdBy: adminId
      },
      {
        code: 'SUMMER20',
        percentage: 20,
        description: 'Summer special - 20% off',
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        maxUses: 50,
        isActive: true,
        createdBy: adminId
      },
      {
        code: 'LOYALTY15',
        percentage: 15,
        description: 'Loyalty reward - 15% off',
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        maxUses: 200,
        isActive: true,
        createdBy: adminId
      },
      {
        code: 'BULK25',
        percentage: 25,
        description: 'Bulk order discount - 25% off',
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        maxUses: 30,
        isActive: true,
        createdBy: adminId
      }
    ];

    for (const discount of discounts) {
      const existingDiscount = await Discount.findOne({ code: discount.code });
      if (!existingDiscount) {
        await Discount.create(discount);
      }
    }
    console.log('✅ Discount codes seeded');

    // ===== SEED ANALYTICS =====
    // Create initial analytics entries
    const analytics = [
      {
        eventType: 'page_view',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        ipAddress: '192.168.1.1'
      },
      {
        eventType: 'photo_view',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        ipAddress: '192.168.1.2'
      },
      {
        eventType: 'blog_view',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
        ipAddress: '192.168.1.3'
      }
    ];

    // Only seed if analytics collection is empty
    const analyticsCount = await Analytics.countDocuments();
    if (analyticsCount === 0) {
      await Analytics.insertMany(analytics);
      console.log('✅ Analytics seeded');
    } else {
      console.log('✅ Analytics collection already populated');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ DATABASE SETUP COMPLETE!');
    console.log('='.repeat(50));
    console.log('\n📊 Collections Created:');
    console.log('   • Admins (1 user)');
    console.log('   • Blogs (4 posts)');
    console.log('   • Photos (5 images)');
    console.log('   • Discounts (4 codes)');
    console.log('   • Analytics (initialized)');
    console.log('\n🔐 Admin Credentials:');
    console.log('   Email: admin@royaldesicrew.com');
    console.log('   Password: Admin@123');
    console.log('\n💳 Sample Discount Codes:');
    discounts.forEach(d => {
      console.log(`   ${d.code} - ${d.percentage}% off`);
    });
    console.log('\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    process.exit(1);
  }
};

seedDatabase();
