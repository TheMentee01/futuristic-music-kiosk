import React, { useState } from 'react';
import { SongDescription } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { QUICK_PROMPTS, ChevronLeftIcon, SparkleIcon, FUTURE_FEATURES } from '../constants';
import { generateLyrics } from '../services/sonautoService';
import { enhanceTrackDescription } from '../services/geminiService';
import { useKioskConfig } from '../contexts/KioskConfigContext';

interface DescriptionScreenProps {
    onSubmit: (description: Omit<SongDescription, 'generationMode'>) => void;
    onBack: () => void;
}

type LyricsTab = 'write' | 'ai' | 'instrumental';

export const DescriptionScreen: React.FC<DescriptionScreenProps> = ({ onSubmit, onBack }) => {
    const { genres, moods, features } = useKioskConfig();

    const [prompt, setPrompt] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedMood, setSelectedMood] = useState<string>('');
    const [duration, setDuration] = useState(30);
    const [lyrics, setLyrics] = useState('');
    const [isInstrumental, setIsInstrumental] = useState(false);
    const [lyricsTab, setLyricsTab] = useState<LyricsTab>('write');
    const [customDuration, setCustomDuration] = useState('');
    const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
    const [isAiEnhanced, setIsAiEnhanced] = useState(true);
    const [customGenre, setCustomGenre] = useState('');
    const [customMood, setCustomMood] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);


    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        );
    };

    const handleAddGenre = () => {
        const trimmedGenre = customGenre.trim();
        if (trimmedGenre && !selectedGenres.find(g => g.toLowerCase() === trimmedGenre.toLowerCase())) {
            setSelectedGenres(prev => [...prev, trimmedGenre]);
        }
        setCustomGenre('');
    };

    const handleGenerate = () => {
        const finalDuration = duration === -1 ? Number(customDuration) : duration;
        onSubmit({
            prompt,
            genres: selectedGenres,
            mood: customMood.trim() || selectedMood,
            duration: finalDuration,
            lyrics: lyricsTab === 'write' ? lyrics : '',
            isInstrumental: lyricsTab === 'instrumental',
            isAiEnhanced: features.aiEnhance ? isAiEnhanced : false
        });
    };

    const handleGenerateLyrics = async () => {
        if (!prompt) {
            alert("Please enter a song prompt first to generate lyrics.");
            return;
        }
        setIsGeneratingLyrics(true);
        try {
            const generated = await generateLyrics(prompt, selectedGenres, selectedMood);
            setLyrics(generated);
            setLyricsTab('write'); // Switch to write tab to show the lyrics
        } catch (error) {
            console.error("Failed to generate lyrics:", error);
            alert("Could not generate lyrics. Please try again.");
        } finally {
            setIsGeneratingLyrics(false);
        }
    };

    const handleEnhancePrompt = async () => {
      if (!prompt) return;
      setIsEnhancing(true);
      try {
        const enhanced = await enhanceTrackDescription(prompt);
        setPrompt(enhanced);
      } catch (error) {
        console.error('Enhancement failed:', error);
      } finally {
        setIsEnhancing(false);
      }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-bg-primary animate-fade-in">
            <Button variant="ghost" onClick={onBack} className="absolute top-24 left-6 !p-2">
                <ChevronLeftIcon className="w-8 h-8"/> Go Back
            </Button>
            <Card className="w-full max-w-4xl">
                <h2 className="text-3xl font-bold gradient-text mb-6 text-center">Describe Your Song</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="font-semibold text-text-primary block mb-2">Song Prompt</label>
                            <textarea
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder="e.g., A synthwave track about driving through a neon city at night..."
                                className="w-full h-32 bg-bg-secondary p-3 rounded-lg border border-accent-purple/50 focus:outline-none focus:ring-2 focus:ring-accent-purple resize-none"
                            />
                             <div className="flex flex-wrap gap-2 mt-2">
                                {QUICK_PROMPTS.map(p => (
                                    <button key={p} onClick={() => setPrompt(p)} className="text-xs bg-bg-secondary px-2 py-1 rounded-full border border-accent-cyan/30 hover:bg-accent-cyan/20">{p}</button>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-4">
                                {features.aiEnhance && (
                                    <button
                                        onClick={() => setIsAiEnhanced(!isAiEnhanced)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-semibold border ${isAiEnhanced ? 'gradient-button text-white border-transparent' : 'bg-bg-secondary border-white/20'}`}
                                    >
                                        <SparkleIcon className="w-5 h-5" />
                                        AI Enhance Prompt {isAiEnhanced ? '(ON)' : '(OFF)'}
                                    </button>
                                )}
                                {FUTURE_FEATURES.AI_DESCRIPTION_ENHANCE.enabled && (
                                    <Button
                                        variant="secondary"
                                        onClick={handleEnhancePrompt}
                                        disabled={!prompt || isEnhancing}
                                        className="flex-1"
                                    >
                                        <SparkleIcon className="w-5 h-5" />
                                        {isEnhancing ? 'Enhancing...' : 'Enhance Description'}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="font-semibold text-text-primary block mb-2">Genres</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={customGenre}
                                    onChange={e => setCustomGenre(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleAddGenre()}
                                    placeholder="Type a custom genre..."
                                    className="flex-grow bg-bg-secondary p-2 rounded-lg border border-accent-purple/50 focus:outline-none focus:ring-2 focus:ring-accent-purple"
                                />
                                <Button variant="secondary" onClick={handleAddGenre} className="!py-0 !px-4">Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {genres.map(g => (
                                    <button key={g} onClick={() => toggleGenre(g)} className={`px-3 py-1.5 rounded-full text-sm transition-colors ${selectedGenres.includes(g) ? 'gradient-button text-white' : 'bg-bg-secondary border border-white/20'}`}>{g}</button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <label className="font-semibold text-text-primary block mb-2">Mood</label>
                            <div className="flex flex-wrap gap-2">
                                {moods.map(m => (
                                    <button key={m.name} onClick={() => { setSelectedMood(m.name); setCustomMood(''); }} className={`px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-2 ${selectedMood === m.name ? 'gradient-button text-white' : 'bg-bg-secondary border border-white/20'}`}>{m.emoji} {m.name}</button>
                                ))}
                            </div>
                             <input
                                type="text"
                                value={customMood}
                                onChange={e => {
                                    setCustomMood(e.target.value);
                                    setSelectedMood('');
                                }}
                                placeholder="Or type a custom mood..."
                                className="w-full bg-bg-secondary p-2 rounded-lg border border-accent-purple/50 mt-3 focus:outline-none focus:ring-2 focus:ring-accent-purple"
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-text-primary block mb-2">Duration</label>
                            <div className="flex flex-wrap gap-2 items-center">
                                {[30, 90, 180].map(d => (
                                    <button key={d} onClick={() => setDuration(d)} className={`px-3 py-1.5 rounded-full text-sm ${duration === d ? 'gradient-button text-white' : 'bg-bg-secondary border border-white/20'}`}>{`${Math.floor(d/60)}:${(d%60).toString().padStart(2,'0')}`}</button>
                                ))}
                                <button onClick={() => setDuration(-1)} className={`px-3 py-1.5 rounded-full text-sm ${duration === -1 ? 'gradient-button text-white' : 'bg-bg-secondary border border-white/20'}`}>Custom</button>
                                {duration === -1 && (
                                    <input type="number" value={customDuration} onChange={e => setCustomDuration(e.target.value)} placeholder="secs" className="w-20 bg-bg-secondary p-1.5 rounded-lg border border-accent-purple/50"/>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-text-primary block mb-2">Lyrics</label>
                        <div className="flex border-b border-white/20 mb-2">
                           { (['write', 'ai', 'instrumental'] as LyricsTab[]).map(tab => (
                               <button key={tab} onClick={() => setLyricsTab(tab)} className={`capitalize px-4 py-2 text-sm font-semibold transition-colors ${lyricsTab === tab ? 'text-accent-cyan border-b-2 border-accent-cyan' : 'text-text-secondary'}`}>{tab.replace('ai', 'AI Generate')}</button>
                           ))}
                        </div>
                        <div className="flex-grow bg-bg-secondary rounded-lg p-3">
                            {lyricsTab === 'write' && <textarea value={lyrics} onChange={e=>setLyrics(e.target.value)} placeholder="Write your lyrics line by line..." className="w-full h-full bg-transparent resize-none focus:outline-none"/>}
                            {lyricsTab === 'ai' && (
                                <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                                    <p className="text-text-secondary mb-4">
                                        Use AI to generate lyrics based on your prompt, genres, and mood.
                                    </p>
                                    <Button onClick={handleGenerateLyrics} disabled={isGeneratingLyrics || !prompt}>
                                        {isGeneratingLyrics ? 'Generating...' : 'Generate Lyrics'}
                                    </Button>
                                </div>
                            )}
                            {lyricsTab === 'instrumental' && <div className="text-center p-8"><p className="text-text-secondary">An instrumental track will be generated.</p></div>}
                        </div>
                    </div>
                </div>
                 <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-end">
                    <Button onClick={handleGenerate} className="text-lg !px-10 !py-4" disabled={!prompt}>
                        Next Step: Generate
                    </Button>
                </div>
            </Card>
        </div>
    );
};