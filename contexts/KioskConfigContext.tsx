import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { PricingTier, KioskFeatures, KioskSettings, Mood } from '../types';
import { PRICING_TIERS as defaultTiers, GENRES as defaultGenres, MOODS as defaultMoods, DEMO_TIER } from '../constants';

const KIOSK_CONFIG_KEY = 'kiosk_config';

const initialSettings: KioskSettings = {
    defaultDuration: 120,
    maxVoiceRecording: 90,
    adminPin: '505090',
    businessEmail: 'C2CFUTURISTICSHOP@GMAIL.COM',
    cashAppTag: '$5memo0'
};

const initialFeatures: KioskFeatures = {
    voiceCreations: true,
    instrumentals: true,
    express: true,
    freeDemo: true,
    aiEnhance: true,
    voiceCloning: false, // Disabled by default as it's a new feature
};


interface KioskConfigContextType {
    pricingTiers: PricingTier[];
    features: KioskFeatures;
    genres: string[];
    moods: Mood[];
    settings: KioskSettings;
    setPricingTiers: React.Dispatch<React.SetStateAction<PricingTier[]>>;
    setFeatures: React.Dispatch<React.SetStateAction<KioskFeatures>>;
    setGenres: React.Dispatch<React.SetStateAction<string[]>>;
    setMoods: React.Dispatch<React.SetStateAction<Mood[]>>;
    setSettings: React.Dispatch<React.SetStateAction<KioskSettings>>;
    saveConfiguration: () => void;
    resetConfiguration: () => void;
    isLoaded: boolean;
}

const KioskConfigContext = createContext<KioskConfigContextType | undefined>(undefined);

export const KioskConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(defaultTiers);
    const [features, setFeatures] = useState<KioskFeatures>(initialFeatures);
    const [genres, setGenres] = useState<string[]>(defaultGenres);
    const [moods, setMoods] = useState<Mood[]>(defaultMoods);
    const [settings, setSettings] = useState<KioskSettings>(initialSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedConfig = localStorage.getItem(KIOSK_CONFIG_KEY);
            if (savedConfig) {
                const { pricingTiers, features, genres, moods, settings } = JSON.parse(savedConfig);
                if(pricingTiers) setPricingTiers(pricingTiers);
                if(features) setFeatures(prev => ({ ...prev, ...features }));
                if(genres) setGenres(genres);
                if(moods) setMoods(moods);
                if(settings) setSettings(prev => ({ ...prev, ...settings }));
            }
        } catch (error) {
            console.error("Failed to load kiosk config from localStorage", error);
        }
        setIsLoaded(true);
    }, []);

    const saveConfiguration = useCallback(() => {
        try {
            const config = { pricingTiers, features, genres, moods, settings };
            localStorage.setItem(KIOSK_CONFIG_KEY, JSON.stringify(config));
            alert('Configuration saved successfully!');
        } catch (error) {
            console.error("Failed to save kiosk config to localStorage", error);
            alert('Error saving configuration.');
        }
    }, [pricingTiers, features, genres, moods, settings]);

    const resetConfiguration = useCallback(() => {
        if (window.confirm("Are you sure you want to reset all settings to their defaults? This cannot be undone.")) {
            localStorage.removeItem(KIOSK_CONFIG_KEY);
            setPricingTiers(defaultTiers);
            setFeatures(initialFeatures);
            setGenres(defaultGenres);
            setMoods(defaultMoods);
            setSettings(initialSettings);
            alert('Configuration has been reset to defaults.');
        }
    }, []);

    const value = {
        pricingTiers, features, genres, moods, settings,
        setPricingTiers, setFeatures, setGenres, setMoods, setSettings,
        saveConfiguration, resetConfiguration, isLoaded
    };

    return (
        <KioskConfigContext.Provider value={value}>
            {children}
        </KioskConfigContext.Provider>
    );
};

export const useKioskConfig = (): KioskConfigContextType => {
    const context = useContext(KioskConfigContext);
    if (context === undefined) {
        throw new Error('useKioskConfig must be used within a KioskConfigProvider');
    }
    return context;
};
