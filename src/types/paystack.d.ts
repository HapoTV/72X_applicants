// Paystack TypeScript declarations
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
  subaccount?: string;
  transaction_charge?: number;
  bearer?: string;
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

// You can also declare the module if needed
declare module 'paystack-js' {
  export interface PaystackOptions {}
  export interface PaystackResponse {}
  export interface PaystackHandler {}
}