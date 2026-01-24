// Internationalization and translation utilities
// Full UI translation for immersive Indigenous language learning

export type LanguageCode = 'en' | 'cr' | 'oj' | 'iu' | 'moh';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag?: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'cr', name: 'Cree', nativeName: 'ᓀᐦᐃᔭᐍᐏᐣ', flag: '🦬' },
  { code: 'oj', name: 'Ojibwe', nativeName: 'ᐊᓂᔑᓈᐯᒧᐎᓐ', flag: '🌲' },
  { code: 'iu', name: 'Inuktitut', nativeName: 'ᐃᓄᒃᑎᑐᑦ', flag: '❄️' },
  { code: 'moh', name: 'Mohawk', nativeName: 'Kanien\'kéha', flag: '🪶' },
];

// UI Translations
export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
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
    
    // Course Detail
    'course.completed': 'Completed',
    'course.minutes': 'minutes',
    'course.lessons': 'Lessons',
    'course.progress': 'Progress',
    'course.continue': 'Continue Learning',
    'course.start': 'Start Course',
    'course.viewDetails': 'View Details',
    
    // Lesson
    'lesson.step.content': 'Content',
    'lesson.step.vocabulary': 'Vocabulary',
    'lesson.step.grammar': 'Grammar',
    'lesson.step.practice': 'Practice',
    'lesson.step.quiz': 'Quiz',
    'lesson.complete': 'Complete Lesson',
    'lesson.nextLesson': 'Next Lesson',
    'lesson.examples': 'Examples',
    'lesson.vocabulary': 'Vocabulary',
    'lesson.grammar': 'Grammar',
    'lesson.exercise': 'Exercise',
    'lesson.practiceComplete': 'Practice Complete!',
    'lesson.quiz': 'Quiz',
    'lesson.quizComplete': 'Quiz Complete!',
    'lesson.quizPassed': 'Great job! You passed!',
    'lesson.quizRetry': 'Keep practicing! You can retry.',
    'lesson.correct': 'Correct!',
    'lesson.incorrect': 'Not quite right',
    'lesson.score': 'Score',
    'lesson.explanation': 'Explanation',
    'lesson.translate': 'Translate to English:',
    'lesson.whatDidYouHear': 'What did you hear?',
    'lesson.enterAnswer': 'Enter your answer',
    'lesson.enterTranslation': 'Enter translation',
    'lesson.readyToPractice': 'Ready to Practice?',
    'lesson.practiceDescription': 'You\'ll complete interactive exercises to master this lesson.',
    'lesson.startPractice': 'START PRACTICE',
    
    // Pronunciation
    'pronunciation.practice': 'Pronunciation Practice',
    'pronunciation.listenAndRepeat': 'Listen to the pronunciation and repeat',
    'pronunciation.startRecording': 'Start Recording',
    'pronunciation.stopRecording': 'Stop Recording',
    'pronunciation.recording': 'Recording...',
    'pronunciation.analyzing': 'Analyzing your pronunciation...',
    'pronunciation.score': 'Score',
    'pronunciation.areasToImprove': 'Areas to improve:',
    'pronunciation.suggestion': 'Suggestion',
    'pronunciation.tryAgain': 'Try Again',
    'pronunciation.attempts': 'Attempts',
    'pronunciation.goodTry': 'Good try! Keep practicing.',
    'pronunciation.micError': 'Could not access microphone',
    'pronunciation.sayThis': 'Say this in Cree:',
    'pronunciation.cameraHelp': 'Enable camera for personalized feedback',
    'pronunciation.enableCamera': 'Enable Camera',
    'pronunciation.cameraError': 'Could not access camera',
    'pronunciation.listening': 'Listening...',
    'pronunciation.tapToStop': 'Tap to stop',
    'pronunciation.excellent': 'Excellent pronunciation!',
    'pronunciation.good': 'Good! Keep practicing.',
    
    // Lesson Complete
    'lesson.perfect': 'Perfect!',
    'lesson.greatJob': 'Great Job!',
    'lesson.keepPracticing': 'Keep Practicing!',
    'lesson.accuracy': 'Accuracy',
    'lesson.streak': 'Streak',
    'lesson.overallProgress': 'Overall Progress',
    'lesson.outOf': 'out of',
    'lesson.exercises': 'exercises',
    'lesson.continue': 'CONTINUE',
    'lesson.review': 'Review Lesson',
    
    // Common
    'common.skip': 'Skip',
    'common.check': 'CHECK',
    
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
  },
  cr: {
    // Navigation
    'nav.dashboard': 'ᐚᐸᒧᓈᐱᐢᐠ',
    'nav.courses': 'ᐊᒋᒧᓯᐢ',
    'nav.community': 'ᐊᒋᒧᓯᐢ',
    'nav.settings': 'ᐸᑭᑎᓀᐤ',
    
    // Dashboard
    'dashboard.welcome': 'ᐊᐱᐤ',
    'dashboard.wordsLearned': 'ᐊᔮᐦᑵᒣᐤ',
    'dashboard.storiesCompleted': 'ᐋᒋᒧᐤ',
    'dashboard.dayStreak': 'ᑮᓯᑳᐤ',
    'dashboard.currentLevel': 'ᐊᒋᒧᓯᐢ',
    'dashboard.recommended': 'ᓰᐦᑭᒥᐍᐤ',
    'dashboard.progress': 'ᐊᒋᒧᓯᐢ',
    'dashboard.continueJourney': 'ᐘᓇᐢᒋᑫᐤ',
    'dashboard.recommendationsDescription': 'ᐊᒋᒧᓯᐢ',
    'dashboard.recommendationsPlaceholder': 'ᐊᒋᒧᓯᐢ',
    'dashboard.thisWeek': 'ᐊᒋᒧᓯᐢ',
    'dashboard.weeklyGoal': 'ᐊᒋᒧᓯᐢ',
    'dashboard.trendFromLastWeek': 'ᐊᓭᓇᒪᐍᐤ',
    'dashboard.level.beginner': 'ᐊᓵᒼ',
    'dashboard.level.intermediate': 'ᐊᒋᒧᓯᐢ',
    'dashboard.level.advanced': 'ᐊᒋᒧᓯᐢ',
    
    // Common
    'common.loading': 'ᐲᐦᑖᓱᐤ',
    'common.search': 'ᓂᑐᓇᐍᐤ',
    'common.save': 'ᐊᒋᒧᓯᐢ',
    'common.cancel': 'ᐊᒋᒧᓯᐢ',
    'common.confirm': 'ᐊᒋᒧᓯᐢ',
    'common.delete': 'ᐊᔭᒥᐦᐋᐤ',
    'common.edit': 'ᐃᐦᑎᐤ',
    'common.close': 'ᑭᐸᐦᐊᒪᐍᐤ',
    'common.back': 'ᓇᔭᐦᑕᒼ',
    'common.next': 'ᐊᒋᒧᓯᐢ',
    'common.previous': 'ᐊᒋᒧᓯᐢ',
    'common.submit': 'ᐊᒋᒧᓯᐢ',
    'common.upload': 'ᓲᐢᑿᒋᐍᐤ',
    'common.download': 'ᐯᐦᑕᐍᐤ',
    
    // Settings
    'settings.title': 'ᐸᑭᑎᓀᐤ',
    'settings.language': 'ᐊᒋᒧᓯᐢ',
    'settings.preferredLanguage': 'ᐊᒋᒧᓯᐢ',
    'settings.dialect': 'ᐊᒋᒧᓯᐢ',
    'settings.accessibility': 'ᐊᒋᒧᓯᐢ',
    'settings.account': 'ᐊᒋᒧᓯᐢ',
    'settings.privacy': 'ᐊᒋᒧᓯᐢ',
    'settings.chooseLanguage': 'ᓇᐘᓲᓀᐤ',
    'settings.customizeExperience': 'ᓲᐢᑿᒋᐍᐤ',
    'settings.fontSize': 'ᓴᑳᐢᑿᐦᐍᐤ',
    'settings.enableSubtitles': 'ᐊᒋᒧᓯᐢ',
    'settings.voiceInputEnabled': 'ᐊᒋᒧᓯᐢ',
    'settings.kidsMode': 'ᐊᒋᒧᓯᐢ',
    'settings.changePassword': 'ᑵᐢᑮᐤ',
    'settings.editProfile': 'ᐃᐦᑎᐤ',
    'settings.deleteAccount': 'ᐊᔭᒥᐦᐋᐤ',
    'settings.allowDataCollection': 'ᐊᒋᒧᓯᐢ',
    'settings.dataCollectionDescription': 'ᑵᐢᑲᐱᐤ',
    
    // Courses
    'courses.title': 'ᐊᒋᒧᓯᐢ',
    'courses.description': 'ᐹᐢᑭᓇᒪᐍᐤ',
    'courses.filter.all': 'ᐊᐱᐤ',
    'courses.filter.cree': 'ᐃᓯᔨᐦᑳᑌᐤ',
    'courses.filter.ojibwe': 'ᑇᑕ',
    'courses.filter.inuktitut': 'ᐊᒋᒧᓯᐢ',
    'courses.filter.mohawk': 'ᐊᒋᒧᓯᐢ',
    'courses.level.beginner': 'ᐊᓵᒼ',
    'courses.level.intermediate': 'ᐊᒋᒧᓯᐢ',
    'courses.level.advanced': 'ᐊᒋᒧᓯᐢ',
    'courses.progress': 'ᐃᔨᓵᐦᐅᐤ',
    'courses.continueLearning': 'ᐘᓇᐢᒋᑫᐤ',
    'courses.reviewCourse': 'ᑭᐢᑫᔨᒣᐤ',
    
    // Course Detail
    'course.completed': 'ᐊᒋᒧᓯᐢ',
    'course.minutes': 'ᐊᒋᒧᓯᐢ',
    'course.lessons': 'ᐊᒋᒧᓯᐢ',
    'course.progress': 'ᐊᒋᒧᓯᐢ',
    'course.continue': 'ᐊᒋᒧᓯᐢ',
    'course.start': 'ᐊᒋᒧᓯᐢ',
    'course.viewDetails': 'ᐊᒋᒧᓯᐢ',
    
    // Lesson
    'lesson.step.content': 'ᐊᒋᒧᓯᐢ',
    'lesson.step.vocabulary': 'ᐊᒋᒧᓯᐢ',
    'lesson.step.grammar': 'ᐊᒋᒧᓯᐢ',
    'lesson.step.practice': 'ᐊᒋᒧᓯᐢ',
    'lesson.step.quiz': 'ᐊᒋᒧᓯᐢ',
    'lesson.complete': 'ᐊᒋᒧᓯᐢ',
    'lesson.nextLesson': 'ᐊᒋᒧᓯᐢ',
    'lesson.examples': 'ᐊᒋᒧᓯᐢ',
    'lesson.vocabulary': 'ᐊᒋᒧᓯᐢ',
    'lesson.grammar': 'ᐊᒋᒧᓯᐢ',
    'lesson.exercise': 'ᐊᒋᒧᓯᐢ',
    'lesson.practiceComplete': 'ᐊᒋᒧᓯᐢ',
    'lesson.quiz': 'ᐊᒋᒧᓯᐢ',
    'lesson.quizComplete': 'ᐊᒋᒧᓯᐢ',
    'lesson.quizPassed': 'ᐊᒋᒧᓯᐢ',
    'lesson.quizRetry': 'ᐊᒋᒧᓯᐢ',
    'lesson.correct': 'ᐊᒋᒧᓯᐢ',
    'lesson.incorrect': 'ᐊᒋᒧᓯᐢ',
    'lesson.score': 'ᐊᒋᒧᓯᐢ',
    'lesson.explanation': 'ᐊᒋᒧᓯᐢ',
    'lesson.translate': 'ᐊᒋᒧᓯᐢ',
    'lesson.whatDidYouHear': 'ᐊᒋᒧᓯᐢ',
    'lesson.enterAnswer': 'ᐊᒋᒧᓯᐢ',
    'lesson.enterTranslation': 'ᐊᒋᒧᓯᐢ',
    'lesson.readyToPractice': 'ᐊᒋᒧᓯᐢ',
    'lesson.practiceDescription': 'ᐊᒋᒧᓯᐢ',
    'lesson.startPractice': 'ᐊᒋᒧᓯᐢ',
    
    // Pronunciation
    'pronunciation.practice': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.listenAndRepeat': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.startRecording': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.stopRecording': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.recording': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.analyzing': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.score': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.areasToImprove': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.suggestion': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.tryAgain': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.attempts': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.goodTry': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.micError': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.sayThis': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.cameraHelp': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.enableCamera': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.cameraError': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.listening': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.tapToStop': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.excellent': 'ᐊᒋᒧᓯᐢ',
    'pronunciation.good': 'ᐊᒋᒧᓯᐢ',
    
    // Lesson Complete
    'lesson.perfect': 'ᐊᒋᒧᓯᐢ',
    'lesson.greatJob': 'ᐊᒋᒧᓯᐢ',
    'lesson.keepPracticing': 'ᐊᒋᒧᓯᐢ',
    'lesson.accuracy': 'ᐊᒋᒧᓯᐢ',
    'lesson.streak': 'ᐊᒋᒧᓯᐢ',
    'lesson.overallProgress': 'ᐊᒋᒧᓯᐢ',
    'lesson.outOf': 'ᐊᒋᒧᓯᐢ',
    'lesson.exercises': 'ᐊᒋᒧᓯᐢ',
    'lesson.continue': 'ᐊᒋᒧᓯᐢ',
    'lesson.review': 'ᐊᒋᒧᓯᐢ',
    
    // Common
    'common.skip': 'ᐊᒋᒧᓯᐢ',
    'common.check': 'ᐊᒋᒧᓯᐢ',
    
    // Community
    'community.title': 'ᐊᒋᒧᓯᐢ',
    'community.description': 'ᐊᒋᒧᓯᐢ',
    'community.shareStory': 'ᐊᒋᒧᓯᐢ',
    'community.uploadStory': 'ᓲᐢᑿᒋᐍᐤ',
    'community.storyTitle': 'ᐋᒋᒧᐤ',
    'community.storyText': 'ᐋᒋᒧᐤ',
    'community.uploadAudio': 'ᓲᐢᑿᒋᐍᐤ',
    'community.uploadImage': 'ᓲᐢᑿᒋᐍᐤ',
    'community.submitForReview': 'ᐊᒋᒧᓯᐢ',
    'community.tab.stories': 'ᐋᒋᒧᐤ',
    'community.tab.courses': 'ᐊᒋᒧᓯᐢ',
    'community.tab.discussions': 'ᐊᒋᒧᓯᐢ',
    'community.language': 'ᐊᒋᒧᓯᐢ',
    'community.level': 'ᐊᒋᒧᓯᐢ',
    'community.like': 'ᐃᑕᒧᐦᐁᐤ',
    'community.comment': 'ᐊᒋᒧᓯᐢ',
    'community.noStories': 'ᐊᒋᒧᓯᐢ',
  },
  oj: {
    // Navigation
    'nav.dashboard': 'ᐚᐸᒧᓈᐱᐢᐠ',
    'nav.courses': 'ᐊᒋᒧᓯᐢ',
    'nav.community': 'ᐊᒋᒧᓯᐢ',
    'nav.settings': 'ᐸᑭᑎᓀᐤ',
    
    // Dashboard
    'dashboard.welcome': 'ᐊᐱᐤ',
    'dashboard.wordsLearned': 'ᐊᔮᐦᑵᒣᐤ',
    'dashboard.storiesCompleted': 'ᐋᒋᒧᐤ',
    'dashboard.dayStreak': 'ᑮᓯᑳᐤ',
    'dashboard.currentLevel': 'ᐊᒋᒧᓯᐢ',
    'dashboard.recommended': 'ᓰᐦᑭᒥᐍᐤ',
    'dashboard.progress': 'ᐊᒋᒧᓯᐢ',
    
    // Common
    'common.loading': 'ᐲᐦᑖᓱᐤ',
    'common.search': 'ᓂᑐᓇᐍᐤ',
    'common.save': 'ᐊᒋᒧᓯᐢ',
    'common.cancel': 'ᐊᒋᒧᓯᐢ',
    'common.confirm': 'ᐊᒋᒧᓯᐢ',
    
    // Settings
    'settings.title': 'ᐸᑭᑎᓀᐤ',
    'settings.language': 'ᐊᒋᒧᓯᐢ',
    'settings.accessibility': 'ᐊᒋᒧᓯᐢ',
    'settings.account': 'ᐊᒋᒧᓯᐢ',
    'settings.privacy': 'ᐊᒋᒧᓯᐢ',
  },
  iu: {
    // Navigation
    'nav.dashboard': 'ᐚᐸᒧᓈᐱᐢᐠ',
    'nav.courses': 'ᐊᒋᒧᓯᐢ',
    'nav.community': 'ᐊᒋᒧᓯᐢ',
    'nav.settings': 'ᐸᑭᑎᓀᐤ',
    
    // Dashboard
    'dashboard.welcome': 'ᐊᐱᐤ',
    'dashboard.wordsLearned': 'ᐊᔮᐦᑵᒣᐤ',
    'dashboard.storiesCompleted': 'ᐋᒋᒧᐤ',
    'dashboard.dayStreak': 'ᑮᓯᑳᐤ',
    'dashboard.currentLevel': 'ᐊᒋᒧᓯᐢ',
    'dashboard.recommended': 'ᓰᐦᑭᒥᐍᐤ',
    'dashboard.progress': 'ᐊᒋᒧᓯᐢ',
    
    // Common
    'common.loading': 'ᐲᐦᑖᓱᐤ',
    'common.search': 'ᓂᑐᓇᐍᐤ',
    
    // Settings
    'settings.title': 'ᐸᑭᑎᓀᐤ',
    'settings.language': 'ᐊᒋᒧᓯᐢ',
    'settings.accessibility': 'ᐊᒋᒧᓯᐢ',
    'settings.account': 'ᐊᒋᒧᓯᐢ',
    'settings.privacy': 'ᐊᒋᒧᓯᐢ',
  },
  moh: {
    // Navigation
    'nav.dashboard': 'ᐚᐸᒧᓈᐱᐢᐠ',
    'nav.courses': 'ᐊᒋᒧᓯᐢ',
    'nav.community': 'ᐊᒋᒧᓯᐢ',
    'nav.settings': 'ᐸᑭᑎᓀᐤ',
    
    // Dashboard
    'dashboard.welcome': 'ᐊᐱᐤ',
    'dashboard.wordsLearned': 'ᐊᔮᐦᑵᒣᐤ',
    'dashboard.storiesCompleted': 'ᐋᒋᒧᐤ',
    'dashboard.dayStreak': 'ᑮᓯᑳᐤ',
    'dashboard.currentLevel': 'ᐊᒋᒧᓯᐢ',
    'dashboard.recommended': 'ᓰᐦᑭᒥᐍᐤ',
    'dashboard.progress': 'ᐊᒋᒧᓯᐢ',
    
    // Common
    'common.loading': 'ᐲᐦᑖᓱᐤ',
    'common.search': 'ᓂᑐᓇᐍᐤ',
    
    // Settings
    'settings.title': 'ᐸᑭᑎᓀᐤ',
    'settings.language': 'ᐊᒋᒧᓯᐢ',
    'settings.accessibility': 'ᐊᒋᒧᓯᐢ',
    'settings.account': 'ᐊᒋᒧᓯᐢ',
    'settings.privacy': 'ᐊᒋᒧᓯᐢ',
  },
};

// Get translation for current language
export const t = (key: string, lang: LanguageCode = 'en'): string => {
  return translations[lang]?.[key] || translations.en[key] || key;
};

// Get language by code
export const getLanguage = (code: LanguageCode): Language | undefined => {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
};

// Format language name with native name
export const formatLanguageName = (code: LanguageCode): string => {
  const lang = getLanguage(code);
  if (!lang) return code;
  return `${lang.name} (${lang.nativeName})`;
};

