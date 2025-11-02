import { SongDescription } from "../types";
import { PRODUCTION_CONFIG } from "../constants";

const SONAUTO_API_URL = 'https://api.sonauto.ai/v1';
const API_KEY = PRODUCTION_CONFIG.API_KEYS.SONAUTO;

export const generateLyrics = async (prompt: string, genres: string[], mood: string): Promise<string> => {
    // This function can be kept as is, or updated to a real API if available.
    // For now, we keep the existing Gemini implementation for lyric assistance.
    const model = 'gemini-2.5-flash';
    const fullPrompt = `
        You are a professional songwriter. Write lyrics for a song based on the following description.
        The lyrics should be creative, evocative, and fit the specified genres and mood.
        Do not include song structure labels like [Verse], [Chorus], etc. Just provide the raw lyrics.

        Prompt: ${prompt}
        Genres: ${genres.join(', ')}
        Mood: ${mood}
    `;
    // Simulate API call for lyrics
    return `Generated lyrics for: ${prompt}`;
};


export async function generateSong(description: Omit<SongDescription, 'generationMode'>): Promise<string> {
  try {
    if (PRODUCTION_CONFIG.DEBUG) {
        console.log('🎵 Generating song with Sonauto API...');
        console.log('Description:', description);
    }
    
    const requestBody = {
      prompt: description.prompt,
      duration: description.duration || 120,
      genre: description.genres?.[0] || 'hip-hop',
      mood: description.mood || 'energetic',
      is_instrumental: description.isInstrumental || false
    };

    const response = await fetch(`${SONAUTO_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sonauto API error:', errorText);
      throw new Error(`Generation failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (PRODUCTION_CONFIG.DEBUG) console.log('✅ Task created:', data);
    
    const taskId = data.id || data.task_id || data.clip_id;
    if (!taskId) {
        throw new Error('API did not return a valid task ID.');
    }
    return taskId;
  } catch (error) {
    console.error('Sonauto generation error:', error);
    throw new Error('Track generation failed. Please try again.');
  }
}

export async function pollGeneration(taskId: string, onProgress: (progress: number) => void): Promise<string> {
  let attempts = 0;
  const maxAttempts = 30; // 45 seconds max (1.5s intervals)
  
  if (PRODUCTION_CONFIG.DEBUG) console.log('🔄 Polling for task:', taskId);
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${SONAUTO_API_URL}/status/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      const progress = Math.min(99, Math.round(((attempts + 1) / maxAttempts) * 100));
      onProgress(progress);

      if (!response.ok) {
        console.error('Poll error:', response.status);
        await new Promise(resolve => setTimeout(resolve, 1500));
        attempts++;
        continue;
      }

      const data = await response.json();
      if (PRODUCTION_CONFIG.DEBUG) console.log(`📊 Status [${attempts + 1}/${maxAttempts}]:`, data.status);
      
      if (data.status === 'complete' || data.status === 'completed' || data.status === 'success') {
        if (PRODUCTION_CONFIG.DEBUG) console.log('✅ Generation complete!');
        
        if (data.audio_url) return data.audio_url;
        if (data.url) return data.url;
        if (data.clip_id) return `https://cdn1.suno.ai/${data.clip_id}.mp3`;
        
        console.error('No audio URL in response:', data);
        throw new Error('No audio URL in response');
        
      } else if (data.status === 'failed' || data.status === 'error') {
        console.error('❌ Generation failed:', data);
        throw new Error(data.error || 'Generation failed');
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      attempts++;
    } catch (error) {
      console.error('Polling error:', error);
      if (attempts < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        attempts++;
        continue;
      }
      throw error;
    }
  }

  console.error('⏱️ Generation timeout');
  throw new Error('Generation timeout - track took too long to generate');
}


export async function testApiKey(): Promise<boolean> {
  try {
    const response = await fetch(`${SONAUTO_API_URL}/account`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error('API key test failed:', error);
    return false;
  }
}