# AI-Powered Indigenous Language Platform

A voice-first, community-driven platform for Indigenous language learning through interactive storytelling.

## Project Overview

This platform enables Indigenous communities to preserve and teach their languages through engaging, interactive stories. The system supports voice-first interactions, community content creation, and AI-powered personalization.

## Architecture

The project is divided into three independent components that can be developed in parallel:

1. **Frontend** (`/frontend`) - Voice-first web interface with chat-style storytelling
2. **Backend** (`/backend`) - Community platform with user management and content moderation
3. **ML Service** (`/ml-service`) - Speech recognition, recommendations, and sensor integration

## Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and component interactions
- **[TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)** - Technical requirements, data formats, and API contracts
- **[FRONTEND_PLAN.md](./FRONTEND_PLAN.md)** - Detailed execution plan for Frontend developer
- **[BACKEND_PLAN.md](./BACKEND_PLAN.md)** - Detailed execution plan for Backend developer
- **[ML_PLAN.md](./ML_PLAN.md)** - Detailed execution plan for ML/AI developer
- **[SETUP.md](./SETUP.md)** - Development environment setup guide
- **[INTEGRATION_TESTING.md](./INTEGRATION_TESTING.md)** - Comprehensive integration testing guide
- **[QUICK_TEST_GUIDE.md](./QUICK_TEST_GUIDE.md)** - Quick reference for testing components

## Team Structure

Each developer should follow their respective plan document:
- Frontend Developer → `FRONTEND_PLAN.md`
- Backend Developer → `BACKEND_PLAN.md`
- ML Developer → `ML_PLAN.md`

## Tech Stack

- **Frontend**: React, Web Speech API, Material-UI/Chakra UI
- **Backend**: Python/FastAPI, PostgreSQL, SQLAlchemy, S3/DigitalOcean Spaces
- **ML Service**: Python, PyTorch/TensorFlow, Whisper, FastAPI

## Deployment

Target platform: DigitalOcean (Droplets or App Platform)

