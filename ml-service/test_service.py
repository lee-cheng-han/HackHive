#!/usr/bin/env python3
"""
Test script for the ML service.
"""
import asyncio
import httpx
import json


async def test_ml_service():
    """Test the ML service endpoints."""
    base_url = "http://localhost:3002"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        print("Testing ML Service...")
        
        # Test health endpoint
        try:
            response = await client.get(f"{base_url}/health")
            print(f"✅ Health check: {response.status_code}")
            if response.status_code == 200:
                health_data = response.json()
                print(f"   TTS Status: {health_data['services']['tts']['status']}")
                print(f"   Speech Status: {health_data['services']['speech_recognition']['status']}")
        except Exception as e:
            print(f"❌ Health check failed: {e}")
        
        # Test TTS info endpoint
        try:
            response = await client.post(
                f"{base_url}/text-to-speech-info",
                json={"text": "Hello, this is a test"}
            )
            print(f"✅ TTS Info: {response.status_code}")
            if response.status_code == 200:
                tts_info = response.json()
                print(f"   Success: {tts_info.get('success')}")
                print(f"   Audio length: {tts_info.get('audio_length')} seconds")
        except Exception as e:
            print(f"❌ TTS info failed: {e}")
        
        # Test TTS generation (without actually downloading)
        try:
            response = await client.post(
                f"{base_url}/text-to-speech",
                json={"text": "Tānisi! My name is Miyo."}
            )
            print(f"✅ TTS Generation: {response.status_code}")
            if response.status_code == 200:
                print(f"   Audio size: {len(response.content)} bytes")
        except Exception as e:
            print(f"❌ TTS generation failed: {e}")
        
        print("\nML Service test completed!")


if __name__ == "__main__":
    asyncio.run(test_ml_service())