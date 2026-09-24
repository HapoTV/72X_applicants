import { useEffect, useState } from 'react';
import type { Quote, QuoteStatus } from '../../interfaces/FinanceData';
import FinanceService from '../../services/FinanceService';

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);

  const loadQuotes = async () => {
    setLoading(true);

    try {
      const data = await FinanceService.getQuotes();

      setQuotes(
        data.map((quote) => ({
          id: quote.id,
          client: quote.client,
          reference: quote.reference ?? '',
          total: Number(quote.total ?? 0),
          status: quote.status as QuoteStatus,
          createdAt: quote.createdAt,
          expiresAt: quote.expiresAt,
          notes: quote.notes,
          items: quote.items,
        })),
      );
    } catch (error) {
      console.error('Failed to load finance quotes:', error);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadQuotes();
  }, []);

  const createQuote = async (quoteData: Omit<Quote, 'id'>) => {
    setLoading(true);

    try {
      const created = await FinanceService.createQuote({
        client: quoteData.client,
        reference: quoteData.reference,
        total: quoteData.total,
        status: quoteData.status,
        createdAt: quoteData.createdAt,
        expiresAt: quoteData.expiresAt,
        notes: quoteData.notes,
        items: quoteData.items,
      });

      const newQuote: Quote = {
        id: created.id,
        client: created.client,
        reference: created.reference ?? '',
        total: Number(created.total ?? 0),
        status: created.status as QuoteStatus,
        createdAt: created.createdAt,
        expiresAt: created.expiresAt,
        notes: created.notes,
        items: created.items,
      };

      setQuotes((prev) => [newQuote, ...prev]);

      return newQuote;
    } catch (error) {
      console.error('Failed to create finance quote:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuote = async (
    id: string,
    quoteData: Partial<Quote>,
  ) => {
    setLoading(true);

    try {
      const updated = await FinanceService.updateQuote(id, {
        client: quoteData.client,
        reference: quoteData.reference,
        total: quoteData.total,
        status: quoteData.status,
        createdAt: quoteData.createdAt,
        expiresAt: quoteData.expiresAt,
        notes: quoteData.notes,
        items: quoteData.items,
      });

      const updatedQuote: Quote = {
        id: updated.id,
        client: updated.client,
        reference: updated.reference ?? '',
        total: Number(updated.total ?? 0),
        status: updated.status as QuoteStatus,
        createdAt: updated.createdAt,
        expiresAt: updated.expiresAt,
        notes: updated.notes,
        items: updated.items,
      };

      setQuotes((prev) =>
        prev.map((quote) =>
          quote.id === id ? updatedQuote : quote,
        ),
      );

      return updatedQuote;
    } catch (error) {
      console.error('Failed to update finance quote:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuote = async (id: string) => {
    setLoading(true);

    try {
      await FinanceService.deleteQuote(id);

      setQuotes((prev) =>
        prev.filter((quote) => quote.id !== id),
      );
    } catch (error) {
      console.error('Failed to delete finance quote:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (
    id: string,
    status: QuoteStatus,
  ) => {
    setLoading(true);

    try {
      const updated = await FinanceService.updateQuoteStatus(
        id,
        status,
      );

      const updatedQuote: Quote = {
        id: updated.id,
        client: updated.client,
        reference: updated.reference ?? '',
        total: Number(updated.total ?? 0),
        status: updated.status as QuoteStatus,
        createdAt: updated.createdAt,
        expiresAt: updated.expiresAt,
        notes: updated.notes,
        items: updated.items,
      };

      setQuotes((prev) =>
        prev.map((quote) =>
          quote.id === id ? updatedQuote : quote,
        ),
      );

      return updatedQuote;
    } catch (error) {
      console.error('Failed to update quote status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getQuoteById = (id: string) =>
    quotes.find((quote) => quote.id === id);

  const filterQuotes = (status?: QuoteStatus) => {
    if (!status) return quotes;

    return quotes.filter(
      (quote) => quote.status === status,
    );
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
    refreshQuotes: loadQuotes,
  };
};