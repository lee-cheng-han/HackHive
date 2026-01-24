/**
 * Script to generate Cree translations using AI translation services
 * 
 * Usage:
 *   node scripts/generate-cree-translations.js
 * 
 * This script will:
 * 1. Extract all English translations from i18n.ts
 * 2. Use AI/translation APIs to generate Cree translations
 * 3. Update the i18n.ts file with the translations
 */

const fs = require('fs');
const path = require('path');

// English translations to translate
const englishTranslations = {
  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.courses': 'Courses',
  'nav.community': 'Community',
  'nav.settings': 'Settings',
  
  // Dashboard
  'dashboard.welcome': 'Welcome back',
  'dashboard.wordsLearned': 'Words Learned',
  'dashboard.storiesCompleted': 'Stories Completed',
  'dashboard.dayStreak': 'Day Streak',
  'dashboard.currentLevel': 'Current Level',
  'dashboard.recommended': 'Recommended for You',
  'dashboard.progress': 'Learning Progress',
  'dashboard.continueJourney': 'Continue your language learning journey today',
  'dashboard.recommendationsDescription': 'Based on your progress, we recommend these stories and lessons...',
  'dashboard.recommendationsPlaceholder': 'Recommendations will appear here',
  'dashboard.thisWeek': 'This Week',
  'dashboard.weeklyGoal': 'of weekly goal',
  'dashboard.trendFromLastWeek': 'from last week',
  'dashboard.level.beginner': 'Beginner',
  'dashboard.level.intermediate': 'Intermediate',
  'dashboard.level.advanced': 'Advanced',
  
  // Common
  'common.loading': 'Loading...',
  'common.search': 'Search...',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.close': 'Close',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.submit': 'Submit',
  'common.upload': 'Upload',
  'common.download': 'Download',
  
  // Settings
  'settings.title': 'Settings',
  'settings.language': 'Language Preferences',
  'settings.preferredLanguage': 'Preferred Language',
  'settings.dialect': 'Dialect',
  'settings.accessibility': 'Accessibility',
  'settings.account': 'Account',
  'settings.privacy': 'Privacy & Data',
  'settings.chooseLanguage': 'Choose your immersive language. The entire interface will be displayed in this language.',
  'settings.customizeExperience': 'Customize your learning experience',
  'settings.fontSize': 'Font Size',
  'settings.enableSubtitles': 'Enable Subtitles',
  'settings.voiceInputEnabled': 'Voice Input Enabled',
  'settings.kidsMode': 'Kids Mode',
  'settings.changePassword': 'Change Password',
  'settings.editProfile': 'Edit Profile',
  'settings.deleteAccount': 'Delete Account',
  'settings.allowDataCollection': 'Allow data collection for personalization',
  'settings.dataCollectionDescription': 'Your progress and learning data helps us improve recommendations',
};

/**
 * Translate using Google Translate API (requires API key)
 * Install: npm install @google-cloud/translate
 */
