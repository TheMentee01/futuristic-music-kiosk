import React from 'react';
import { CashAppPaymentScreen } from './CashAppPaymentScreen';

interface ExpressPaymentScreenProps {
  price: number;
  itemName: string;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const ExpressPaymentScreen: React.FC<ExpressPaymentScreenProps> = (props) => {
  return <CashAppPaymentScreen {...props} />;
};
