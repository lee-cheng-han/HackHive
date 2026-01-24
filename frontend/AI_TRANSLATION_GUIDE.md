# Using AI to Generate Cree Translations

## Quick Start

1. **Get a Gemini API key** (FREE!):
   - Go to https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key

2. **Set up the script:**
   ```bash
   cd frontend
   npm install @google/generative-ai
   ```

3. **Create .env file:**
   ```bash
   echo "GEMINI_API_KEY=your_key_here" > .env
   ```

4. **Run the script:**
   ```bash
   node scripts/generate-cree-translations.js
   ```

5. **Review and verify:**
   - Check `src/utils/i18n.ts` for the new translations
   - Have a Cree speaker review them
   - Make corrections as needed

## Alternative: Use Online Tools

If you prefer not to use API keys, you can:

1. **Use ChatGPT directly:**
   - Go to https://chat.openai.com
   - Ask: "Translate these English phrases to Plains Cree: [list your phrases]"
   - Copy the translations
   - I'll help you add them to the code

2. **Use Google Translate:**
   - Go to https://translate.google.com
   - Note: May not support Cree well, but worth trying
   - Translate each phrase
   - Copy results

3. **Use Cree Dictionary Tools:**
   - Online Cree dictionaries
   - Cree language apps
   - Community resources

## What the Script Does

The script will:
- ✅ Extract all 50+ English phrases from your app
- ✅ Send them to AI for translation
- ✅ Get Cree translations back
- ✅ Automatically update your code
- ✅ Create a backup of the original file

## Cost

- **Gemini**: **FREE!** (generous free tier)
- **OpenAI**: ~$0.50-2.00 for all translations (one-time)
- **Free alternatives**: Use ChatGPT web interface (free tier available)

## After AI Translation

**Important:** Always have a Cree speaker review AI translations because:
- AI may miss cultural nuances
- Some phrases need context
- Grammar and word choice matter
- Dialect differences exist (Plains Cree vs. other dialects)

## Need Help?

If you want me to:
- Set up the script differently
- Use a different AI service
- Format translations differently
- Help with manual translation entry

Just let me know!

