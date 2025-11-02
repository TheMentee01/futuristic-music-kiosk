import React from 'react';

interface GenerationModalProps {
    progress: number;
}

export const GenerationModal: React.FC<GenerationModalProps> = ({ progress }) => {
    return (
        <div className="generation-modal-overlay">
            <div className="generation-modal">
                <h2>🎵 Creating Your Masterpiece</h2>
                
                <div className="soundwave-container">
                    <div className="soundwave-bar" style={{ animationDelay: '0s' }}></div>
                    <div className="soundwave-bar" style={{ animationDelay: '0.1s' }}></div>
                    <div className="soundwave-bar" style={{ animationDelay: '0.2s' }}></div>
                    <div className="soundwave-bar" style={{ animationDelay: '0.3s' }}></div>
                    <div className="soundwave-bar" style={{ animationDelay: '0.4s' }}></div>
                    <div className="soundwave-bar" style={{ animationDelay: '0.3s' }}></div>
                    <div className="soundwave-bar" style={{ animationDelay: '0.2s' }}></div>
                    <div className="soundwave-bar" style={{ animationDelay: '0.1s' }}></div>
                    <div className="soundwave-bar" style={{ animationDelay: '0s' }}></div>
                </div>

                <div className="progress-ring-container">
                    <svg className="progress-ring" width="120" height="120">
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00d9ff" />
                                <stop offset="100%" stopColor="#b24bf3" />
                            </linearGradient>
                        </defs>
                        <circle
                            className="progress-ring-circle-bg"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="8"
                            fill="transparent"
                            r="52"
                            cx="60"
                            cy="60"
                        />
                        <circle
                            className="progress-ring-circle"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="transparent"
                            r="52"
                            cx="60"
                            cy="60"
                            strokeDasharray={`${2 * Math.PI * 52}`}
                            strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                        />
                    </svg>
                    <div className="progress-text">{Math.round(progress)}%</div>
                </div>

                <div className="generation-status">
                    {progress < 30 && '🎼 Analyzing your vision...'}
                    {progress >= 30 && progress < 60 && '🎹 Composing melodies...'}
                    {progress >= 60 && progress < 90 && '🎤 Layering vocals & instruments...'}
                    {progress >= 90 && '✨ Finalizing masterpiece...'}
                </div>
            </div>
        </div>
    );
};