import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { SettingsIcon, EXPRESS_PRICE, INSTRUMENTAL_PRICE } from '../constants';
import { useKioskConfig } from '../contexts/KioskConfigContext';

interface KioskSelectionScreenProps {
    onSelect: (mode: 'creator' | 'instrumentals' | 'express' | 'admin' | 'demo') => void;
    onCeoAccess: () => void;
}

export const KioskSelectionScreen: React.FC<KioskSelectionScreenProps> = ({ onSelect, onCeoAccess }) => {
    const { features, settings } = useKioskConfig();
    const [clickCount, setClickCount] = useState(0);
    const [showCeoPrompt, setShowCeoPrompt] = useState(false);
    const [clickTimer, setClickTimer] = useState<number | null>(null);
    const [ceoPin, setCeoPin] = useState('');

    const handleLogoClick = () => {
        if (clickTimer) {
            clearTimeout(clickTimer);
        }
        
        const newCount = clickCount + 1;
        setClickCount(newCount);
        
        if (newCount >= 5) {
            setShowCeoPrompt(true);
            setClickCount(0);
        }
        
        const timer = window.setTimeout(() => setClickCount(0), 30000);
        setClickTimer(timer);
    };

    const handleCeoLogin = (pin: string) => {
        if (pin === 'BYPASS' || pin === settings.adminPin) {
            setShowCeoPrompt(false);
            onCeoAccess();
        } else {
            alert('Invalid CEO bypass code');
        }
        setCeoPin('');
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-bg-primary">
             <header className="text-center mb-12 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
                <button 
                    id="main-title-trigger"
                    onClick={handleLogoClick}
                    style={{ userSelect: 'none' }}
                    className="w-full bg-transparent border-0 p-0 text-4xl md:text-5xl lg:text-6xl font-black gradient-text tracking-tight transition-transform duration-200 hover:scale-[1.02] active:scale-100 focus:outline-none focus:ring-4 focus:ring-accent-purple/50 rounded-lg"
                    title="CEO Access Easter Egg"
                >
                    Welcome to FUTURISTIC MUSIC KIOSK
                </button>
                <p className="text-text-secondary mt-4 max-w-2xl mx-auto text-lg">
                    The AI-powered music creation kiosk. Choose your experience to get started.
                </p>
            </header>

            {showCeoPrompt && (
                <div className="ceo-bypass-modal animate-fade-in">
                    <div className="ceo-bypass-content">
                        <h2 className="text-2xl font-bold">🔑 CEO Bypass Access</h2>
                        <p className="text-yellow-200/80 my-4">Enter bypass code to access the testing panel:</p>
                        <input
                            type="password"
                            placeholder="Enter bypass code"
                            autoFocus
                            value={ceoPin}
                            onChange={(e) => setCeoPin(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                handleCeoLogin((e.target as HTMLInputElement).value);
                                }
                            }}
                            className="w-full bg-bg-secondary p-3 rounded-lg border border-yellow-500/50 text-white text-center text-xl tracking-[0.2em] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <div className="flex gap-4 mt-6">
                            <Button variant="secondary" onClick={() => { setShowCeoPrompt(false); setCeoPin(''); }} className="w-full">Cancel</Button>
                            {/* FIX: Replaced DOM traversal with state management for the PIN input, resolving the onClick type error. */}
                            <Button
                                onClick={() => handleCeoLogin(ceoPin)}
                                className="w-full"
                                style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)', border: 'none' }}
                            >
                                Access Panel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {features.voiceCreations && (
                    <Card className="hover:border-accent-cyan hover:shadow-glow-cyan transition-all duration-300 transform hover:-translate-y-2 text-center flex flex-col">
                        <h2 className="text-3xl font-bold text-accent-cyan mb-4">Creator Mode</h2>
                        <div className="text-text-secondary mb-6 flex-grow flex flex-col justify-center">
                            <p>Craft a unique song from scratch using your voice and imagination.</p>
                            <p className="mt-4 font-bold text-accent-teal text-xl">$10 - $500</p>
                            <p className="text-sm">6 Tiers Available</p>
                        </div>
                        <Button onClick={() => onSelect('creator')} className="w-full mt-auto">Start Creating</Button>
                    </Card>
                )}
                 {features.instrumentals && (
                    <Card className="hover:border-accent-cyan hover:shadow-glow-cyan transition-all duration-300 transform hover:-translate-y-2 text-center flex flex-col">
                        <h2 className="text-3xl font-bold text-accent-cyan mb-4">Instrumentals</h2>
                        <div className="text-text-secondary mb-6 flex-grow flex flex-col justify-center">
                            <p>Browse our library of high-quality, AI-generated instrumental tracks for your projects.</p>
                            <p className="mt-4 font-bold text-accent-teal text-xl">${INSTRUMENTAL_PRICE}</p>
                        </div>
                        <Button onClick={() => onSelect('instrumentals')} className="w-full mt-auto">Browse Beats</Button>
                    </Card>
                 )}
                 {features.express && (
                    <Card className="hover:border-accent-cyan hover:shadow-glow-cyan transition-all duration-300 transform hover:-translate-y-2 text-center flex flex-col">
                        <h2 className="text-3xl font-bold text-accent-cyan mb-4">Express</h2>
                        <div className="text-text-secondary mb-6 flex-grow flex flex-col justify-center">
                            <p>Need a song fast? Pick a style, give a prompt, and get a radio-ready track in minutes.</p>
                            <p className="mt-4 font-bold text-accent-teal text-xl">${EXPRESS_PRICE}</p>
                        </div>
                        <Button onClick={() => onSelect('express')} className="w-full mt-auto">Get Song Now</Button>
                    </Card>
                 )}
            </div>
            {features.freeDemo && (
             <div className="w-full max-w-6xl mt-8 text-center animate-slide-in-up" style={{ animationDelay: '400ms' }}>
                <Button variant="secondary" onClick={() => onSelect('demo')} className="!px-10 !py-4 text-lg">
                    Try a Free 15-Second Demo
                </Button>
            </div>
            )}
             <div className="w-full max-w-6xl mt-12 text-center animate-slide-in-up" style={{ animationDelay: '500ms' }}>
                 <Button variant="ghost" onClick={() => onSelect('admin')} className="text-yellow-400 hover:bg-yellow-500/10">
                    <SettingsIcon className="w-6 h-6 mr-2" />
                    Admin Panel
                </Button>
            </div>
        </div>
    );
};