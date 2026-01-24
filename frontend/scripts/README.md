# Translation Scripts

## Generate Cree Translations with AI

This script uses AI translation services to automatically generate Cree translations for all UI strings.

### Setup

1. **Install Gemini package:**
   ```bash
   npm install @google/generative-ai
   ```

2. **Get Gemini API key:**
   - Go to https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key

3. **Set up API key:**
   Create a `.env` file in the frontend directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Usage

```bash
# Using Gemini (default - recommended)
node scripts/generate-cree-translations.js

# OR specify explicitly
node scripts/generate-cree-translations.js gemini

# Alternative services (if needed)
node scripts/generate-cree-translations.js openai
node scripts/generate-cree-translations.js google
node scripts/generate-cree-translations.js deepl
```

### What it does

1. Extracts all English strings from the translation file
2. Sends each string to the AI translation service
3. Gets Cree translations back
4. Updates `src/utils/i18n.ts` with the new translations
5. Creates a backup of the original file

### Important Notes

⚠️ **AI translations need human review!**

- AI may not be 100% accurate for Cree
- Cultural context matters
- Have a Cree speaker review all translations
- Some phrases may need manual adjustment

### Getting Gemini API Key

**Google Gemini (Recommended):**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in your `.env` file as `GEMINI_API_KEY=your_key_here`

**Why Gemini?**
- ✅ Free tier with generous limits
- ✅ Great for language translation
- ✅ Fast and reliable
- ✅ Easy to set up

**Alternative Services:**

**OpenAI:**
1. Go to https://platform.openai.com/
2. Sign up/login
3. Go to API Keys section
4. Create a new key
5. Copy it to your .env file

**Google Translate:**
1. Go to https://cloud.google.com/translate
2. Create a project
3. Enable Translation API
4. Create credentials
5. Copy API key to .env

**DeepL:**
1. Go to https://www.deepl.com/pro-api
2. Sign up for API access
3. Get your API key
4. Copy to .env

### Cost Estimates

- **Google Gemini**: **FREE** (generous free tier, perfect for this project!)
- **OpenAI GPT-4**: ~$0.01-0.03 per 1000 words (~$0.50-2.00 for all translations)
- **Google Translate**: Free tier available, then pay-as-you-go
- **DeepL**: Free tier available, then subscription

**Recommendation:** Use Gemini - it's free and works great for translations!

### After Running

1. Review the generated translations in `src/utils/i18n.ts`
2. Have a Cree speaker verify accuracy
3. Make manual corrections as needed
4. Test the app to ensure everything displays correctly

