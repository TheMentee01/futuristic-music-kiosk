
import React, { useState } from 'react';
import { useCreatorsStudioState, Track, Project, Preset } from '../hooks/useCreatorsStudioState';

interface CreatorsStudioScreenProps {
  onBack: () => void;
}

export function CreatorsStudioScreen({ onBack }: CreatorsStudioScreenProps) {
  const {
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
    deletePreset
  } = useCreatorsStudioState();

  const [quickPrompt, setQuickPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  return (
    <div className="creators-studio">
      <header className="studio-header">
        <div className="studio-title">
          <h1>⚡ CREATOR'S STUDIO</h1>
          <p className="vip-badge">CEO RICH - VIP ACCESS GRANTED</p>
        </div>
        <button className="btn-secondary-cs" onClick={onBack}>
          ← Back to Admin
        </button>
      </header>

      <nav className="studio-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          🏠 Dashboard
        </button>
        <button className={activeTab === 'musiclab' ? 'active' : ''} onClick={() => setActiveTab('musiclab')}>
          🎵 AI Music Lab
        </button>
        <button className={activeTab === 'tools' ? 'active' : ''} onClick={() => setActiveTab('tools')}>
          🛠️ Advanced Tools
        </button>
        <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
          📊 Analytics
        </button>
        <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>
          📁 Projects
        </button>
      </nav>

      <main className="studio-content">
        {activeTab === 'dashboard' && (
          <DashboardTab 
            quickPrompt={quickPrompt}
            setQuickPrompt={setQuickPrompt}
            generating={generating}
            setGenerating={setGenerating}
            tracks={tracks}
            saveTrack={saveTrack}
          />
        )}
        {activeTab === 'musiclab' && (
          <MusicLabTab saveTrack={saveTrack} voiceProfiles={voiceProfiles} />
        )}
        {activeTab === 'tools' && (
          <AdvancedToolsTab presets={presets} savePreset={savePreset} deletePreset={deletePreset} tracks={tracks} />
        )}
        {activeTab === 'analytics' && <AnalyticsTab tracks={tracks} />}
        {activeTab === 'projects' && (
          <ProjectsTab projects={projects} tracks={tracks} createProject={createProject} deleteTrack={deleteTrack} />
        )}
      </main>
    </div>
  );
}

function DashboardTab({ quickPrompt, setQuickPrompt, generating, setGenerating, tracks, saveTrack }) {
  const handleGenerate = async () => {
    if (!quickPrompt.trim()) return;
    setGenerating(true);
    // Simulate API call
    await new Promise(res => setTimeout(res, 2000));
    try {
      const newTrack: Track = {
        id: `track-${Date.now()}`,
        title: quickPrompt.substring(0, 50),
        duration: 180,
        audioUrl: '#', // Placeholder URL
        createdAt: new Date().toISOString()
      };
      saveTrack(newTrack);
      setQuickPrompt('');
      alert('Track generated successfully!');
    } catch (error) {
      alert('Generation failed. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="dashboard-tab">
      <section className="quick-create-widget">
        <h2>⚡ Quick Create</h2>
        <textarea
          value={quickPrompt}
          onChange={(e) => setQuickPrompt(e.target.value)}
          placeholder={"Describe your masterpiece...\n\nExample: 'Hard trap beat with Memphis 808s and motivational lyrics about success'"}
          rows={6}
          disabled={generating}
        />
        <div className="quick-toggles">
          <label><input type="checkbox" defaultChecked/><span>✨ AI Enhance</span></label>
          <label><input type="checkbox" /><span>🗣️ Voice Clone</span></label>
          <label><input type="checkbox" /><span>🎛️ Auto Remix</span></label>
        </div>
        <button className="btn-primary-cs btn-lg-cs generate-button" onClick={handleGenerate} disabled={!quickPrompt.trim() || generating}>
          {generating ? '⏳ Generating...' : '🚀 GENERATE NOW'}
        </button>
      </section>

      <section className="recent-projects">
        <h3>Recent Creations</h3>
        <div className="track-grid">
          {tracks.slice(0, 6).map(track => (
            <div key={track.id} className="track-card">
              <div className="track-waveform"></div>
              <h4>{track.title}</h4>
              <p>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</p>
              <div className="track-actions">
                <button>▶️ Play</button>
                <button>💾 Download</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MusicLabTab({ saveTrack, voiceProfiles }) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const features = [
    { id: 'multitrack', icon: '🎼', name: 'Multi-Track Creator', desc: 'Create 5-10 songs at once' },
    { id: 'voiceclone', icon: '🗣️', name: 'AI Voice Cloning', desc: 'Clone and save voice profiles' },
    { id: 'genrefusion', icon: '🎭', name: 'Genre Fusion', desc: 'Mix multiple genres' },
    { id: 'remixer', icon: '🔄', name: 'Instant Remixer', desc: 'Remix any track instantly' },
    { id: 'stems', icon: '🎚️', name: 'Stem Extractor', desc: 'Separate vocals/drums/bass' },
    { id: 'effects', icon: '✨', name: 'Voice Effects Lab', desc: 'Auto-tune, reverb, pitch' },
    { id: 'lyrics', icon: '📝', name: 'Lyrics Generator', desc: 'AI writes full songs' },
    { id: 'beats', icon: '🥁', name: 'Beat Library', desc: '1000+ premium beats' }
  ];

  return (
    <div className="music-lab-tab">
      <h2>🎵 AI Music Lab</h2>
      {!selectedFeature ? (
        <div className="feature-grid">
          {features.map(feature => (
            <button key={feature.id} className="feature-card" onClick={() => setSelectedFeature(feature.id)}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.name}</h3>
              <p>{feature.desc}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="feature-panel">
          <button className="back-button" onClick={() => setSelectedFeature(null)}>← Back to Lab</button>
          <FeaturePanel featureId={selectedFeature} saveTrack={saveTrack} />
        </div>
      )}
    </div>
  );
}

function FeaturePanel({ featureId, saveTrack }) {
  if (featureId === 'multitrack') {
    return (
      <div className="feature-content">
        <h3>🎼 Multi-Track Creator</h3>
        <div className="input-group">
          <label>Number of songs (1-10):</label>
          <input type="number" min="1" max="10" defaultValue="5" />
        </div>
        <div className="input-group">
          <label>Prompts (one per line):</label>
          <textarea rows={10} placeholder={'Song 1: Hard trap beat...\nSong 2: Lo-fi chill vibes...\nSong 3: Memphis rap anthem...'} />
        </div>
        <button className="btn-primary-cs">Generate All Tracks</button>
      </div>
    );
  }
  if (featureId === 'beats') {
    const mockBeats = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      name: `Beat ${i + 1}`,
      bpm: 120 + (i * 5),
      key: ['C', 'D', 'E', 'F', 'G', 'A', 'B'][i % 7],
      genre: ['Trap', 'Lo-fi', 'Drill', 'Boom Bap'][i % 4]
    }));
    return (
      <div className="feature-content">
        <h3>🥁 Beat Library</h3>
        <div className="beat-filters">
          <input type="search" placeholder="Search 1000+ beats..." />
          <select><option>All Genres</option></select>
          <input type="range" min="60" max="200" />
          <span>BPM: 60-200</span>
        </div>
        <div className="beat-grid">
          {mockBeats.map(beat => (
            <div key={beat.id} className="beat-card">
              <h4>{beat.name}</h4>
              <p>{beat.bpm} BPM • {beat.key} • {beat.genre}</p>
              <div className="beat-actions">
                <button>▶️ Preview</button>
                <button>💾 Use</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return <div className="feature-content"><h3>Feature: {featureId}</h3><p>Implementation in progress...</p></div>;
}

function AdvancedToolsTab({ presets, savePreset, deletePreset, tracks }) {
  return (
    <div className="tools-tab">
      <h2>🛠️ Advanced Creator Tools</h2>
      <section className="tool-section">
        <h3>💾 Custom Presets</h3>
        <div className="preset-list">
          {presets.map(preset => (
            <div key={preset.id} className="preset-item">
              <span>{preset.name}</span>
              <button onClick={() => deletePreset(preset.id)}>🗑️</button>
            </div>
          ))}
        </div>
        <button className="btn-secondary-cs" onClick={savePreset}>+ Save Current Settings</button>
      </section>
      <section className="tool-section">
        <h3>📦 Batch Export</h3>
        <div className="export-options">
          <label><input type="checkbox" /> MP3</label>
          <label><input type="checkbox" /> WAV</label>
          <label><input type="checkbox" /> FLAC</label>
          <select><option>Standard Quality</option><option>High</option><option>Maximum</option></select>
          <button className="btn-primary-cs">Export Selected</button>
        </div>
      </section>
    </div>
  );
}

function AnalyticsTab({ tracks }) {
  return (
    <div className="analytics-tab">
      <h2>📊 Analytics & Insights</h2>
      <div className="stats-grid">
        <div className="stat-card"><h3>{tracks.length}</h3><p>Total Tracks Created</p></div>
        <div className="stat-card"><h3>{Math.floor(tracks.reduce((sum, t) => sum + t.duration, 0) / 60)}</h3><p>Minutes of Music</p></div>
        <div className="stat-card"><h3>100%</h3><p>Success Rate</p></div>
        <div className="stat-card"><h3>⚡</h3><p>Unlimited Access</p></div>
      </div>
    </div>
  );
}

function ProjectsTab({ projects, tracks, createProject, deleteTrack }) {
  return (
    <div className="projects-tab">
      <h2>📁 Project Manager</h2>
      <button className="btn-primary-cs" onClick={createProject}>+ New Project</button>
      <div className="project-list">
        {tracks.map(track => (
          <div key={track.id} className="project-item">
            <div className="project-info">
              <h4>{track.title}</h4>
              <p>{new Date(track.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="project-actions">
              <button>▶️ Play</button>
              <button>💾 Download</button>
              <button onClick={() => deleteTrack(track.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Inject CSS to avoid needing a separate CSS file
if (typeof document !== 'undefined' && !document.getElementById('creators-studio-styles')) {
  const css = `
    .creators-studio { min-height: 100vh; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #e0e0e0; font-family: 'Inter', sans-serif; }
    .studio-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; background: linear-gradient(90deg, rgba(255, 215, 0, 0.1), rgba(0, 217, 255, 0.1)); border-bottom: 2px solid #00d9ff; }
    .studio-title h1 { font-size: 28px; font-weight: 900; background: linear-gradient(135deg, #ffd700 0%, #00d9ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; }
    .vip-badge { font-size: 12px; color: #ffd700; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
    .studio-tabs { display: flex; gap: 8px; padding: 12px 32px; background: #151933; border-bottom: 1px solid rgba(255,255,255,0.1); overflow-x: auto; }
    .studio-tabs button { padding: 10px 20px; background: transparent; border: none; color: rgba(255,255,255,0.6); cursor: pointer; border-radius: 8px; transition: all 0.2s ease; white-space: nowrap; font-weight: 600; font-size: 14px; }
    .studio-tabs button.active { background: linear-gradient(135deg, #00d9ff, #b24bf3); color: white; box-shadow: 0 0 15px rgba(0, 217, 255, 0.5); }
    .studio-content { padding: 32px; }
    .btn-primary-cs { background: linear-gradient(90deg, #00d9ff, #b24bf3); color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; transition: all 0.2s ease; }
    .btn-primary-cs:hover { transform: scale(1.05); box-shadow: 0 0 20px #b24bf3a0; }
    .btn-primary-cs:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary-cs { background: rgba(255,255,255,0.1); color: white; padding: 10px 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); font-weight: bold; cursor: pointer; transition: background 0.2s; }
    .btn-secondary-cs:hover { background: rgba(255,255,255,0.2); }
    .btn-lg-cs { padding: 16px 32px; font-size: 18px; }
    .dashboard-tab { display: grid; grid-template-columns: 1fr 2fr; gap: 32px; }
    .quick-create-widget { background: #151933; padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
    .quick-create-widget h2 { font-size: 24px; font-weight: bold; margin-bottom: 16px; background: linear-gradient(90deg, #00d9ff, #b24bf3); -webkit-background-clip: text; -webkit-text-fill-color: transparent;}
    .quick-create-widget textarea { width: 100%; background: #0a0e27; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 12px; color: white; resize: none; font-size: 16px; }
    .quick-toggles { display: flex; gap: 16px; margin: 16px 0; }
    .quick-toggles label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
    .quick-toggles input[type="checkbox"] { width: 18px; height: 18px; accent-color: #00d9ff; }
    .generate-button { width: 100%; }
    .recent-projects h3 { font-size: 20px; margin-bottom: 16px; }
    .track-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
    .track-card { background: #151933; padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
    .track-card h4 { font-weight: bold; margin: 8px 0 4px; }
    .track-card p { font-size: 14px; color: rgba(255,255,255,0.6); }
    .track-waveform { height: 60px; background: linear-gradient(90deg, #00d9ff50, #b24bf350); border-radius: 4px; }
    .track-actions { margin-top: 12px; display: flex; gap: 8px; }
    .track-actions button { flex: 1; padding: 8px; background: rgba(255,255,255,0.1); border: none; color: white; border-radius: 4px; cursor: pointer; }
    .music-lab-tab h2, .tools-tab h2, .analytics-tab h2, .projects-tab h2 { font-size: 28px; margin-bottom: 24px; }
    .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .feature-card { background: #151933; padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); text-align: left; transition: all 0.2s ease; cursor: pointer; }
    .feature-card:hover { transform: translateY(-5px); border-color: #00d9ff; box-shadow: 0 5px 20px #00d9ff30; }
    .feature-icon { font-size: 32px; margin-bottom: 12px; }
    .feature-card h3 { font-size: 18px; font-weight: bold; margin: 0 0 8px; }
    .feature-card p { color: rgba(255,255,255,0.6); margin: 0; }
    .feature-panel .back-button { margin-bottom: 24px; font-weight: bold; }
    .feature-content { background: #151933; padding: 32px; border-radius: 12px; }
    .input-group { margin-bottom: 16px; }
    .input-group label { display: block; margin-bottom: 8px; font-weight: 500; }
    .input-group input, .input-group textarea, .input-group select { width: 100%; background: #0a0e27; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 12px; color: white; }
    .beat-filters { display: flex; gap: 16px; margin-bottom: 24px; align-items: center; }
    .beat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; max-height: 400px; overflow-y: auto; }
    .beat-card { background: #0a0e27; padding: 12px; border-radius: 8px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .stat-card { background: linear-gradient(135deg, #151933, #1a1a2e); padding: 24px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1); }
    .stat-card h3 { font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #00d9ff, #b24bf3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .stat-card p { margin-top: 8px; color: rgba(255,255,255,0.6); }
    .project-list { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
    .project-item { display: flex; justify-content: space-between; align-items: center; background: #151933; padding: 16px; border-radius: 8px; }
  `;
  const styleElement = document.createElement('style');
  styleElement.id = 'creators-studio-styles';
  styleElement.innerHTML = css;
  document.head.appendChild(styleElement);
}
