# Test Suite

This directory contains integration tests and test utilities for validating the system.

## Structure

```
tests/
├── integration/
│   ├── test_voice_flow.py      # End-to-end voice flow tests
│   └── test_api_contracts.py   # API contract validation
├── test_audio/                 # Test audio files (create these)
│   └── sample.wav              # 16kHz, mono, WAV format
└── README.md                   # This file
```

## Running Tests

### Quick Test (All Services Running)

```bash
# Run integration test suite
./scripts/run_integration_tests.sh
```

### Individual Tests

```bash
# Voice flow test (requires audio file)
python tests/integration/test_voice_flow.py tests/test_audio/sample.wav

# API contract validation
python tests/integration/test_api_contracts.py
```

## Prerequisites

1. **Backend running**: `cd backend && python run.py`
2. **ML Service running**: `cd ml-service && uvicorn app.main:app --port 5000`
3. **Test audio file**: Create `tests/test_audio/sample.wav` (16kHz, mono, WAV)

## Creating Test Audio

```bash
# Using ffmpeg
ffmpeg -f lavfi -i "sine=frequency=440:duration=2" \
  -ar 16000 -ac 1 tests/test_audio/sample.wav

# Or record a short phrase
# Ensure: 16kHz sample rate, mono channel, WAV format
```

## Test Checklist

Before running tests, ensure:

- [ ] Backend is running on port 3001
- [ ] ML Service is running on port 5000
- [ ] Database is set up and seeded
- [ ] Test audio file exists (for voice tests)
- [ ] Python dependencies installed (`pip install requests`)

## Expected Results

All tests should pass with:
- ✅ Service health checks
- ✅ Authentication flow
- ✅ Story loading
- ✅ Recommendations
- ✅ Voice transcription (if audio file provided)
- ✅ API contract validation

## Troubleshooting

**Services not running**: Start backend and ML service first

**Authentication fails**: Run seed script to create test user

**Audio test skipped**: Create test audio file in `tests/test_audio/`

**Import errors**: Install test dependencies: `pip install requests pytest`

