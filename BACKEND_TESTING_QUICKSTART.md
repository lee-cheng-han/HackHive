# Backend Testing - Quick Start

## ✅ Backend is Running!

- Backend API: **http://localhost:3001**
- API Documentation: **http://localhost:3001/docs**
- Health Check: **http://localhost:3001/health**

## 🚀 Easiest Way to Test: Swagger UI

1. **Open http://localhost:3001/docs in your browser**
2. You'll see an interactive API interface
3. Click any endpoint to expand it
4. Click **"Try it out"** button
5. Fill in parameters
6. Click **"Execute"**
7. See the response below

This is the easiest way to test without writing any code!

## 📊 Test Data (Already Seeded)

The database is populated with sample data:

### Test Users
- **Learner Account**
  - Email: `learner@turtletalk.app`
  - Password: `learner123`
  
- **Teacher Account**
  - Email: `teacher@turtletalk.app`
  - Password: `teacher123`

- **Admin Account**
  - Email: `admin@turtletalk.app`
  - Password: `admin123`

### Sample Data Created
- ✅ 3 users (learner, teacher, admin)
- ✅ 2 courses (Cree Basics, Ojibwe Family)
- ✅ 3 lessons with vocabulary and exercises
- ✅ 3 exercises (multiple choice, translation, fill-in-blank)
- ✅ 1 story with 2 scenes
- ✅ Progress data for the learner

## 🧪 Quick Tests via Swagger UI

### Test 1: Login
1. Go to http://localhost:3001/docs
2. Find **POST /api/v1/auth/login**
3. Click "Try it out"
4. Enter:
   ```json
   {
     "email": "learner@turtletalk.app",
     "password": "learner123"
   }
   ```
5. Click "Execute"
6. Copy the `access_token` from the response

### Test 2: Get Your Profile
1. Click the **Authorize** button at the top
2. Paste your token: `Bearer YOUR_TOKEN_HERE`
3. Click "Authorize"
4. Find **GET /api/v1/users/me**
5. Click "Try it out" → "Execute"
6. See your profile data!

### Test 3: List Courses
1. Find **GET /api/v1/courses**
2. Click "Try it out" → "Execute"
3. See 2 courses returned

### Test 4: Get Course Details
1. From the courses list, copy a `course_id`
2. Find **GET /api/v1/courses/{course_id}**
3. Click "Try it out"
4. Paste the course_id
5. Click "Execute"
6. See full course details

## 📱 Command Line Testing

```bash
# Test health
curl http://localhost:3001/health

# Login and get token
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "learner@turtletalk.app", "password": "learner123"}'

# List all courses
curl http://localhost:3001/api/v1/courses

# Filter courses by language
curl "http://localhost:3001/api/v1/courses?language=cr"

# List stories
curl http://localhost:3001/api/v1/stories
```

## 🔍 Check Database

```bash
cd backend
sqlite3 turtletalk.db

# In SQLite shell:
.tables                    # List all tables
SELECT * FROM users;       # View users
SELECT * FROM courses;     # View courses
SELECT * FROM lessons;     # View lessons
SELECT * FROM exercises;   # View exercises
.quit                      # Exit
```

## 📝 Available Endpoints

### Public (No Auth Required)
- `GET /health` - Health check
- `GET /` - API info
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/courses` - List courses
- `GET /api/v1/courses/{id}` - Get course
- `GET /api/v1/stories` - List stories
- `GET /api/v1/stories/{id}` - Get story

### Protected (Auth Required)
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update profile
- `POST /api/v1/voice-to-text` - Transcribe audio
- `POST /api/v1/pronunciation/evaluate` - Evaluate pronunciation
- `POST /api/v1/ai-tutor/chat` - Chat with AI tutor

## 🎯 Full Test Flow

1. **Register a new user**
   - Use Swagger UI or curl
   - Email: your@email.com, Password: yourpass

2. **Login**
   - Get access token
   - Store for authenticated requests

3. **Browse courses**
   - See Cree and Ojibwe courses
   - Filter by language/level

4. **View course details**
   - Get lessons for a course
   - See exercise count

5. **Get your profile**
   - Use authenticated endpoint
   - See your preferences

## 🐛 Troubleshooting

**Port already in use?**
```bash
lsof -ti:3001 | xargs kill -9
```

**Need to restart server?**
```bash
cd backend
source venv/bin/activate
python run.py
```

**Database issues?**
```bash
# Reset database
rm turtletalk.db
alembic upgrade head
python scripts/seed_data.py
```

## ✨ Summary

Your backend is fully operational with:
- ✅ 19 API routes
- ✅ Sample data loaded
- ✅ Authentication working
- ✅ Interactive docs at /docs

**Easiest way to test: Open http://localhost:3001/docs**

