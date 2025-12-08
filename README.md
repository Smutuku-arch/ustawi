# Ustawi

**Ustawi** is a comprehensive mental health and career guidance platform designed for young Kenyans—especially university students and early-career professionals. The platform combines mental wellness tools, AI-powered support, career guidance, and a rich resource library into a single, intuitive web application.

Whether you're a student managing academic stress, a graduate navigating career choices, or a young professional balancing work and wellness—Ustawi provides the tools and support you need to thrive.

---

## 🌟 Key Features

### 🔐 Secure Authentication & User Management
- JWT-based authentication with bcrypt password hashing
- Role-based access control (user, admin)
- Secure session management

### 📊 Mood & Wellness Tracking
- Daily emotional check-ins with visual mood graphs
- Score-based tracking (1-10 scale) with emoji indicators
- Personal journaling with notes for each mood entry
- Historical mood data visualization

### 🤖 AI-Powered Chatbot
- Intelligent conversational assistant using OpenAI GPT
- Contextual wellness tips and career guidance
- Empathetic responses to stress, anxiety, and decision-making
- Pre-built conversation prompts for common concerns

### 📚 Comprehensive Resource Library
- **Books**: Upload and read PDF books with inline viewer
  - Full-page PDF rendering
  - Smooth scrolling through pages
  - Cover image support
- **Articles**: Create, read, and manage wellness articles
  - Rich text content with categories (Mental Health, Career, Wellness, Other)
  - Article summaries and view tracking
  - Professional reading layout with justified text
  - Full article editing capabilities
- **Videos**: Upload and stream educational videos
  - Video thumbnail support
  - Duration tracking
  - In-app video player

### 🎯 Resource Management System
- Book appointments with counselors and career advisors
- Real-time availability checking
- Automatic conflict detection
- Appointment confirmation system

### ⚙️ Advanced Admin Dashboard
- **User Management**: View all users and manage roles (admin/user)
- **Content Management**:
  - Upload books with cover images
  - Write and edit articles with rich formatting
  - Upload videos with thumbnails
  - Delete and manage all content types
- **Analytics**: Track total users, admins, books, articles, and videos
- **Real-time Updates**: Instant feedback for all admin actions

### 📱 Responsive Design
- Mobile-first approach optimized for smartphones
- Tablet and desktop layouts
- Smooth animations and transitions
- Optimized for low-bandwidth environments

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** with Vite for fast development
- **Axios** for API communication
- **Context API** for state management
- **CSS3** with modern responsive design
- **PDF.js** for inline PDF viewing

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Multer** for file uploads (books, covers, videos, thumbnails)
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### AI Integration
- **OpenAI API** (GPT-3.5/4) for chatbot
- Custom prompt engineering for Kenyan context
- Swahili and English support

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **pnpm**
- **OpenAI API key** (for chatbot functionality)

### 1. Clone the Repository
```bash
git clone https://github.com/Smutuku-arch/Uswawi
cd ustawi
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/ustawi
JWT_SECRET=your_strong_jwt_secret_here_min_32_chars
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=your_openai_api_key_here
AUTO_CREATE_ADMIN=false
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strongPassword123
```

Run setup (creates uploads folder):

```bash
npm run setup
```

Create an admin user:

```bash
npm run create-admin -- --email=admin@localhost.com --password=admin123 --name="Admin User"
```

Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:4000`. Health check: `http://localhost:4000/health`

### 3. Frontend Setup

```bash
cd ..   # back to project root
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_BASE=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 4. Initial Login

**Admin Credentials:**
- Email: `admin@localhost.com`
- Password: `admin123`

**First Steps:**
1. Navigate to `http://localhost:5173`
2. Click "Get Started" or "Login"
3. Use admin credentials to access admin features
4. Explore the dashboard, upload content, and test features

---

## 📦 Deployment Guide

### Backend Deployment (Render)

