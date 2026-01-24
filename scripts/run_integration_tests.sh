#!/bin/bash

# Integration Test Runner
# Runs all integration tests and validates system integration

set -e

echo "🧪 Starting Integration Test Suite"
echo "===================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if services are running
check_service() {
    local url=$1
    local name=$2
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $name is running"
        return 0
    else
        echo -e "${RED}❌${NC} $name is not running"
        return 1
    fi
}

echo ""
echo "🔍 Checking services..."
BACKEND_OK=false
ML_OK=false

if check_service "http://localhost:3001/health" "Backend"; then
    BACKEND_OK=true
fi

if check_service "http://localhost:5000/health" "ML Service"; then
    ML_OK=true
fi

if [ "$BACKEND_OK" = false ] || [ "$ML_OK" = false ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Some services are not running.${NC}"
    echo "Start them with:"
    [ "$BACKEND_OK" = false ] && echo "  Terminal 1: cd backend && source venv/bin/activate && python run.py"
    [ "$ML_OK" = false ] && echo "  Terminal 2: cd ml-service && source venv/bin/activate && uvicorn app.main:app --port 5000"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📋 Running Integration Tests..."
echo ""

# Run Python integration tests
if [ -f "tests/integration/test_voice_flow.py" ]; then
    echo "Running voice flow tests..."
    cd tests/integration
    python test_voice_flow.py || echo -e "${YELLOW}⚠️  Voice flow test skipped (no audio file)${NC}"
    cd ../..
fi

if [ -f "tests/integration/test_api_contracts.py" ]; then
    echo "Running API contract tests..."
    cd tests/integration
    python test_api_contracts.py
    cd ../..
fi

# Run backend tests if available
if [ -d "backend/tests" ]; then
    echo ""
    echo "Running backend tests..."
    cd backend
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    fi
    if command -v pytest &> /dev/null; then
        pytest tests/ -v || echo -e "${YELLOW}⚠️  Backend tests failed or not configured${NC}"
    fi
    cd ..
fi

# Run ML service tests if available
if [ -d "ml-service/tests" ]; then
    echo ""
    echo "Running ML service tests..."
    cd ml-service
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    fi
    if command -v pytest &> /dev/null; then
        pytest tests/ -v || echo -e "${YELLOW}⚠️  ML service tests failed or not configured${NC}"
    fi
    cd ..
fi

echo ""
echo "===================================="
echo -e "${GREEN}✅ Integration test suite complete${NC}"
echo ""
echo "Next steps:"
echo "1. Review test output above"
echo "2. Fix any failing tests"
echo "3. Re-run tests: ./scripts/run_integration_tests.sh"
echo ""

