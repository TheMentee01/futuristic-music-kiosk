import React from 'react';
import { CashAppPaymentScreen } from './CashAppPaymentScreen';

interface PaymentScreenProps {
  price: number;
  itemName: string;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = (props) => {
  return <CashAppPaymentScreen {...props} />;
};
