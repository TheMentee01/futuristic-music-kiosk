
import React, { useState } from 'react';
import { Page, useKioskState } from './hooks/useKioskState';
import { PricingTier, VoiceRecording, SongDescription, Song, ExpressRequest, InstrumentalRequest, ContactInfo, Session } from './types';
import { KioskSelectionScreen } from './components/KioskSelectionScreen';
import { PricingScreen } from './components/PricingScreen';
import { RecordingScreen } from './components/RecordingScreen';
import { DescriptionScreen } from './components/DescriptionScreen';
import { CashAppPaymentScreen } from './components/CashAppPaymentScreen';
import { GenerationModal } from './components/GenerationModal';
import { PlaybackScreen } from './components/PlaybackScreen';
import { Header } from './components/Header';
import { generateSong, pollGeneration } from './services/sonautoService';
import { TrendingScreen } from './components/TrendingScreen';
import { AdminLoginScreen } from './components/AdminLoginScreen';
import { AdminScreen } from './components/AdminScreen';
import { FloatingAdminButton } from './components/FloatingAdminButton';
import { useSession } from './services/sessionService';
import { InstrumentalsScreen } from './components/InstrumentalsScreen';
import { ExpressScreen } from './components/ExpressScreen';
import { ContactInfoScreen } from './components/ContactInfoScreen';
import { DEMO_TIER, INSTRUMENTAL_PRICE, EXPRESS_PRICE } from './constants';
import { sendEmailWithTrack } from './services/emailService';
import { KioskConfigProvider, useKioskConfig } from './contexts/KioskConfigContext';
import { CreatorsStudioScreen } from './components/CreatorsStudioScreen';
import { CeoTestingPanel } from './components/CeoTestingPanel';


