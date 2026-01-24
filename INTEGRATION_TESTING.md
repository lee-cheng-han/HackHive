# Integration Testing Guide

This guide helps the three teams (Frontend, Backend, ML) test their components individually and together to ensure smooth integration.

## Table of Contents

1. [Individual Component Testing](#individual-component-testing)
2. [Integration Testing](#integration-testing)
3. [Test Utilities & Mock Data](#test-utilities--mock-data)
4. [Integration Checklist](#integration-checklist)
5. [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## Individual Component Testing

### Frontend Testing

#### Test 1: Voice Input Capture
**Goal**: Verify frontend can capture audio from microphone

```bash
# In frontend directory
npm test  # Run React tests
```

**Manual Test**:
1. Open `http://localhost:3000`
2. Click "Start Recording" button
3. Speak for 2-3 seconds
4. Click "Stop Recording"
5. **Expected**: Audio blob is created, no errors in console

**Check Console**:
- ✅ No microphone permission errors
- ✅ Audio blob size > 0
- ✅ Audio format is correct (WebM or WAV)

#### Test 2: API Client
**Goal**: Verify frontend can call backend APIs

**Test Script**: `frontend/tests/api.test.ts` (create this)

```typescript
// Test API calls with mock backend
import { storyApi, voiceApi } from '../services/api';

test('GET /api/stories returns story list', async () => {
  const response = await storyApi.listStories({ language: 'cr' });
  expect(response.data.stories).toBeArray();
});
```

**Manual Test**:
1. Start backend server (`python run.py` in backend/)
2. Open browser console
3. Test API call:
```javascript
fetch('http://localhost:3001/api/stories', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
}).then(r => r.json()).then(console.log)
```
4. **Expected**: JSON response with stories array

#### Test 3: Story Rendering
**Goal**: Verify story UI components render correctly

**Test Data**: Use `frontend/tests/mockStory.json`

```json
{
  "story_id": "test-story",
  "title": "Test Story",
  "scenes": [
    {
      "id": "scene1",
      "text": "Hello world",
      "image_url": "/test-image.png"
    }
  ]
}
```

**Manual Test**:
1. Load mock story data
2. **Expected**: 
   - Scene text displays
   - Image loads (or placeholder shows)
   - Choices render as buttons
   - Audio player appears if audio_url exists

---

### Backend Testing

#### Test 1: API Endpoints
**Goal**: Verify all endpoints return correct responses

**Test Script**: `backend/tests/test_api.py`

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_register_user():
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "test123",
        "name": "Test User",
        "preferred_language": "cr"
    })
    assert response.status_code == 201
    assert "token" in response.json()
```

**Run Tests**:
```bash
cd backend
pytest tests/
```

#### Test 2: Database Operations
**Goal**: Verify database models work correctly

```python
def test_create_story():
    # Create test user
    user = User(email="test@example.com", ...)
    db.add(user)
    db.commit()
    
    # Create story
    story = Story(title="Test", author_id=user.user_id, ...)
    db.add(story)
    db.commit()
    
    assert story.story_id is not None
```

#### Test 3: ML Service Integration
**Goal**: Verify backend can call ML service

**Test with Mock ML Service**:
```python
# Use httpx mock or test ML service
async def test_voice_transcription():
    # Mock ML service response
    mock_response = {
        "transcription": "test transcription",
        "confidence": 0.9
    }
    # Test backend endpoint
    response = client.post("/api/voice-to-text", ...)
    assert response.json()["transcription"] == "test transcription"
```

---

### ML Service Testing

#### Test 1: Speech Recognition
**Goal**: Verify Whisper can transcribe audio

**Test Script**: `ml-service/tests/test_asr.py`

```python
import pytest
from app.services.speech_service import SpeechService

def test_transcribe_audio():
    service = SpeechService()
    result = service.transcribe_audio("tests/test_audio/sample.wav", "en")
    assert "transcription" in result
    assert result["confidence"] > 0
```

**Manual Test**:
```bash
cd ml-service
python -c "
from app.services.speech_service import SpeechService
service = SpeechService()
result = service.transcribe_audio('test_audio.wav', 'en')
print(result)
"
```

#### Test 2: Recommendation Engine
**Goal**: Verify recommendations are generated

```python
def test_recommendations():
    service = RecommendationService()
    recommendations = service.recommend_stories(
        user_id="test",
        known_words=["hello", "world"],
        completed_stories=["story1"],
        all_stories=mock_stories,
        limit=3
    )
    assert len(recommendations) > 0
    assert "story_id" in recommendations[0]
```

#### Test 3: API Endpoints
**Goal**: Verify ML service API works

```bash
# Test transcription endpoint
curl -X POST http://localhost:5000/transcribe \
  -F "file=@test_audio.wav" \
  -F "language_code=en"

# Test recommendations
curl -X POST http://localhost:5000/recommend \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test", "known_words": ["hello"]}'
```

---

## Integration Testing

### Test 1: Frontend ↔ Backend

#### 1.1 Voice Upload Flow
**Goal**: Frontend sends audio, backend processes it

**Steps**:
1. **Frontend**: Record 3-second audio clip
2. **Frontend**: Convert to WAV format (16kHz, mono)
3. **Frontend**: POST to `/api/voice-to-text`
4. **Backend**: Receives file, validates format
5. **Backend**: Returns transcription

**Test Script**: `tests/integration/test_voice_flow.py`

```python
import requests
import os

def test_voice_upload_flow():
    # 1. Frontend captures audio (simulated)
    audio_file = open("tests/test_audio/sample.wav", "rb")
    
    # 2. Send to backend
    response = requests.post(
        "http://localhost:3001/api/voice-to-text",
        files={"file": audio_file},
        data={"language_code": "en"},
        headers={"Authorization": "Bearer TOKEN"}
    )
    
    # 3. Verify response
    assert response.status_code == 200
    data = response.json()
    assert "transcription" in data
    assert "confidence" in data
    print(f"✅ Transcription: {data['transcription']}")
```

**Expected Result**:
```json
{
  "transcription": "hello world",
  "confidence": 0.85,
  "language_detected": "en"
}
```

#### 1.2 Story Loading Flow
**Goal**: Frontend requests story, backend returns complete data

**Steps**:
1. **Frontend**: GET `/api/stories/story123`
2. **Backend**: Query database, format response
3. **Frontend**: Render story scenes

**Test**:
```javascript
// In browser console or test file
const response = await fetch('http://localhost:3001/api/stories/story123', {
  headers: { 'Authorization': 'Bearer TOKEN' }
});
const story = await response.json();

// Verify structure
console.assert(story.story_id, 'Story ID missing');
console.assert(story.scenes.length > 0, 'No scenes');
console.assert(story.scenes[0].text, 'Scene text missing');
```

**Expected Response**:
```json
{
  "story_id": "story123",
  "title": "The Morning Song",
  "scenes": [
    {
      "id": "scene1",
      "text": "Tānisi! My name is Miyo.",
      "image_url": "/media/images/story123/scene1.png"
    }
  ]
}
```

---

### Test 2: Backend ↔ ML Service

#### 2.1 Speech Transcription Flow
**Goal**: Backend forwards audio to ML, gets transcription

**Steps**:
1. **Backend**: Receives audio from frontend
2. **Backend**: POST to ML service `/transcribe`
3. **ML Service**: Processes with Whisper
4. **ML Service**: Returns transcription
5. **Backend**: Formats and returns to frontend

**Test Script**: `backend/tests/test_ml_integration.py`

```python
import pytest
from app.services.ml_service import transcribe_audio

@pytest.mark.asyncio
async def test_ml_transcription():
    # Read test audio file
    with open("tests/test_audio/sample.wav", "rb") as f:
        audio_bytes = f.read()
    
    # Call ML service
    result = await transcribe_audio(audio_bytes, "en")
    
    # Verify
    assert "transcription" in result
    assert result["confidence"] > 0
    print(f"✅ ML Transcription: {result['transcription']}")
```

**Expected ML Response**:
```json
{
  "transcription": "hello world",
  "confidence": 0.85,
  "language_detected": "en",
  "processing_time_ms": 450
}
```

#### 2.2 Recommendation Flow
**Goal**: Backend requests recommendations from ML service

**Test**:
```python
async def test_ml_recommendations():
    user_data = {
        "user_id": "user123",
        "known_words": ["tansi", "miyo"],
        "completed_stories": ["story1"],
        "preferred_language": "cr",
        "limit": 5
    }
    
    result = await get_recommendations(user_data)
    assert "recommendations" in result
    assert len(result["recommendations"]) > 0
```

---

### Test 3: Frontend ↔ AI Layer (via Backend)

#### 3.1 Recommendation Display
**Goal**: Frontend shows personalized recommendations

**Steps**:
1. **Frontend**: GET `/api/recommendations`
2. **Backend**: Calls ML service `/recommend`
3. **ML Service**: Analyzes user profile, returns suggestions
4. **Backend**: Returns recommendations to frontend
5. **Frontend**: Displays "Next Stories" section

**Test**:
```javascript
// Frontend test
const response = await fetch('http://localhost:3001/api/recommendations', {
  headers: { 'Authorization': 'Bearer TOKEN' }
});
const data = await response.json();

// Verify
console.assert(data.recommended.length > 0, 'No recommendations');
console.assert(data.recommended[0].story_id, 'Missing story_id');
console.assert(data.recommended[0].reason, 'Missing reason');
```

**Expected Response**:
```json
{
  "recommended": [
    {
      "story_id": "story312",
      "reason": "introduces 2 new words: kisikaw, nipiy",
      "match_score": 0.85
    }
  ]
}
```

---

### Test 4: End-to-End Voice Story Flow

**Complete Flow Test**:
1. User speaks into microphone (Frontend)
2. Frontend sends audio to Backend
3. Backend forwards to ML Service
4. ML Service transcribes
5. Backend returns transcription
6. Frontend processes transcription
7. Frontend updates story based on response

**Test Script**: `tests/integration/test_e2e_voice.py`

```python
import requests
import time

def test_e2e_voice_story():
    # 1. User logs in
    login_response = requests.post("http://localhost:3001/api/auth/login", json={
        "email": "test@example.com",
        "password": "test123"
    })
    token = login_response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Load a story
    story_response = requests.get(
        "http://localhost:3001/api/stories/story123",
        headers=headers
    )
    story = story_response.json()
    print(f"✅ Loaded story: {story['title']}")
    
    # 3. User speaks (simulate with test audio)
    with open("tests/test_audio/response.wav", "rb") as audio_file:
        voice_response = requests.post(
            "http://localhost:3001/api/voice-to-text",
            files={"file": audio_file},
            data={"language_code": "cr"},
            headers=headers
        )
    transcription = voice_response.json()["transcription"]
    print(f"✅ Transcription: {transcription}")
    
    # 4. Verify story progresses
    # (This depends on your story logic)
    assert transcription is not None
```

---

## Test Utilities & Mock Data

### Mock Backend for Frontend Testing

**File**: `frontend/tests/mockBackend.js`

```javascript
// Mock backend responses for frontend testing
export const mockStory = {
  story_id: "mock-story-123",
  title: "Mock Story",
  language: "cr",
  scenes: [
    {
      id: "scene1",
      text: "Tānisi! My name is Miyo.",
      image_url: "/mock-image.png",
      choices: [
        { id: "c1", text: "Hello!", next_scene: "scene2" }
      ]
    }
  ]
};

export const mockTranscription = {
  transcription: "tansi",
  confidence: 0.9,
  language_detected: "cr"
};
```

### Mock ML Service for Backend Testing

**File**: `backend/tests/mock_ml_service.py`

```python
# Mock ML service responses
MOCK_TRANSCRIPTION = {
    "transcription": "test transcription",
    "confidence": 0.85,
    "language_detected": "en"
}

MOCK_RECOMMENDATIONS = {
    "recommendations": [
        {
            "story_id": "story123",
            "reason": "test reason",
            "match_score": 0.8
        }
    ]
}

# Use in tests with httpx mock
from unittest.mock import AsyncMock

async def mock_ml_transcribe(audio_bytes, language_code):
    return MOCK_TRANSCRIPTION
```

### Test Audio Files

Create test audio files for testing:
- `tests/test_audio/sample.wav` - 16kHz, mono, 16-bit PCM
- `tests/test_audio/response.wav` - Short phrase for testing

**Generate Test Audio**:
```bash
# Using ffmpeg
ffmpeg -f lavfi -i "sine=frequency=440:duration=2" -ar 16000 -ac 1 test_audio.wav
```

---

## Integration Checklist

Use this checklist during development and before demo:

### Pre-Integration (Individual Components)

- [ ] **Frontend**: Voice input captures audio without errors
- [ ] **Frontend**: API client can make authenticated requests
- [ ] **Frontend**: Story components render with mock data
- [ ] **Backend**: All API endpoints return correct status codes
- [ ] **Backend**: Database operations work (create, read, update)
- [ ] **Backend**: JWT authentication works
- [ ] **ML Service**: Whisper can transcribe test audio
- [ ] **ML Service**: Recommendation engine returns results
- [ ] **ML Service**: API endpoints respond correctly

### Integration Tests

- [ ] **Frontend → Backend**: Voice upload works
- [ ] **Frontend → Backend**: Story loading works
- [ ] **Frontend → Backend**: User authentication works
- [ ] **Backend → ML**: Audio transcription works
- [ ] **Backend → ML**: Recommendations work
- [ ] **Frontend → Backend → ML**: Complete voice flow works
- [ ] **Frontend → Backend → ML**: Recommendation display works

### Data Format Validation

- [ ] Audio format: 16kHz, mono, WAV
- [ ] Story JSON matches API spec
- [ ] Transcription response matches spec
- [ ] Recommendation response matches spec
- [ ] Error responses follow error format

### Performance

- [ ] Voice transcription < 3 seconds
- [ ] Story loading < 1 second
- [ ] API responses < 500ms (simple queries)
- [ ] No memory leaks in long sessions

### Error Handling

- [ ] Invalid audio format returns 400 error
- [ ] Missing auth token returns 401 error
- [ ] ML service down: backend handles gracefully
- [ ] Network errors: frontend shows user-friendly message

---

## Troubleshooting Common Issues

### Issue: CORS Errors

**Symptom**: Browser console shows "CORS policy" error

**Fix**:
```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: Audio Format Rejected

**Symptom**: Backend returns "Invalid audio format"

**Fix**:
- Verify audio is WAV format
- Check sample rate is 16kHz
- Ensure mono channel
- Check file size < 2MB

### Issue: ML Service Timeout

**Symptom**: Backend waits too long for ML response

**Fix**:
```python
# backend/app/services/ml_service.py
async with httpx.AsyncClient(timeout=10.0) as client:
    # Increase timeout or check ML service is running
```

### Issue: Authentication Token Expired

**Symptom**: 401 Unauthorized after some time

**Fix**:
- Check JWT expiration time
- Implement token refresh
- Frontend should handle 401 and re-login

### Issue: Story Not Rendering

**Symptom**: Frontend shows blank or error

**Fix**:
- Check story JSON structure matches schema
- Verify image/audio URLs are accessible
- Check browser console for errors
- Validate scene data structure

---

## Automated Test Runner

Create a script to run all integration tests:

**File**: `scripts/run_integration_tests.sh`

```bash
#!/bin/bash

echo "🧪 Running Integration Tests..."

# Start services (in background)
echo "Starting services..."
cd backend && python run.py &
BACKEND_PID=$!
cd ../ml-service && python -m uvicorn app.main:app --port 5000 &
ML_PID=$!

# Wait for services to start
sleep 5

# Run tests
echo "Running backend tests..."
cd ../backend && pytest tests/integration/ -v

echo "Running ML service tests..."
cd ../ml-service && pytest tests/ -v

# Cleanup
kill $BACKEND_PID $ML_PID
echo "✅ Tests complete"
```

---

## Sync Schedule

**Every 6 Hours**:
1. Run integration checklist
2. Test voice upload flow
3. Test story loading
4. Test recommendations
5. Share any API changes with team

**Before Demo**:
1. Run full integration test suite
2. Test on multiple browsers
3. Test with real audio files
4. Verify all error cases
5. Performance check

---

## Quick Test Commands

```bash
# Test backend health
curl http://localhost:3001/health

# Test ML service health
curl http://localhost:5000/health

# Test authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test story list
curl http://localhost:3001/api/stories \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test voice transcription (with test file)
curl -X POST http://localhost:3001/api/voice-to-text \
  -F "file=@test_audio.wav" \
  -F "language_code=en" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Next Steps

1. **Each Team**: Set up test files in your component
2. **Backend Team**: Create mock ML service responses
3. **Frontend Team**: Create mock backend responses
4. **ML Team**: Create test audio files
5. **All Teams**: Run integration tests every 6 hours
6. **Before Demo**: Complete full integration checklist

Good luck! 🚀

