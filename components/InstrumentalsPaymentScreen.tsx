import React from 'react';
import { CashAppPaymentScreen } from './CashAppPaymentScreen';

interface InstrumentalsPaymentScreenProps {
  price: number;
  itemName: string;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const InstrumentalsPaymentScreen: React.FC<InstrumentalsPaymentScreenProps> = (props) => {
  return <CashAppPaymentScreen {...props} />;
};
