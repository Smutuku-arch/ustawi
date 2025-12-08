# Ustawi

**Ustawi** is a responsive web application designed to support young Kenyans—especially university students and early-career professionals—who are navigating academic stress, emotional challenges, and career uncertainty. The platform blends mental health tools and career guidance into a single, intuitive interface that encourages self-reflection, growth, and informed decision-making.

Whether you're a student at KU feeling overwhelmed by exams, a graduate from JKUAT unsure about your next step, or a young professional in Nairobi juggling work and mental health—Ustawi is here for you.

---

## 🌟 Features

### 🔐 Secure Account Management
- Register, log in, and manage your profile securely.
- Role-based access (user, admin) with JWT authentication.

### 📅 Mood & Wellness Check-ins
- Daily emotional check-ins to track your mental state.
- Visual mood graphs and journaling prompts to encourage reflection and growth.

### 🤖 AI-Powered Chatbot
- Conversational assistant offering wellness tips and career advice.
- Trained to respond with empathy and support around stress, anxiety, and decision-making.

### 🎯 Career Guidance Engine
- AI-driven suggestions based on your interests, strengths, and goals.
- Explore career paths, build CVs, and prepare for interviews.

### 📚 Resource Hub
- Curated articles, videos, and exercises focused on mental resilience and career planning.
- Upload and manage books and resources (admin only).

### 📱 Interactive UI
- Smooth animations and responsive design for mobile-first access.
- Optimized for low-bandwidth environments and campus Wi-Fi.

### 🗓️ Appointments & Resources
- Schedule appointments with resources (counselors, career advisors).
- Automatic conflict detection for resource booking.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (with Vite for bundling)
- **Axios** for API calls
- Responsive UI with modern CSS

### Backend
- **Node.js + Express**
- **MongoDB** (with Mongoose ODM)
- **JWT** authentication (bcryptjs for password hashing)
- **Multer** for file uploads (books, resources)
- **dotenv** for environment variables

### AI & NLP
- **OpenAI GPT-3.5/4** (or Azure OpenAI)
- Custom-trained Kenyan context models (Swahili + English hybrid)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **MongoDB** (local or Atlas cluster)
- **npm** or **pnpm**

### 1. Clone the repository
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
MONGO_URI=mongodb://localhost:27017/ustawi   # or your MongoDB Atlas URI
JWT_SECRET=your_strong_jwt_secret_here
FRONTEND_URL=http://localhost:5173
AUTO_CREATE_ADMIN=false   # set to true to auto-create admin on startup (requires ADMIN_EMAIL and ADMIN_PASSWORD)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=yourAdminPassword
```

Run setup (creates uploads folder):

```bash
npm run setup
```

Create an admin user (if AUTO_CREATE_ADMIN=false):

```bash
npm run create-admin -- --email=admin@example.com --password=strongpass --name="Admin"
```

Start the backend:

```bash
npm run dev
```

Backend will run at `http://localhost:4000`. Check health: `http://localhost:4000/health`.

### 3. Frontend Setup

```bash
cd ..   # back to project root
npm install   # or pnpm install
```

Create a `.env` file in the project root (if needed for API base URL):

```env
VITE_API_BASE=http://localhost:4000
```

Start the frontend:

```bash
npm run dev   # or pnpm dev
```

Frontend will run at `http://localhost:5173`.

### 4. Verify Installation

- **Health check:** `curl http://localhost:4000/health`
- **Login:** POST `http://localhost:4000/api/auth/login` with `{ "email": "admin@example.com", "password": "strongpass" }`
- **Admin dashboard:** Navigate to `http://localhost:5173/admin` (if route is configured) and log in with admin credentials.

---

## 🖥️ Localhost Deployment (Development)

### Quick Start (All-in-One)

From the project root, open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run setup
npm run create-admin -- --email=admin@localhost.com --password=admin123 --name="Local Admin"
npm run dev
```
Backend runs at `http://localhost:4000`.

**Terminal 2 — Frontend:**
```bash
# from project root
npm install   # or pnpm install
npm run dev   # or pnpm dev
```
Frontend runs at `http://localhost:5173`.

### Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/ustawi
JWT_SECRET=dev_secret_replace_in_production
FRONTEND_URL=http://localhost:5173
AUTO_CREATE_ADMIN=false
ADMIN_EMAIL=admin@localhost.com
ADMIN_PASSWORD=admin123
```

**Frontend** (`.env` in project root, optional):
```env
VITE_API_BASE=http://localhost:4000
```

### Start MongoDB (if running locally)

**Docker:**
```bash
docker run -d -p 27017:27017 --name ustawi-mongo -v mongo-data:/data/db mongo:6
```

**Homebrew (macOS):**
```bash
brew services start mongodb-community
```

**Linux (systemd):**
```bash
sudo systemctl start mongod
```

### Verify Localhost Deployment

1. **Health check:** `curl http://localhost:4000/health`
2. **Login:** `curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@localhost.com","password":"admin123"}'`
3. **Frontend:** Open `http://localhost:5173` in your browser.
4. **Admin panel:** Navigate to `http://localhost:5173/admin` and log in with admin credentials.

