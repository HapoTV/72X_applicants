import { useState, useEffect } from 'react';
import type { Quote, QuoteStatus } from '../../interfaces/FinanceData';

const STORAGE_KEY = 'finance_manager_quotes';

const loadStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const DEFAULT_QUOTES: Quote[] = [
  {
    id: 'Q-001',
    client: 'Maputo Retail Co.',
    reference: 'Retail Launch',
    total: 7800,
    status: 'Sent',
    createdAt: '2026-05-12',
    expiresAt: '2026-06-12',
  },
  {
    id: 'Q-002',
    client: 'Sunrise Bakery',
    reference: 'Bakery Refurb',
    total: 12450,
    status: 'Draft',
    createdAt: '2026-05-25',
    expiresAt: '2026-06-25',
  },
];

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>(() =>
    loadStorage<Quote[]>(STORAGE_KEY, DEFAULT_QUOTES),
  );
  const [loading, setLoading] = useState(false);

  // Persist quotes to localStorage whenever they change
  useEffect(() => {
    saveStorage(STORAGE_KEY, quotes);
  }, [quotes]);

  const createQuote = async (quoteData: Omit<Quote, 'id'>) => {
    setLoading(true);
    try {
      const newQuote: Quote = {
        ...quoteData,
        id: `Q-${(quotes.length + 1).toString().padStart(3, '0')}`,
      };
      setQuotes((prev) => [newQuote, ...prev]);
      return newQuote;
    } finally {
      setLoading(false);
    }
  };

  const updateQuote = async (id: string, quoteData: Partial<Quote>) => {
    setLoading(true);
    try {
      setQuotes((prev) =>
        prev.map((quote) => (quote.id === id ? { ...quote, ...quoteData } : quote)),
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteQuote = async (id: string) => {
    setLoading(true);
    try {
      setQuotes((prev) => prev.filter((quote) => quote.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (id: string, status: QuoteStatus) => {
    setLoading(true);
    try {
      setQuotes((prev) =>
        prev.map((quote) => (quote.id === id ? { ...quote, status } : quote)),
      );
    } finally {
      setLoading(false);
    }
  };

  const getQuoteById = (id: string) => quotes.find((q) => q.id === id);

  const filterQuotes = (status?: QuoteStatus) => {
    if (!status) return quotes;
    return quotes.filter((quote) => quote.status === status);
  };

  return {
    quotes,
    loading,
    createQuote,
    updateQuote,
    deleteQuote,
    updateQuoteStatus,
    getQuoteById,
    filterQuotes,
  };
};
