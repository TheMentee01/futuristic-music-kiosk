export interface PricingTier {
    id: string;
    name: string;
    price: number;
    songCreations: number;
    maxRecordingSeconds: number;
    features: string[];
    isPopular?: boolean;
    isBestValue?: boolean;
    isDemo?: boolean;
}

export interface VoiceRecording {
    id: string;
    blob: Blob;
    url: string;
    base64: string;
}

export interface SongDescription {
    prompt: string;
    genres: string[];
    mood: string;
    duration: number;
    lyrics: string;
    isInstrumental: boolean;
    generationMode: 'creator' | 'express' | 'instrumentals';
    isAiEnhanced?: boolean;
    isFancyMode?: boolean;
}

export interface Song {
    id: string;
    title: string;
    audioUrl: string;
    imageUrl: string;
    description: Omit<SongDescription, 'generationMode'>;
    tier: PricingTier;
}

export interface InstrumentalRequest {
    prompt: string;
    isAiEnhanced: boolean;
    isFancyMode: boolean;
}

export interface ExpressRequest {
    prompt: string;
    isAiEnhanced: boolean;
    isFancyMode: boolean;
    isInstrumental: boolean;
}

export interface ContactInfo {
    name: string;
    email: string;
    phone?: string;
}

export interface Session {
    id: string;
    contactInfo: ContactInfo;
    song: Song;
    status: 'Pending' | 'Sent';
}

export interface KioskFeatures {
  voiceCreations: boolean;
  instrumentals: boolean;
  express: boolean;
  freeDemo: boolean;
  aiEnhance: boolean;
  voiceCloning: boolean;
}

export interface KioskSettings {
  defaultDuration: number;
  maxVoiceRecording: number;
  adminPin: string;
  businessEmail: string;
  cashAppTag: string;
}

export interface Mood {
    name: string;
    emoji: string;
}