### Troubleshooting Localhost

- **Backend won't start:** Check if MongoDB is running (`mongosh` or `docker ps`). Verify `.env` values.
- **Frontend won't connect:** Ensure `VITE_API_BASE` points to `http://localhost:4000` and backend is running.
- **CORS errors:** Confirm `FRONTEND_URL=http://localhost:5173` in backend `.env`.
- **Port conflicts:** Change `PORT` in backend `.env` or Vite port in `vite.config.js`.

---

## 📦 Deployment

### Backend Deployment

#### Option 1: Render
1. Push code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Connect your repo and set:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
4. Add environment variables in Render dashboard:
   - `MONGO_URI` (MongoDB Atlas connection string)
   - `JWT_SECRET`
   - `FRONTEND_URL` (your deployed frontend URL)
   - `AUTO_CREATE_ADMIN=true` (optional, with `ADMIN_EMAIL` and `ADMIN_PASSWORD`)
5. Deploy. Backend will be live at `https://your-app.onrender.com`.

#### Option 2: Heroku
```bash
heroku login
heroku create your-app-name
heroku config:set MONGO_URI="your_mongo_uri" JWT_SECRET="your_jwt_secret" FRONTEND_URL="https://your-frontend.com"
git subtree push --prefix backend heroku main
```

Or deploy via Heroku dashboard by connecting your GitHub repo.

### Frontend Deployment

#### Option 1: Vercel
```bash
npm i -g vercel
vercel --prod
```
Set environment variables in Vercel dashboard:
- `VITE_API_BASE=https://your-backend.onrender.com`

#### Option 2: Netlify
```bash
npm run build
```
Upload `dist` folder to Netlify or connect GitHub repo. Set environment variable:
- `VITE_API_BASE=https://your-backend.onrender.com`

#### Option 3: Serve from Backend (Static)
Build the frontend:
```bash
npm run build
```
Copy `dist` contents to `backend/public`:
```bash
cp -r dist/* backend/public/
```
Add static middleware in `backend/src/index.js`:
```javascript
app.use(express.static('public'));
```
Deploy backend only; frontend will be served at root URL.

---

## 🔧 Environment Variables

### Backend (.env in backend folder)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/ustawi` or Atlas URI |
| `JWT_SECRET` | Secret for signing JWTs | `your_strong_secret` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `AUTO_CREATE_ADMIN` | Auto-create admin on startup | `true` or `false` |
| `ADMIN_EMAIL` | Admin email (if AUTO_CREATE_ADMIN=true) | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin password | `yourPassword` |

### Frontend (.env in project root, optional)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE` | Backend API base URL | `http://localhost:4000` or `https://your-backend.com` |

---

## 📂 Project Structure

```
ustawi/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose models (User, Post, Mood, Resource, Appointment, Book)
│   │   ├── routes/          # Express routes (auth, posts, moods, resources, appointments, admin)
│   │   ├── middleware/      # Auth middleware, admin middleware
│   │   ├── utils/           # Multer upload config
│   │   ├── scripts/         # createAdmin.js
│   │   └── index.js         # Express app entry
│   ├── uploads/             # Uploaded files (local, for dev)
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── src/                     # Frontend React code
│   ├── api/                 # API helpers (moods.js, admin.js, etc.)
│   ├── components/          # React components (MoodTracker, AdminDashboard, etc.)
│   └── App.jsx
├── public/
├── .env.example
├── package.json
└── README.md
```

---

## 🧪 Testing

### Backend
- Run health check: `curl http://localhost:4000/health`
- Login: `curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"yourpass"}'`
- Admin endpoints: `curl -H "Authorization: Bearer <TOKEN>" http://localhost:4000/api/admin/users`

### Frontend
- Open `http://localhost:5173` and test login, mood tracking, admin dashboard, resource booking.

---

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit changes (`git commit -m 'Add YourFeature'`).
4. Push to branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🌍 Community & Support

- **Email:** support@ustawi.co.ke (example)
- **Twitter:** @ustawiapp
- **Discord:** [Join our community](#)

---

**Ustawi** — Empowering Kenyan youth to thrive mentally and professionally.