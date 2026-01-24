# Language Features Documentation

## Overview
TurtleTalk supports bilingual UI (English/French) and multiple Indigenous languages for learning content. The language system is designed to be flexible and culturally respectful.

## Supported Languages

### UI Languages (Interface)
- **English** (en) - Default interface language
- **French** (fr) - French interface language

### Learning Languages (Indigenous)
- **Cree** (cr) - ᓀᐦᐃᔭᐍᐏᐣ (Nēhiyawēwin)
- **Ojibwe** (oj) - ᐊᓂᔑᓈᐯᒧᐎᓐ (Anishinaabemowin)
- **Inuktitut** (iu) - ᐃᓄᒃᑎᑐᑦ
- **Mohawk** (moh) - Kanien'kéha

## Components

### LanguageProvider
Wraps the app and provides language context to all components.

```tsx
import { LanguageProvider } from './contexts/LanguageContext';

<LanguageProvider>
  <App />
</LanguageProvider>
```

### useLanguage Hook
Access language state and functions in any component.

```tsx
import { useLanguage } from '../contexts/LanguageContext';

const { 
  uiLanguage,        // Current UI language (en/fr)
  learningLanguage,  // Language being learned (Indigenous)
  setUILanguage,     // Change UI language
  setLearningLanguage, // Change learning language
  translate,         // Translate UI text
} = useLanguage();
```

### LanguageSwitcher
Component to switch between UI and learning languages.

```tsx
import { LanguageSwitcher } from './components/Language/LanguageSwitcher';

<LanguageSwitcher 
  showLabel={true} 
  variant="both" // 'ui', 'learning', or 'both'
/>
```

### TranslationDisplay
Display Indigenous language text with English/French translation.

```tsx
import { TranslationDisplay } from './components/Language/TranslationDisplay';

<TranslationDisplay
  text="Tānisi! Niya Miyo nitisiyihkāson."
  translation="Hello! My name is Miyo."
  language="cr"
  showTranslation={true}
  onPlayAudio={() => playAudio()}
  size="large"
/>
```

### BilingualText
Display text with expandable translation.

```tsx
import { BilingualText } from './components/Language/BilingualText';

<BilingualText
  primaryText="Tānisi!"
  secondaryText="Hello!"
  primaryLanguage="cr"
  secondaryLanguage="en"
  showToggle={true}
  defaultExpanded={false}
/>
```

## Usage Examples

### Translating UI Text
```tsx
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { translate } = useLanguage();
  
  return (
    <Typography>{translate('dashboard.welcome')}</Typography>
  );
}
```

### Displaying Indigenous Language Content
```tsx
import { TranslationDisplay } from './components/Language/TranslationDisplay';

function StoryComponent({ story }) {
  return (
    <TranslationDisplay
      text={story.text}
      translation={story.text_translation}
      language={story.language}
      showTranslation={true}
    />
  );
}
```

### Switching Languages
```tsx
import { useLanguage } from '../contexts/LanguageContext';

function LanguageSelector() {
  const { setUILanguage, setLearningLanguage } = useLanguage();
  
  return (
    <>
      <Button onClick={() => setUILanguage('fr')}>
        Switch to French
      </Button>
      <Button onClick={() => setLearningLanguage('cr')}>
        Learn Cree
      </Button>
    </>
  );
}
```

## Translation Keys

Add new translations in `src/utils/i18n.ts`:

```typescript
export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    'my.new.key': 'English text',
  },
  fr: {
    'my.new.key': 'Texte français',
  },
  // ... other languages
};
```

## Language Persistence

Language preferences are automatically saved to localStorage:
- `ui_language` - UI language preference
- `learning_language` - Learning language preference

## Best Practices

1. **Always use translate() for UI text** - Never hardcode UI strings
2. **Use TranslationDisplay for Indigenous content** - Shows respect and provides context
3. **Support both UI languages** - Ensure all UI text has English and French translations
4. **Show native names** - Display Indigenous language names in their native script
5. **Provide translations** - Always include English/French translations for Indigenous content

## Future Enhancements

- [ ] Add more Indigenous languages
- [ ] Support for regional dialects
- [ ] Voice synthesis in Indigenous languages
- [ ] Keyboard input for syllabic scripts
- [ ] Language detection from user input
- [ ] Community-contributed translations

