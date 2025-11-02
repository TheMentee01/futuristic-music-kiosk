import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface PlaybackScreenProps {
    song: Song;
    onRestart: () => void;
}

export const PlaybackScreen: React.FC<PlaybackScreenProps> = ({ song, onRestart }) => {
    const [audioError, setAudioError] = useState('');
    const [showConfetti, setShowConfetti] = useState(true);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        // Hide confetti after 3 seconds
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        setIsLoading(false);
        const error = (e.target as HTMLAudioElement).error;
        let errorMessage = 'An unknown error occurred while trying to play the audio.';
        if (error) {
            switch (error.code) {
                case error.MEDIA_ERR_ABORTED:
                    errorMessage = 'The audio playback was aborted.';
                    break;
                case error.MEDIA_ERR_NETWORK:
                    errorMessage = 'A network error caused the audio download to fail.';
                    break;
                case error.MEDIA_ERR_DECODE:
                    errorMessage = 'The audio could not be played, either due to corruption or because your browser does not support the format.';
                    break;
                case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorMessage = 'The audio could not be loaded because the format is not supported.';
                    break;
                default:
                    break;
            }
        }
        console.error("Audio Error:", error, errorMessage);
        setAudioError(errorMessage);
    };

    const handleCanPlay = () => {
        setIsLoading(false);
    };

    const handleDownload = () => {
        if (!song.audioUrl || audioError) {
          alert('⚠️ Audio not available for download');
          return;
        }
        const link = document.createElement('a');
        link.href = song.audioUrl;
        link.download = `${song.title.replace(/ /g, '_') || 'generated-track'}.mp3`;
        link.target = '_blank'; // Open in new tab for direct download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-bg-primary animate-fade-in">
            {showConfetti && (
                <div className="confetti-container">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className="confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                backgroundColor: ['#00d9ff', '#b24bf3', '#ffd700', '#ff2e97'][Math.floor(Math.random() * 4)]
                            }}
                        />
                    ))}
                </div>
            )}
            <Card className="w-full max-w-lg text-center">
                <div className="success-badge">✨ TRACK COMPLETE! ✨</div>
                <h2 className="text-3xl font-bold gradient-text mb-4">Your Track is Ready!</h2>
                
                <div className="my-6">
                    <img src={song.imageUrl} alt="Album Art" className="w-full max-w-xs mx-auto rounded-lg shadow-glow-purple" />
                </div>
                
                <h3 className="text-2xl font-semibold">{song.title}</h3>
                <p className="text-text-secondary">{[...song.description.genres, song.description.mood].join(' · ')}</p>
                
                {isLoading && (
                    <div className="my-6 p-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-cyan mx-auto"></div>
                        <p className="mt-4 text-text-secondary">🎵 Loading audio...</p>
                    </div>
                )}

                {audioError && (
                    <div className="my-6 p-4 bg-error/10 border border-error/30 rounded-lg text-center">
                        <h4 className="font-bold text-error">Audio Playback Error</h4>
                        <p className="text-text-secondary text-sm">{audioError}</p>
                    </div>
                )}
                
                <audio 
                    controls 
                    src={song.audioUrl} 
                    onError={handleAudioError}
                    onCanPlay={handleCanPlay}
                    className={`w-full my-6 ${isLoading || audioError ? 'hidden' : 'block'}`}
                    preload="auto"
                >
                    Your browser does not support the audio element.
                </audio>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <Button variant="primary" onClick={handleDownload} disabled={isLoading || !!audioError}>Download Song</Button>
                    <Button variant="secondary" onClick={onRestart}>Create Another</Button>
                </div>
                <Button variant="ghost" onClick={onRestart} className="mt-4">Back to Home</Button>

            </Card>
        </div>
    );
};
