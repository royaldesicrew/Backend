# Admin Panel - Royal Desi Crew

React-based admin panel for managing photos, blogs, discounts, and analytics.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```
REACT_APP_API_URL=http://localhost:5000
```

3. Start development server:
```bash
npm start
```

Access at: `http://localhost:3000/admin`

## Production Build

```bash
npm run build
```

## Features

- **Login**: Admin authentication with JWT
- **Dashboard**: Overview with analytics
- **Photos Manager**: Upload, view, and delete photos
- **Blogs Manager**: Create, edit, and delete blog posts
- **Discounts Manager**: Manage discount codes
- **Analytics**: Track visitor stats and activity

## Backend API Endpoints Required

- `POST /api/admin/login` - Admin login
- `GET /api/photos` - Get all photos
- `POST /api/photos/upload` - Upload photo
- `DELETE /api/photos/:id` - Delete photo
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog
- `DELETE /api/blogs/:id` - Delete blog
- `GET /api/discounts` - Get discounts
- `POST /api/discounts` - Create discount
- `DELETE /api/discounts/:id` - Delete discount
- `GET /api/analytics/dashboard` - Get dashboard stats

## Deployment on Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variable: `REACT_APP_API_URL=https://your-backend.vercel.app`
4. Deploy

## Notes

- Admin panel is hidden from normal users
- Only accessible at `/admin/login`
- Uses JWT tokens for authentication
- All requests to backend require authorization token
