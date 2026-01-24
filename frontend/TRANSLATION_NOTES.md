# Translation Notes

## Current Status

All UI strings have been wrapped with translation keys and are ready for full Indigenous language immersion. However, **the Cree, Ojibwe, Inuktitut, and Mohawk translations currently use placeholder text** (ᐊᐢᑭᐦᐊᐧᐠ) and need to be replaced with authentic translations.

## What's Been Translated

✅ **Navigation** - All tab labels
✅ **Dashboard** - Welcome message, stat labels, recommendations, progress
✅ **Settings** - All settings labels and descriptions
✅ **Common UI** - Buttons, loading states, search, etc.
✅ **Stat Cards** - Trend indicators ("from last week")
✅ **Level Labels** - Beginner, Intermediate, Advanced

## Next Steps

1. **Get Authentic Translations**: Work with Indigenous language speakers/experts to provide accurate translations for all keys in:
   - `frontend/src/utils/i18n.ts`
   - Specifically the `cr`, `oj`, `iu`, and `moh` language objects

2. **Translation Keys Structure**:
   - `nav.*` - Navigation items
   - `dashboard.*` - Dashboard content
   - `settings.*` - Settings page
   - `common.*` - Common UI elements

3. **Example of What Needs Translation**:
   ```typescript
   cr: {
     'dashboard.welcome': 'ᑕᓂᓯ', // ✅ This is correct (Tānisi = Hello)
     'dashboard.wordsLearned': 'ᐊᐧᐸᐢᑭᐦᐊᐧᐠ', // ❌ Placeholder - needs real translation
     // ... all other keys need authentic Cree translations
   }
   ```

## How to Add Translations

1. Open `frontend/src/utils/i18n.ts`
2. Find the language object (e.g., `cr`, `oj`, `iu`, `moh`)
3. Replace placeholder text with authentic translations
4. Test in the app by switching languages

## Important

- All infrastructure is in place - just need authentic translations
- The app will fall back to English if a translation key is missing
- Ensure cultural appropriateness and accuracy of all translations
- Consider regional dialects when providing translations