1. Push code to GitHub
2. Create a **Web Service** on [Render](https://render.com)
3. Connect your repository
4. Configure:
   - **Build Command:** `cd backend && npm install && npm run setup`
   - **Start Command:** `cd backend && npm start`
5. Add environment variables:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ustawi
   JWT_SECRET=production_secret_min_32_characters
   FRONTEND_URL=https://your-frontend-url.vercel.app
   OPENAI_API_KEY=your_openai_key
   AUTO_CREATE_ADMIN=true
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=securePassword123
   ```
6. Deploy

### Frontend Deployment (Vercel)

```bash
npm run build
vercel --prod
```

Or use Vercel dashboard:
1. Import GitHub repository
2. Set environment variable:
   ```
   VITE_API_BASE=https://your-backend.onrender.com
   ```
3. Deploy

### Alternative: Static Frontend from Backend

```bash
npm run build
cp -r dist/* backend/public/
```

Update `backend/src/index.js`:
```javascript
app.use(express.static('public'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
```

Deploy backend only—frontend served at root URL.

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `4000` |
| `MONGO_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/ustawi` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Yes | `your_very_strong_secret_key_here` |
| `FRONTEND_URL` | Frontend origin for CORS | Yes | `http://localhost:5173` |
| `OPENAI_API_KEY` | OpenAI API key for chatbot | Yes | `sk-...` |
| `AUTO_CREATE_ADMIN` | Auto-create admin on startup | No | `false` |
| `ADMIN_EMAIL` | Admin email (if AUTO_CREATE) | No | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin password | No | `strongPassword` |

### Frontend (`.env` in root)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_BASE` | Backend API base URL | Yes | `http://localhost:4000` |

---

## 📂 Project Structure

```
ustawi/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js              # User authentication model
│   │   │   ├── Post.js              # Community posts
│   │   │   ├── Mood.js              # Mood tracking entries
│   │   │   ├── Resource.js          # Resources (counselors, etc.)
│   │   │   ├── Appointment.js       # Appointment bookings
│   │   │   ├── Book.js              # PDF books
│   │   │   ├── Article.js           # Articles (NEW)
│   │   │   └── Video.js             # Videos (NEW)
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication routes
│   │   │   ├── posts.js             # Community posts
│   │   │   ├── moods.js             # Mood tracking
│   │   │   ├── resources.js         # Resource management
│   │   │   ├── appointments.js      # Appointment booking
│   │   │   ├── books.js             # Book routes (NEW)
│   │   │   ├── articles.js          # Article routes (admin)
│   │   │   ├── articlesPublic.js    # Public article routes (NEW)
│   │   │   ├── videos.js            # Video routes (NEW)
│   │   │   ├── admin.js             # Admin management
│   │   │   └── ai.js                # AI chatbot
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   └── admin.js             # Admin-only middleware
│   │   ├── utils/
│   │   │   └── upload.js            # Multer file upload config
│   │   ├── scripts/
│   │   │   ├── createAdmin.js       # Create admin script
│   │   │   ├── resetDb.js           # Database reset
│   │   │   └── seed.js              # Seed sample data
│   │   └── index.js                 # Express app entry
│   ├── uploads/                     # Uploaded files (books, videos, images)
│   ├── .env
│   └── package.json
├── src/                             # Frontend React code
│   ├── api/
│   │   ├── moods.js
│   │   ├── admin.js                 # Admin API calls (NEW: updateArticle)
│   │   ├── books.js                 # Books API (NEW)
│   │   ├── articles.js              # Articles API (NEW)
│   │   └── videos.js                # Videos API (NEW)
│   ├── components/
│   │   ├── MoodTracker.jsx          # Mood tracking component
│   │   ├── AdminDashboard.jsx       # Admin panel (ENHANCED)
│   │   ├── AIChatbot.jsx            # AI chat interface
│   │   └── landingPage/             # Landing page components
│   ├── pages/
│   │   ├── Dashboard.jsx            # Main dashboard (ENHANCED)
│   │   ├── Resources.jsx            # Resource library (ENHANCED: articles, videos)
│   │   ├── BookSession.jsx          # Appointment booking
│   │   └── home.jsx                 # Landing page
│   ├── context/
│   │   └── appContext.jsx           # Global state management
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── pdfjs/
│       └── viewer.html              # PDF.js viewer (NEW)
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎨 New Features Highlights

### 📖 Inline PDF Viewer
- View books directly in the browser without downloads
- Full-page rendering with PDF.js
- Smooth scrolling through pages
- Persistent across sessions via sidebar navigation

### ✍️ Article System
- Create rich-text articles with categories
- Edit existing articles inline
- Summary and full content views
- View tracking and metadata display
- Justified text layout for professional reading experience

### 🎥 Video Library
- Upload educational and wellness videos
- Thumbnail support for previews
- Duration tracking
- In-app video player with controls
- Modal playback for better viewing experience

### 🛠️ Enhanced Admin Dashboard
- Tabbed interface for easy navigation
- Real-time stats dashboard
- Edit/delete capabilities for all content types
- File upload with preview
- Success/error notifications
- Responsive grid layouts

---

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Moods
- `POST /api/moods` - Log mood entry
- `GET /api/moods/stats` - Get mood statistics
- `GET /api/moods` - List all user moods

### Books (Public)
- `GET /api/books` - List all books
- `GET /api/books/:id` - Get single book

### Articles (Public)
- `GET /api/articles` - List all articles
- `GET /api/articles/:id` - Get single article (increments views)

### Videos (Public)
- `GET /api/videos` - List all videos
- `GET /api/videos/:id` - Get single video (increments views)

### Admin (Requires Admin Role)
- `GET /api/admin/users` - List all users
- `POST /api/admin/users/:id/role` - Change user role
- `POST /api/admin/books` - Upload book
- `DELETE /api/admin/books/:id` - Delete book
- `POST /api/admin/articles` - Create article
- `PUT /api/admin/articles/:id` - Update article
- `DELETE /api/admin/articles/:id` - Delete article
- `POST /api/admin/videos` - Upload video
- `DELETE /api/admin/videos/:id` - Delete video

### AI Chatbot
- `POST /api/ai/chat` - Send message to AI

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access**: Admin-only routes protected
- **CORS Protection**: Configured allowed origins
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Type and size restrictions via Multer

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Make your changes
4. Commit: `git commit -m 'Add YourFeature'`
5. Push: `git push origin feature/YourFeature`
6. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test features before submitting PR
- Update README if adding new features

---

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB connection fails**: Verify `MONGO_URI` is correct. Check MongoDB is running.
- **Port already in use**: Change `PORT` in `.env`
- **JWT errors**: Ensure `JWT_SECRET` is at least 32 characters
- **File upload fails**: Check `uploads/` folder exists and has write permissions

### Frontend Issues
- **API calls fail**: Verify `VITE_API_BASE` points to running backend
- **CORS errors**: Ensure backend `FRONTEND_URL` matches frontend origin
- **PDF won't load**: Check browser console for errors. Ensure PDF URL is accessible.
- **Login fails**: Clear browser cache and local storage

### Common Solutions
```bash
# Reset node_modules
rm -rf node_modules package-lock.json
npm install

# Clear MongoDB collections
npm run reset-db

# Recreate admin
npm run create-admin -- --email=admin@test.com --password=test123 --name="Test Admin"
```

---

## 📊 Analytics & Monitoring

The admin dashboard provides real-time insights:
- Total registered users
- Admin vs regular users
- Total books, articles, and videos
- Article view counts
- Video view counts

---

## 🌍 Roadmap

- [ ] Push notifications for appointments
- [ ] Advanced mood analytics with AI insights
- [ ] Group therapy session scheduling
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Swahili, Kikuyu)
- [ ] Payment integration for premium features
- [ ] Community forums with moderation
- [ ] Progress badges and gamification

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT API
- **MongoDB** for database services
- **Render** and **Vercel** for hosting
- Kenyan universities and mental health professionals for insights
- The open-source community

---

## 📞 Support & Contact

- **Email**: support@ustawi.co.ke
- **Website**: [ustawi.co.ke](https://ustawi.co.ke) (coming soon)
- **Twitter**: [@ustawiapp](https://twitter.com/ustawiapp)
- **GitHub Issues**: [Report bugs](https://github.com/Smutuku-arch/Uswawi/issues)

---

**Ustawi** — Empowering young Kenyans to thrive mentally, academically, and professionally. 🌟