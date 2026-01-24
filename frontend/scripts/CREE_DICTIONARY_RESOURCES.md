# Cree Dictionary Resources

## Online Cree Dictionaries

### 1. **itwewina.altlab.app** (Algonquian Dictionaries Online)
- **URL**: https://itwewina.altlab.app/
- **Description**: Comprehensive Cree dictionary database
- **API**: May have API access (check their documentation)
- **Usage**: Can search for Cree words and translations

### 2. **Cree Dictionary** (University of Alberta)
- **URL**: Various university resources
- **Description**: Academic Cree language resources
- **Usage**: May have downloadable data or API

### 3. **FirstVoices** (First Peoples' Cultural Council)
- **URL**: https://www.firstvoices.com/
- **Description**: Indigenous language platform with Cree resources
- **API**: May have API access for language data

### 4. **Native-Land.ca API**
- **URL**: https://native-land.ca/
- **Description**: Indigenous territories and language data
- **API**: Free API access for developers
- **Usage**: Can query for language data

## How to Use These Resources

### Option 1: Manual Lookup
1. Visit the dictionary website
2. Search for each English word/phrase
3. Copy the Cree translation
4. Add to the translation file

### Option 2: API Integration (if available)
1. Check if the dictionary has an API
2. Get API credentials if needed
3. Use the script to query the API
4. Automatically update translations

### Option 3: Create Local Dictionary
1. Manually collect translations from dictionaries
2. Create a JSON file: `frontend/data/cree-dictionary.json`
3. Format:
```json
{
  "dashboard": "ᐸᑭᑖᐢᑯᒪᐏᐣ",
  "courses": "ᑮᐢᑭᓱᐃᐧᓇ",
  "settings": "ᐃᑕᓱᐃᐧᓇ",
  "save": "your_cree_translation",
  "cancel": "your_cree_translation"
}
```
4. The script will automatically use this file

## Recommended Approach

1. **Start with itwewina.altlab.app** - Most comprehensive
2. **Create a local dictionary file** - For common UI terms
3. **Use the script** - To automatically look up remaining terms
4. **Manual review** - Have a Cree speaker verify all translations

## Creating Local Dictionary

Create `frontend/data/cree-dictionary.json`:

```json
{
  "dashboard": "ᐸᑭᑖᐢᑯᒪᐏᐣ",
  "courses": "ᑮᐢᑭᓱᐃᐧᓇ",
  "community": "ᐃᐧᒉᐦᑐᐃᐧᐣ",
  "settings": "ᐃᑕᓱᐃᐧᓇ",
  "welcome": "ᑕᓂᓯ",
  "back": "ᐊᐢᑭᐦᐊᐧᐠ",
  "save": "ᐊᐢᑭᐦᐊᐧᐠ",
  "cancel": "ᐊᐢᑭᐦᐊᐧᐠ",
  "loading": "ᐊᐢᑭᐦᐊᐧᐠ",
  "search": "ᓂᐢᑕᐧᐠ"
}
```

Then run:
```bash
node scripts/use-cree-dictionary.js
```

## Next Steps

1. Visit itwewina.altlab.app and search for common terms
2. Create the local dictionary file with translations you find
3. Run the script to fill in remaining translations
4. Review and verify with a Cree speaker

