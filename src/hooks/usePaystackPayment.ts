import { useState, useEffect, useCallback, useRef } from 'react';
import { Currency } from '../interfaces/PaymentData';

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
  
  // Use refs to store callbacks to avoid recreating them
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
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Paystack script:', error);
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
  const handlePaystackCallback = useCallback((response: any) => {
    console.log('🔄 Paystack callback received:', response);
    
    if (response.status === 'success' && successCallbackRef.current) {
      setIsProcessing(true);
      
      // Call the success callback
      successCallbackRef.current(response.reference)
        .catch(error => {
          console.error('❌ Error in payment success callback:', error);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    } else {
      console.error('Payment failed or cancelled:', response);
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
      const reference = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error('Payment gateway is not configured. Please contact support.');
      }

      // Ensure PaystackPop is available
      if (!window.PaystackPop) {
        throw new Error('Payment service is not available. Please refresh the page.');
      }

      // Store callbacks in refs
      successCallbackRef.current = onSuccess;
      closeCallbackRef.current = onClose || (() => {});

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email.trim(),
        amount: Math.round(amount * 100), // Convert to kobo/cent
        ref: reference,
        currency: currency,
        metadata: metadata || {},
        callback: handlePaystackCallback, // Regular function, not async
        onClose: handlePaystackClose, // Regular function
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
        label: "72X Subscription",
        plan: "", // Add your plan code if you have subscription plans
      });

      handler.openIframe();

    } catch (error) {
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