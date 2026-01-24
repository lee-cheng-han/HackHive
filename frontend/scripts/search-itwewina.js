/**
 * Script to search itwewina.altlab.app for Cree translations
 * 
 * itwewina is a Plains Cree Dictionary by Alberta Language Technology Lab
 * https://itwewina.altlab.app/
 * 
 * Usage:
 *   node scripts/search-itwewina.js
 *   node scripts/search-itwewina.js "dashboard"
 *   node scripts/search-itwewina.js --all
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

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
 * Search itwewina.altlab.app for a word
 * The website uses a search API endpoint
 */
async function searchItwewina(englishWord) {
  return new Promise((resolve) => {
    // Extract the main word from phrases
    const mainWord = englishWord.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2)[0] || englishWord.toLowerCase();
    
    // Try the search API endpoint
    // Based on the website structure, it likely uses a search endpoint
    const searchPath = `/search?q=${encodeURIComponent(mainWord)}&lang=en`;
    
    // Try different search paths - the website might use different endpoints
    const possiblePaths = [
      `/search?q=${encodeURIComponent(mainWord)}`,
      `/api/search?q=${encodeURIComponent(mainWord)}`,
      `/word/${encodeURIComponent(mainWord)}`,
      `/api/word/${encodeURIComponent(mainWord)}`,
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
          'Accept': 'application/json, text/html, */*',
          'User-Agent': 'TurtleTalk-Translation-Script/1.0',
          'Referer': 'https://itwewina.altlab.app/',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Try to parse as JSON first
        if (res.statusCode === 200 && res.headers['content-type']?.includes('application/json')) {
          try {
            const result = JSON.parse(data);
            const translation = extractTranslationFromJSON(result, mainWord);
            if (translation) {
              resolve(translation);
              return;
            }
          } catch (e) {
            // Not JSON, try HTML parsing
          }
        }
        
        // Parse HTML response
        if (res.statusCode === 200) {
          const translation = extractTranslationFromHTML(data, mainWord);
          if (translation && translation !== 'ᑖᓂᓯ' && translation !== 'tânisi') {
            // Filter out the greeting that appears on every page
            resolve(translation);
            return;
          }
        }
        
        // Try next path if this one didn't work
        attempts++;
        tryNext();
      });
    });
    
      req.on('error', () => {
        attempts++;
        tryNext();
      });
      
      req.setTimeout(5000, () => {
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
 * Extract Cree translation from JSON response
 */
function extractTranslationFromJSON(result, word) {
  if (!result) return null;
  
  // Try different possible response structures
  if (result.results && Array.isArray(result.results) && result.results.length > 0) {
    const firstResult = result.results[0];
    if (firstResult.cree) return firstResult.cree;
    if (firstResult.word) return firstResult.word;
    if (firstResult.lemma) return firstResult.lemma;
  }
  
  if (result.translations && Array.isArray(result.translations) && result.translations.length > 0) {
    return result.translations[0].cree || result.translations[0].text;
  }
  
  if (result.word) return result.word;
  if (result.cree) return result.cree;
  
  return null;
}

/**
 * Extract Cree translation from HTML response
 * Parses the search results page from itwewina.altlab.app
 */
function extractTranslationFromHTML(html, word) {
  if (!html) return null;
  
  // The website structure: search results are in specific containers
  // We need to find the actual dictionary entry, not navigation/header text
  
  // Pattern 1: Look for search results container
  // Try to find the main content area with dictionary entries
  const resultContainerMatch = html.match(/<main[^>]*>(.*?)<\/main>/is) || 
                                html.match(/<div[^>]*class=["'][^"']*result["'][^>]*>(.*?)<\/div>/is) ||
                                html.match(/<div[^>]*class=["'][^"']*entry["'][^>]*>(.*?)<\/div>/is);
  
  const searchArea = resultContainerMatch ? resultContainerMatch[1] : html;
  
  // Pattern 2: Look for data-orth attributes (the website uses these for Cree words)
  // Format: data-orth-Cans="ᐊᐧᐸᐢᑭᐦᐊᐧᐠ" or data-orth-Latn="itwêwina"
  const dataOrthMatch = searchArea.match(/data-orth-Cans=["']([^"']+)["']/i) ||
                        searchArea.match(/data-orth-Latn=["']([^"']+)["']/i);
  
  if (dataOrthMatch && dataOrthMatch[1]) {
    const translation = dataOrthMatch[1].trim();
    // Filter out common page elements
    const navWords = ['ᑖᓂᓯ', 'ᐃᑘᐏᓇ', 'tânisi', 'itwêwina'];
    if (!navWords.includes(translation) && translation.length >= 2) {
      return translation;
    }
  }
  
  // Pattern 3: Look for dictionary entry structure
  // Entries typically have: Cree word (syllabics or SRO) followed by English definition
  // Or: English word followed by Cree translation
  
  // Try to find Cree syllabics in the search results (not in header/nav)
  const syllabicPattern = /[᐀-ᙿ]{2,}/g;
  const allSyllabicMatches = searchArea.match(syllabicPattern);
  
  if (allSyllabicMatches && allSyllabicMatches.length > 0) {
    // Filter out common navigation words that appear on every page
    const navWords = ['ᐊᐢᑭᐦᐊᐧᐠ', 'ᐃᑘᐏᓇ', 'ᑕᓂᓯ', 'ᑖᓂᓯ']; // Common words that appear in navigation
    const validMatches = allSyllabicMatches.filter(match => 
      !navWords.includes(match) && match.length >= 2
    );
    
    if (validMatches.length > 0) {
      // Return the first valid match (likely the main translation)
      return validMatches[0];
    }
  }
  
  // Pattern 3: Look for SRO Cree words in search results
  // Cree SRO words contain: ê, î, ô, â, and often end with w, hk, etc.
  const sroPattern = /\b[a-zêîôâý]+(?:w|hk|hk|hk)?\b/gi;
  const allSroMatches = searchArea.match(sroPattern);
  
  if (allSroMatches && allSroMatches.length > 0) {
    // Filter for Cree-looking words (contain diacritics or Cree endings)
    const creeWords = allSroMatches.filter(w => {
      const lower = w.toLowerCase();
      return w.length > 2 && 
             (w.includes('ê') || w.includes('î') || w.includes('ô') || w.includes('â') || 
              w.includes('ý') || lower.endsWith('w') || lower.endsWith('hk'));
    });
    
    if (creeWords.length > 0) {
      // Return the first Cree word found
      return creeWords[0];
    }
  }
  
  // Pattern 4: Try to find in data attributes or structured content
  const dataMatch = searchArea.match(/data-word=["']([^"']+)["']/i) ||
                    searchArea.match(/data-cree=["']([^"']+)["']/i) ||
                    searchArea.match(/<span[^>]*class=["'][^"']*cree["'][^>]*>([^<]+)<\/span>/i);
  
  if (dataMatch && dataMatch[1]) {
    return dataMatch[1].trim();
  }
  
  // Pattern 5: Look for JSON-LD structured data
  const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/is);
  if (jsonLdMatch) {
    try {
      const jsonData = JSON.parse(jsonLdMatch[1]);
      if (jsonData.translation || jsonData.cree || jsonData.word) {
        return jsonData.translation || jsonData.cree || jsonData.word;
      }
    } catch (e) {
      // Not valid JSON
    }
  }
  
  return null;
}

/**
 * Search for a single word and return translation
 */
async function searchWord(englishWord) {
  console.log(`Searching itwewina.altlab.app for: "${englishWord}"`);
  
  const translation = await searchItwewina(englishWord);
  
  if (translation) {
    console.log(`  ✓ Found: ${translation}`);
    return translation;
  } else {
    console.log(`  ✗ Not found`);
    return null;
  }
}

/**
 * Search all translations and update dictionary
 */
async function searchAllTranslations() {
  console.log('🔍 Searching itwewina.altlab.app for all translations...\n');
  console.log('Note: This will make multiple requests. Please be respectful of their servers.\n');
  
  const translations = {};
  const total = Object.keys(englishTranslations).length;
  let count = 0;
  
  for (const [key, englishText] of Object.entries(englishTranslations)) {
    count++;
    console.log(`[${count}/${total}] ${key}:`);
    
    // Extract main word from phrase
    const mainWord = englishText.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2)[0] || englishText.toLowerCase();
    
    const translation = await searchItwewina(mainWord);
    translations[key] = translation;
    
    // Be respectful - add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
  }
  
  // Save results to dictionary file
  const dictPath = path.join(__dirname, '../data/cree-dictionary.json');
  let dict = {};
  
  if (fs.existsSync(dictPath)) {
    try {
      dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    } catch (e) {
      console.error('Error reading existing dictionary:', e.message);
    }
  }
  
  // Merge new translations
  for (const [key, translation] of Object.entries(translations)) {
    if (translation) {
      const englishText = englishTranslations[key].toLowerCase();
      dict[englishText] = translation;
      
      // Also add individual words
      const words = englishText.split(/\s+/);
      if (words.length > 1) {
        words.forEach(word => {
          if (word.length > 2 && !dict[word]) {
            dict[word] = translation; // Use phrase translation for now
          }
        });
      }
    }
  }
  
  // Save updated dictionary
  fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2));
  console.log(`\n✅ Updated dictionary file: ${dictPath}`);
  console.log(`📊 Found ${Object.values(translations).filter(Boolean).length} translations`);
  
  return translations;
}

