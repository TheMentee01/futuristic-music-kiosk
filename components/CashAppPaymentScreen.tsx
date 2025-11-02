import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { ChevronLeftIcon } from '../constants';
import { PinModal } from './common/PinModal';
import { useKioskConfig } from '../contexts/KioskConfigContext';

interface CashAppPaymentScreenProps {
    price: number;
    itemName: string;
    onPaymentSuccess: () => void;
    onBack: () => void;
}

export const CashAppPaymentScreen: React.FC<CashAppPaymentScreenProps> = ({ price, itemName, onPaymentSuccess, onBack }) => {
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const { settings } = useKioskConfig();
    const cashAppTag = settings.cashAppTag;
    
    const qrDataUrl = `https://cash.app/${cashAppTag}`; 
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrDataUrl)}`;


    const handleConfirmPayment = () => {
        setIsPinModalOpen(true);
    };
    
    const onPinConfirm = () => {
        setIsPinModalOpen(false);
        onPaymentSuccess();
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-bg-primary animate-fade-in">
            <Button variant="ghost" onClick={onBack} className="absolute top-24 left-6 !p-2">
                <ChevronLeftIcon className="w-8 h-8"/> Go Back
            </Button>
            <Card className="w-full max-w-md">
                <h2 className="text-3xl font-bold gradient-text mb-2 text-center">Complete Your Purchase</h2>
                <p className="text-center text-text-secondary mb-6">You are purchasing the <span className="font-bold text-accent-cyan">{itemName}</span> package for <span className="font-bold text-text-primary">${price.toFixed(2)}</span>.</p>
                
                <div className="flex flex-col items-center justify-center my-8">
                    <p className="font-bold text-xl text-accent-cyan mb-3 uppercase tracking-widest">SCAN HERE</p>
                    <div className="w-[250px] h-[250px] bg-white p-2 rounded-xl qr-glow-border flex items-center justify-center">
                        <img src={qrImageUrl} alt="Cash App QR Code for payment" className="w-full h-full object-contain rounded-lg" />
                    </div>
                     <div className="text-center mt-4">
                        <p className="text-5xl font-black gradient-text mt-2">{cashAppTag}</p>
                        <p className="text-text-secondary mt-2">{settings.businessEmail}</p>
                    </div>
                </div>

                <div className="mt-8 border-t border-white/20 pt-6">
                    <p className="text-center text-yellow-400 font-semibold mb-4">For Kiosk Operator</p>
                    <Button onClick={handleConfirmPayment} className="w-full text-lg !py-4 bg-green-500 hover:bg-green-600">
                        Confirm Payment Received
                    </Button>
                </div>
            </Card>
            
            <PinModal 
                isOpen={isPinModalOpen}
                onConfirm={onPinConfirm}
                onCancel={() => setIsPinModalOpen(false)}
                title="Admin Confirmation"
            />
        </div>
    );
};
