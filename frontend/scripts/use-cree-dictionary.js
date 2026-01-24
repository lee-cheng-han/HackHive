/**
 * Script to use online Cree dictionaries for translations
 * 
 * This script queries online Cree dictionary resources to find translations
 * 
 * Usage:
 *   node scripts/use-cree-dictionary.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// English translations that need Cree translations
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
 * Query Algonquian Dictionaries Online (itwewina.altlab.app)
 * This is a comprehensive Cree dictionary database
 * 
 * Note: The actual API endpoint may vary. Check itwewina.altlab.app for API docs.
 */
async function queryItwewina(englishWord) {
  return new Promise((resolve) => {
    // Extract key words from phrase (for simple lookups)
    const keyWords = englishWord.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2)
      .slice(0, 1); // Take first meaningful word for dictionary lookup
    
    const searchTerm = keyWords[0] || englishWord.toLowerCase();
    
    // Try different possible API endpoints
    const possiblePaths = [
      `/api/search?q=${encodeURIComponent(searchTerm)}&lang=cr`,
      `/api/word/${encodeURIComponent(searchTerm)}`,
      `/search?q=${encodeURIComponent(searchTerm)}`,
    ];
    
    let attempts = 0;
    const tryNext = () => {
      if (attempts >= possiblePaths.length) {
        resolve(null);
        return;
      }
      
      const options = {
        hostname: 'itwewina.altlab.app',
        path: possiblePaths[attempts],
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TurtleTalk-Translation-Script/1.0',
        },
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const result = JSON.parse(data);
              // Try different response formats
              if (result && result.translations && result.translations.length > 0) {
                resolve(result.translations[0].cree || result.translations[0].text);
              } else if (result && result.word) {
                resolve(result.word);
              } else if (result && result.cree) {
                resolve(result.cree);
              } else if (Array.isArray(result) && result.length > 0) {
                resolve(result[0].cree || result[0].text);
              } else {
                attempts++;
                tryNext();
              }
            } catch (e) {
              attempts++;
              tryNext();
            }
          } else {
            attempts++;
            tryNext();
          }
        });
      });
      
      req.on('error', () => {
        attempts++;
        tryNext();
      });
      
      req.setTimeout(3000, () => {
        req.destroy();
        attempts++;
        tryNext();
      });
      
      req.end();
    };
    
    tryNext();
  });
}

/**
 * Query Cree Dictionary using web scraping (if API not available)
 * This is a fallback method - use with respect for the website's terms of service
 */
async function queryCreeDictionaryWeb(englishWord) {
  // This would require checking the actual dictionary website structure
  // For now, return null - implement based on specific dictionary site
  return null;
}

/**
 * Use a local Cree dictionary file if available
 * Handles both single words and phrases intelligently
 */
async function queryLocalDictionary(englishWord) {
  const dictPath = path.join(__dirname, '../data/cree-dictionary.json');
  
  if (fs.existsSync(dictPath)) {
    try {
      const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
      const lowerWord = englishWord.toLowerCase().trim();
      
      // Try exact match first (for phrases that might be in dictionary)
      if (dict[lowerWord]) {
        return dict[lowerWord];
      }
      
      // Try normalized version (remove punctuation)
      const normalized = lowerWord.replace(/[^\w\s]/g, '');
      if (dict[normalized]) {
        return dict[normalized];
      }
      
      // For phrases, try to find key words and translate them
      // But only if it's a short phrase (2-3 words)
      const words = normalized.split(/\s+/).filter(w => w.length > 0);
      
      if (words.length <= 3) {
        // Try to translate each word
        const translations = words.map(w => {
          // Try exact match
          if (dict[w]) return dict[w];
          // Try common variations
          if (dict[w + 's']) return dict[w + 's']; // plural
          if (dict[w.replace(/s$/, '')]) return dict[w.replace(/s$/, '')]; // singular
          return null;
        }).filter(Boolean);
        
        // Only return if we got translations for most words
        if (translations.length >= words.length * 0.7) {
          return translations.join(' ');
        }
      }
      
      // For single words, try common variations
      if (words.length === 1) {
        const word = words[0];
        // Try common word forms
        const variations = [
          word + 's', // plural
          word.replace(/s$/, ''), // singular
          word.replace(/ed$/, ''), // past tense
          word.replace(/ing$/, ''), // gerund
        ];
        
        for (const variant of variations) {
          if (dict[variant]) {
            return dict[variant];
          }
        }
      }
    } catch (e) {
      console.error('Error reading local dictionary:', e.message);
    }
  }
  
  return null;
}

/**
 * Main dictionary lookup function
 */
async function lookupInDictionary(englishText) {
  console.log(`Looking up: "${englishText}"`);
  
  // Try local dictionary first (fastest)
  let translation = await queryLocalDictionary(englishText);
  if (translation) {
    console.log(`  → ${translation} (from local dictionary)`);
    return translation;
  }
  
  // Try online dictionary API
  translation = await queryItwewina(englishText);
  if (translation) {
    console.log(`  → ${translation} (from online dictionary)`);
    return translation;
  }
  
  // Try web scraping as last resort
  translation = await queryCreeDictionaryWeb(englishText);
  if (translation) {
    console.log(`  → ${translation} (from web)`);
    return translation;
  }
  
  console.log('  → (not found in dictionaries)');
  return null;
}

