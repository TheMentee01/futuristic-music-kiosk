import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { ChevronLeftIcon } from '../constants';
import { ContactInfo } from '../types';

interface ContactInfoScreenProps {
    onSubmit: (info: ContactInfo) => void;
    onBack: () => void;
}

export const ContactInfoScreen: React.FC<ContactInfoScreenProps> = ({ onSubmit, onBack }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!name || !email) {
            setError('Name and Email are required.');
            return;
        }
        setError('');
        onSubmit({ name, email, phone });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-bg-primary animate-fade-in">
            <Button variant="ghost" onClick={onBack} className="absolute top-24 left-6 !p-2">
                <ChevronLeftIcon className="w-8 h-8"/> Go Back
            </Button>
            <Card className="w-full max-w-md">
                <h2 className="text-3xl font-bold gradient-text mb-2 text-center">Contact Information</h2>
                <p className="text-center text-text-secondary mb-6">Where should we send your song?</p>
                
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-bg-secondary p-3 rounded-lg border border-accent-purple/50 focus:outline-none focus:ring-2 focus:ring-accent-purple"
                    />
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-bg-secondary p-3 rounded-lg border border-accent-purple/50 focus:outline-none focus:ring-2 focus:ring-accent-purple"
                    />
                     <input 
                        type="tel" 
                        placeholder="Phone Number (Optional)" 
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-bg-secondary p-3 rounded-lg border border-accent-purple/50 focus:outline-none focus:ring-2 focus:ring-accent-purple"
                    />
                </div>
                
                {error && <p className="text-error text-center mt-4">{error}</p>}

                <Button onClick={handleSubmit} className="w-full text-lg !py-4 mt-8">
                    Submit and Continue
                </Button>
                 <Button variant="ghost" onClick={() => onSubmit({name: 'Guest', email: 'guest@example.com'})} className="w-full mt-2">
                    Skip for now
                </Button>
            </Card>
        </div>
    );
};
