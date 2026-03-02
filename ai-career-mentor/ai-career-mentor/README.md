# 🚀 AI Career Mentor — Full-Stack Application

A production-ready, AI-powered career mentoring platform with a stunning Liquid Glass UI, built with React + Vite + Node.js + MongoDB.

---

## ✨ Features

### 🔐 Authentication
- JWT-based auth with bcrypt password hashing
- Protected routes (frontend + backend)
- Role-based access control (User / Admin)

### 🤖 AI Integration (Google Gemini)
- Real-time AI career chat
- Resume analysis with ATS scoring
- Career roadmap generation
- Interview preparation

### 📄 Resume Analyzer
- PDF upload and parsing
- AI-powered feedback (ATS score, impact score, overall score)
- Strengths & improvement suggestions
- Keyword optimization tips

### 📊 Admin Dashboard
- User management (list, search, promote to Pro, delete)
- Analytics charts (recharts)
- Platform stats overview

### 💳 Stripe Payments
- Pro subscription at $19.99/month
- Webhook handling
- Automatic Pro status updates

### 🎨 UI/UX
- Liquid Glass / Glassmorphism design
- Framer Motion animations
- Dark theme with purple/pink gradient
- Fully responsive (mobile + desktop)
- Toast notifications

---

## 📁 Folder Structure

```
ai-career-mentor/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Register/Login/Me
│   │   ├── chatController.js    # AI chat with Gemini
│   │   ├── resumeController.js  # PDF upload + AI analysis
│   │   ├── adminController.js   # Admin stats/users
│   │   └── paymentController.js # Stripe integration
│   ├── middleware/
│   │   └── auth.js             # JWT verify, admin, pro
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Chat.js             # Chat history schema
│   │   └── Analytics.js        # Event tracking
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   ├── users.js            # /api/users/*
│   │   ├── chat.js             # /api/chat/*
│   │   ├── resume.js           # /api/resume/*
│   │   ├── admin.js            # /api/admin/*
│   │   ├── payment.js          # /api/payment/*
│   │   └── analytics.js        # /api/analytics/*
│   ├── uploads/                # Temp PDF storage
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express app entry
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx           # Floating navbar
    │   │   │   └── DashboardLayout.jsx  # Collapsible sidebar
    │   │   └── ui/
    │   │       ├── LoadingSpinner.jsx
    │   │       └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Auth state + methods
    │   │   └── ThemeContext.jsx  # Dark/light toggle
    │   ├── pages/
    │   │   ├── HomePage.jsx      # Landing page
    │   │   ├── auth/
    │   │   │   ├── LoginPage.jsx
    │   │   │   └── RegisterPage.jsx
    │   │   ├── dashboard/
    │   │   │   ├── DashboardHome.jsx  # Overview
    │   │   │   ├── ChatPage.jsx       # AI chat
    │   │   │   ├── ResumePage.jsx     # Resume analyzer
    │   │   │   └── ProfilePage.jsx    # Edit profile
    │   │   └── admin/
    │   │       └── AdminPanel.jsx     # Admin dashboard
    │   ├── utils/
    │   │   └── api.js            # Axios instance
    │   ├── App.jsx               # Routes
    │   ├── main.jsx
    │   └── index.css             # Tailwind + custom styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** — copy `.env.example` to `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/ai-career-mentor
JWT_SECRET=your_super_long_secret_key_here
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=AIzaSyAMkDs1SIaTHsVHaxVbD1GlBdnnQbaWkKg
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** — create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run Development

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### 4. Create Admin User (optional)

After registering, use MongoDB Compass or shell to set `isAdmin: true`:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { isAdmin: true } })
```

---

## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✓ | Get current user |
| PUT | /api/users/profile | ✓ | Update profile |
| POST | /api/chat/message | ✓ | Send chat message (AI) |
| GET | /api/chat/history | ✓ | Get chat history |
| DELETE | /api/chat/:id | ✓ | Delete a chat |
| POST | /api/resume/analyze | ✓ | Upload + analyze resume |
| GET | /api/admin/stats | Admin | Platform statistics |
| GET | /api/admin/users | Admin | All users |
| PATCH | /api/admin/users/:id | Admin | Update user |
| DELETE | /api/admin/users/:id | Admin | Delete user |
| POST | /api/payment/create-checkout | ✓ | Stripe checkout |
| POST | /api/payment/webhook | — | Stripe webhook |

---

## 🚀 Deployment

### Render (Backend)

1. Create a new **Web Service** on Render
2. Connect your GitHub repo
3. Build command: `cd backend && npm install`
4. Start command: `node backend/server.js`
5. Add all env vars from `.env.example`

### Vercel (Frontend)

1. Import your repo on Vercel
2. Set root to `frontend/`
3. Build: `npm run build`, Output: `dist`
4. Add `VITE_API_URL=https://your-backend.render.com/api`

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Whitelist IP: `0.0.0.0/0` (for Render)
3. Copy connection string to `MONGODB_URI`

---

## 🛡️ Security Features

- JWT tokens with expiry
- bcryptjs password hashing (salt rounds: 12)
- Helmet.js security headers
- Rate limiting (100 req/15min)
- Input sanitization via express-validator
- CORS configured per environment
- Admin-only route protection
- File type validation (PDF only)

---

## 📊 Database Schemas

### User
```js
{ name, email, password(hashed), role, careerInterest, skillLevel,
  isAdmin, isPro, stripeCustomerId, bio, skills[], resumeUrl,
  lastActive, loginCount, createdAt }
```

### Chat
```js
{ userId, title, messages[{role, content, timestamp}],
  category, createdAt, updatedAt }
```

### Analytics
```js
{ userId, event, data, timestamp }
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| HTTP | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | Google Gemini Pro |
| Payments | Stripe |
| File Parsing | pdf-parse + multer |
| Notifications | react-hot-toast |

---

Built with ❤️ — AI Career Mentor v1.0.0
