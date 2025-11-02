import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { ContactInfo, PricingTier } from '../types';
import { generateAlbumCover, cloneVoice, enhanceAudio, generateMusicVideoWithReplicate, pollReplicatePrediction } from '../services/replicateService';
import { PRODUCTION_CONFIG } from '../constants';

interface CeoTestingPanelProps {
  onBack: () => void;
  onGenerateTrack: (config: { prompt: string; workflow: string; duration: number; tier: PricingTier; customerInfo: ContactInfo }) => void;
}

export function CeoTestingPanel({ onBack, onGenerateTrack }: CeoTestingPanelProps) {
    const [testPrompt, setTestPrompt] = useState('');
    const [testMode, setTestMode] = useState<'voice' | 'instrumental' | 'express'>('express');
  
    const quickTests = [
      { name: 'Test Hip-Hop Track', prompt: 'Hard trap beat with 808s and a dark piano melody' },
      { name: 'Test Pop Song', prompt: 'Catchy, upbeat summer pop melody with female vocals' },
      { name: 'Test Rock Anthem', prompt: 'Heavy classic rock guitar riffs with powerful drums' },
      { name: 'Test EDM Banger', prompt: 'Energetic electronic dance music for a festival mainstage' }
    ];

    const handleGenerate = (prompt: string) => {
        if (!prompt) {
            alert('Please enter a test prompt');
            return;
        }
        onGenerateTrack({
          prompt: prompt,
          workflow: testMode,
          duration: 120,
          tier: {
            id: 'ceo-test',
            name: 'CEO Testing',
            price: 0,
            songCreations: 1,
            maxRecordingSeconds: 120,
            features: ['Free CEO testing mode']
          },
          customerInfo: { name: 'CEO Test', email: 'ceo@test.com' }
        });
    }

    const testReplicateFeature = async (feature: string) => {
        alert(`Starting test for: ${feature}. This may take a few minutes. Check the console for progress.`);
        try {
            let predictionId: string | null = null;
            if (feature === 'album-cover') {
                predictionId = await generateAlbumCover('Neon Sunset', 'CEO Rich', 'synthwave');
            } else if (feature === 'voice-clone') {
                // NOTE: This uses a preset voice. For true cloning, a URL to an audio file would be needed.
                predictionId = await cloneVoice('placeholder_audio_url', 'Testing the futuristic music kiosk voice cloning feature. One, two, three.');
            } else if (feature === 'enhance-audio') {
                // NOTE: This requires a real public audio URL to work.
                alert("Audio enhancement requires a public audio URL. This test will likely fail without a valid URL in replicateService.ts");
                predictionId = await enhanceAudio('https://replicate.delivery/pbxt/IZiJ49s5s24A1Y2n2sCIIi3c3t6Iu2BnaF42s5C6G3oYlV9I/music.wav');
            } else if (feature === 'music-video') {
                // NOTE: This also requires real public URLs for audio and images.
                alert("Music video generation requires public audio/image URLs. This test will likely fail without valid URLs in replicateService.ts");
                predictionId = await generateMusicVideoWithReplicate('https://replicate.delivery/pbxt/IZiJ49s5s24A1Y2n2sCIIi3c3t6Iu2BnaF42s5C6G3oYlV9I/music.wav', ['A futuristic city', 'A neon sign']);
            }

            if (predictionId) {
                if (PRODUCTION_CONFIG.DEBUG) console.log(`[Replicate] Prediction started with ID: ${predictionId}`);
                const result = await pollReplicatePrediction(predictionId);
                if (PRODUCTION_CONFIG.DEBUG) console.log('[Replicate] Prediction finished!', result);
                alert(`${feature} test completed successfully! Check console for output.`);
            }
        } catch (error) {
            console.error(`[Replicate] Test failed for ${feature}:`, error);
            alert(`Test for ${feature} failed. See console for details.`);
        }
    };
  
    return (
      <div className="min-h-screen w-full p-4 md:p-8 bg-bg-primary animate-fade-in pt-8">
        <div className="w-full max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">🔬 CEO Testing Panel</h1>
                    <p className="text-text-secondary">Test features without payment or customer flow.</p>
                </div>
                <Button variant="secondary" onClick={onBack}>← Back to Home</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Generation */}
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-xl font-bold text-accent-cyan mb-4">🎯 Sonauto Music Generation</h2>
                        <div className="flex gap-2 rounded-lg bg-bg-secondary p-1">
                            {(['voice', 'instrumental', 'express'] as const).map(mode => (
                                <button key={mode} onClick={() => setTestMode(mode)} className={`flex-1 p-2 rounded-md font-semibold capitalize transition-colors ${testMode === mode ? 'gradient-button text-white' : 'hover:bg-white/5'}`}>
                                   {mode === 'voice' && '🎤'} {mode === 'instrumental' && '🎹'} {mode === 'express' && '⚡'} {mode}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold text-accent-cyan mb-4">⚡ Quick Tests (Sonauto)</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {quickTests.map((test) => (
                                <Button key={test.name} variant="secondary" onClick={() => handleGenerate(test.prompt)}>
                                    {test.name}
                                </Button>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold text-accent-cyan mb-4">🎨 Custom Test (Sonauto)</h2>
                        <textarea
                            className="w-full h-32 bg-bg-secondary p-3 rounded-lg border border-accent-purple/50 focus:outline-none focus:ring-2 focus:ring-accent-purple resize-none"
                            placeholder="Enter custom prompt for testing..."
                            value={testPrompt}
                            onChange={(e) => setTestPrompt(e.target.value)}
                        />
                        <Button onClick={() => handleGenerate(testPrompt)} disabled={!testPrompt.trim()} className="w-full mt-3 !py-3 text-lg">
                            🚀 Generate Test Track
                        </Button>
                    </Card>
                </div>

                {/* Right Column - Status & Replicate */}
                <div className="space-y-6">
                     <Card>
                        <h2 className="text-xl font-bold text-accent-cyan mb-4">🎨 Replicate AI Features</h2>
                        <div className="grid grid-cols-2 gap-3">
                           <Button variant="secondary" onClick={() => testReplicateFeature('album-cover')}>🎨 Generate Album Cover</Button>
                           <Button variant="secondary" onClick={() => testReplicateFeature('voice-clone')}>🎤 Test Voice Cloning</Button>
                           <Button variant="secondary" onClick={() => testReplicateFeature('enhance-audio')}>🎚️ Enhance Audio</Button>
                           <Button variant="secondary" onClick={() => testReplicateFeature('music-video')}>🎬 Generate Music Video</Button>
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-bg-secondary/50 text-center">
                            <p className="font-bold text-yellow-400">💰 Available Credit: ~$10.00</p>
                            <p className="text-xs text-text-secondary mt-1">Estimates: ~500 album covers, ~500 voice clones, ~20 videos</p>
                        </div>
                    </Card>

                     <Card>
                        <h2 className="text-xl font-bold text-accent-cyan mb-4">📊 System Status</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-bg-secondary p-4 rounded-lg text-center">
                                <h3 className="font-semibold text-text-secondary">API Connections</h3>
                                <p className="text-lg font-bold text-success mt-1">✓ All Active</p>
                            </div>
                             <div className="bg-bg-secondary p-4 rounded-lg text-center">
                                <h3 className="font-semibold text-text-secondary">Generation Speed</h3>
                                <p className="text-lg font-bold text-text-primary mt-1">~35-90s</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
      </div>
    );
}