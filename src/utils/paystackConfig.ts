// src/utils/paystackConfig.ts
export const PAYSTACK_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key_here',
  
  TEST_CARDS: {
    VISA: '5061 0600 0000 0000 08',
    VERVE: '5061 0600 0000 0000 17',
    MASTERCARD: '5399 8300 0000 0008',
    
    getRandomTestCard: () => {
      const cards = Object.values(PAYSTACK_CONFIG.TEST_CARDS).filter(v => typeof v === 'string');
      return cards[Math.floor(Math.random() * cards.length)];
    }
  },
  
  getPaymentUrl: (reference: string, email: string, amount: number, currency: string = 'ZAR') => {
    return `https://paystack.com/pay/${reference}?email=${encodeURIComponent(email)}&amount=${amount}&currency=${currency}`;
  }
};