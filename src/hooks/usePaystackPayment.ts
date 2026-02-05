import { useState, useEffect, useCallback, useRef } from 'react';
import { Currency } from '../interfaces/PaymentData';

declare global {
  interface Window {
    PaystackPop: {
      setup(options: PaystackOptions): PaystackHandler;
    };
  }
}

interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  ref: string;
  currency?: string;
  metadata?: Record<string, any>;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
  channels?: string[];
  label?: string;
  plan?: string;
  quantity?: number;
  [key: string]: any;
}

interface PaystackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
  [key: string]: any;
}

interface PaystackHandler {
  openIframe(): void;
}

interface UsePaystackPaymentReturn {
  paystackLoaded: boolean;
  isProcessing: boolean;
  initializePayment: (config: PaystackConfig) => Promise<void>;
}

interface PaystackConfig {
  email: string;
  amount: number;
  currency?: Currency;
  metadata?: Record<string, any>;
  onSuccess: (reference: string) => Promise<void>;
  onClose?: () => void;
}

export const usePaystackPayment = (): UsePaystackPaymentReturn => {
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use refs to store the async callbacks
  const successCallbackRef = useRef<((reference: string) => Promise<void>) | null>(null);
  const closeCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Check if script is already loaded
    if (window.PaystackPop) {
      setPaystackLoaded(true);
      return;
    }

    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Paystack script loaded successfully');
      setPaystackLoaded(true);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Paystack script');
      setPaystackLoaded(false);
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Create a regular function that Paystack can call
  const handlePaystackCallback = useCallback((response: PaystackResponse) => {
    console.log('🔄 Paystack callback received:', response);
    
    // Paystack callback must be a regular function, not async
    if (response.status === 'success' && successCallbackRef.current) {
      setIsProcessing(true);
      
      // Call the async success callback but don't await here
      successCallbackRef.current(response.reference)
        .catch(error => {
          console.error('❌ Error in payment success callback:', error);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    } else if (response.status === 'error') {
      console.error('Payment error:', response.message);
      setIsProcessing(false);
    } else {
      console.log('Payment status:', response.status);
      setIsProcessing(false);
    }
  }, []);

  const handlePaystackClose = useCallback(() => {
    console.log('⚠️ Paystack payment modal closed');
    setIsProcessing(false);
    if (closeCallbackRef.current) {
      closeCallbackRef.current();
    }
  }, []);

  const initializePayment = useCallback(async ({
    email,
    amount,
    currency = Currency.ZAR,
    metadata,
    onSuccess,
    onClose
  }: PaystackConfig): Promise<void> => {
    if (!paystackLoaded) {
      throw new Error('Payment service is still loading. Please try again.');
    }

    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    setIsProcessing(true);

    try {
      const reference = `72X_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error('Payment gateway is not configured. Please contact support.');
      }

      if (!window.PaystackPop) {
        throw new Error('Payment service is not available. Please refresh the page.');
      }

      // Store the async callbacks in refs
      successCallbackRef.current = onSuccess;
      closeCallbackRef.current = onClose || (() => {});

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email.trim(),
        amount: Math.round(amount * 100), // Convert to kobo/cent
        ref: reference,
        currency: currency,
        metadata: metadata || {},
        channels: ['card', 'bank', 'ussd', 'mobile_money'],
        label: "72X Subscription",
        callback: handlePaystackCallback, // Regular function, NOT async
        onClose: handlePaystackClose, // Regular function, NOT async
      });

      handler.openIframe();

    } catch (error: any) {
      setIsProcessing(false);
      console.error('❌ Payment initialization error:', error);
      throw error;
    }
  }, [paystackLoaded, handlePaystackCallback, handlePaystackClose]);

  return {
    paystackLoaded,
    isProcessing,
    initializePayment
  };
};