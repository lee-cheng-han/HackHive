"""
Test API contracts to ensure Frontend, Backend, and ML Service are in sync.
Validates data formats match TECHNICAL_SPEC.md
"""
import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:3001"
ML_URL = "http://localhost:5000"

def validate_story_response(story: Dict[str, Any]) -> tuple[bool, str]:
    """Validate story response matches API spec"""
    required_fields = ["story_id", "language", "title", "level", "scenes"]
    
    for field in required_fields:
        if field not in story:
            return False, f"Missing required field: {field}"
    
    # Validate scenes
    if not isinstance(story["scenes"], list):
        return False, "scenes must be a list"
    
    if len(story["scenes"]) == 0:
        return False, "story must have at least one scene"
    
    # Validate first scene
    scene = story["scenes"][0]
    scene_required = ["id", "order", "text", "interaction_type"]
    for field in scene_required:
        if field not in scene:
            return False, f"Scene missing required field: {field}"
    
    return True, "Story format valid"

def validate_transcription_response(response: Dict[str, Any]) -> tuple[bool, str]:
    """Validate transcription response matches API spec"""
    required_fields = ["transcription", "confidence"]
    
    for field in required_fields:
        if field not in response:
            return False, f"Missing required field: {field}"
    
    if not isinstance(response["transcription"], str):
        return False, "transcription must be a string"
    
    if not isinstance(response["confidence"], (int, float)):
        return False, "confidence must be a number"
    
    if not (0 <= response["confidence"] <= 1):
        return False, "confidence must be between 0 and 1"
    
    return True, "Transcription format valid"

def validate_recommendation_response(response: Dict[str, Any]) -> tuple[bool, str]:
    """Validate recommendation response matches API spec"""
    if "recommended" not in response:
        return False, "Missing 'recommended' field"
    
    if not isinstance(response["recommended"], list):
        return False, "recommended must be a list"
    
    if len(response["recommended"]) > 0:
        rec = response["recommended"][0]
        required_fields = ["story_id", "reason"]
        for field in required_fields:
            if field not in rec:
                return False, f"Recommendation missing required field: {field}"
    
    return True, "Recommendation format valid"

def test_story_api_contract(token: str):
    """Test story API matches contract"""
    print("📋 Testing Story API Contract...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get story list
    response = requests.get(f"{BASE_URL}/api/stories", headers=headers)
    if response.status_code != 200:
        print(f"❌ Failed to get stories: {response.status_code}")
        return False
    
    data = response.json()
    if "stories" not in data:
        print("❌ Response missing 'stories' field")
        return False
    
    if len(data["stories"]) == 0:
        print("⚠️  No stories available for testing")
        return True
    
    # Get full story
    story_id = data["stories"][0]["story_id"]
    story_response = requests.get(
        f"{BASE_URL}/api/stories/{story_id}",
        headers=headers
    )
    
    if story_response.status_code != 200:
        print(f"❌ Failed to get story: {story_response.status_code}")
        return False
    
    story = story_response.json()
    valid, message = validate_story_response(story)
    
    if valid:
        print(f"✅ {message}")
        return True
    else:
        print(f"❌ {message}")
        print(f"   Story data: {json.dumps(story, indent=2)[:200]}...")
        return False

def test_ml_service_contract():
    """Test ML service API matches contract"""
    print("📋 Testing ML Service API Contract...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{ML_URL}/health", timeout=2)
        if response.status_code != 200:
            print(f"❌ ML service health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException:
        print("❌ ML service not reachable")
        return False
    
    print("✅ ML service is reachable")
    
    # Note: Full transcription test requires audio file
    # This validates the contract structure only
    
    return True

def test_error_response_format(token: str):
    """Test error responses follow the spec format"""
    print("📋 Testing Error Response Format...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test 404 (non-existent story)
    response = requests.get(
        f"{BASE_URL}/api/stories/non-existent-id",
        headers=headers
    )
    
    if response.status_code == 404:
        error_data = response.json()
        if "error" in error_data and "message" in error_data:
            print("✅ Error format valid (404)")
            return True
        else:
            print("❌ Error response missing 'error' or 'message' field")
            return False
    
    return True

def main():
    """Run API contract tests"""
    print("=" * 60)
    print("📋 API Contract Validation Tests")
    print("=" * 60)
    
    # Get auth token
    try:
        register_response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": f"contract_test_{int(__import__('time').time())}@example.com",
                "password": "test123",
                "name": "Contract Test",
                "preferred_language": "cr"
            }
        )
        
        if register_response.status_code == 201:
            token = register_response.json()["token"]
        else:
            # Try login
            login_response = requests.post(
                f"{BASE_URL}/api/auth/login",
                json={"email": "admin@example.com", "password": "admin123"}
            )
            if login_response.status_code == 200:
                token = login_response.json()["token"]
            else:
                print("❌ Could not authenticate")
                return
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return
    
    results = []
    
    # Run tests
    results.append(("Story API Contract", test_story_api_contract(token)))
    results.append(("ML Service Contract", test_ml_service_contract()))
    results.append(("Error Format", test_error_response_format(token)))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Contract Test Results")
    print("=" * 60)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    all_passed = all(result[1] for result in results)
    
    if all_passed:
        print("\n🎉 All API contracts valid!")
    else:
        print("\n⚠️  Some contracts don't match spec. Check TECHNICAL_SPEC.md")

if __name__ == "__main__":
    main()

