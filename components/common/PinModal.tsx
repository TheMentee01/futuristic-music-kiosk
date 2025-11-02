import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { useKioskConfig } from '../../contexts/KioskConfigContext';

interface PinModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onConfirm, onCancel, title }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const { settings } = useKioskConfig();

    useEffect(() => {
        if (isOpen) {
            setPin('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleConfirmClick = () => {
        if (pin === settings.adminPin) {
            onConfirm();
        } else {
            setError('Invalid PIN.');
            setPin('');
        }
    };
    
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleConfirmClick();
        }
    };

    return (
        <div className="fixed inset-0 bg-bg-primary/90 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-sm text-center animate-fade-in">
                <h2 className="text-2xl font-bold gradient-text mb-4">{title}</h2>
                <p className="text-text-secondary mb-6">Please enter the admin PIN to proceed.</p>
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
                    aria-label="Admin PIN for confirmation"
                />
                {error && <p className="text-error mt-2 text-sm">{error}</p>}
                <div className="flex gap-4 mt-6">
                    <Button variant="secondary" onClick={onCancel} className="w-full">Cancel</Button>
                    <Button onClick={handleConfirmClick} className="w-full">Confirm</Button>
                </div>
            </Card>
        </div>
    );
};