/**
 * Update i18n.ts with found translations
 */
function updateI18nFile(translations) {
  const i18nPath = path.join(__dirname, '../src/utils/i18n.ts');
  
  if (!fs.existsSync(i18nPath)) {
    console.error('i18n.ts not found!');
    return;
  }
  
  let content = fs.readFileSync(i18nPath, 'utf8');
  const backupPath = i18nPath + '.backup3';
  fs.writeFileSync(backupPath, content);
  
  // Update only the keys that have translations
  for (const [key, translation] of Object.entries(translations)) {
    if (translation) {
      // Escape single quotes in translation
      const escapedTranslation = translation.replace(/'/g, "\\'");
      
      // Find and replace the translation
      const pattern = new RegExp(`('${key.replace(/\./g, '\\.')}'\\s*:\\s*')([^']*)(')`, 'g');
      content = content.replace(pattern, `$1${escapedTranslation}$3`);
    }
  }
  
  fs.writeFileSync(i18nPath, content);
  console.log(`✅ Updated i18n.ts (backup: ${backupPath})`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--all') {
    // Search all translations
    const translations = await searchAllTranslations();
    updateI18nFile(translations);
    console.log('\n✨ Done! Review the translations in i18n.ts');
  } else {
    // Search for a specific word
    const word = args.join(' ');
    const translation = await searchWord(word);
    
    if (translation) {
      console.log(`\nTranslation: ${translation}`);
      console.log('\nTo add this to your dictionary, run:');
      console.log(`node scripts/search-itwewina.js --all`);
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { searchItwewina, searchWord };