async function translateWithGoogle(text, targetLang = 'cr') {
  try {
    const { Translate } = require('@google-cloud/translate').v2;
    const translate = new Translate({
      key: process.env.GOOGLE_TRANSLATE_API_KEY,
    });
    
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (error) {
    console.error('Google Translate error:', error.message);
    return null;
  }
}

/**
 * Translate using Google Gemini API (requires API key)
 * Install: npm install @google/generative-ai
 */
async function translateWithGemini(text, targetLang = 'Cree') {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    
    // Load .env file if not already loaded
    if (!process.env.GEMINI_API_KEY) {
      try {
        require('dotenv').config();
      } catch (e) {
        // dotenv not installed, that's okay
      }
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash (fast and free) or gemini-2.5-pro (more capable)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `You are a translator specializing in Plains Cree (Nēhiyawēwin). Translate the following English text to Plains Cree. 

Requirements:
- Use Cree syllabics (ᐊᐧᐸᐢᑭᐦᐊᐧᐠ) when appropriate, or Romanized Cree
- Be culturally accurate and use proper Cree grammar
- For UI elements, use concise, natural Cree phrases
- Return ONLY the translation, no explanations

English text to translate: "${text}"

Cree translation:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translation = response.text().trim();
    
    // Clean up any extra text that Gemini might add
    return translation.split('\n')[0].replace(/^["']|["']$/g, '').trim();
  } catch (error) {
    console.error('Gemini error:', error.message);
    return null;
  }
}

/**
 * Translate using OpenAI API (requires API key)
 * Install: npm install openai
 */
async function translateWithOpenAI(text, targetLang = 'Cree') {
  try {
    // Ensure dotenv is loaded
    try {
      require('dotenv').config();
    } catch (e) {
      // dotenv already loaded or not available
    }
    
    const OpenAI = require('openai');
    
    // Load API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY not found. Current env keys:', Object.keys(process.env).filter(k => k.includes('API')));
      throw new Error('OPENAI_API_KEY not found in environment variables');
    }
    
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using cheaper model to avoid quota issues
      messages: [
        {
          role: 'system',
          content: `You are a translator specializing in Plains Cree (Nēhiyawēwin). Translate English text to Plains Cree. Use Cree syllabics (ᐊᐧᐸᐢᑭᐦᐊᐧᐠ) when appropriate, or Romanized Cree. Be culturally accurate and use proper Cree grammar.`,
        },
        {
          role: 'user',
          content: `Translate to Plains Cree: "${text}"`,
        },
      ],
      temperature: 0.3,
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI error:', error.message);
    return null;
  }
}

/**
 * Translate using DeepL API (requires API key)
 * Install: npm install deepl-node
 */
async function translateWithDeepL(text, targetLang = 'EN') {
  try {
    const deepl = require('deepl-node');
    const translator = new deepl.Translator(process.env.DEEPL_API_KEY);
    
    // Note: DeepL may not support Cree directly, might need to use English as intermediate
    const result = await translator.translateText(text, 'en', 'en');
    return result.text;
  } catch (error) {
    console.error('DeepL error:', error.message);
    return null;
  }
}

/**
 * Main translation function - tries multiple services
 */
async function translateText(text, method = 'gemini') {
  console.log(`Translating: "${text}"`);
  
  let translation = null;
  
  switch (method) {
    case 'gemini':
      translation = await translateWithGemini(text);
      break;
    case 'openai':
      translation = await translateWithOpenAI(text);
      break;
    case 'google':
      translation = await translateWithGoogle(text);
      break;
    case 'deepl':
      translation = await translateWithDeepL(text);
      break;
    default:
      console.log('Unknown method, trying Gemini...');
      translation = await translateWithGemini(text);
  }
  
  if (translation) {
    console.log(`  → ${translation}`);
    return translation;
  }
  
  console.log('  → (translation failed, using placeholder)');
  return 'ᐊᐢᑭᐦᐊᐧᐠ'; // Placeholder
}

/**
 * Generate all translations
 */
async function generateTranslations(method = 'openai') {
  console.log('Generating Cree translations...\n');
  console.log(`Using method: ${method}\n`);
  
  const translations = {};
  
  for (const [key, englishText] of Object.entries(englishTranslations)) {
    translations[key] = await translateText(englishText, method);
    // Small delay to avoid rate limits
    const delay = method === 'openai' ? 500 : 300;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  return translations;
}

/**
 * Update i18n.ts file with new translations
 */
function updateI18nFile(translations) {
  const i18nPath = path.join(__dirname, '../src/utils/i18n.ts');
  let content = fs.readFileSync(i18nPath, 'utf8');
  
  // Find the cr: section and replace translations
  const crSectionStart = content.indexOf("  cr: {");
  const crSectionEnd = content.indexOf("  },\n  oj:", crSectionStart);
  
  if (crSectionStart === -1 || crSectionEnd === -1) {
    console.error('Could not find Cree section in i18n.ts');
    return;
  }
  
  // Build new Cree translations section
  let newCrSection = "  cr: {\n";
  
  // Navigation
  newCrSection += "    // Navigation\n";
  newCrSection += `    'nav.dashboard': '${translations['nav.dashboard']}',\n`;
  newCrSection += `    'nav.courses': '${translations['nav.courses']}',\n`;
  newCrSection += `    'nav.community': '${translations['nav.community']}',\n`;
  newCrSection += `    'nav.settings': '${translations['nav.settings']}',\n`;
  newCrSection += "    \n";
  
  // Dashboard
  newCrSection += "    // Dashboard\n";
  newCrSection += `    'dashboard.welcome': '${translations['dashboard.welcome']}',\n`;
  newCrSection += `    'dashboard.wordsLearned': '${translations['dashboard.wordsLearned']}',\n`;
  newCrSection += `    'dashboard.storiesCompleted': '${translations['dashboard.storiesCompleted']}',\n`;
  newCrSection += `    'dashboard.dayStreak': '${translations['dashboard.dayStreak']}',\n`;
  newCrSection += `    'dashboard.currentLevel': '${translations['dashboard.currentLevel']}',\n`;
  newCrSection += `    'dashboard.recommended': '${translations['dashboard.recommended']}',\n`;
  newCrSection += `    'dashboard.progress': '${translations['dashboard.progress']}',\n`;
  newCrSection += `    'dashboard.continueJourney': '${translations['dashboard.continueJourney']}',\n`;
  newCrSection += `    'dashboard.recommendationsDescription': '${translations['dashboard.recommendationsDescription']}',\n`;
  newCrSection += `    'dashboard.recommendationsPlaceholder': '${translations['dashboard.recommendationsPlaceholder']}',\n`;
  newCrSection += `    'dashboard.thisWeek': '${translations['dashboard.thisWeek']}',\n`;
  newCrSection += `    'dashboard.weeklyGoal': '${translations['dashboard.weeklyGoal']}',\n`;
  newCrSection += `    'dashboard.trendFromLastWeek': '${translations['dashboard.trendFromLastWeek']}',\n`;
  newCrSection += `    'dashboard.level.beginner': '${translations['dashboard.level.beginner']}',\n`;
  newCrSection += `    'dashboard.level.intermediate': '${translations['dashboard.level.intermediate']}',\n`;
  newCrSection += `    'dashboard.level.advanced': '${translations['dashboard.level.advanced']}',\n`;
  newCrSection += "    \n";
  
  // Common
  newCrSection += "    // Common\n";
  newCrSection += `    'common.loading': '${translations['common.loading']}',\n`;
  newCrSection += `    'common.search': '${translations['common.search']}',\n`;
  newCrSection += `    'common.save': '${translations['common.save']}',\n`;
  newCrSection += `    'common.cancel': '${translations['common.cancel']}',\n`;
  newCrSection += `    'common.confirm': '${translations['common.confirm']}',\n`;
  newCrSection += `    'common.delete': '${translations['common.delete']}',\n`;
  newCrSection += `    'common.edit': '${translations['common.edit']}',\n`;
  newCrSection += `    'common.close': '${translations['common.close']}',\n`;
  newCrSection += `    'common.back': '${translations['common.back']}',\n`;
  newCrSection += `    'common.next': '${translations['common.next']}',\n`;
  newCrSection += `    'common.previous': '${translations['common.previous']}',\n`;
  newCrSection += `    'common.submit': '${translations['common.submit']}',\n`;
  newCrSection += `    'common.upload': '${translations['common.upload']}',\n`;
  newCrSection += `    'common.download': '${translations['common.download']}',\n`;
  newCrSection += "    \n";
  
  // Settings
  newCrSection += "    // Settings\n";
  newCrSection += `    'settings.title': '${translations['settings.title']}',\n`;
  newCrSection += `    'settings.language': '${translations['settings.language']}',\n`;
  newCrSection += `    'settings.preferredLanguage': '${translations['settings.preferredLanguage']}',\n`;
  newCrSection += `    'settings.dialect': '${translations['settings.dialect']}',\n`;
  newCrSection += `    'settings.accessibility': '${translations['settings.accessibility']}',\n`;
  newCrSection += `    'settings.account': '${translations['settings.account']}',\n`;
  newCrSection += `    'settings.privacy': '${translations['settings.privacy']}',\n`;
  newCrSection += `    'settings.chooseLanguage': '${translations['settings.chooseLanguage']}',\n`;
  newCrSection += `    'settings.customizeExperience': '${translations['settings.customizeExperience']}',\n`;
  newCrSection += `    'settings.fontSize': '${translations['settings.fontSize']}',\n`;
  newCrSection += `    'settings.enableSubtitles': '${translations['settings.enableSubtitles']}',\n`;
  newCrSection += `    'settings.voiceInputEnabled': '${translations['settings.voiceInputEnabled']}',\n`;
  newCrSection += `    'settings.kidsMode': '${translations['settings.kidsMode']}',\n`;
  newCrSection += `    'settings.changePassword': '${translations['settings.changePassword']}',\n`;
  newCrSection += `    'settings.editProfile': '${translations['settings.editProfile']}',\n`;
  newCrSection += `    'settings.deleteAccount': '${translations['settings.deleteAccount']}',\n`;
  newCrSection += `    'settings.allowDataCollection': '${translations['settings.allowDataCollection']}',\n`;
  newCrSection += `    'settings.dataCollectionDescription': '${translations['settings.dataCollectionDescription']}',\n`;
  
  newCrSection += "  },\n";
  
  // Replace the section
  const before = content.substring(0, crSectionStart);
  const after = content.substring(crSectionEnd + 1);
  
  const newContent = before + newCrSection + after;
  
  // Backup original file
  fs.writeFileSync(i18nPath + '.backup', content);
  
  // Write new content
  fs.writeFileSync(i18nPath, newContent);
  
  console.log('\n✅ Updated i18n.ts with new translations!');
  console.log('📝 Backup saved to i18n.ts.backup');
}

// Main execution
async function main() {
  const method = process.argv[2] || 'openai';
  
  console.log('🚀 Starting Cree translation generation...\n');
  console.log('⚠️  Note: You need to set up API keys in .env file:');
  console.log('   - OPENAI_API_KEY (for OpenAI) - Currently using');
  console.log('   - GEMINI_API_KEY (for Google Gemini)');
  console.log('   - GOOGLE_TRANSLATE_API_KEY (for Google Translate)');
  console.log('   - DEEPL_API_KEY (for DeepL)\n');
  
  try {
    const translations = await generateTranslations(method);
    updateI18nFile(translations);
    console.log('\n✨ Done! Review the translations and have a Cree speaker verify them.');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure you have:');
    console.error('1. Installed required packages: npm install @google/generative-ai');
    console.error('2. Set up GEMINI_API_KEY in .env file');
    console.error('3. Get your API key from: https://makersuite.google.com/app/apikey');
    console.error('4. Have sufficient API credits (Gemini has generous free tier)');
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateTranslations, translateText };

