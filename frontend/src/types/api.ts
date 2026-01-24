// API type definitions
export interface VoiceTranscriptionResponse {
  transcription: string;
  confidence: number;
  language_detected?: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: any;
}

