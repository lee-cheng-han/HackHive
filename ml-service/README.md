# TurtleTalk ML Service

AI/ML microservice for the Indigenous Language Learning Platform. Provides text-to-speech generation using your trained PyTorch model and speech recognition using Whisper.

## ✅ What's Implemented

- **Text-to-Speech**: Uses your `best_model.pth` PyTorch model for speech generation
- **Speech Recognition**: Whisper-based transcription for multiple languages
- **FastAPI REST API**: Clean endpoints for integration with backend
- **Health Monitoring**: Status endpoints for service monitoring
- **Error Handling**: Graceful fallbacks and logging

## 🚀 Quick Start

### 1. Setup

```bash
# Run the setup script
./setup.sh

# Or manually:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### 2. Start Service

```bash
# Activate virtual environment
source venv/bin/activate

# Start the service
python run.py
```

Service runs at: **http://localhost:3002**

### 3. Test Service

```bash
# Test all endpoints
python test_service.py

# Or check health manually
curl http://localhost:3002/health
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Service status and model information

### Text-to-Speech
- `POST /text-to-speech` - Generate speech audio from text
- `POST /text-to-speech-info` - Get TTS info without generating audio

### Speech Recognition  
- `POST /transcribe` - Transcribe audio to text

### Model Information
- `GET /models/tts/info` - TTS model details
- `GET /models/speech/info` - Speech recognition model details
- `GET /models/speech/languages` - Supported languages

## 💾 Your Model Integration

The service automatically loads your `best_model.pth` file:

```python
# Your model is loaded in tts_service.py
model_path = "./best_model.pth"
checkpoint = torch.load(model_path, map_location=device)
```

**Note**: The current implementation includes a flexible model loader that adapts to different PyTorch model architectures. You may need to customize the `_generate_audio()` method in `tts_service.py` to match your specific model's interface.

## 🔧 Configuration

Edit `.env` file:

```bash
# Server
HOST=0.0.0.0
PORT=3002
DEBUG=true

# Model settings
MODEL_PATH=./best_model.pth
DEVICE=auto  # auto, cpu, cuda
MAX_LENGTH=500

# Audio settings
SAMPLE_RATE=22050
AUDIO_FORMAT=wav

# Whisper settings
WHISPER_MODEL=base  # tiny, base, small, medium, large
```

## 🎯 Integration with Backend

The backend is already configured to use this service:

```python
# Backend calls ML service at:
ML_SERVICE_URL = "http://localhost:3002"

# Voice routes use:
POST /transcribe        -> ML service transcription
POST /text-to-speech   -> ML service TTS generation
```

## 📋 File Structure

```
ml-service/
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── tts_service.py       # Your model integration
├── speech_service.py    # Whisper integration
├── run.py              # Server runner
├── test_service.py     # Test script
├── setup.sh            # Setup script
├── requirements.txt    # Dependencies
├── .env.example        # Environment template
└── best_model.pth      # Your trained model
```

## ⚡ Performance Notes

- **Model Loading**: ~1GB model loads on startup (may take 30-60 seconds)
- **GPU Support**: Automatic CUDA detection if available
- **Memory**: Requires ~2-4GB RAM depending on model size
- **Concurrency**: Single model instance (configurable via MAX_WORKERS)

## 🐛 Troubleshooting

**Model won't load:**
- Check `best_model.pth` exists and is valid PyTorch checkpoint
- Verify sufficient RAM/GPU memory
- Check device compatibility (CPU vs CUDA)

**Service not starting:**
- Ensure all dependencies installed: `pip install -r requirements.txt`
- Check port 3002 is available
- Review logs for specific errors

**Backend integration issues:**
- Verify ML service is running at http://localhost:3002
- Check backend ML_SERVICE_URL configuration
- Test endpoints manually with curl/Postman

## 🔄 Next Steps

1. **Customize TTS Model Interface**: Update `_generate_audio()` in `tts_service.py` to match your model
2. **Add Model Caching**: Implement model warming for faster response times
3. **Batch Processing**: Add batch TTS generation for multiple texts
4. **Model Versioning**: Support multiple model versions/languages

## 📖 See Also

- [Backend Integration](../backend/README.md)
- [Technical Specifications](../TECHNICAL_SPEC.md)
- [ML Development Plan](../ML_PLAN.md)