# Backend Repository Structure

This folder contains all backend-related files for the Royal Desi Crew website.

## Files Overview

### Core Backend Files
- `src/server.js` - Main Express server entry point
- `package.json` - Backend dependencies
- `.env.local` - Environment variables (API keys, database config)

### Environment Variables
Located in `.env.local`:
- `RESEND_API_KEY` - For sending user confirmation emails
- `MONGODB_URI` - Database connection string
- Other API keys and configuration

### API Endpoints

#### Email API
- `POST /api/emails/send` - Send user confirmation emails via Resend

#### Photos API
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Upload new photo (admin)

#### Blogs API
- `GET /api/blogs` - Get all blog posts
- `POST /api/blogs` - Create blog post (admin)

#### Discounts API
- `GET /api/discounts` - Get all discount codes
- `POST /api/discounts/validate` - Validate discount code

#### Analytics API
- `POST /api/analytics/track` - Track page views and events

#### Auth API
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration

### Frontend Integration
The frontend (in static/) communicates with backend via:
- API Base URL: `http://localhost:5000/api`
- Client API integration file: `client-api-integration.js` (reference copy)

### Admin Portal
Located in `admin/` folder - separate React app for managing content:
- Photos, Blogs, Discounts
- Analytics Dashboard
- User Registrations

### Scripts
Located in `scripts/`:
- `seedDatabase.js` - Initialize database
- `migratePhotos.js` - Migrate photo data
- `testLoginFlow.js` - Test authentication

## Running the Backend

```bash
npm install
npm start
```

Server runs on: `http://localhost:5000`

## Database
- MongoDB connection via `.env.local`
- Models in `src/models/`
- Controllers in `src/controllers/`

## File Organization
```
backend/
├── src/
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── uploads/
│   └── photos/
├── scripts/
├── .env.local
├── package.json
└── README.md
```

---
All backend dependencies are managed in this folder. When moving to another repository, ensure `.env.local` is properly configured with correct API keys and database URLs.
