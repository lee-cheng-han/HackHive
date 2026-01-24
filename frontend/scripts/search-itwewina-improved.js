/**
 * Improved script to search itwewina.altlab.app for Cree translations
 * Uses Puppeteer to handle JavaScript-rendered content
 * 
 * Usage:
 *   node scripts/search-itwewina-improved.js
 *   node scripts/search-itwewina-improved.js "dashboard"
 *   node scripts/search-itwewina-improved.js --all
 */

const puppeteer = require('puppeteer');
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
  
  // Courses
  'courses.title': 'Language Courses',
  'courses.description': 'Explore courses in different Indigenous languages',
  'courses.filter.all': 'all',
  'courses.filter.cree': 'Cree',
  'courses.filter.ojibwe': 'Ojibwe',
  'courses.filter.inuktitut': 'Inuktitut',
  'courses.filter.mohawk': 'Mohawk',
  'courses.level.beginner': 'Beginner',
  'courses.level.intermediate': 'Intermediate',
  'courses.level.advanced': 'Advanced',
  'courses.progress': 'Progress',
  'courses.continueLearning': 'Continue Learning',
  'courses.reviewCourse': 'Review Course',
  
  // Community
  'community.title': 'Community Hub',
  'community.description': 'Share stories, learn together, and preserve cultural heritage',
  'community.shareStory': 'Share Your Story',
  'community.uploadStory': 'Upload a Story or Course',
  'community.storyTitle': 'Story Title',
  'community.storyText': 'Story Text',
  'community.uploadAudio': 'Upload Audio',
  'community.uploadImage': 'Upload Image',
  'community.submitForReview': 'Submit for Review',
  'community.tab.stories': 'Stories',
  'community.tab.courses': 'Courses',
  'community.tab.discussions': 'Discussions',
  'community.language': 'Language',
  'community.level': 'Level',
  'community.like': 'Like',
  'community.comment': 'Comment',
  'community.noStories': 'No community stories yet. Be the first to share!',
};

// Words to filter out (common page elements, not actual translations)
const FILTER_WORDS = ['ᑖᓂᓯ', 'ᐃᑘᐏᓇ', 'tânisi', 'itwêwina', 'ᐊᐢᑭᐦᐊᐧᐠ'];

/**
 * Search itwewina.altlab.app using Puppeteer
 */
