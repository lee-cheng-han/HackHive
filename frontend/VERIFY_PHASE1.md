# Phase 1 Verification Checklist

Follow these steps to verify Phase 1 is complete and working correctly.

## ✅ Step 1: Verify Project Structure

Open your terminal and run:

```bash
cd /Users/jingyu/HackHive/frontend
```

Then check the structure:

```bash
# Check main directories exist
ls -la src/components/
ls -la src/services/
ls -la src/hooks/
ls -la src/types/
ls -la src/utils/
```

**Expected Output:**
- You should see directories: `Chat`, `Story`, `Audio`, `Accessibility` inside `components/`
- Other directories should exist but be empty for now

## ✅ Step 2: Verify Dependencies

Check that all packages are installed:

```bash
npm list --depth=0 | grep -E "(mui|chakra|axios|react-router|howler|uuid)"
```

**Expected Output:**
You should see:
- @mui/material
- @chakra-ui/react
- axios
- react-router-dom
- howler
- uuid

## ✅ Step 3: Verify Type Definitions

Check that type files exist and are valid:

```bash
# Check files exist
ls src/types/
cat src/types/story.ts
cat src/types/api.ts
cat src/types/user.ts
```

**Expected:**
- All three files should exist
- They should contain TypeScript interfaces

## ✅ Step 4: Verify TypeScript Compilation

Test that TypeScript compiles without errors:

```bash
npm run build
```

**Expected:**
- Should complete successfully
- Should say "Compiled successfully"
- Should create a `build/` directory

## ✅ Step 5: Start Development Server

Start the React development server:

```bash
npm start
```

**Expected:**
- Browser should open automatically
- Should open to `http://localhost:3000`
- You should see the default React app (spinning logo)
- No errors in the terminal
- No errors in browser console (press F12 to open)

**To stop the server:** Press `Ctrl+C` in the terminal

## ✅ Step 6: Verify Environment Variables

Check that environment file exists:

```bash
cat .env
```

**Expected:**
- File should exist
- Should contain: `REACT_APP_API_URL=http://localhost:3001/api`

## ✅ Step 7: Test TypeScript in VS Code (Optional)

If you're using VS Code:

1. Open the `frontend` folder in VS Code
2. Open any `.ts` or `.tsx` file
3. Check for red squiggly lines (errors)
4. Hover over imports - they should resolve correctly

**Expected:**
- No TypeScript errors
- Imports should be recognized
- Auto-completion should work

## ✅ Step 8: Verify Package.json

Check package.json has all scripts:

```bash
cat package.json | grep -A 5 "scripts"
```

**Expected:**
Should see:
- `"start": "react-scripts start"`
- `"build": "react-scripts build"`
- `"test": "react-scripts test"`

## 🎯 Quick Verification Command

Run this single command to check everything at once:

```bash
cd /Users/jingyu/HackHive/frontend && \
echo "📁 Checking structure..." && \
[ -d "src/components" ] && echo "✅ Components directory exists" || echo "❌ Missing components" && \
[ -d "src/types" ] && echo "✅ Types directory exists" || echo "❌ Missing types" && \
[ -f "src/types/story.ts" ] && echo "✅ Story types exist" || echo "❌ Missing story.ts" && \
echo "📦 Checking dependencies..." && \
npm list @mui/material @chakra-ui/react axios react-router-dom howler uuid 2>/dev/null | grep -q "@" && echo "✅ Dependencies installed" || echo "❌ Missing dependencies" && \
echo "🔨 Testing build..." && \
npm run build > /dev/null 2>&1 && echo "✅ Build successful" || echo "❌ Build failed"
```

## ✅ All Checks Passed?

If all checks pass:
- ✅ You're ready for Phase 2!
- ✅ Your project is set up correctly
- ✅ All dependencies are installed
- ✅ TypeScript is configured properly

## ❌ If Something Fails

**Build fails:**
- Check for TypeScript errors: `npx tsc --noEmit`
- Check node_modules: `rm -rf node_modules && npm install`

**Dependencies missing:**
- Reinstall: `npm install @mui/material @chakra-ui/react axios react-router-dom howler uuid`

**Structure missing:**
- Recreate directories: `mkdir -p src/{components/{Chat,Story,Audio,Accessibility},services,hooks,types,utils}`

## Next Steps

Once verified, you can proceed to **Phase 2: Core Components** where we'll build:
1. API service
2. Speech service  
3. Voice Input component
4. Story components

