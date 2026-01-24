// Story type definitions
export interface Story {
  story_id: string;
  language: string;
  title: string;
  level: string;
  scenes: StoryScene[];
}

export interface StoryScene {
  id: string;
  order: number;
  text: string;
  text_translation?: string;
  image_url?: string;
  audio_url?: string;
  choices?: Choice[];
  interaction_type: 'choice' | 'voice_response' | 'continue';
}

export interface Choice {
  id: string;
  text: string;
  text_translation?: string;
  next_scene: string;
  voice_prompt?: string;
}

