# Royal Desi Crew - Backend Repository

This is the **complete backend repository** containing both the API server and the Admin Dashboard management portal.

## 📁 Project Structure

```
backend/
├── src/                    # Backend API server
│   ├── server.js          # Express server entry point
│   ├── controllers/       # API endpoint handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth and validation
│   └── config/           # Configuration files
├── admin/                 # React Admin Dashboard
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Admin pages
│   │   ├── context/      # State management
│   │   └── services/     # API services
│   ├── package.json
│   └── .env.local
├── scripts/              # Database & testing scripts
│   ├── seedDatabase.js
│   ├── seedAdmin.js
│   ├── migratePhotos.js
│   └── ...more scripts
├── uploads/              # Photo storage
│   └── photos/
├── package.json          # Root backend package.json
├── .env.local           # Environment variables
└── .env.example         # Environment template
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

This installs dependencies for both backend AND admin dashboard.

### Running Locally

**Start both Backend API and Admin Dashboard:**
```bash
npm start
```

This runs:
- **Backend API** on `http://localhost:5000`
- **Admin Dashboard** on `http://localhost:3000`

**Or run separately:**
```bash
npm run backend      # Just backend API
npm run admin        # Just admin dashboard
npm run backend:dev  # Backend with hot reload
```

## 📋 Scripts

```bash
npm start              # Run backend + admin together
npm run backend        # Backend API only
npm run backend:dev    # Backend with nodemon (auto-reload)
npm run admin          # Admin dashboard only
npm run admin:dev      # Admin with hot reload
npm run seed           # Seed database with sample data
npm run test           # Run admin portal tests
```

## 🔑 Environment Variables

Create `.env.local` with:

```env
# Server Config
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/royal-desi-crew?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-2024

# Frontend URLs
FRONTEND_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:5000

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_here

# Media Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin account

### Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Upload photo (admin)
- `DELETE /api/photos/:id` - Delete photo (admin)

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog (admin)
- `PUT /api/blogs/:id` - Update blog (admin)

### Discounts
- `GET /api/discounts` - Get all discounts
- `POST /api/discounts` - Create discount code (admin)
- `POST /api/discounts/validate` - Validate discount code

### Analytics
- `POST /api/analytics/track` - Track page views
- `GET /api/analytics` - Get analytics data (admin)

### Emails
- `POST /api/emails/send` - Send email via Resend

## 🎨 Admin Dashboard

Access at: `http://localhost:3000`

Login with admin credentials configured in `.env.local`

**Features:**
- 📸 Photo Management - Upload and manage event photos
- 📝 Blog Management - Create and edit blog posts
- 💰 Discount Codes - Create promotional codes
- 📊 Analytics Dashboard - View user activity
- 👥 Admin Users - Manage admin accounts

## 📦 Database

**MongoDB Collections:**
- `admins` - Admin user accounts
- `photos` - Event photos metadata
- `blogs` - Blog posts
- `discounts` - Discount codes
- `analytics` - User activity tracking

**Seeding Database:**
```bash
npm run seed          # Load sample data
npm run test          # Test admin portal
npm run check:admin   # Verify admin credentials
```

## 🌐 Deployment

### Vercel Deployment

This backend is configured for Vercel deployment.

**Deploy with:**
```bash
vercel deploy
```

**Production URL example:**
```
https://royal-desi-crew-api.vercel.app
```

**After deployment, update frontend URLs in:**
- `FRONTEND_URL` in backend `.env.local`
- `REACT_APP_API_URL` in admin `/.env.local`

### Environment Variables on Vercel

Add to Vercel project settings:
```
MONGODB_URI=your_mongodb_atlas_url
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

## 🔐 Security

- JWT tokens for authentication
- Password hashing with bcryptjs
- CORS configured for allowed origins
- Environment variables for secrets
- Input validation on all endpoints

## 📱 Frontend Integration

**Website** connects to API:
- Base URL: `http://localhost:5000/api`
- Email endpoint: `/api/emails/send` (via Resend)
- Admin notifications: FormSubmit.co

**Update API URL after deployment:**
```javascript
// In static/api-integration.js
const API_BASE_URL = 'https://your-backend-domain/api';
```

## 🛠 Development

### Adding Dependencies

```bash
# For backend
npm install package-name

# For admin
cd admin && npm install package-name
```

### Project Files

- **Backend Source:** `src/` folder
- **Admin Source:** `admin/src/` folder
- **Database Scripts:** `scripts/` folder
- **Configuration:** `.env.local` file

## 📚 Documentation

- [Backend API Routes](./src/README.md)
- [Admin Dashboard Setup](./admin/README.md)
- [Database Schema](./BACKEND_STRUCTURE.md)

## 🐛 Troubleshooting

**Port 5000 already in use:**
```bash
# Find process on port 5000
netstat -ano | findstr :5000
# Kill process
taskkill /PID [PID] /F
```

**MongoDB connection failed:**
- Check `MONGODB_URI` in `.env.local`
- Verify IP whitelist on MongoDB Atlas
- Test connection: `npm run test`

**Admin dashboard not loading:**
- Check if admin is running on port 3000
- Verify `REACT_APP_API_URL` in admin/.env.local
- Check browser console for errors

## 📞 Support

For issues or questions:
1. Check error logs in terminal
2. Run `npm run test` for diagnostics
3. Verify all environment variables are set
4. Check MongoDB connection

## 📄 License

Licensed under MIT License

---

**This backend repo is ready to be deployed separately to Vercel or any Node.js hosting platform.**
