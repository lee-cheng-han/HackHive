// Sample data for Indigenous language learning community
export interface CommunityUser {
  id: string;
  name: string;
  avatar?: string;
  languages: string[];
  level: 'beginner' | 'intermediate' | 'advanced' | 'fluent';
  nation: string;
  joinedDate: string;
  bio: string;
  isElder: boolean;
  isLanguageKeeper: boolean;
}

export interface CommunityStory {
  id: string;
  title: string;
  titleCree: string;
  content: string;
  contentCree: string;
  author: CommunityUser;
  language: string;
  category: 'traditional' | 'personal' | 'teaching' | 'legend' | 'history';
  audioUrl?: string;
  createdAt: string;
  likes: number;
  comments: CommunityComment[];
  culturalContext: string;
  tags: string[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'language_circle' | 'storytelling' | 'cultural_celebration' | 'workshop' | 'ceremony';
  date: string;
  time: string;
  duration: string;
  location: 'virtual' | 'hybrid' | 'in_person';
  maxParticipants?: number;
  currentParticipants: number;
  host: {
    name: string;
    nation: string;
    isElder: boolean;
    avatar?: string;
  };
  language: string;
  registrationRequired: boolean;
  isRecurring: boolean;
  tags: string[];
}

export interface CommunityComment {
  id: string;
  user: CommunityUser;
  content: string;
  createdAt: string;
  replies?: CommunityComment[];
}

export interface LanguageExchange {
  id: string;
  title: string;
  description: string;
  host: CommunityUser;
  participants: CommunityUser[];
  maxParticipants: number;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  type: 'conversation' | 'pronunciation' | 'storytelling' | 'translation';
  scheduledTime: string;
  status: 'open' | 'full' | 'active' | 'completed';
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: CommunityUser;
  category: 'grammar' | 'pronunciation' | 'culture' | 'translation' | 'general';
  language: string;
  createdAt: string;
  replies: CommunityComment[];
  views: number;
  isSticky: boolean;
  isPinned: boolean;
}

export interface TranslationProject {
  id: string;
  title: string;
  description: string;
  originalText: string;
  originalLanguage: string;
  targetLanguage: string;
  coordinator: CommunityUser;
  contributors: CommunityUser[];
  currentProgress: number;
  deadline?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'literature' | 'legal' | 'educational' | 'cultural' | 'medical';
  status: 'open' | 'in_progress' | 'review' | 'completed';
}

// Sample Users - representing diverse Indigenous communities
export const sampleUsers: CommunityUser[] = [
  {
    id: 'user-1',
    name: 'Mary Sinclair',
    languages: ['Plains Cree', 'English'],
    level: 'fluent',
    nation: 'Mistissini Cree Nation',
    joinedDate: '2023-08-15',
    bio: 'Cree language teacher and cultural keeper. I love sharing traditional stories with the next generation.',
    isElder: true,
    isLanguageKeeper: true,
  },
  {
    id: 'user-2',
    name: 'Jordan Whitehorse',
    languages: ['Nehiyawewin', 'English'],
    level: 'intermediate',
    nation: 'Bigstone Cree Nation',
    joinedDate: '2023-10-02',
    bio: 'Learning my ancestral language after years away. Excited to reconnect with my roots!',
    isElder: false,
    isLanguageKeeper: false,
  },
  {
    id: 'user-3',
    name: 'Elder Robert Beargrease',
    languages: ['Woods Cree', 'English', 'French'],
    level: 'fluent',
    nation: 'Little Red River Cree Nation',
    joinedDate: '2023-06-20',
    bio: 'Traditional storyteller and language keeper. I believe every word saved is a piece of our culture preserved.',
    isElder: true,
    isLanguageKeeper: true,
  },
  {
    id: 'user-4',
    name: 'Sarah Lightning',
    languages: ['Plains Cree', 'English'],
    level: 'beginner',
    nation: 'Poundmaker Cree Nation',
    joinedDate: '2024-01-10',
    bio: 'New to learning Cree but passionate about connecting with my heritage.',
    isElder: false,
    isLanguageKeeper: false,
  },
  {
    id: 'user-5',
    name: 'David Okimaw',
    languages: ['Swampy Cree', 'English'],
    level: 'advanced',
    nation: 'Norway House Cree Nation',
    joinedDate: '2023-09-12',
    bio: 'PhD student researching Indigenous language revitalization. Happy to help with translation projects!',
    isElder: false,
    isLanguageKeeper: false,
  }
];

// Sample Stories with cultural context
export const sampleStories: CommunityStory[] = [
  {
    id: 'story-1',
    title: 'The Teaching of the Seven Fires',
    titleCree: 'nîso-kîkway kîskinohamâkêwin',
    content: 'This is a traditional teaching passed down through generations about the seven stages of life and the guidance each fire provides to our people.',
    contentCree: 'ôma kîskinohamâkêwin kâ-pê-sipwêhtêk ostês ohci tânisi êkwa nîso-kîkway kâ-isi-pimâtisiyânk êkwa tânisi kâ-isi-nakatamâkoyânk.',
    author: sampleUsers[2], // Elder Robert
    language: 'Plains Cree',
    category: 'teaching',
    createdAt: '2024-01-15',
    likes: 24,
    comments: [],
    culturalContext: 'The Seven Fires prophecy is a traditional teaching among many Anishinaabe peoples, including Cree nations. It speaks to seven epochs of time and the choices humans face.',
    tags: ['prophecy', 'traditional-teaching', 'seven-fires', 'wisdom'],
  },
  {
    id: 'story-2',
    title: 'My First Pow Wow',
    titleCree: 'nitam nîkamowîkamik',
    content: 'I want to share the story of attending my first pow wow and how the drumbeat awakened something deep in my spirit that had been sleeping.',
    contentCree: 'niwî-âcimostânaw tânisi kâ-nitam-itohteyan nîkamowîkamikohk êkwa tânisi mistikwask kâ-kî-kocistamawit niyicâhk ekoni kâ-kî-nipât.',
    author: sampleUsers[1], // Jordan
    language: 'Plains Cree',
    category: 'personal',
    createdAt: '2024-01-12',
    likes: 18,
    comments: [],
    culturalContext: 'Pow wows are important cultural gatherings that bring Indigenous communities together through dance, song, and ceremony.',
    tags: ['pow-wow', 'personal-story', 'cultural-awakening', 'ceremony'],
  },
  {
    id: 'story-3',
    title: 'Grandmother\'s Medicine Walk',
    titleCree: 'nôhkom opimohtewin maskihkîhk',
    content: 'Every spring, my grandmother would take us on a medicine walk to gather traditional plants and teach us their uses and the proper protocols.',
    contentCree: 'mihcêtwâw sîkwan, nôhkom kî-wîcinâkeônânaw maskihkiy-pimohtewinihk ka-mawasoyânk maskihkiya êkwa ka-kîskinamâkoyânk tânisi ka-âpacihtâyânk.',
    author: sampleUsers[0], // Mary
    language: 'Plains Cree',
    category: 'traditional',
    createdAt: '2024-01-08',
    likes: 31,
    comments: [],
    culturalContext: 'Traditional plant knowledge is sacred and has been passed down through generations. Each plant has specific uses and gathering protocols.',
    tags: ['traditional-medicine', 'plant-knowledge', 'grandmother', 'seasonal-practices'],
  }
];

// Sample Language Exchange Sessions
export const sampleLanguageExchanges: LanguageExchange[] = [
  {
    id: 'exchange-1',
    title: 'Beginner Cree Conversation Circle',
    description: 'A welcoming space for new learners to practice basic greetings, introductions, and everyday phrases in Plains Cree.',
    host: sampleUsers[0], // Mary
    participants: [sampleUsers[3], sampleUsers[1]], // Sarah, Jordan
    maxParticipants: 6,
    language: 'Plains Cree',
    level: 'beginner',
    type: 'conversation',
    scheduledTime: '2024-01-26T19:00:00Z',
    status: 'open',
  },
  {
    id: 'exchange-2',
    title: 'Traditional Story Pronunciation Practice',
    description: 'Practice pronouncing traditional Cree stories with guidance from fluent speakers. Great for improving accent and rhythm.',
    host: sampleUsers[2], // Elder Robert
    participants: [sampleUsers[1], sampleUsers[4]], // Jordan, David
    maxParticipants: 4,
    language: 'Woods Cree',
    level: 'intermediate',
    type: 'pronunciation',
    scheduledTime: '2024-01-27T14:00:00Z',
    status: 'open',
  },
  {
    id: 'exchange-3',
    title: 'Collaborative Translation Workshop',
    description: 'Working together to translate important community documents from English to Cree while maintaining cultural accuracy.',
    host: sampleUsers[4], // David
    participants: [sampleUsers[0], sampleUsers[2]], // Mary, Elder Robert
    maxParticipants: 5,
    language: 'Swampy Cree',
    level: 'advanced',
    type: 'translation',
    scheduledTime: '2024-01-28T16:00:00Z',
    status: 'full',
  }
];

// Sample Discussion Forum Posts
export const sampleDiscussions: Discussion[] = [
  {
    id: 'discussion-1',
    title: 'How do you handle vowel length in different Cree dialects?',
    content: 'I\'ve been learning Plains Cree but I\'m hearing different vowel pronunciations when talking with speakers from other regions. Can anyone explain the dialectical differences?',
    author: sampleUsers[1], // Jordan
    category: 'pronunciation',
    language: 'Plains Cree',
    createdAt: '2024-01-20',
    replies: [],
    views: 47,
    isSticky: false,
    isPinned: false,
  },
  {
    id: 'discussion-2',
    title: 'Seeking help with animate/inanimate noun classification',
    content: 'I\'m struggling to understand when nouns are considered animate vs inanimate in Cree. Are there any patterns or cultural concepts I should understand?',
    author: sampleUsers[3], // Sarah
    category: 'grammar',
    language: 'Plains Cree',
    createdAt: '2024-01-18',
    replies: [],
    views: 62,
    isSticky: false,
    isPinned: true,
  },
  {
    id: 'discussion-3',
    title: 'Traditional naming ceremonies and their linguistic significance',
    content: 'I\'m curious about the role of language in traditional Cree naming ceremonies. How do names connect to identity and spiritual beliefs?',
    author: sampleUsers[4], // David
    category: 'culture',
    language: 'Plains Cree',
    createdAt: '2024-01-16',
    replies: [],
    views: 89,
    isSticky: true,
    isPinned: false,
  }
];

// Sample Translation Projects
export const sampleTranslationProjects: TranslationProject[] = [
  {
    id: 'translation-1',
    title: 'Community Health Resources',
    description: 'Translating essential health information and COVID-19 safety guidelines into Plains Cree for community distribution.',
    originalText: 'Public Health Guidelines for Community Safety',
    originalLanguage: 'English',
    targetLanguage: 'Plains Cree',
    coordinator: sampleUsers[4], // David
    contributors: [sampleUsers[0], sampleUsers[2]], // Mary, Elder Robert
    currentProgress: 75,
    deadline: '2024-02-15',
    priority: 'high',
    category: 'medical',
    status: 'in_progress',
  },
  {
    id: 'translation-2',
    title: 'Traditional Stories Collection',
    description: 'Preserving traditional oral stories by transcribing them in both Cree syllabics and Roman orthography.',
    originalText: 'Collection of Traditional Cree Stories',
    originalLanguage: 'Woods Cree (oral)',
    targetLanguage: 'Written Cree',
    coordinator: sampleUsers[2], // Elder Robert
    contributors: [sampleUsers[0], sampleUsers[1]], // Mary, Jordan
    currentProgress: 40,
    priority: 'urgent',
    category: 'cultural',
    status: 'open',
  },
  {
    id: 'translation-3',
    title: 'Educational Materials for Children',
    description: 'Creating age-appropriate learning materials in Cree for elementary school children to connect with their heritage.',
    originalText: 'Elementary Learning Curriculum',
    originalLanguage: 'English',
    targetLanguage: 'Plains Cree',
    coordinator: sampleUsers[0], // Mary
    contributors: [sampleUsers[3]], // Sarah
    currentProgress: 20,
    deadline: '2024-03-01',
    priority: 'medium',
    category: 'educational',
    status: 'open',
  }
];