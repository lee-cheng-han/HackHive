# Quick Test Guide

Quick reference for testing each component and integration.

## 🚀 Quick Start Testing

### 1. Start All Services

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python run.py
```

**Terminal 2 - ML Service:**
```bash
cd ml-service
source venv/bin/activate
uvicorn app.main:app --port 5000 --reload
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

### 2. Verify Services Are Running

```bash
# Backend
curl http://localhost:3001/health
# Expected: {"status":"ok","service":"backend-api"}

# ML Service
curl http://localhost:5000/health
# Expected: {"status":"ok","service":"ml-service"}

# Frontend
# Open http://localhost:3000 in browser
```

---

## 🧪 Component Testing

### Frontend Tests

**Test Voice Input:**
1. Open `http://localhost:3000`
2. Click "Start Recording"
3. Speak for 2-3 seconds
4. Click "Stop Recording"
5. ✅ Check: No console errors, audio captured

**Test API Connection:**
```javascript
// In browser console
fetch('http://localhost:3001/api/stories', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
.then(r => r.json())
.then(console.log)
```

**Test Story Rendering:**
1. Load a story from API
2. ✅ Check: Scenes display, images load, choices appear

---

### Backend Tests

**Test API Endpoints:**
```bash
# Health check
curl http://localhost:3001/health

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test","preferred_language":"cr"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get stories (replace TOKEN with actual token)
curl http://localhost:3001/api/stories \
  -H "Authorization: Bearer TOKEN"
```

**Test Database:**
```bash
cd backend
python -c "from app.database import init_db; init_db()"
python scripts/seed.py
```

---

### ML Service Tests

**Test Transcription:**
```bash
# If you have a test audio file
curl -X POST http://localhost:5000/transcribe \
  -F "file=@test_audio.wav" \
  -F "language_code=en"
```

**Test Recommendations:**
```bash
curl -X POST http://localhost:5000/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test",
    "known_words": ["hello", "world"],
    "completed_stories": [],
    "preferred_language": "en",
    "limit": 3
  }'
```

---

## 🔗 Integration Tests

### Test 1: Voice Upload Flow

**Manual Test:**
1. Frontend: Record audio
2. Frontend: Send to `/api/voice-to-text`
3. Backend: Receives, forwards to ML service
4. ML Service: Transcribes
5. Backend: Returns to frontend
6. ✅ Check: Transcription appears in UI

**Automated Test:**
```bash
python tests/integration/test_voice_flow.py tests/test_audio/sample.wav
```

### Test 2: Story Loading Flow

**Manual Test:**
1. Frontend: Requests story
2. Backend: Queries database
3. Backend: Returns story JSON
4. Frontend: Renders story
5. ✅ Check: Story displays with scenes, images, choices

### Test 3: Recommendations Flow

**Manual Test:**
1. Frontend: User completes story
2. Frontend: Requests recommendations
3. Backend: Calls ML service
4. ML Service: Returns recommendations
5. Frontend: Displays "Next Stories"
6. ✅ Check: Recommendations appear

**Automated Test:**
```bash
python tests/integration/test_api_contracts.py
```

---

## ✅ Integration Checklist

Run this checklist every 6 hours:

```bash
# Quick health checks
curl http://localhost:3001/health && echo "✅ Backend"
curl http://localhost:5000/health && echo "✅ ML Service"

# Run integration tests
./scripts/run_integration_tests.sh
```

**Checklist:**
- [ ] Backend health check passes
- [ ] ML Service health check passes
- [ ] Frontend loads without errors
- [ ] Authentication works (register/login)
- [ ] Story list loads
- [ ] Story detail loads
- [ ] Voice upload works (if audio file available)
- [ ] Recommendations return results
- [ ] No CORS errors in browser console
- [ ] API responses match expected format

---

## 🐛 Common Issues & Fixes

### CORS Error
**Fix**: Add frontend URL to backend CORS settings:
```python
# backend/app/main.py
allow_origins=["http://localhost:3000"]
```

### Audio Format Error
**Fix**: Ensure audio is WAV, 16kHz, mono:
```bash
# Convert with ffmpeg
ffmpeg -i input.wav -ar 16000 -ac 1 output.wav
```

### ML Service Timeout
**Fix**: Check ML service is running, increase timeout:
```python
# backend/app/services/ml_service.py
timeout=15.0  # Increase if needed
```

### Authentication Fails
**Fix**: Seed database with test user:
```bash
cd backend
python scripts/seed.py
# Use: admin@example.com / admin123
```

---

## 📊 Test Results Format

After running tests, you should see:

```
🧪 Integration Test Suite
============================================================
🔍 Checking service health...
✅ Backend is running
✅ ML Service is running

🔐 Testing authentication...
✅ User registered successfully

📚 Testing story loading...
✅ Found 1 stories
✅ Story loaded: The Morning Song

🎯 Testing recommendations...
✅ Received 2 recommendations

📊 Test Results Summary
============================================================
✅ PASS: Story Loading
✅ PASS: Recommendations
✅ PASS: Voice Upload

🎉 All tests passed!
```

---

## 🔄 Sync Schedule

**Every 6 Hours:**
1. Run `./scripts/run_integration_tests.sh`
2. Check all services are running
3. Test one voice upload
4. Test one story load
5. Share any API changes with team

**Before Demo:**
1. Run full test suite
2. Test on multiple browsers
3. Test with real audio files
4. Verify error handling
5. Performance check (< 3s for transcription)

---

## 📝 Test Data

**Test User:**
- Email: `admin@example.com`
- Password: `admin123`
- Created by: `python backend/scripts/seed.py`

**Test Story:**
- ID: `story123` (or first story in database)
- Title: "The Morning Song"
- Created by seed script

**Test Audio:**
- Format: WAV, 16kHz, mono
- Location: `tests/test_audio/sample.wav`
- Create with: `ffmpeg -f lavfi -i "sine=frequency=440:duration=2" -ar 16000 -ac 1 tests/test_audio/sample.wav`

---

## 🎯 Success Criteria

All tests pass when:
- ✅ Services start without errors
- ✅ Authentication works
- ✅ Stories load and display
- ✅ Voice transcription works
- ✅ Recommendations appear
- ✅ No console errors
- ✅ API responses match spec

Good luck! 🚀

