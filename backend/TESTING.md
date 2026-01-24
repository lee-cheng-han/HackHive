# Backend Testing Guide

## Quick Testing Methods

### 1. Interactive API Documentation (Easiest)

Visit **http://localhost:3001/docs** in your browser. This is the Swagger UI where you can:
- See all available endpoints
- Try each endpoint with the "Try it out" button
- See request/response examples
- Test with different parameters

**Steps:**
1. Open http://localhost:3001/docs
2. Click any endpoint to expand it
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"
6. See the response

### 2. Using cURL (Command Line)

```bash
# Health check
curl http://localhost:3001/health

# Register a new user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser",
    "preferred_language": "cr"
  }'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get courses (no auth required)
curl http://localhost:3001/api/v1/courses

# Get user profile (requires auth)
curl http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get stories
curl http://localhost:3001/api/v1/stories?language=cr&level=beginner
```

### 3. Using Python Requests

```python
import requests

BASE_URL = "http://localhost:3001/api/v1"

# Register
response = requests.post(f"{BASE_URL}/auth/register", json={
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
})
print(response.json())

# Login
response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "test@example.com",
    "password": "password123"
})
token = response.json()["access_token"]

# Get profile with auth
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(f"{BASE_URL}/users/me", headers=headers)
print(response.json())
```

### 4. Using Postman

1. Import the API from http://localhost:3001/openapi.json
2. Create a new collection
3. Add environment variable: `base_url = http://localhost:3001/api/v1`
4. Test each endpoint

## Test Scenarios

### Scenario 1: User Registration & Login

```bash
# 1. Register
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "learner@turtletalk.app",
    "password": "SecurePass123",
    "username": "cree_learner",
    "first_name": "John",
    "last_name": "Doe",
    "preferred_language": "cr"
  }'

# 2. Login (save the access_token from response)
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "learner@turtletalk.app",
    "password": "SecurePass123"
  }'

# 3. Get your profile
TOKEN="YOUR_ACCESS_TOKEN_HERE"
curl http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"
```

### Scenario 2: Browse Courses

```bash
# List all courses
curl http://localhost:3001/api/v1/courses

# Filter by language
curl "http://localhost:3001/api/v1/courses?language=cr"

# Filter by level
curl "http://localhost:3001/api/v1/courses?level=beginner"

# Get specific course with lessons
curl http://localhost:3001/api/v1/courses/COURSE_ID
```

### Scenario 3: Access Stories

```bash
# List all stories
curl http://localhost:3001/api/v1/stories

# Filter stories
curl "http://localhost:3001/api/v1/stories?language=cr&level=beginner"

# Get specific story
curl http://localhost:3001/api/v1/stories/STORY_ID
```

## Seed Database with Test Data

Run the seed script to populate the database:

```bash
cd backend
source venv/bin/activate
python scripts/seed_data.py
```

This will create:
- Sample users
- Courses with lessons and exercises
- Community stories
- Progress data

## Testing with Python Script

Create `test_api.py`:

```python
import requests
import json

BASE_URL = "http://localhost:3001/api/v1"

def test_health():
    response = requests.get("http://localhost:3001/health")
    print(f"✅ Health: {response.json()}")

def test_register_and_login():
    # Register
    response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": "tester@example.com",
        "password": "test123",
        "username": "tester"
    })
    if response.status_code == 201:
        print("✅ Registration successful")
    else:
        print(f"❌ Registration failed: {response.text}")
        return None
    
    # Login
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "tester@example.com",
        "password": "test123"
    })
    if response.status_code == 200:
        token = response.json()["access_token"]
        print(f"✅ Login successful, token: {token[:20]}...")
        return token
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def test_courses():
    response = requests.get(f"{BASE_URL}/courses")
    courses = response.json()
    print(f"✅ Found {len(courses)} courses")
    return courses

if __name__ == "__main__":
    print("Testing TurtleTalk Backend API\n")
    test_health()
    token = test_register_and_login()
    courses = test_courses()
```

Run: `python test_api.py`

## Check Database

```bash
# SQLite
sqlite3 turtletalk.db

# In SQLite shell:
.tables                  # List all tables
SELECT * FROM users;     # View users
SELECT * FROM courses;   # View courses
.quit                    # Exit
```

## Monitor Logs

```bash
# View backend logs
tail -f /tmp/turtletalk_backend.log

# Or run server in foreground to see logs directly
python run.py
```

## Common Issues

### 1. Port already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### 2. Database not initialized
```bash
# Run migrations
alembic upgrade head
```

### 3. Invalid token
- Tokens expire after 30 minutes
- Login again to get a new token

### 4. CORS errors
- Check `CORS_ORIGINS` in `.env`
- Make sure frontend URL is included

## API Endpoints Summary

### Public Endpoints (No Auth)
- `GET /health` - Health check
- `GET /` - API info
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/courses` - List courses
- `GET /api/v1/stories` - List stories

### Protected Endpoints (Auth Required)
- `GET /api/v1/users/me` - Get profile
- `PUT /api/v1/users/me` - Update profile
- `POST /api/v1/voice-to-text` - Transcribe audio
- `POST /api/v1/pronunciation/evaluate` - Evaluate pronunciation
- `POST /api/v1/ai-tutor/chat` - Chat with AI

## Performance Testing

```bash
# Install Apache Bench
brew install httpd  # macOS

# Test endpoint performance
ab -n 100 -c 10 http://localhost:3001/health

# Load test courses endpoint
ab -n 100 -c 10 http://localhost:3001/api/v1/courses
```

## Next Steps

1. **Add seed data** - Run `python scripts/seed_data.py`
2. **Test in Swagger** - Visit http://localhost:3001/docs
3. **Create test user** - Register via API
4. **Test authentication** - Login and use protected endpoints
5. **Integrate with frontend** - Test full stack flow

