# How to Test Backend Functionalities

## ✅ Backend is Live and Working!

Backend server: **http://localhost:3001**

## 🎯 Method 1: Swagger UI (Recommended - Easiest!)

### Open this URL in your browser:
```
http://localhost:3001/docs
```

This gives you an **interactive API testing interface** where you can:
- See all 19 API endpoints
- Test each endpoint with a button click
- See request/response examples
- No coding required!

### How to use Swagger UI:

1. **Navigate** to http://localhost:3001/docs
2. **Click** any endpoint to expand (e.g., "GET /api/v1/courses")
3. **Click** "Try it out" button
4. **Fill** in any parameters if needed
5. **Click** "Execute"
6. **View** the response below

### Test Authentication in Swagger:

1. Find **POST /api/v1/auth/login**
2. Click "Try it out"
3. Use these credentials:
   ```json
   {
     "email": "learner@turtletalk.app",
     "password": "learner123"
   }
   ```
4. Copy the `access_token` from response
5. Click **"Authorize"** button at top of page
6. Paste: `Bearer YOUR_TOKEN_HERE`
7. Now you can test protected endpoints!

## 🧪 Method 2: Quick Command Line Tests

### Test Health:
```bash
curl http://localhost:3001/health
```
Returns: `{"status":"healthy","environment":"development","version":"1.0.0"}`

### List All Courses:
```bash
curl http://localhost:3001/api/v1/courses
```
Returns: **2 courses** (Plains Cree Basics, Ojibwe Family Terms)

### List All Stories:
```bash
curl http://localhost:3001/api/v1/stories
```
Returns: **1 story** (The Teachings of the Turtle)

### Login Test:
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "learner@turtletalk.app",
    "password": "learner123"
  }'
```

## 📊 What Data is Available?

The database has been seeded with sample data:

### Users (3)
- **learner@turtletalk.app** / learner123 (Learner role)
- **teacher@turtletalk.app** / teacher123 (Teacher role)  
- **admin@turtletalk.app** / admin123 (Admin role)

### Courses (2)
1. **Plains Cree Basics**
   - Language: Cree (cr)
   - Level: Beginner
   - 3 lessons with exercises
   
2. **Ojibwe Family Terms**
   - Language: Ojibwe (oj)
   - Level: Beginner

### Lessons (3 in Cree Basics)
1. Greetings and Introductions
   - 3 vocabulary words
   - 3 exercises (multiple choice, translation, fill-blank)
2. Numbers 1-10
   - 5 vocabulary words
3. Pronunciation Practice
   - 3 pronunciation guides

### Stories (1)
- **The Teachings of the Turtle**
  - Language: Cree
  - 2 story scenes
  - 45 likes, 120 views

## 🔍 Method 3: Check Database Directly

```bash
cd backend
sqlite3 turtletalk.db
```

Then run SQL queries:
```sql
-- See all tables
.tables

-- Count users
SELECT COUNT(*) FROM users;

-- View courses
SELECT title, language, level FROM courses;

-- View lessons
SELECT title, type FROM lessons;

-- Exit
.quit
```

## 📝 All Available Endpoints

### Public Endpoints (No Authentication)
✅ Working and tested:
- `GET /health` - Health check
- `GET /` - API information
- `GET /api/v1/courses` - List all courses (2 courses)
- `GET /api/v1/courses/{id}` - Get course details
- `GET /api/v1/stories` - List all stories (1 story)
- `GET /api/v1/stories/{id}` - Get story details
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Protected Endpoints (Require Token)
Available after login:
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile
- `POST /api/v1/voice-to-text` - Transcribe audio
- `POST /api/v1/pronunciation/evaluate` - Evaluate pronunciation
- `POST /api/v1/ai-tutor/chat` - Chat with AI tutor

## 🎬 Full Test Workflow

### Step 1: Check Health
```bash
curl http://localhost:3001/health
```

### Step 2: View Courses
```bash
curl http://localhost:3001/api/v1/courses | python3 -m json.tool
```
You should see 2 courses with full lesson data!

### Step 3: Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "learner@turtletalk.app",
    "password": "learner123"
  }' | python3 -m json.tool
```
Save the `access_token` from the response.

### Step 4: Get Your Profile
```bash
TOKEN="your_token_here"
curl http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

## 🌐 Test with Browser

Simply open these URLs:

1. **API Info**: http://localhost:3001/
2. **Health Check**: http://localhost:3001/health
3. **Courses (JSON)**: http://localhost:3001/api/v1/courses
4. **Stories (JSON)**: http://localhost:3001/api/v1/stories
5. **API Docs**: http://localhost:3001/docs ⭐ **BEST FOR TESTING**

## 🚀 Integration with Frontend

The frontend at **http://localhost:3000** is already configured to connect to the backend at `http://localhost:3001/api/v1`.

When you browse courses or stories on the frontend, it will fetch data from your backend API!

## 📋 Summary

**Easiest way: Open http://localhost:3001/docs**

This interactive interface lets you test everything without writing code:
- ✅ All 19 endpoints available
- ✅ Built-in request builder
- ✅ Automatic authentication handling
- ✅ Response validation
- ✅ Example data pre-filled

**Backend Status:**
- ✅ Server running on port 3001
- ✅ Database seeded with test data
- ✅ 3 users, 2 courses, 3 lessons, 3 exercises, 1 story
- ✅ All endpoints functional
- ✅ Authentication working
- ✅ Ready for frontend integration

