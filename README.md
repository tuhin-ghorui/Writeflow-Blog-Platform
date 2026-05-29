# WriteFlow - Premium Full-Stack Blogging Platform

WriteFlow is a production-ready, SaaS-style blogging application developed with the MERN stack. It features a complete JWT authentication workflow, a Markdown-based rich editor with live split-screen preview, category/tag taxonomies, view tracking, article likes, user profiles, comments, and a multi-tab system-level Admin Panel.

## Features

- **Authentication**: JWT-based secure signup, login, auto login persistence, and password verification hashing with bcryptjs.
- **Blogging Lifecycle**: Full CRUD operations. Slugs are automatically generated from article titles and guaranteed unique via database checks.
- **Rich Editor**: Custom distraction-free Markdown text area with formatting helper keys and a real-time live HTML preview tab.
- **Interactions**: Interactive comments section (instant submission updates and cascading deletes) and toggle article likes.
- **Metrics**: High-fidelity views and likes counter tracking.
- **Admin Dashboard**: System-level moderation workspace:
  - **KPI statistics**: total users, blogs, comments, and views count.
  - **User Management**: listing all users and cascaded deletion.
  - **Blog Moderation**: force-deleting spam or inappropriate articles.
  - **Comment Moderation**: auditing comments list and force-deleting spam.
- **Design & UI**: Premium, dark-mode toggle enabled SaaS interface utilizing HSL colors, Outfit/Inter typography, scrollbars, loading skeletons, responsive menus, and toast notifications.
- **Security Protocols**: Helmet headers, express-rate-limiter (sensitive auth attempts cap), custom recursive XSS sanitization, and CORS protections.

---

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + React Router + Lucide Icons + React Hot Toast
- **Backend**: Node.js + Express.js + Mongoose ORM
- **Database**: MongoDB Atlas / Local MongoDB
- **Security & Auth**: jsonwebtoken, bcryptjs, helmet, express-rate-limit

---

## Folder Structure

```
WriteFlow/
├── server/
│   ├── config/          # Database, security config
│   ├── controllers/     # Route controller functions (Auth, User, Blog, Comments, Admin)
│   ├── middleware/      # Auth protection, admin validation, rate-limiting, XSS cleaning
│   ├── models/          # User, Blog, and Comment Mongoose Schemas
│   ├── routes/          # Express API route endpoints
│   ├── utils/           # slugify, generateToken
│   ├── server.js        # Express Node entry server
│   └── .env
├── client/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, CommentSection, SkeletonCard
│   │   ├── context/     # AuthContext, ThemeContext
│   │   ├── layouts/     # MainLayout (navbar/footer outlet)
│   │   ├── pages/       # Home, Listing, Details, About, Dashboard, Editor, Profile, Admin
│   │   ├── routes/      # PrivateRoute and AdminRoute guards
│   │   ├── services/    # api.js fetch client with token injector
│   │   ├── index.css    # Typography, global scrollbars, markdown classes
│   │   ├── App.jsx      # Router mapping & Toaster registrations
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env
└── README.md
```

---

## Installation & Setup Guide

### Prerequisites
- Node.js (v18+)
- npm / yarn
- MongoDB running locally OR a MongoDB Atlas database URI

### 1. Database & Server Setup
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install server-side dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `server/` folder (use `.env.example` as a template):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/writeflow
   JWT_SECRET=supersecretkeywriteflow123
   NODE_ENV=development
   ```
4. Start the backend development server:
   ```bash
   node server.js
   ```

### 2. Client Setup
1. Open a new terminal window and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install client-side dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `client/` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the local link (typically `http://localhost:5173`).

---

## API Documentation

### AUTH (`/api/auth`)
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Login, returns JWT token & user payload
- `GET /api/auth/me` - Fetch authenticated user details

### USER (`/api/users`)
- `GET /api/users/profile` - Fetch current user profile + total blogs/views/likes metrics
- `PUT /api/users/profile` - Edit name, username, email, avatar, or reset password

### BLOG (`/api/blogs`)
- `GET /api/blogs` - Query blogs list (filters: `category`, `tag`, `author`, `search`, sorting: `latest`, `most-viewed`, `popular`, pagination: `page`)
- `GET /api/blogs/:slugOrId` - Fetch blog detail (increments views count)
- `POST /api/blogs` - Create blog post (Authorized users)
- `PUT /api/blogs/:id` - Update blog post (Author/Admin only)
- `DELETE /api/blogs/:id` - Delete blog post (Author/Admin only)
- `POST /api/blogs/:id/like` - Toggle like on a blog post (Authorized users)

### COMMENTS (`/api/comments`)
- `GET /api/comments/:blogId` - Fetch comments for a blog post
- `POST /api/comments` - Create a comment on a blog post (Authorized users)
- `DELETE /api/comments/:id` - Delete comment (Commenter/Admin only)

### ADMIN (`/api/admin`)
- `GET /api/admin/stats` - Fetch overall stats grids + recent blogs/users (Admin only)
- `GET /api/admin/users` - Fetch list of all system users (Admin only)
- `DELETE /api/admin/users/:id` - Delete user account (Admin only)
- `GET /api/admin/comments` - Fetch all system comments for moderation (Admin only)

---

## Seed Admin Credentials
To create an initial admin account, simply sign up via the register page. You can elevate their role to `'admin'` directly in the database inside the `users` collection:
```javascript
db.users.updateOne({ username: "your_username" }, { $set: { role: "admin" } });
```
This grants access to the high-level KPI dashboard.
