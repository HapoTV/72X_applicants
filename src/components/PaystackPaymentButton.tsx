import React from 'react';
import { Button } from './ui/button';
import { Loader2, CreditCard, Shield } from 'lucide-react';
import { Currency } from '../interfaces/PaymentData';
import { usePaystackPayment } from '../hooks/usePaystackPayment';

interface PaystackPaymentButtonProps {
  email: string;
  amount: number;
  currency?: Currency;
  metadata?: Record<string, any>;
  onSuccess: (reference: string) => Promise<void>;
  onClose?: () => void;
  disabled?: boolean;
  buttonText?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const PaystackPaymentButton: React.FC<PaystackPaymentButtonProps> = ({
  email,
  amount,
  currency = Currency.ZAR,
  metadata,
  onSuccess,
  onClose,
  disabled = false,
  buttonText = "Pay Now",
  className = "",
  variant = "default",
  size = "lg"
}) => {
  const { paystackLoaded, isProcessing, initializePayment } = usePaystackPayment();

  const handleClick = async () => {
    if (!paystackLoaded || isProcessing || disabled || !email || !amount) {
      return;
    }

    try {
      await initializePayment({
        email,
        amount,
        currency,
        metadata,
        onSuccess,
        onClose
      });
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      if (onClose) onClose();
    }
  };

  const isButtonDisabled = !paystackLoaded || isProcessing || disabled || !email || !amount;

  return (
    <Button
      onClick={handleClick}
      disabled={isButtonDisabled}
      className={`flex items-center gap-2 ${className}`}
      variant={variant}
      size={size}
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4" />
          {buttonText}
        </>
      )}
    </Button>
  );
};

export default PaystackPaymentButton;