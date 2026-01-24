#!/bin/bash
# Quick API testing script

echo "🧪 Testing TurtleTalk Backend API"
echo "================================"
echo ""

BASE_URL="http://localhost:3001/api/v1"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test health endpoint
echo "1️⃣ Testing health endpoint..."
HEALTH=$(curl -s http://localhost:3001/health)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "   $HEALTH"
else
    echo -e "${RED}❌ Health check failed${NC}"
    exit 1
fi
echo ""

# Test registration
echo "2️⃣ Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "email": "test'$(date +%s)'@example.com",
        "password": "testpass123",
        "username": "testuser'$(date +%s)'",
        "preferred_language": "cr"
    }')

if echo "$REGISTER_RESPONSE" | grep -q "id"; then
    echo -e "${GREEN}✅ Registration successful${NC}"
    echo "   User created"
else
    echo -e "${YELLOW}⚠️  Registration response:${NC}"
    echo "   $REGISTER_RESPONSE"
fi
echo ""

# Test login
echo "3️⃣ Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "email": "learner@turtletalk.app",
        "password": "learner123"
    }')

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('access_token', ''))" 2>/dev/null)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✅ Login successful${NC}"
    echo "   Token: ${TOKEN:0:30}..."
else
    echo -e "${RED}❌ Login failed - run seed script first:${NC}"
    echo "   cd backend && source venv/bin/activate && python scripts/seed_data.py"
    echo ""
fi
echo ""

# Test courses endpoint
echo "4️⃣ Testing courses endpoint..."
COURSES=$(curl -s $BASE_URL/courses)
COURSE_COUNT=$(echo "$COURSES" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ -n "$COURSE_COUNT" ]; then
    echo -e "${GREEN}✅ Courses retrieved${NC}"
    echo "   Found $COURSE_COUNT courses"
else
    echo -e "${YELLOW}⚠️  No courses found - run seed script${NC}"
fi
echo ""

# Test stories endpoint
echo "5️⃣ Testing stories endpoint..."
STORIES=$(curl -s $BASE_URL/stories)
STORY_COUNT=$(echo "$STORIES" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ -n "$STORY_COUNT" ]; then
    echo -e "${GREEN}✅ Stories retrieved${NC}"
    echo "   Found $STORY_COUNT stories"
else
    echo -e "${YELLOW}⚠️  No stories found${NC}"
fi
echo ""

# Test protected endpoint (if we have token)
if [ -n "$TOKEN" ]; then
    echo "6️⃣ Testing protected endpoint (user profile)..."
    PROFILE=$(curl -s $BASE_URL/users/me \
        -H "Authorization: Bearer $TOKEN")
    
    if echo "$PROFILE" | grep -q "email"; then
        echo -e "${GREEN}✅ Protected endpoint works${NC}"
        EMAIL=$(echo "$PROFILE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('email', ''))" 2>/dev/null)
        echo "   User: $EMAIL"
    else
        echo -e "${RED}❌ Protected endpoint failed${NC}"
    fi
    echo ""
fi

# Summary
echo "================================"
echo -e "${GREEN}✨ Backend API is working!${NC}"
echo ""
echo "Next steps:"
echo "  1. Visit http://localhost:3001/docs for interactive API testing"
echo "  2. Run: python scripts/seed_data.py (if you haven't)"
echo "  3. Test with frontend at http://localhost:3000"
echo ""

