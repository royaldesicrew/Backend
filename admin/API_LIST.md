# Royal Desi Crew - API Documentation

This document provides a comprehensive list of all available API endpoints for the Royal Desi Crew backend.

## Base URL
- **Production:** `https://backend-six-theta-99.vercel.app`
- **Development:** `http://localhost:5000`

---

## 🔐 Authentication
Most admin-related endpoints require a JSON Web Token (JWT) provided in the `Authorization` header.

**Format:** `Authorization: Bearer <token>`

### Auth Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/admin/login` | Authenticate admin and get JWT | ❌ |
| `GET` | `/api/admin/verify` | Verify current JWT and get admin profile | ✅ |
| `POST` | `/api/admin/logout` | Invalidate session (client-side) | ✅ |

**Login Body Example:**
```json
{
  "email": "admin@royaldesicrew.com",
  "password": "your-password"
}
```

---

## 📸 Photos
Manage the gallery and photo uploads.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/photos` | Fetch all public photos | ❌ |
| `POST` | `/api/photos/upload` | Upload a new photo to Cloudinary | ✅ |
| `PUT` | `/api/photos/:id` | Update photo details or replace image | ✅ |
| `DELETE` | `/api/photos/:id` | Remove a photo from database and Cloudinary | ✅ |
| `GET` | `/api/photos/stats` | Get photo-related statistics | ✅ |

**Upload/Update Body (Multipart/Form-Data):**
- `photo`: File (Image)
- `title`: String
- `category`: String (e.g., 'Wedding', 'Corporate')
- `description`: String

---

## ✍️ Blogs
Manage blog posts and articles.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/blogs` | Fetch all blog posts | ❌ |
| `POST` | `/api/blogs` | Create a new blog post | ✅ |
| `PUT` | `/api/blogs/:id` | Update an existing blog post | ✅ |
| `DELETE` | `/api/blogs/:id` | Delete a blog post | ✅ |
| `GET` | `/api/blogs/stats` | Get blog-related statistics | ✅ |

---

## 🏷️ Discounts
Manage promotional codes and validation.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/discounts` | List all discount codes | ✅ |
| `POST` | `/api/discounts` | Create a new discount code | ✅ |
| `PUT` | `/api/discounts/:id` | Update discount details | ✅ |
| `DELETE` | `/api/discounts/:id` | Delete a discount code | ✅ |
| `POST` | `/api/discounts/validate` | Validate a code for client checkout | ❌ |

---

## 📊 Analytics
Track and retrieve engagement data.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/analytics/dashboard` | Summary stats for the admin dashboard | ✅ |
| `GET` | `/api/analytics/photos` | Photo view/engagement analytics | ✅ |
| `GET` | `/api/analytics/blogs` | Blog read/engagement analytics | ✅ |
| `POST` | `/api/analytics/track` | Track a client-side event | ❌ |

---

## 📧 Emails
Handle contact forms and bookings.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/emails/send` | Send booking/inquiry email via Nodemailer | ❌ |

---

## 🛠️ System
Utility and health endpoints.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Check if the server is healthy |
| `GET` | `/placeholder/:w/:h` | Generate a dynamic SVG placeholder image |

---

> [!TIP]
> Always ensure your `Content-Type` header is set to `application/json` for POST/PUT requests, except when uploading files (use `multipart/form-data`).
