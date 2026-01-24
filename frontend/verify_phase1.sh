#!/bin/bash

echo "🧪 Phase 1 Verification Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ $1${NC}"
        ((FAILED++))
        return 1
    fi
}

echo "📁 Checking Project Structure..."
[ -d "src/components" ] && check "Components directory exists" || check "Components directory missing"
[ -d "src/services" ] && check "Services directory exists" || check "Services directory missing"
[ -d "src/hooks" ] && check "Hooks directory exists" || check "Hooks directory missing"
[ -d "src/types" ] && check "Types directory exists" || check "Types directory missing"
[ -d "src/utils" ] && check "Utils directory exists" || check "Utils directory missing"

echo ""
echo "📄 Checking Type Files..."
[ -f "src/types/story.ts" ] && check "story.ts exists" || check "story.ts missing"
[ -f "src/types/api.ts" ] && check "api.ts exists" || check "api.ts missing"
[ -f "src/types/user.ts" ] && check "user.ts exists" || check "user.ts missing"

echo ""
echo "📦 Checking Dependencies..."
npm list @mui/material > /dev/null 2>&1 && check "Material-UI installed" || check "Material-UI missing"
npm list @chakra-ui/react > /dev/null 2>&1 && check "Chakra UI installed" || check "Chakra UI missing"
npm list axios > /dev/null 2>&1 && check "Axios installed" || check "Axios missing"
npm list react-router-dom > /dev/null 2>&1 && check "React Router installed" || check "React Router missing"
npm list howler > /dev/null 2>&1 && check "Howler installed" || check "Howler missing"
npm list uuid > /dev/null 2>&1 && check "UUID installed" || check "UUID missing"

echo ""
echo "🔨 Testing TypeScript Build..."
npm run build > /dev/null 2>&1 && check "TypeScript compiles successfully" || check "TypeScript build failed"

echo ""
echo "📋 Checking Environment..."
[ -f ".env" ] && check ".env file exists" || echo -e "${YELLOW}⚠️  .env file missing (optional)${NC}"

echo ""
echo "================================"
echo "📊 Summary:"
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Failed: $FAILED${NC}"
    echo ""
    echo "Please fix the failed checks before proceeding."
    exit 1
else
    echo -e "${GREEN}🎉 All checks passed! Ready for Phase 2.${NC}"
    exit 0
fi
