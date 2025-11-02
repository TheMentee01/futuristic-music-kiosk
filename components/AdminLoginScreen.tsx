import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { ChevronLeftIcon } from '../constants';
import { useKioskConfig } from '../contexts/KioskConfigContext';

interface AdminLoginScreenProps {
    onLogin: (pin: string) => boolean;
    onBack: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onLogin, onBack }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const { settings } = useKioskConfig();

    const handleLogin = () => {
        const success = onLogin(pin);
        if (!success) {
            setError('Invalid PIN. Please try again.');
            setPin('');
        }
    };
    
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-bg-primary animate-fade-in">
            <Button variant="ghost" onClick={onBack} className="absolute top-24 left-6 !p-2 z-10">
                <ChevronLeftIcon className="w-8 h-8"/> Back
            </Button>
            <Card className="w-full max-w-sm text-center">
                <h2 className="text-3xl font-bold gradient-text mb-4">Admin Access</h2>
                <p className="text-text-secondary mb-6">Enter the PIN to access the admin panel.</p>
                 <input
                    type="password"
                    value={pin}
                    onChange={(e) => {
                        setPin(e.target.value);
                        setError('');
                    }}
                    onKeyPress={handleKeyPress}
                    maxLength={6}
                    autoFocus
                    placeholder="Enter 6-digit PIN"
                    className="w-full bg-bg-secondary p-3 rounded-lg border border-accent-purple/50 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-accent-purple"
                    aria-label="Admin PIN for login"
                />
                {error && <p className="text-error mt-2 text-sm">{error}</p>}
                <Button onClick={handleLogin} className="w-full mt-6">
                    Login
                </Button>
            </Card>
        </div>
    );
};
