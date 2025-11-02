import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Page } from '../hooks/useKioskState';
import { Session, PricingTier, Mood } from '../types';
import { sendEmailWithTrack } from '../services/emailService';
import { useKioskConfig } from '../contexts/KioskConfigContext';
import { TrashIcon, FUTURE_FEATURES, API_STATUS } from '../constants';

interface AdminScreenProps {
    sessions: Session[];
    onUpdateSessionStatus: (sessionId: string, status: 'Pending' | 'Sent') => void;
    onLogout: () => void;
    onNavigate: (page: Page) => void;
}

const convertToCSV = (sessions: Session[]): string => {
    const headers = ['Date', 'Customer Name', 'Email', 'Phone', 'Order Type', 'Price', 'Track URL'];
    const rows = sessions.map(s => {
        const date = new Date(parseInt(s.id)).toLocaleString();
        const rowData = [
            date,
            s.contactInfo.name,
            s.contactInfo.email,
            s.contactInfo.phone || '',
            s.song.tier.name,
            s.song.tier.price,
            s.song.audioUrl
        ];
        return rowData.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
    });
    return [headers.join(','), ...rows].join('\n');
};

export const AdminScreen: React.FC<AdminScreenProps> = ({ sessions, onUpdateSessionStatus, onLogout, onNavigate }) => {
    const {
        pricingTiers, setPricingTiers,
        features, setFeatures,
        genres, setGenres,
        moods, setMoods,
        settings, setSettings,
        saveConfiguration, resetConfiguration
    } = useKioskConfig();

    const [aiEditPrompt, setAiEditPrompt] = useState('');
    const [aiEditResult, setAiEditResult] = useState('');
    
    const handleSendEmail = (session: Session) => {
        sendEmailWithTrack(session, settings.businessEmail);
        alert(`Email sent to ${session.contactInfo.email}`);
    };
    
    const handleExportCSV = () => {
        if (sessions.length === 0) {
            alert("No session data to export.");
            return;
        }
        const csvData = convertToCSV(sessions);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `kiosk_sessions_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    const handleTierChange = <K extends keyof PricingTier>(index: number, field: K, value: PricingTier[K]) => {
        const updatedTiers = [...pricingTiers];
        updatedTiers[index] = { ...updatedTiers[index], [field]: value };
        setPricingTiers(updatedTiers);
    };

    const addNewTier = () => {
        setPricingTiers([...pricingTiers, { id: `new-${Date.now()}`, name: 'New Tier', price: 0, songCreations: 1, maxRecordingSeconds: 60, features: ['Feature 1'] }]);
    };

    const deleteTier = (index: number) => {
        if (window.confirm(`Are you sure you want to delete the "${pricingTiers[index].name}" tier?`)) {
            setPricingTiers(pricingTiers.filter((_, i) => i !== index));
        }
    };

    const handleAiEdit = async () => {
        const prompt = aiEditPrompt.toLowerCase().trim();
        if (!prompt) return;

        let resultText = "Could not understand the command.";
        
        const priceMatch = prompt.match(/(?:change|set) tier (\d+) price to \$?(\d+)/);
        if (priceMatch) {
            const tierIndex = parseInt(priceMatch[1], 10) - 1;
            const newPrice = parseInt(priceMatch[2], 10);
            if (tierIndex >= 0 && tierIndex < pricingTiers.length) {
                handleTierChange(tierIndex, 'price', newPrice);
                resultText = `Updated Tier ${tierIndex + 1} price to $${newPrice}.`;
            }
        }

        const toggleMatch = prompt.match(/(turn off|disable|turn on|enable) (.+) mode/);
        if (toggleMatch) {
            const action = toggleMatch[1];
            const featureName = toggleMatch[2].replace(/\s/g, '').toLowerCase();
            const newState = action === 'turn on' || action === 'enable';
            
            const featureKey = Object.keys(features).find(k => k.toLowerCase().includes(featureName));
            if(featureKey) {
                setFeatures(prev => ({...prev, [featureKey]: newState}));
                resultText = `${newState ? 'Enabled' : 'Disabled'} ${featureKey}.`;
            }
        }
        
        const addGenreMatch = prompt.match(/add genre:?\s*(.+)/);
        if (addGenreMatch) {
            const newGenre = addGenreMatch[1].trim();
            if (newGenre && !genres.includes(newGenre)) {
                setGenres([...genres, newGenre]);
                resultText = `Added genre: ${newGenre}.`;
            }
        }

        setAiEditResult(resultText);
        setAiEditPrompt('');
    };

    return (
        <div className="min-h-screen w-full p-4 md:p-8 bg-bg-primary animate-fade-in pt-24">
            <Card className="w-full max-w-6xl">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text">Admin Dashboard</h1>
                        <p className="text-text-secondary mt-2">Manage customer songs and kiosk settings.</p>
                    </div>
                     <div className="flex gap-4">
                        <Button
                            onClick={() => onNavigate('creators-studio')}
                            style={{ background: 'linear-gradient(135deg, #ffd700 0%, #00d9ff 100%)', border: 'none' }}
                            className="text-black font-bold !px-6 !py-3 text-base"
                        >
                          ⚡ CEO Creator's Studio (VIP Access)
                        </Button>
                        <Button variant="secondary" className="!border-error !text-error hover:!bg-error/10" onClick={onLogout}>Logout</Button>
                    </div>
                </div>

                <div className="mb-8">
                     <h2 className="text-2xl font-bold text-accent-cyan mb-4">API Status</h2>
                     <div className="api-status-grid">
                      <div className="api-card">
                        <h3>🎵 Sonauto</h3>
                        <div className="status-indicator status-success">✓ {API_STATUS.SONAUTO.status}</div>
                        <p>{API_STATUS.SONAUTO.features[0]}</p>
                        <p className="api-tier">{API_STATUS.SONAUTO.tier} Tier</p>
                      </div>
                      
                      <div className="api-card">
                        <h3>🤖 Gemini</h3>
                        <div className="status-indicator status-success">✓ {API_STATUS.GEMINI.status}</div>
                        <p>{API_STATUS.GEMINI.features[0]}</p>
                        <p className="api-tier">{API_STATUS.GEMINI.tier} Tier</p>
                      </div>
                      
                      <div className="api-card">
                        <h3>🎨 Replicate</h3>
                        <div className="status-indicator status-success">✓ {API_STATUS.REPLICATE.status}</div>
                        <p>{API_STATUS.REPLICATE.features[0]}</p>
                        <p className="api-credit">{API_STATUS.REPLICATE.credit} Credit</p>
                      </div>
                    </div>
                </div>

                <div className="mb-12">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-accent-cyan">Session History</h2>
                        <Button variant="secondary" onClick={handleExportCSV}>Export CSV</Button>
                    </div>
                    <div className="overflow-x-auto bg-bg-secondary rounded-lg border border-white/10 max-h-96">
                        {sessions.length > 0 ? (
                            <table className="w-full text-left min-w-[600px]">
                                <thead className="border-b border-white/10 sticky top-0 bg-bg-secondary">
                                    <tr>
                                        <th className="p-4">Date</th><th className="p-4">Customer</th><th className="p-4">Track</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map(session => (
                                        <tr key={session.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5">
                                            <td className="p-4 text-text-secondary">{new Date(parseInt(session.id)).toLocaleString()}</td>
                                            <td className="p-4 font-semibold">{session.contactInfo.name}</td>
                                            <td className="p-4 text-text-secondary italic">"{session.song.title}"</td>
                                            <td className="p-4 text-text-secondary">${session.song.tier.price.toFixed(2)}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${session.status === 'Sent' ? 'bg-success/20 text-success' : 'bg-yellow-400/20 text-yellow-400'}`}>
                                                    {session.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" onClick={() => window.open(session.song.audioUrl, '_blank')} className="!py-1 !px-3 text-sm">▶️ Play</Button>
                                                    <Button variant="secondary" onClick={() => handleSendEmail(session)} className="!py-1 !px-3 text-sm">📧 Send</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p className="text-center p-8 text-text-secondary">No customer sessions recorded yet.</p>}
                    </div>
                </div>

                <div className="mt-8 p-6 bg-bg-secondary/50 rounded-lg border border-white/10">
                    <h2 className="text-3xl font-bold gradient-text mb-6 text-center">⚙️ Kiosk Configuration</h2>
                    
                    <div className="mb-8 p-4 bg-black/20 rounded-md border border-white/10">
                        <h3 className="text-xl font-bold text-accent-teal mb-4">💰 Pricing Tiers</h3>
                        <div className="space-y-3">
                            {pricingTiers.map((tier, index) => (
                                <div key={tier.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center p-2 rounded bg-bg-primary/50">
                                    <input type="text" value={tier.name} onChange={e => handleTierChange(index, 'name', e.target.value)} placeholder="Tier Name" className="bg-bg-secondary p-2 rounded border border-white/20"/>
                                    <input type="number" value={tier.price} onChange={e => handleTierChange(index, 'price', Number(e.target.value))} placeholder="Price" className="bg-bg-secondary p-2 rounded border border-white/20"/>
                                    <input type="number" value={tier.songCreations} onChange={e => handleTierChange(index, 'songCreations', Number(e.target.value))} placeholder="Songs" className="bg-bg-secondary p-2 rounded border border-white/20"/>
                                    <Button variant="secondary" onClick={() => deleteTier(index)} className="!border-error !text-error hover:!bg-error/10"><TrashIcon className="w-4 h-4 mr-2"/>Delete</Button>
                                </div>
                            ))}
                        </div>
                        <Button onClick={addNewTier} className="mt-4">➕ Add New Tier</Button>
                    </div>

                    <div className="mb-8 p-4 bg-black/20 rounded-md border border-white/10">
                        <h3 className="text-xl font-bold text-accent-teal mb-4">🎛️ Feature Toggles</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(features).map(([key, value]) => (
                                <label key={key} className="flex items-center gap-3 p-3 bg-bg-secondary rounded-md cursor-pointer hover:bg-white/5">
                                    <input type="checkbox" checked={value} onChange={e => setFeatures(prev => ({ ...prev, [key as keyof typeof features]: e.target.checked }))} className="w-5 h-5 accent-accent-cyan"/>
                                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8 p-4 rounded-md border border-accent-purple/50 bg-gradient-to-br from-accent-purple/5 to-accent-cyan/5">
                        <h3 className="text-xl font-bold text-accent-teal mb-4">🤖 AI Quick Edit</h3>
                        <p className="text-sm text-text-secondary mb-3">Use natural language to modify kiosk settings.</p>
                        <div className="flex gap-3">
                            <textarea value={aiEditPrompt} onChange={e => setAiEditPrompt(e.target.value)} placeholder="e.g., 'Change tier 2 price to $30' or 'Turn off express mode'" className="w-full bg-bg-secondary p-2 rounded border border-white/20 resize-none" rows={2}/>
                            <Button onClick={handleAiEdit}>✨ Apply</Button>
                        </div>
                        {aiEditResult && <p className="mt-2 text-success text-sm p-2 bg-success/10 rounded">Applied: {aiEditResult}</p>}
                    </div>

                    <div className="mt-8 p-4 bg-black/20 rounded-md border border-white/10">
                        <h3 className="text-xl font-bold text-accent-teal mb-4">🚀 Coming Soon Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(FUTURE_FEATURES).map(([key, feature]) => (
                                <div key={key} className="bg-bg-secondary p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-text-primary">{feature.description}</p>
                                    </div>
                                    <div>
                                    {feature.comingSoon ? (
                                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-500/20 text-blue-300">
                                            📅 {feature.estimatedRelease || 'Coming Soon'}
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-success/20 text-success">
                                            ✅ Available
                                        </span>
                                    )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-center gap-4 border-t border-white/10 pt-6">
                        <Button onClick={saveConfiguration} className="!px-8 !py-3 text-lg">💾 Save All Configuration</Button>
                        <Button onClick={resetConfiguration} variant="secondary" className="!border-error !text-error hover:!bg-error/10">🔄 Reset to Defaults</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};