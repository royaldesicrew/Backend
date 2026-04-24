# Backend - Royal Desi Crew

Node.js + Express backend with MongoDB integration for Royal Desi Crew admin panel.

## Setup

### 1. Clone/Create Backend Repo

Create a new folder or repo:
```bash
mkdir backend
cd backend
npm install
```

### 2. Environment Variables

Create `.env.local`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/royal-desi-crew
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

**For MongoDB:**
- Use MongoDB Atlas (cloud): [mongodb.com/atlas](https://mongodb.com/atlas)
- Or local MongoDB

### 3. Create Admin User

Create a `scripts/seedAdmin.js` file and run it:
```javascript
import Admin from '../src/models/Admin.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = new Admin({
    name: 'Admin',
    email: 'admin@royaldesicrew.com',
    password: hashedPassword,
    role: 'super-admin'
  });
  await admin.save();
  console.log('Admin created');
  process.exit();
};

createAdmin();
```

Run: `node scripts/seedAdmin.js`

### 4. Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Production Build

### Deploy on Vercel

1. Push to GitHub
2. Create new Vercel project
3. Set environment variables:
   - `MONGODB_URI=mongodb+srv://...`
   - `JWT_SECRET=your-secret-key`
   - `FRONTEND_URL=https://your-frontend.vercel.app`
4. Deploy

## API Endpoints

### Authentication
- `POST /api/admin/login` - Login
- `GET /api/admin/verify` - Verify token
- `POST /api/admin/logout` - Logout

### Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos/upload` - Upload photo (auth required)
- `PUT /api/photos/:id` - Update photo (auth required)
- `DELETE /api/photos/:id` - Delete photo (auth required)

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog (auth required)
- `PUT /api/blogs/:id` - Update blog (auth required)
- `DELETE /api/blogs/:id` - Delete blog (auth required)

### Discounts
- `GET /api/discounts` - Get all discounts (auth required)
- `POST /api/discounts` - Create discount (auth required)
- `PUT /api/discounts/:id` - Update discount (auth required)
- `DELETE /api/discounts/:id` - Delete discount (auth required)
- `POST /api/discounts/validate` - Validate discount code

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats (auth required)
- `GET /api/analytics/photos` - Photo stats (auth required)
- `GET /api/analytics/blogs` - Blog stats (auth required)
- `POST /api/analytics/track` - Track event

## Technology Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + bcryptjs
- **CORS**: Enabled for frontend

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
├── scripts/
├── package.json
├── .env.example
└── vercel.json
```

## Notes

- Admin panel UI is in the `admin/` folder
- Both frontend and backend need to be deployed separately
- Ensure CORS is configured for your frontend URL
