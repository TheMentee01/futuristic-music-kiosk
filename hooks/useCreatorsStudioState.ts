
import { useState, useCallback, useEffect } from 'react';

// --- TYPES ---
export interface Track {
  id: string;
  title: string;
  duration: number; // in seconds
  audioUrl: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: string;
}

export interface VoiceProfile {
  id: string;
  name: string;
}

export interface Preset {
  id: string;
  name: string;
  settings: Record<string, any>;
}

export type StudioTab = 'dashboard' | 'musiclab' | 'tools' | 'analytics' | 'projects';

// --- MOCK DATA ---
const MOCK_TRACKS: Track[] = [
  { id: 'track-1', title: 'Neon Sunset Drive', duration: 185, audioUrl: '#', createdAt: new Date().toISOString() },
  { id: 'track-2', title: 'Rainy Lofi Morning', duration: 150, audioUrl: '#', createdAt: new Date().toISOString() },
  { id: 'track-3', title: '808 Kingdom', duration: 210, audioUrl: '#', createdAt: new Date().toISOString() },
];

// --- HOOK ---

const usePersistentState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
};


export const useCreatorsStudioState = () => {
  const [activeTab, setActiveTab] = useState<StudioTab>('dashboard');
  const [projects, setProjects] = usePersistentState<Project[]>('cs_projects', []);
  const [tracks, setTracks] = usePersistentState<Track[]>('cs_tracks', MOCK_TRACKS);
  const [voiceProfiles, setVoiceProfiles] = usePersistentState<VoiceProfile[]>('cs_voices', []);
  const [presets, setPresets] = usePersistentState<Preset[]>('cs_presets', []);

  const createProject = useCallback(() => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: `New Project ${projects.length + 1}`,
      trackIds: [],
      createdAt: new Date().toISOString(),
    };
    setProjects(p => [...p, newProject]);
    alert('New project created!');
  }, [projects, setProjects]);

  const saveTrack = useCallback((track: Track) => {
    setTracks(t => [track, ...t]);
  }, [setTracks]);

  const deleteTrack = useCallback((trackId: string) => {
    if (window.confirm('Are you sure you want to delete this track?')) {
      setTracks(t => t.filter(track => track.id !== trackId));
    }
  }, [setTracks]);

  const savePreset = useCallback(() => {
    const presetName = prompt('Enter preset name:');
    if (presetName) {
      const newPreset: Preset = {
        id: `preset-${Date.now()}`,
        name: presetName,
        settings: {
          /* capture current settings here */
        },
      };
      setPresets(p => [...p, newPreset]);
    }
  }, [setPresets]);
  
  const deletePreset = useCallback((presetId: string) => {
    if (window.confirm('Are you sure you want to delete this preset?')) {
      setPresets(p => p.filter(preset => preset.id !== presetId));
    }
  }, [setPresets]);

  return {
    activeTab,
    setActiveTab,
    projects,
    tracks,
    voiceProfiles,
    presets,
    createProject,
    saveTrack,
    deleteTrack,
    savePreset,
    deletePreset,
  };
};
