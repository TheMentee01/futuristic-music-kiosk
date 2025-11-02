import React from 'react';
import { Page } from '../hooks/useKioskState';
import { WrenchIcon } from '../constants';

interface FloatingAdminButtonProps {
    onNavigate: (page: Page) => void;
}

export const FloatingAdminButton: React.FC<FloatingAdminButtonProps> = ({ onNavigate }) => {
    return (
        <button
            onClick={() => onNavigate('admin-login')}
            className="fixed bottom-5 right-5 z-[100] w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg text-white transform transition-transform hover:scale-110 focus:outline-none focus:ring-4 ring-yellow-400/50"
            aria-label="Quick Admin Access"
            title="Quick Admin Access"
        >
            <WrenchIcon className="w-8 h-8" />
        </button>
    );
};