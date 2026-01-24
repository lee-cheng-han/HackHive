# Using itwewina.altlab.app for Cree Translations

## Overview

The `search-itwewina.js` script searches [itwewina.altlab.app](https://itwewina.altlab.app/) - a comprehensive Plains Cree Dictionary by the Alberta Language Technology Lab.

## Quick Start

### Search for a single word:
```bash
cd frontend
node scripts/search-itwewina.js "dashboard"
node scripts/search-itwewina.js "settings"
node scripts/search-itwewina.js "save"
```

### Search for all UI translations:
```bash
node scripts/search-itwewina.js --all
```

This will:
1. Search itwewina.altlab.app for each English word
2. Extract Cree translations from the results
3. Update `data/cree-dictionary.json` with found translations
4. Update `src/utils/i18n.ts` with the translations

## How It Works

1. **Extracts main word** from phrases (e.g., "Welcome back" → "welcome")
2. **Searches itwewina.altlab.app** using their search functionality
3. **Extracts Cree translation** from the HTML/JSON response
4. **Supports both formats**:
   - Syllabics: ᐊᐧᐸᐢᑭᐦᐊᐧᐠ
   - SRO (Standard Roman Orthography): ê-kî-nitawi-kâh-kîmôci-kotiskâwêyâhk

## Features

- ✅ **Automatic word extraction** - Handles phrases intelligently
- ✅ **Multiple format support** - Finds syllabics and SRO
- ✅ **Rate limiting** - 1 second delay between requests (respectful)
- ✅ **Auto-updates** - Updates dictionary and i18n.ts automatically
- ✅ **Error handling** - Gracefully handles missing translations

## Example Output

```
Searching itwewina.altlab.app for: "dashboard"
  ✓ Found: ᐃᑘᐏᓇ

Searching itwewina.altlab.app for: "settings"
  ✓ Found: [translation]

Searching itwewina.altlab.app for: "save"
  ✗ Not found
```

## Notes

- **Be respectful**: The script includes 1-second delays between requests
- **Not all words found**: Some English words may not have direct Cree translations
- **Manual review needed**: Always have a Cree speaker verify translations
- **Phrases**: For phrases, the script extracts the main word (first meaningful word)

## About itwewina

[itwewina.altlab.app](https://itwewina.altlab.app/) is:
- Made by the **Alberta Language Technology Lab (ALTLab)**
- In collaboration with **First Nations University** and **Maskwacîs Education Schools Commission (MESC)**
- Dictionary entries courtesy of **Prof. Arok Wolvengrey**, **MESC**, and **Prof. emeritus Earle Waugh**
- Contains spoken word recordings from speakers in Maskwacîs and Moswacîhk

## Tips

1. **Start with common words** - Search for frequently used UI terms
2. **Check results** - Verify translations make sense in context
3. **Use --all sparingly** - Only when you need to update many translations
4. **Combine with manual** - Use this for lookup, then manually refine

## Troubleshooting

**No results found?**
- The word might not exist in the dictionary
- Try searching for a related word or root form
- Some phrases need to be broken down into individual words

**Script errors?**
- Check your internet connection
- The website might be temporarily unavailable
- Try again later

**Wrong translations?**
- Always verify with a Cree speaker
- Some words have multiple meanings
- Context matters for accurate translation