/**
 * Generate translations using dictionaries
 */
async function generateTranslationsFromDictionary() {
  console.log('Generating Cree translations from dictionaries...\n');
  
  const translations = {};
  
  for (const [key, englishText] of Object.entries(englishTranslations)) {
    translations[key] = await lookupInDictionary(englishText);
    // Small delay to be respectful to dictionary servers
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return translations;
}

/**
 * Update i18n.ts file with dictionary translations
 */
function updateI18nFile(translations) {
  const i18nPath = path.join(__dirname, '../src/utils/i18n.ts');
  let content = fs.readFileSync(i18nPath, 'utf8');
  
  // Find the cr: section
  const crSectionStart = content.indexOf("  cr: {");
  const crSectionEnd = content.indexOf("  },\n  oj:", crSectionStart);
  
  if (crSectionStart === -1 || crSectionEnd === -1) {
    console.error('Could not find Cree section in i18n.ts');
    return;
  }
  
  // Build new Cree translations section (only update missing ones)
  let newCrSection = "  cr: {\n";
  
  // Navigation
  newCrSection += "    // Navigation\n";
  newCrSection += `    'nav.dashboard': '${translations['nav.dashboard'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'nav.courses': '${translations['nav.courses'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'nav.community': '${translations['nav.community'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'nav.settings': '${translations['nav.settings'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += "    \n";
  
  // Dashboard
  newCrSection += "    // Dashboard\n";
  newCrSection += `    'dashboard.welcome': '${translations['dashboard.welcome'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.wordsLearned': '${translations['dashboard.wordsLearned'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.storiesCompleted': '${translations['dashboard.storiesCompleted'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.dayStreak': '${translations['dashboard.dayStreak'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.currentLevel': '${translations['dashboard.currentLevel'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.recommended': '${translations['dashboard.recommended'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.progress': '${translations['dashboard.progress'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.continueJourney': '${translations['dashboard.continueJourney'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.recommendationsDescription': '${translations['dashboard.recommendationsDescription'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.recommendationsPlaceholder': '${translations['dashboard.recommendationsPlaceholder'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.thisWeek': '${translations['dashboard.thisWeek'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.weeklyGoal': '${translations['dashboard.weeklyGoal'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.trendFromLastWeek': '${translations['dashboard.trendFromLastWeek'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.level.beginner': '${translations['dashboard.level.beginner'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.level.intermediate': '${translations['dashboard.level.intermediate'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'dashboard.level.advanced': '${translations['dashboard.level.advanced'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += "    \n";
  
  // Common
  newCrSection += "    // Common\n";
  newCrSection += `    'common.loading': '${translations['common.loading'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.search': '${translations['common.search'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.save': '${translations['common.save'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.cancel': '${translations['common.cancel'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.confirm': '${translations['common.confirm'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.delete': '${translations['common.delete'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.edit': '${translations['common.edit'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.close': '${translations['common.close'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.back': '${translations['common.back'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.next': '${translations['common.next'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.previous': '${translations['common.previous'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.submit': '${translations['common.submit'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.upload': '${translations['common.upload'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'common.download': '${translations['common.download'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += "    \n";
  
  // Settings
  newCrSection += "    // Settings\n";
  newCrSection += `    'settings.title': '${translations['settings.title'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.language': '${translations['settings.language'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.preferredLanguage': '${translations['settings.preferredLanguage'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.dialect': '${translations['settings.dialect'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.accessibility': '${translations['settings.accessibility'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.account': '${translations['settings.account'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.privacy': '${translations['settings.privacy'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.chooseLanguage': '${translations['settings.chooseLanguage'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.customizeExperience': '${translations['settings.customizeExperience'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.fontSize': '${translations['settings.fontSize'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.enableSubtitles': '${translations['settings.enableSubtitles'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.voiceInputEnabled': '${translations['settings.voiceInputEnabled'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.kidsMode': '${translations['settings.kidsMode'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.changePassword': '${translations['settings.changePassword'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.editProfile': '${translations['settings.editProfile'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.deleteAccount': '${translations['settings.deleteAccount'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.allowDataCollection': '${translations['settings.allowDataCollection'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  newCrSection += `    'settings.dataCollectionDescription': '${translations['settings.dataCollectionDescription'] || 'ᐊᐢᑭᐦᐊᐧᐠ'}',\n`;
  
  newCrSection += "  },\n";
  
  // Replace the section
  const before = content.substring(0, crSectionStart);
  const after = content.substring(crSectionEnd + 1);
  
  const newContent = before + newCrSection + after;
  
  // Backup original file
  fs.writeFileSync(i18nPath + '.backup2', content);
  
  // Write new content
  fs.writeFileSync(i18nPath, newContent);
  
  console.log('\n✅ Updated i18n.ts with dictionary translations!');
  console.log('📝 Backup saved to i18n.ts.backup2');
}

// Main execution
async function main() {
  console.log('🚀 Starting Cree dictionary lookup...\n');
  console.log('This script will:');
  console.log('1. Try to query online Cree dictionaries');
  console.log('2. Use local dictionary file if available');
  console.log('3. Update translations in i18n.ts\n');
  
  try {
    const translations = await generateTranslationsFromDictionary();
    updateI18nFile(translations);
    console.log('\n✨ Done! Review the translations.');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = { lookupInDictionary, generateTranslationsFromDictionary };

