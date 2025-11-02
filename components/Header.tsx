import React from 'react';
import { Page } from '../hooks/useKioskState';
import { WrenchIcon, HomeIcon, ArrowLeftIcon } from '../constants';

interface HeaderProps {
    currentPage: Page;
    previousPage: Page;
    onNavigate: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, previousPage, onNavigate }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-20 p-4 bg-bg-primary/80 backdrop-blur-sm border-b border-white/10">
            <nav className="max-w-7xl mx-auto flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold gradient-text">FUTURISTIC MUSIC KIOSK</h1>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                    {currentPage !== 'home' && (
                        <button onClick={() => onNavigate(previousPage)} className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-300 text-text-secondary hover:text-text-primary hover:bg-white/10" title="Go Back">
                            <ArrowLeftIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                    )}
                    <button onClick={() => onNavigate('home')} className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-300 text-text-secondary hover:text-text-primary hover:bg-white/10" title="Go Home">
                        <HomeIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Home</span>
                    </button>
                    <button
                        onClick={() => onNavigate('trending')}
                        className="px-2 sm:px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-300 text-text-secondary hover:text-text-primary"
                    >
                        Trending
                    </button>
                     <button
                        onClick={() => onNavigate('admin-login')}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20"
                    >
                        <WrenchIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Admin</span>
                    </button>
                </div>
            </nav>
        </header>
    );
};
