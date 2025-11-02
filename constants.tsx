
import React from 'react';
import { PricingTier } from './types';

export const EXPRESS_PRICE = 15;
export const INSTRUMENTAL_PRICE = 25;

/**
 * =================================================================
 * PRODUCTION & ENVIRONMENT CONFIGURATION
 * =================================================================
 * In a real production environment, these keys would be stored securely
 * as environment variables and accessed via `process.env.VARIABLE_NAME`.
 * This structure prepares the app for that deployment pattern.
 */
export const PRODUCTION_CONFIG = {
  // Replace with process.env in a real backend/build environment
  API_KEYS: {
    SONAUTO: 'sksonauto_vy2menq8qHOQS3FSs35Lo_OtYeRF20rRkgl1kJJJhG1hJKW3', 
    GEMINI: process.env.API_KEY as string,
    REPLICATE: 'r8_aLbWV1bm5r0sdIMemto77dMwdi6HlO44VvZKg' 
  },
  ENVIRONMENT: 'development', // 'production' or 'development'
  get DEBUG() {
    return this.ENVIRONMENT !== 'production';
  },
  API_TIMEOUT: 45000, // 45 seconds
  MAX_RETRIES: 3,
};

export const API_STATUS = {
  SONAUTO: {
    tier: 'PAID',
    status: 'ACTIVE',
    limits: 'UNLIMITED',
    features: ['Premium Quality', 'Priority Queue', 'Commercial License']
  },
  GEMINI: {
    tier: 'PAID',
    status: 'ACTIVE',
    limits: '10,000+ per day',
    features: ['Pro Models', 'Video API', 'Priority Support']
  },
  REPLICATE: {
    tier: 'CREDIT',
    status: 'ACTIVE',
    credit: '$10.00',
    features: ['Voice Cloning', 'Music Videos', 'Album Covers', 'Audio Enhancement']
  }
};


export const REPLICATE_FEATURES = {
  VOICE_CLONING: {
    enabled: true,
    description: 'Clone any voice for custom vocals',
    cost: '~$0.02 per generation'
  },
  ALBUM_COVERS: {
    enabled: true,
    description: 'AI-generated album artwork',
    cost: '~$0.01 per image'
  },
  MUSIC_VIDEOS: {
    enabled: true,
    description: 'Generate music videos from audio',
    cost: '~$0.50 per video'
  },
  AUDIO_ENHANCEMENT: {
    enabled: true,
    description: 'Enhance audio quality',
    cost: '~$0.05 per track'
  }
};

export const FUTURE_FEATURES = {
  MUSIC_VIDEO_GENERATION: {
    enabled: false,
    comingSoon: true,
    description: 'Generate music videos from audio + images',
    estimatedRelease: 'Q1 2026'
  },
  LYRIC_VIDEO: {
    enabled: false,
    comingSoon: true,
    description: 'Animated lyric videos with AI visuals',
    estimatedRelease: 'Q1 2026'
  },
  SCENE_GENERATION: {
    enabled: false,
    comingSoon: true,
    description: 'AI-generated scenes matching audio mood',
    estimatedRelease: 'Q1 2026'
  },
  AI_DESCRIPTION_ENHANCE: {
    enabled: true, // Can enable this one now!
    comingSoon: false,
    description: 'AI-enhanced track descriptions'
  }
} as const;


export const DEMO_TIER: PricingTier = {
    id: 'tier-demo',
    name: 'Demo Version',
    price: 0,
    songCreations: 1,
    maxRecordingSeconds: 15,
    features: [
        '1 Song Creation (15s max)',
        'Limited to 15s Recording',
        'Standard MP3 Audio',
        'Upsell to full version',
    ],
    isDemo: true,
};

