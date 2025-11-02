import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { ToggleSwitch } from './common/ToggleSwitch';
import { SparkleIcon, INSTRUMENTAL_PRICE } from '../constants';
import { InstrumentalRequest } from '../types';

interface InstrumentalsScreenProps {
    onSubmit: (request: InstrumentalRequest) => void;
}

export const InstrumentalsScreen: React.FC<InstrumentalsScreenProps> = ({ onSubmit }) => {
    const [prompt, setPrompt] = useState('');
    const [isAiEnhanced, setIsAiEnhanced] = useState(true);
    const [isFancyMode, setIsFancyMode] = useState(false);

    const handleGenerate = () => {
        if (prompt.trim()) {
            onSubmit({ prompt, isAiEnhanced, isFancyMode });
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-bg-primary pt-24 animate-fade-in">
            <Card className="w-full max-w-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold gradient-text">Instrumental Studio</h1>
                    <p className="text-lg font-bold text-accent-cyan mt-2">${INSTRUMENTAL_PRICE} - Beat Maker</p>
                </div>
                
                <div className="my-8 relative">
                     <SparkleIcon className="absolute top-4 left-4 w-6 h-6 text-accent-purple/50" />
                    <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="e.g., An epic, cinematic orchestral score for a space battle, with heavy drums and a choir..."
                        className="w-full h-40 bg-bg-secondary p-4 pl-12 rounded-lg border-2 border-accent-purple/30 focus:outline-none focus:ring-2 focus:ring-accent-purple resize-none text-lg"
                        aria-label="Instrumental prompt"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    <ToggleSwitch label="AI Enhance" enabled={isAiEnhanced} setEnabled={setIsAiEnhanced} />
                    <ToggleSwitch label="Fancy Mode" enabled={isFancyMode} setEnabled={setIsFancyMode} />
                </div>

                <div className="mt-8 flex justify-center">
                     <Button 
                        onClick={handleGenerate} 
                        disabled={!prompt.trim()}
                        className="text-xl !px-12 !py-5 animate-pulse-slow"
                        aria-label="Generate instrumental"
                    >
                        Next Step: Pay
                    </Button>
                </div>
            </Card>
        </div>
    );
};