const KioskApp: React.FC = () => {
    const { currentPage, previousPage, navigate, goBack } = useKioskState('home');
    const { isAdmin, login, logout } = useSession();
    const { settings, isLoaded } = useKioskConfig();

    // App state
    const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
    const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
    const [description, setDescription] = useState<Omit<SongDescription, 'generationMode'> | null>(null);
    const [song, setSong] = useState<Song | null>(null);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [paymentContext, setPaymentContext] = useState<{ price: number; itemName: string; pageAfterContactInfo: Page } | null>(null);
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);


    const handleSelectMode = (mode: 'creator' | 'instrumentals' | 'express' | 'admin' | 'demo') => {
        if (mode === 'creator') navigate('pricing');
        if (mode === 'instrumentals') navigate('instrumentals');
        if (mode === 'express') navigate('express');
        if (mode === 'admin') navigate('admin-login');
        if (mode === 'demo') {
            setSelectedTier(DEMO_TIER);
            navigate('recording'); // Skip payment for demo
        }
    };

    const handleCeoAccess = () => {
        navigate('ceo-testing');
    };

    const handleSelectTier = (tier: PricingTier) => {
        setSelectedTier(tier);
        setPaymentContext({ price: tier.price, itemName: tier.name, pageAfterContactInfo: 'recording' });
        navigate('payment');
    };

    const handleRecordingsReady = (recordings: VoiceRecording[]) => {
        setRecordings(recordings);
        navigate('description');
    };
    
    const handleDescriptionSubmit = async (desc: Omit<SongDescription, 'generationMode'>) => {
        setDescription(desc);
        navigate('generating');
        await runGenerationProcess(desc);
    };
    
    const handleInstrumentalSubmit = (request: InstrumentalRequest) => {
        const desc: Omit<SongDescription, 'generationMode'> = {
            prompt: request.prompt, genres: [], mood: '', duration: settings.defaultDuration, lyrics: '', isInstrumental: true,
            isAiEnhanced: request.isAiEnhanced,
            isFancyMode: request.isFancyMode
        };
        const tier: PricingTier = { id: 'inst-tier', name: 'Instrumental Beat', price: INSTRUMENTAL_PRICE, songCreations: 1, maxRecordingSeconds: 0, features: [] };
        setSelectedTier(tier);
        setDescription(desc);
        setPaymentContext({ price: tier.price, itemName: tier.name, pageAfterContactInfo: 'generating' });
        navigate('payment');
    };
    
    const handleExpressSubmit = (request: ExpressRequest) => {
         const desc: Omit<SongDescription, 'generationMode'> = {
            prompt: request.prompt, genres: [], mood: '', duration: settings.defaultDuration, lyrics: '', isInstrumental: request.isInstrumental,
            isAiEnhanced: request.isAiEnhanced,
            isFancyMode: request.isFancyMode
        };
        const tier: PricingTier = { id: 'exp-tier', name: 'Express Song', price: EXPRESS_PRICE, songCreations: 1, maxRecordingSeconds: 0, features: [] };
        setSelectedTier(tier);
        setDescription(desc);
        setPaymentContext({ price: tier.price, itemName: tier.name, pageAfterContactInfo: 'generating' });
        navigate('payment');
    };

    const runGenerationProcess = async (descOverride?: Omit<SongDescription, 'generationMode'> | null, tierOverride?: PricingTier | null) => {
        const descToGenerate = descOverride || description;
        const tierToUse = tierOverride || selectedTier;
        
        if (!descToGenerate || !tierToUse) {
            console.error("Missing description or tier for song generation.", { descToGenerate, selectedTier: tierToUse });
            alert("Something went wrong. Could not find song description or pricing tier.");
            handleRestart();
            return;
        }

        try {
            setGenerationProgress(5);
            const taskId = await generateSong(descToGenerate);
            setGenerationProgress(10);
            
            const audioUrl = await pollGeneration(taskId, (progress) => {
                // Polling will take the progress from 10% to 95%
                setGenerationProgress(10 + progress * 0.85);
            });
            
            const newSong: Song = {
                id: taskId,
                title: descToGenerate.prompt.substring(0, 30) || 'Untitled',
                audioUrl: audioUrl,
                imageUrl: `https://picsum.photos/seed/${taskId}/500/500`,
                description: descToGenerate,
                tier: tierToUse,
            };
            setSong(newSong);
            
            if (contactInfo) {
                const newSession: Session = {
                    id: newSong.id,
                    contactInfo: contactInfo,
                    song: newSong,
                    status: 'Pending',
                };
                sendEmailWithTrack(newSession, settings.businessEmail);
                const sentSession = { ...newSession, status: 'Sent' as const };
                setSessions(prev => [...prev, sentSession]);
            }

            setGenerationProgress(100);
            setTimeout(() => navigate('playback'), 1000); // Short delay to show 100%
        } catch (error) {
            console.error('Song generation failed:', error);
            alert(`There was an error generating your song: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
            handleRestart();
        }
    };

    const handleCeoGenerateTrack = async (config: { prompt: string; workflow: string; duration: number; tier: PricingTier; customerInfo: ContactInfo }) => {
        setSelectedTier(config.tier);
        setContactInfo(config.customerInfo);

        const desc: Omit<SongDescription, 'generationMode'> = {
            prompt: config.prompt,
            genres: [],
            mood: 'Test',
            duration: config.duration,
            lyrics: '',
            isInstrumental: config.workflow === 'instrumental' || config.workflow === 'express-instrumental',
            isAiEnhanced: true,
        };
        
        setDescription(desc);
        navigate('generating');
        await runGenerationProcess(desc, config.tier);
    };


    const handlePaymentSuccess = () => {
        navigate('contact-info');
    };
    
    const handleContactInfoSubmit = async (info: ContactInfo) => {
        const finalDescription = description;
        setContactInfo(info);
        console.log('Contact Info Captured:', info); // For admin/logging purposes

        const pageAfterContactInfo = paymentContext?.pageAfterContactInfo;

        if (pageAfterContactInfo === 'generating') {
            navigate('generating');
            await runGenerationProcess(finalDescription);
        } else if (pageAfterContactInfo) {
            navigate(pageAfterContactInfo);
        } else {
            // Fallback in case context is lost
            handleRestart();
        }
    };


    const handleRestart = () => {
        setSelectedTier(null);
        setRecordings([]);
        setDescription(null);
        setSong(null);
        setGenerationProgress(0);
        setPaymentContext(null);
        setContactInfo(null);
        navigate('home');
    };

    const handleLogin = (pin: string): boolean => {
        const success = login(pin, settings.adminPin);
        if (success) {
            navigate('admin');
        }
        return success;
    };
    
    const handleLogout = () => {
        logout();
        navigate('home');
    }

    const handleUpdateSessionStatus = (sessionId: string, status: 'Pending' | 'Sent') => {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status } : s));
    };

    const renderPage = () => {
        if (!isLoaded) {
             return <div className="min-h-screen flex items-center justify-center"><h1 className="gradient-text text-3xl">Loading Kiosk...</h1></div>
        }

        if(isAdmin && !['admin', 'creators-studio'].includes(currentPage)) {
             return <AdminScreen sessions={sessions} onUpdateSessionStatus={handleUpdateSessionStatus} onLogout={handleLogout} onNavigate={navigate}/>;
        }

        switch (currentPage) {
            case 'home': return <KioskSelectionScreen onSelect={handleSelectMode} onCeoAccess={handleCeoAccess} />;
            case 'pricing': return <PricingScreen onSelectTier={handleSelectTier} />;
            case 'payment': return <CashAppPaymentScreen price={paymentContext!.price} itemName={paymentContext!.itemName} onPaymentSuccess={handlePaymentSuccess} onBack={goBack} />;
            case 'recording': 
                const tierForRecording = selectedTier ? { ...selectedTier, maxRecordingSeconds: selectedTier.isDemo ? 15 : settings.maxVoiceRecording } : DEMO_TIER;
                return <RecordingScreen tier={tierForRecording} onRecordingsReady={handleRecordingsReady} onBack={() => selectedTier?.isDemo ? navigate('home') : goBack()} />;
            case 'description': return <DescriptionScreen onSubmit={handleDescriptionSubmit} onBack={() => navigate('recording')} />;
            case 'instrumentals': return <InstrumentalsScreen onSubmit={handleInstrumentalSubmit} />;
            case 'express': return <ExpressScreen onSubmit={handleExpressSubmit} />;
            case 'contact-info': return <ContactInfoScreen onSubmit={handleContactInfoSubmit} onBack={() => navigate('payment')} />;
            case 'playback': return <PlaybackScreen song={song!} onRestart={handleRestart} />;
            case 'trending': return <TrendingScreen />;
            case 'ceo-testing': return <CeoTestingPanel onBack={handleRestart} onGenerateTrack={handleCeoGenerateTrack} />;

            // Admin pages
            case 'admin-login': return <AdminLoginScreen onLogin={handleLogin} onBack={goBack} />;
            case 'admin': return <AdminScreen sessions={sessions} onUpdateSessionStatus={handleUpdateSessionStatus} onLogout={handleLogout} onNavigate={navigate} />;
            case 'creators-studio': return <CreatorsStudioScreen onBack={() => navigate('admin')} />;

            default: return <div>Page not found</div>;
        }
    };
    
    const showHeader = !['generating', 'home', 'ceo-testing'].includes(currentPage);

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary font-sans">
            {showHeader && <Header currentPage={currentPage} previousPage={previousPage} onNavigate={(page) => navigate(page)} />}
            
            {renderPage()}

            {currentPage === 'generating' && (
                <GenerationModal progress={generationProgress} />
            )}
            {!isAdmin && !['admin-login', 'ceo-testing'].includes(currentPage) && <FloatingAdminButton onNavigate={navigate}/>}
        </div>
    );
};


const App: React.FC = () => (
    <KioskConfigProvider>
        <KioskApp />
    </KioskConfigProvider>
);


export default App;