async function searchItwewina(browser, englishWord) {
  const page = await browser.newPage();
  
  try {
    // Extract main word from phrases
    const mainWord = englishWord.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2)[0] || englishWord.toLowerCase();
    
    // Navigate to search page
    const searchUrl = `https://itwewina.altlab.app/search?q=${encodeURIComponent(mainWord)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 10000 });
    
    // Wait for search results to load
    await new Promise(resolve => setTimeout(resolve, 2000)); // Give time for JavaScript to render
    
    // Try to find dictionary entries in the page
    const translations = await page.evaluate((mainWord) => {
      const results = [];
      const filterWords = ['ᑖᓂᓯ', 'ᐃᑘᐏᓇ', 'tânisi', 'itwêwina', 'ᐊᐢᑭᐦᐊᐧᐠ', 'ᑖᓂᓯ!'];
      
      // First, try to find the actual search results area
      // Look for search result containers or dictionary entries
      const searchResults = document.querySelector('[id*="result"], [class*="result"], [class*="entry"], [class*="word"]');
      const searchArea = searchResults || document.body;
      
      // Method 1: Look for elements with data-orth attributes (Cree words) in search results
      const orthElements = searchArea.querySelectorAll('[data-orth-Cans], [data-orth-Latn]');
      orthElements.forEach(el => {
        // Check if this element is in a dictionary entry (not navigation/header)
        const parent = el.closest('header, nav, .header, .nav, .branding');
        if (parent) return; // Skip navigation elements
        
        const syllabic = el.getAttribute('data-orth-Cans');
        const sro = el.getAttribute('data-orth-Latn');
        if (syllabic && !filterWords.includes(syllabic) && syllabic.length >= 2) {
          results.push({ type: 'syllabic', text: syllabic, source: 'data-orth' });
        }
        if (sro && !filterWords.includes(sro) && sro.length >= 2) {
          results.push({ type: 'sro', text: sro, source: 'data-orth' });
        }
      });
      
      // Method 2: Look for dictionary entry containers
      const entryContainers = document.querySelectorAll('.entry, .result, .word-entry, [class*="entry"], [class*="result"]');
      entryContainers.forEach(container => {
        // Look for Cree text inside (syllabics or SRO)
        const text = container.textContent || container.innerText;
        
        // Extract syllabics
        const syllabicMatch = text.match(/[᐀-ᙿ]{2,}/);
        if (syllabicMatch && !filterWords.includes(syllabicMatch[0])) {
          results.push({ type: 'syllabic', text: syllabicMatch[0] });
        }
        
        // Extract SRO (Cree words with diacritics)
        const sroMatch = text.match(/\b[a-zêîôâý]+(?:w|hk)?\b/i);
        if (sroMatch && (sroMatch[0].includes('ê') || sroMatch[0].includes('î') || 
                         sroMatch[0].includes('ô') || sroMatch[0].includes('â'))) {
          if (!filterWords.includes(sroMatch[0])) {
            results.push({ type: 'sro', text: sroMatch[0] });
          }
        }
      });
      
      // Method 3: Look for main content area (excluding header/nav) and extract Cree words
      const mainContent = document.querySelector('main, .content, [role="main"]');
      if (mainContent) {
        // Remove header and nav from consideration
        const headerNav = mainContent.querySelectorAll('header, nav, .header, .nav, .branding');
        headerNav.forEach(el => el.remove());
        
        const allText = mainContent.textContent || mainContent.innerText;
        
        // Find all syllabic sequences
        const syllabicMatches = allText.match(/[᐀-ᙿ]{2,}/g);
        if (syllabicMatches) {
          syllabicMatches.forEach(match => {
            if (!filterWords.includes(match) && match.length >= 2) {
              results.push({ type: 'syllabic', text: match, source: 'text-extract' });
            }
          });
        }
        
        // Find SRO words
        const sroMatches = allText.match(/\b[a-zêîôâý]+(?:w|hk)?\b/gi);
        if (sroMatches) {
          sroMatches.forEach(match => {
            const lower = match.toLowerCase();
            if ((match.includes('ê') || match.includes('î') || match.includes('ô') || match.includes('â')) &&
                !filterWords.includes(match) && match.length >= 2) {
              results.push({ type: 'sro', text: match, source: 'text-extract' });
            }
          });
        }
      }
      
      // Remove duplicates and prioritize data-orth results
      const unique = [];
      const seen = new Set();
      const dataOrthResults = results.filter(r => r.source === 'data-orth');
      const otherResults = results.filter(r => r.source !== 'data-orth');
      
      // Add data-orth results first (more reliable)
      dataOrthResults.forEach(r => {
        if (!seen.has(r.text)) {
          seen.add(r.text);
          unique.push(r);
        }
      });
      
      // Then add other results
      otherResults.forEach(r => {
        if (!seen.has(r.text)) {
          seen.add(r.text);
          unique.push(r);
        }
      });
      
      return unique;
    }, mainWord);
    
    await page.close();
    
    // Return the first valid translation (prefer syllabics)
    if (translations.length > 0) {
      const syllabic = translations.find(t => t.type === 'syllabic');
      if (syllabic) return syllabic.text;
      return translations[0].text;
    }
    
    return null;
  } catch (error) {
    await page.close();
    console.error(`  Error searching for "${englishWord}":`, error.message);
    return null;
  }
}

/**
 * Search for a single word
 */
async function searchWord(browser, englishWord) {
  console.log(`Searching itwewina.altlab.app for: "${englishWord}"`);
  
  const translation = await searchItwewina(browser, englishWord);
  
  if (translation) {
    console.log(`  ✓ Found: ${translation}`);
    return translation;
  } else {
    console.log(`  ✗ Not found`);
    return null;
  }
}

/**
 * Search all translations
 */
async function searchAllTranslations() {
  console.log('🔍 Searching itwewina.altlab.app for all translations...\n');
  console.log('Using Puppeteer to handle JavaScript-rendered content...\n');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
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
      
      const translation = await searchItwewina(browser, mainWord);
      translations[key] = translation;
      
      if (translation) {
        console.log(`  ✓ ${translation}`);
      } else {
        console.log(`  ✗ Not found`);
      }
      
      // Be respectful - add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
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
    
    // Update i18n.ts
    updateI18nFile(translations);
    
    return translations;
  } finally {
    await browser.close();
  }
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
  const backupPath = i18nPath + '.backup4';
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
    console.log('\n✨ Done! Review the translations in i18n.ts');
  } else {
    // Search for a specific word
    const word = args.join(' ');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const translation = await searchWord(browser, word);
      
      if (translation) {
        console.log(`\nTranslation: ${translation}`);
        console.log('\nTo search all translations, run:');
        console.log(`node scripts/search-itwewina-improved.js --all`);
      }
    } finally {
      await browser.close();
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { searchItwewina, searchWord };

