import React from 'react';
import { PricingTier } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { useKioskConfig } from '../contexts/KioskConfigContext';

interface PricingScreenProps {
    onSelectTier: (tier: PricingTier) => void;
}

const PricingCard: React.FC<{ tier: PricingTier; onSelect: () => void; }> = ({ tier, onSelect }) => (
    <Card className="relative flex flex-col items-center text-center border-2 border-transparent hover:border-accent-cyan hover:shadow-glow-cyan transition-all duration-300 transform hover:-translate-y-2 h-full">
        {tier.isPopular && (
            <div className="absolute -top-4 bg-accent-pink text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                MOST POPULAR
            </div>
        )}
        {tier.isBestValue && (
            <div className="absolute -top-4 bg-success text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                BEST VALUE
            </div>
        )}
        <h3 className="text-2xl font-bold text-accent-cyan">{tier.name}</h3>
        <p className="text-5xl font-black my-4 gradient-text">${tier.price}</p>
        <p className="text-lg font-semibold text-text-primary">
            {tier.songCreations === Infinity ? 'Unlimited' : tier.songCreations} Song Creation{tier.songCreations > 1 || tier.songCreations === Infinity ? 's' : ''}
        </p>
        <ul className="text-text-secondary my-6 space-y-2 flex-grow">
            {tier.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-left">
                    <span className="text-accent-teal">✓</span> {feature}
                </li>
            ))}
        </ul>
        <Button onClick={onSelect} className="w-full mt-auto">SELECT</Button>
    </Card>
);


export const PricingScreen: React.FC<PricingScreenProps> = ({ onSelectTier }) => {
    const { pricingTiers } = useKioskConfig();
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-bg-primary overflow-y-auto pt-24">
            <header className="text-center mb-12 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text tracking-tight">
                    Create Your Music with Your Voice
                </h1>
                <p className="text-text-secondary mt-4 max-w-2xl mx-auto text-lg">
                    Purchase a package to start. Create songs, get stems, and extend your creations.
                </p>
            </header>
            <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-2xl">
                {pricingTiers.map((tier, index) => (
                    <div key={tier.id} className="animate-slide-in-up" style={{ animationDelay: `${200 + index * 100}ms` }}>
                        <PricingCard tier={tier} onSelect={() => onSelectTier(tier)} />
                    </div>
                ))}
            </main>
        </div>
    );
};
