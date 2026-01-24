# Using Cree Dictionary for Translations

## Overview

This script helps you use online Cree dictionaries to translate UI strings. It supports:

1. **Local Dictionary** - Fast lookups from `data/cree-dictionary.json`
2. **Online Dictionary APIs** - Queries itwewina.altlab.app and other sources
3. **Hybrid Approach** - Combines dictionary lookups with AI translation

## Setup

### 1. Create Local Dictionary

Edit `frontend/data/cree-dictionary.json` and add translations:

```json
{
  "dashboard": "ᐸᑭᑖᐢᑯᒪᐏᐣ",
  "courses": "ᑮᐢᑭᓱᐃᐧᓇ",
  "settings": "ᐃᑕᓱᐃᐧᓇ",
  "welcome back": "ᑕᐚᐤ ᐁᑳᔭᐦᑖᐤ!",
  "save": "ᐊᐢᑭᐦᐊᐧᐠ"
}
```

### 2. Find Translations

Visit these Cree dictionary websites to find translations:

- **itwewina.altlab.app** - Comprehensive Cree dictionary
- **FirstVoices** - Indigenous language resources
- **University of Alberta Cree Dictionary** - Academic resources

### 3. Run the Script

```bash
cd frontend
node scripts/use-cree-dictionary.js
```

## How It Works

1. **Local Dictionary First** - Fast, offline lookups
2. **Online Dictionary** - Queries itwewina.altlab.app API (if available)
3. **Word-by-Word** - For phrases, translates key words
4. **Updates i18n.ts** - Automatically updates translation file

## Adding More Translations

### Method 1: Manual Dictionary File

1. Visit itwewina.altlab.app
2. Search for English words
3. Copy Cree translations
4. Add to `data/cree-dictionary.json`
5. Run the script

### Method 2: Online API (if available)

The script will automatically try to query online dictionaries. If the API endpoint is different, update the `queryItwewina` function in the script.

### Method 3: Hybrid with AI

You can combine dictionary lookups with AI translation:

```bash
# First, use dictionary for common words
node scripts/use-cree-dictionary.js

# Then, use AI for remaining phrases
node scripts/generate-cree-translations.js
```

## Dictionary Resources

See `CREE_DICTIONARY_RESOURCES.md` for a list of online Cree dictionaries and how to use them.

## Tips

- **Start with common words** - Add frequently used UI terms first
- **Verify translations** - Always have a Cree speaker verify
- **Use phrases when possible** - Some phrases have specific Cree translations
- **Keep dictionary updated** - Add new translations as you find them

## Example

```json
{
  "dashboard": "ᐸᑭᑖᐢᑯᒪᐏᐣ",
  "courses": "ᑮᐢᑭᓱᐃᐧᓇ",
  "community": "ᐃᐧᒉᐦᑐᐃᐧᐣ",
  "settings": "ᐃᑕᓱᐃᐧᓇ",
  "welcome back": "ᑕᐚᐤ ᐁᑳᔭᐦᑖᐤ!",
  "words learned": "ᑭᐢᑭᓄᐦᑕᐦᐃᑲᓇ ᐊᔭᒥᐏᓇ"
}
```

Then run:
```bash
node scripts/use-cree-dictionary.js
```

The script will use these translations and update `i18n.ts` automatically!

