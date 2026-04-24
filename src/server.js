import './loadEnv.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import discountRoutes from './routes/discountRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware - CORS must be first
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:8000',
      'http://192.168.0.106:3001',
      'http://192.168.0.106:8000',
      'https://royaldesicrew.com',
      'https://www.royaldesicrew.com'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:8000',
      'http://192.168.0.106:3001',
      'http://192.168.0.106:8000',
      'https://royaldesicrew.com',
      'https://www.royaldesicrew.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-desi-crew')
  .then(async () => {
    console.log('✅ MongoDB connected');
    
    // Auto-create admin user if none exists
    const Admin = (await import('./models/Admin.js')).default;
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const bcrypt = (await import('bcryptjs')).default;
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await Admin.create({
        name: 'Admin',
        email: 'admin@royaldesicrew.com',
        password: hashedPassword,
        role: 'super-admin',
        isActive: true
      });
      console.log('✅ Admin user created: admin@royaldesicrew.com / Admin@123');
    }
  })
  .catch(err => console.error('❌ MongoDB error:', err));

// Placeholder image endpoint
app.get('/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  const text = decodeURIComponent(req.query.text || 'Placeholder');
  
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#e0e0e0"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#666" text-anchor="middle" dominant-baseline="middle">
      ${text.substring(0, 30)}
    </text>
  </svg>`;
  
  res.set('Content-Type', 'image/svg+xml');
  res.set('Cache-Control', 'public, max-age=3600');
  res.send(svg);
});

// Routes
app.use('/api/admin', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/emails', emailRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export for Vercel
export default app;
