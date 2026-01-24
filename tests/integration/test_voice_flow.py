"""
Integration test for voice upload flow: Frontend → Backend → ML Service
"""
import requests
import os
import sys
import time

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

BASE_URL = "http://localhost:3001"
ML_URL = "http://localhost:5000"

def test_health_checks():
    """Verify all services are running"""
    print("🔍 Checking service health...")
    
    # Backend health
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=2)
        assert response.status_code == 200
        print("✅ Backend is running")
    except requests.exceptions.RequestException:
        print("❌ Backend is not running. Start with: cd backend && python run.py")
        return False
    
    # ML service health
    try:
        response = requests.get(f"{ML_URL}/health", timeout=2)
        assert response.status_code == 200
        print("✅ ML Service is running")
    except requests.exceptions.RequestException:
        print("❌ ML Service is not running. Start with: cd ml-service && uvicorn app.main:app")
        return False
    
    return True

def test_authentication():
    """Test user registration and login"""
    print("\n🔐 Testing authentication...")
    
    # Register test user
    register_data = {
        "email": f"test_{int(time.time())}@example.com",
        "password": "test123",
        "name": "Test User",
        "preferred_language": "cr"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
        if response.status_code == 201:
            token = response.json()["token"]
            print("✅ User registered successfully")
            return token
        elif response.status_code == 409:
            # User exists, try login
            login_response = requests.post(
                f"{BASE_URL}/api/auth/login",
                json={"email": register_data["email"], "password": register_data["password"]}
            )
            if login_response.status_code == 200:
                token = login_response.json()["token"]
                print("✅ User logged in successfully")
                return token
    except Exception as e:
        print(f"❌ Authentication failed: {e}")
        return None

def test_voice_upload(token, audio_file_path=None):
    """Test voice upload: Frontend → Backend → ML Service"""
    print("\n🎤 Testing voice upload flow...")
    
    if not audio_file_path:
        # Create a simple test audio file (you should have a real WAV file)
        print("⚠️  No test audio file provided. Skipping voice upload test.")
        print("   Create a test WAV file (16kHz, mono) and pass path as argument")
        return False
    
    if not os.path.exists(audio_file_path):
        print(f"❌ Audio file not found: {audio_file_path}")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        with open(audio_file_path, "rb") as audio_file:
            files = {"file": ("audio.wav", audio_file, "audio/wav")}
            data = {"language_code": "en"}
            
            print(f"📤 Uploading audio file: {audio_file_path}")
            response = requests.post(
                f"{BASE_URL}/api/voice-to-text",
                files=files,
                data=data,
                headers=headers,
                timeout=15  # ML processing may take time
            )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Transcription received:")
            print(f"   Text: {result.get('transcription', 'N/A')}")
            print(f"   Confidence: {result.get('confidence', 0):.2f}")
            print(f"   Language: {result.get('language_detected', 'N/A')}")
            return True
        else:
            print(f"❌ Voice upload failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Voice upload error: {e}")
        return False

def test_story_loading(token):
    """Test story loading: Frontend → Backend"""
    print("\n📚 Testing story loading...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # First, get list of stories
        response = requests.get(f"{BASE_URL}/api/stories", headers=headers)
        if response.status_code == 200:
            stories = response.json().get("stories", [])
            print(f"✅ Found {len(stories)} stories")
            
            if len(stories) > 0:
                # Load first story
                story_id = stories[0]["story_id"]
                story_response = requests.get(
                    f"{BASE_URL}/api/stories/{story_id}",
                    headers=headers
                )
                
                if story_response.status_code == 200:
                    story = story_response.json()
                    print(f"✅ Story loaded: {story.get('title', 'N/A')}")
                    print(f"   Scenes: {len(story.get('scenes', []))}")
                    return True
                else:
                    print(f"❌ Failed to load story: {story_response.status_code}")
                    return False
            else:
                print("⚠️  No stories available. Create a story first.")
                return True  # Not a failure, just no data
        else:
            print(f"❌ Failed to list stories: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Story loading error: {e}")
        return False

def test_recommendations(token):
    """Test recommendations: Frontend → Backend → ML Service"""
    print("\n🎯 Testing recommendations...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/recommendations", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            recommendations = data.get("recommended", [])
            print(f"✅ Received {len(recommendations)} recommendations")
            
            for rec in recommendations[:3]:  # Show first 3
                print(f"   - {rec.get('story_id', 'N/A')}: {rec.get('reason', 'N/A')}")
            
            return True
        else:
            print(f"❌ Recommendations failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Recommendations error: {e}")
        return False

def main():
    """Run all integration tests"""
    print("=" * 60)
    print("🧪 Integration Test Suite")
    print("=" * 60)
    
    # Check services
    if not test_health_checks():
        print("\n❌ Services not running. Please start backend and ML service first.")
        return
    
    # Authenticate
    token = test_authentication()
    if not token:
        print("\n❌ Authentication failed. Cannot continue tests.")
        return
    
    # Run tests
    results = []
    
    # Test story loading
    results.append(("Story Loading", test_story_loading(token)))
    
    # Test recommendations
    results.append(("Recommendations", test_recommendations(token)))
    
    # Test voice upload (if audio file provided)
    audio_file = sys.argv[1] if len(sys.argv) > 1 else None
    if audio_file:
        results.append(("Voice Upload", test_voice_upload(token, audio_file)))
    else:
        print("\n⚠️  Skipping voice upload test (no audio file provided)")
        print("   Usage: python test_voice_flow.py [path_to_audio.wav]")
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    all_passed = all(result[1] for result in results)
    
    if all_passed:
        print("\n🎉 All tests passed!")
    else:
        print("\n⚠️  Some tests failed. Check output above for details.")

if __name__ == "__main__":
    main()

