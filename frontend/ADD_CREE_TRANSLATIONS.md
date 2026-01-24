# How to Add Cree Translations

## Option 1: Fill the Template (Easiest)

1. Open `CREE_TRANSLATIONS_TEMPLATE.md`
2. Fill in each translation
3. Tell me when it's done
4. I'll add them to the app

## Option 2: Provide Translations Directly

You can provide translations in any format. For example:

```
"Welcome back" = "Tānisi"
"Words Learned" = "your Cree translation here"
"Stories Completed" = "your Cree translation here"
...
```

Or as a list:
- Dashboard → [Cree word]
- Courses → [Cree word]
- Settings → [Cree word]
...

## Option 3: Use a Translation Service

If you have access to:
- A Cree language speaker
- A translation service
- Online Cree dictionaries
- Community resources

You can get translations from them and provide them to me in any format.

## What I Need

For each English phrase, I need the Cree equivalent. The phrases are:
- Navigation items (Dashboard, Courses, Community, Settings)
- Dashboard content (Welcome back, Words Learned, etc.)
- Common UI elements (Save, Cancel, etc.)
- Settings page content

## Once You Provide Translations

Just tell me "here are the translations" and provide them in any format. I'll:
1. Add them to `frontend/src/utils/i18n.ts`
2. Test that they display correctly
3. Make sure the entire UI shows in Cree when selected

## Quick Start

If you want to start with just the most important ones, prioritize:
1. Navigation (Dashboard, Courses, Community, Settings)
2. Dashboard welcome message
3. Common buttons (Save, Cancel, etc.)

Then we can add the rest gradually.

