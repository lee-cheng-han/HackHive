# Improved itwewina Search Script

## Overview

The `search-itwewina-improved.js` script uses **Puppeteer** (headless browser) to properly handle JavaScript-rendered content from [itwewina.altlab.app](https://itwewina.altlab.app/).

## Why the Improved Version?

The original script couldn't extract translations because:
- The website uses JavaScript to load search results dynamically
- Simple HTML parsing doesn't work with JavaScript-rendered content
- Puppeteer actually executes the JavaScript and waits for content to load

## Features

✅ **Handles JavaScript** - Uses Puppeteer to render the page  
✅ **Better filtering** - Excludes navigation/header text  
✅ **Multiple extraction methods** - Tries data attributes, entry containers, and text extraction  
✅ **Prioritizes reliable sources** - Prefers `data-orth` attributes over text extraction  
✅ **Rate limiting** - 1.5 second delay between requests  

## Usage

### Search for a single word:
```bash
cd frontend
node scripts/search-itwewina-improved.js "dashboard"
node scripts/search-itwewina-improved.js "settings"
```

### Search for all UI translations:
```bash
node scripts/search-itwewina-improved.js --all
```

**Note**: This will take about 1-2 minutes (52 words × 1.5 seconds delay)

## How It Works

1. **Launches headless browser** (Puppeteer)
2. **Navigates to search page** with the English word
3. **Waits for JavaScript to render** (2 seconds)
4. **Extracts Cree translations** using multiple methods:
   - `data-orth-Cans` and `data-orth-Latn` attributes (most reliable)
   - Dictionary entry containers
   - Text extraction from main content area
5. **Filters out** common page elements (greeting, navigation)
6. **Updates** `data/cree-dictionary.json` and `src/utils/i18n.ts`

## Requirements

```bash
npm install --save-dev puppeteer
```

## Example Output

```
Searching itwewina.altlab.app for: "dashboard"
  ✓ Found: ᐚᐸᒧᓈᐱᐢᐠ

Translation: ᐚᐸᒧᓈᐱᐢᐠ
```

## Notes

- **First run**: Puppeteer downloads Chromium (~170MB) on first use
- **Rate limiting**: 1.5 second delay between requests (respectful)
- **Not all words found**: Some English words may not have direct Cree translations
- **Manual review**: Always verify translations with a Cree speaker

## Troubleshooting

**"Puppeteer not found"**
```bash
npm install --save-dev puppeteer
```

**"Chromium download failed"**
- Check internet connection
- Puppeteer needs to download Chromium on first run

**Still finding wrong translations?**
- The website structure may have changed
- Try manual lookups for critical words
- Check the actual search results in a browser

