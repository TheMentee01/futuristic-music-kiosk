import { GoogleGenAI } from "@google/genai";
import { PRODUCTION_CONFIG } from '../constants';

const API_KEY = PRODUCTION_CONFIG.API_KEYS.GEMINI;

/**
 * Gemini API Service - Optimized for Production
 */

// Singleton instance of the GoogleGenAI class
let ai: GoogleGenAI | null = null;
const getAi = () => {
    if (!ai) {
        if (!API_KEY) {
            throw new Error("Gemini API key is not configured.");
        }
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
};

// Test API key validity by listing models
export async function testGeminiApiKey(): Promise<boolean> {
  try {
    const genAI = getAi();
    // A simple, non-costly call to verify the key
    const result = await genAI.models.list();
    return !!result.models;
  } catch (error) {
    console.error('Gemini API test failed:', error);
    return false;
  }
}

// Enhance track description with AI using the Gemini 2.5 Pro model
export async function enhanceTrackDescription(
  prompt: string
): Promise<string> {
  try {
    const genAI = getAi();
    const response = await genAI.models.generateContent({
        model: "gemini-2.5-pro", // Upgraded to Pro model for paid tier
        contents: `Enhance this music track description with more creative and specific details while keeping it under 200 characters:\n\n"${prompt}"`
    });
    
    const enhancedText = response.text;
    return enhancedText.trim() || prompt;

  } catch (error) {
    console.error('Description enhancement error:', error);
    return prompt; // Return original if enhancement fails
  }
}

// Future: Generate music video from audio + images
export async function generateMusicVideo(
  audioUrl: string,
  images: string[],
  style?: string
): Promise<string> {
  if (PRODUCTION_CONFIG.DEBUG) {
    console.log('🎬 Music Video Generation (Coming Soon)');
    console.log('Audio:', audioUrl, 'Images:', images, 'Style:', style);
  }
  throw new Error('Music video generation not yet implemented');
}

// Future: Generate lyric video
export async function generateLyricVideo(
  audioUrl: string,
  lyrics: string,
  visualStyle?: string
): Promise<string> {
  if (PRODUCTION_CONFIG.DEBUG) {
    console.log('📝 Lyric Video Generation (Coming Soon)');
    console.log('Audio:', audioUrl, 'Lyrics:', lyrics, 'Style:', visualStyle);
  }
  throw new Error('Lyric video generation not yet implemented');
}

// Future: Generate scene images from audio analysis
export async function generateSceneImagesFromAudio(
  audioUrl: string,
  sceneCount: number = 4
): Promise<string[]> {
  if (PRODUCTION_CONFIG.DEBUG) {
    console.log('🎨 Scene Generation (Coming Soon)');
    console.log('Audio:', audioUrl, 'Scene count:', sceneCount);
  }
  throw new Error('Scene generation not yet implemented');
}

export default {
  testGeminiApiKey,
  generateMusicVideo,
  generateLyricVideo,
  generateSceneImagesFromAudio,
  enhanceTrackDescription
};