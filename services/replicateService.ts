import { PRODUCTION_CONFIG } from '../constants';

const REPLICATE_API_URL = 'https://api.replicate.com/v1';
const API_KEY = PRODUCTION_CONFIG.API_KEYS.REPLICATE;

/**
 * Replicate API Service - Optimized for Production
 */

// Centralized fetch logic with improved error handling
async function fetchReplicate(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${REPLICATE_API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Authorization': `Token ${API_KEY}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Replicate API Error:', errorData);
        throw new Error(errorData.detail || 'Replicate API request failed');
    }

    return response.json();
}

// Test API connection
export async function testReplicateApiKey(): Promise<boolean> {
  try {
    await fetchReplicate('/models');
    return true;
  } catch (error) {
    console.error('Replicate API test failed:', error);
    return false;
  }
}

// VOICE CLONING - Clone any voice for custom vocals
export async function cloneVoice(audioSample: string, text: string): Promise<string> {
  if (PRODUCTION_CONFIG.DEBUG) console.log('🎤 Cloning voice with Replicate...');
  const prediction = await fetchReplicate('/predictions', {
    method: 'POST',
    body: JSON.stringify({
      version: 'suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787',
      input: {
        prompt: text,
        history_prompt: 'speaker_9', // Can be customized
      },
    }),
  });
  return prediction.id;
}

// MUSIC VIDEO - Generate video from audio + images
export async function generateMusicVideoWithReplicate(audioUrl: string, prompts: string[], style: string = 'cinematic'): Promise<string> {
  if (PRODUCTION_CONFIG.DEBUG) console.log('🎬 Generating music video with Replicate...');
  // Deforum model expects prompts as a pipe-separated string
  const animationPrompts = `0: ${prompts.join(' | ')}, ${style}`;
  
  const prediction = await fetchReplicate('/predictions', {
    method: 'POST',
    body: JSON.stringify({
      version: 'deforum/deforum_stable_diffusion:e202340534604803108c848603613271545efca151187e1494191839e1a8b5e4',
      input: {
        audio: audioUrl,
        animation_prompts: animationPrompts,
        fps: 24,
        max_frames: 240,
      },
    }),
  });
  return prediction.id;
}

// ALBUM COVER - Generate cover art for tracks
export async function generateAlbumCover(trackTitle: string, artistName: string, style: string = 'hip-hop'): Promise<string> {
  if (PRODUCTION_CONFIG.DEBUG) console.log('🎨 Generating album cover...');
  const prompt = `Album cover for "${trackTitle}" by ${artistName}, ${style} style, professional, high quality, 4K`;
  
  const prediction = await fetchReplicate('/predictions', {
    method: 'POST',
    body: JSON.stringify({
      version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      input: {
        prompt: prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
      },
    }),
  });
  return prediction.id;
}

// AUDIO ENHANCEMENT - Improve audio quality
export async function enhanceAudio(audioUrl: string): Promise<string> {
  if (PRODUCTION_CONFIG.DEBUG) console.log('🎚️ Enhancing audio quality...');
  
  const prediction = await fetchReplicate('/predictions', {
    method: 'POST',
    body: JSON.stringify({
      version: 'adobe/enhance-speech:6a6362a4a34015640134442657d4760d62a26537b86422f258ce882352b2c5e5',
      input: {
        audio: audioUrl,
      },
    }),
  });
  return prediction.id;
}

// POLL PREDICTION STATUS
export async function pollReplicatePrediction(predictionId: string): Promise<any> {
  let attempts = 0;
  const maxAttempts = 60; // 3 minutes max
  
  while (attempts < maxAttempts) {
    try {
      const prediction = await fetchReplicate(`/predictions/${predictionId}`);
      if (PRODUCTION_CONFIG.DEBUG) console.log(`📊 Prediction status [${attempts+1}/${maxAttempts}]: ${prediction.status}`);

      if (prediction.status === 'succeeded') {
        if (PRODUCTION_CONFIG.DEBUG) console.log('✅ Prediction complete!');
        return prediction.output;
      }
      if (prediction.status === 'failed') {
        throw new Error(prediction.error || 'Prediction failed');
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
    } catch (error) {
      console.error('Polling error:', error);
      if (attempts >= maxAttempts - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
    }
  }

  throw new Error('Prediction timeout');
}

export default {
  testReplicateApiKey,
  cloneVoice,
  generateMusicVideoWithReplicate,
  generateAlbumCover,
  enhanceAudio,
  pollReplicatePrediction
};