export const PRICING_TIERS: PricingTier[] = [
    {
        id: 'tier-spark',
        name: 'Spark',
        price: 10,
        songCreations: 1,
        maxRecordingSeconds: 90,
        features: [
            '1 Song Creation',
            'Up to 1:30 Recording',
            'Standard MP3 Audio',
        ],
    },
    {
        id: 'tier-creator',
        name: 'Creator',
        price: 25,
        songCreations: 3,
        maxRecordingSeconds: 300,
        features: [
            '3 Song Creations',
            'Up to 5 mins Recording',
            'High Quality Audio',
        ],
        isPopular: true,
    },
    {
        id: 'tier-producer-50',
        name: 'Producer',
        price: 50,
        songCreations: 5,
        maxRecordingSeconds: 600,
        features: [
            '5 Song Creations',
            'Extend Mode Feature',
            'Up to 10 mins Recording',
            'Studio Quality Audio',
        ],
    },
    {
        id: 'tier-1-new',
        name: 'Producer Pack',
        price: 100,
        songCreations: 15,
        maxRecordingSeconds: 600,
        features: [
            '15 Song Creations',
            'Up to 10 mins per recording',
            'Studio Quality Audio',
            'Full Stem & MIDI Exports',
            'Priority Queue Generation',
        ],
    },
    {
        id: 'tier-2-new',
        name: 'Studio Bundle',
        price: 250,
        songCreations: 35,
        maxRecordingSeconds: 900,
        features: [
            '35 Song Creations',
            'Up to 15 mins per recording',
            'Lossless Audio (FLAC)',
            'Top Priority Queue',
        ],
    },
    {
        id: 'tier-3-new',
        name: 'Industry Pro',
        price: 500,
        songCreations: 50,
        maxRecordingSeconds: Infinity,
        features: [
            '50 Song Creations',
            '3 Custom Album Covers',
            'Unlimited Recording Time',
            'Commercial Use License',
            '**CONTACT CEO RICH FOR MORE INFO...**',
        ],
        isBestValue: true,
    },
];

export const QUICK_PROMPTS = [
    "A synthwave track about driving through a neon city at night",
    "Acoustic folk song about a long journey home",
    "Energetic pop anthem for a summer festival",
    "Lo-fi hip hop beat for studying or relaxing",
];

export const QUICK_PROMPTS_EXPRESS = [
    { name: "Happy Pop", prompt: "A happy, upbeat pop song about summer vacation" },
    { name: "Sad Ballad", prompt: "A slow, emotional piano ballad about lost love" },
    { name: "Epic Trailer", prompt: "An epic, cinematic orchestral score for a movie trailer" },
    { name: "Chill Lo-fi", prompt: "A relaxing lo-fi hip hop track with vinyl crackle" },
];


export const GENRES = [
    'Pop', 'Rock', 'Hip-Hop', 'Electronic', 'R&B', 'Country', 'Jazz',
    'Classical', 'Reggae', 'Metal', 'Folk', 'Blues', 'Synthwave', 'Lo-fi'
];

export const MOODS = [
    { name: 'Happy', emoji: '😊' },
    { name: 'Sad', emoji: '😢' },
    { name: 'Energetic', emoji: '⚡' },
    { name: 'Relaxing', emoji: '😌' },
    { name: 'Epic', emoji: '웅' },
    { name: 'Romantic', emoji: '❤️' },
    { name: 'Dark', emoji: '💀' },
    { name: 'Upbeat', emoji: '🎶' },
];

// Icons
export const RecordIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10z"/>
    </svg>
);

export const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
    </svg>
);

export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
    </svg>
);

export const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
    </svg>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.226m-2.22 0a2.25 2.25 0 0 0-2.22 2.22c0 .593.235 1.155.636 1.562m12.132-1.562a2.25 2.25 0 0 1 2.22 2.22c0 .593-.235 1.155-.636 1.562m-2.22 0a2.25 2.25 0 0 0 2.22-2.22c0-.593-.235-1.155-.636-1.562M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-5.25 0s-1.176-1.126-2.5-1.126-2.5 1.126-2.5 1.126m4.333 3.571a4.5 4.5 0 0 1-6.666 0m1.167-3.571s-1.176 1.126-2.5 1.126-2.5-1.126-2.5-1.126" />
    </svg>
);

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
);

export const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

export const SparkleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

export const WrenchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.83-5.83M11.42 15.17l2.496-3.03c.317-.384.74-.664 1.21-.822l2.828-1.026A2.25 2.25 0 0 0 21 3l-2.25.002a2.25 2.25 0 0 0-1.026 2.828l-1.026 2.828c-.158.47-.438.893-.822 1.21l-3.03 2.496m-2.518-.542.94-1.146a2.25 2.25 0 0 0-3.182-3.182l-1.146.94m-2.518-.542-1.636 1.636a2.25 2.25 0 0 0 3.182 3.182l1.636-1.636m0 0-.94-1.146" />
    </svg>
);