import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { ToggleSwitch } from './common/ToggleSwitch';
import { SparkleIcon, QUICK_PROMPTS_EXPRESS } from '../constants';
import { ExpressRequest } from '../types';

interface ExpressScreenProps {
    onSubmit: (request: ExpressRequest) => void;
}

export const ExpressScreen: React.FC<ExpressScreenProps> = ({ onSubmit }) => {
    const [prompt, setPrompt] = useState('');
    const [isAiEnhanced, setIsAiEnhanced] = useState(true);
    const [isFancyMode, setIsFancyMode] = useState(false);
    const [isInstrumental, setIsInstrumental] = useState(false);

    const handleGenerate = () => {
        if (prompt.trim()) {
            onSubmit({ prompt, isAiEnhanced, isFancyMode, isInstrumental });
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-bg-primary pt-24 animate-fade-in">
            <Card className="w-full max-w-3xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold gradient-text">Express Creation</h1>
                    <p className="text-lg font-bold text-accent-cyan mt-2">$15 - Express Creation</p>
                </div>
                
                <div className="my-8 relative">
                    <SparkleIcon className="absolute top-4 left-4 w-6 h-6 text-accent-purple/50" />
                    <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="e.g., A happy, upbeat pop song about summer vacation..."
                        className="w-full h-40 bg-bg-secondary p-4 pl-12 rounded-lg border-2 border-accent-purple/30 focus:outline-none focus:ring-2 focus:ring-accent-purple resize-none text-lg"
                        aria-label="Express song prompt"
                    />
                </div>

                <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {QUICK_PROMPTS_EXPRESS.map(({name, prompt: p}) => (
                        <button key={name} onClick={() => setPrompt(p)} className="text-sm bg-bg-secondary px-3 py-1 rounded-full border border-accent-cyan/30 hover:bg-accent-cyan/20">{name}</button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                    <ToggleSwitch label="AI Enhance" enabled={isAiEnhanced} setEnabled={setIsAiEnhanced} />
                    <ToggleSwitch label="Fancy Mode" enabled={isFancyMode} setEnabled={setIsFancyMode} />
                    <ToggleSwitch label="Instrumental" enabled={isInstrumental} setEnabled={setIsInstrumental} />
                </div>

                <div className="mt-8 flex justify-center">
                     <Button 
                        onClick={handleGenerate} 
                        disabled={!prompt.trim()}
                        className="text-xl !px-12 !py-5 animate-pulse-slow"
                        aria-label="Generate express song"
                    >
                        Next Step: Pay
                    </Button>
                </div>
            </Card>
        </div>
    );
};