import { useCallback, useEffect, useState } from 'react';
import type { TenderItem } from '../../interfaces/TenderlyAIData';
import TenderlyAIService, {
  type TenderFilter,
} from '../../services/TenderlyAIService';

export const useTenders = () => {
  const [tenders, setTenders] = useState<TenderItem[]>([]);
  const [savedTenderIds, setSavedTenderIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTenders = useCallback(async (filters: TenderFilter = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await TenderlyAIService.listTenders(filters);

      setTenders(response.data ?? []);
      setTotal(response.total ?? 0);
      setPage(response.page ?? 0);
      setSize(response.size ?? 10);
      setTotalPages(response.totalPages ?? 0);

      // Keep saved IDs in sync with the backend response.
      const backendSavedIds = (response.data ?? [])
        .filter((tender) => tender.isSaved === true)
        .map((tender) => tender.id);

      setSavedTenderIds((previous) => {
        const next = new Set(previous);

        backendSavedIds.forEach((id) => next.add(id));

        return next;
      });

      return response;
    } catch (err) {
      console.error('Failed to fetch tenders:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load tenders',
      );

      setTenders([]);
      setTotal(0);
      setTotalPages(0);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSavedTenders = useCallback(async () => {
    try {
      const savedTenders = await TenderlyAIService.getSavedTenders();

      setSavedTenderIds(
        new Set(savedTenders.map((tender) => tender.id)),
      );

      return savedTenders;
    } catch (err) {
      console.error('Failed to fetch saved tenders:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load saved tenders',
      );

      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTenders({
      page: 0,
      size: 10,
    }).catch(() => {
      // Error is already stored in state.
    });

    fetchSavedTenders().catch(() => {
      // Error is already stored in state.
    });
  }, [fetchTenders, fetchSavedTenders]);

  const addTender = async (_tenderData: Omit<TenderItem, 'id'>) => {
    console.warn(
      'addTender is not supported by the current backend API.',
    );
  };

  const updateTender = async (
    _id: string,
    _tenderData: Partial<TenderItem>,
  ) => {
    console.warn(
      'updateTender is not supported by the current backend API.',
    );
  };

  const deleteTender = async (_id: string) => {
    console.warn(
      'deleteTender is not supported by the current backend API.',
    );
  };

  const toggleSavedTender = async (tenderId: string) => {
    setLoading(true);
    setError(null);

    const isCurrentlySaved = savedTenderIds.has(tenderId);

    try {
      if (isCurrentlySaved) {
        await TenderlyAIService.unsaveTender(tenderId);

        setSavedTenderIds((previous) => {
          const next = new Set(previous);
          next.delete(tenderId);
          return next;
        });

        setTenders((previous) =>
          previous.map((tender) =>
            tender.id === tenderId
              ? { ...tender, isSaved: false }
              : tender,
          ),
        );
      } else {
        await TenderlyAIService.saveTender(tenderId);

        setSavedTenderIds((previous) => {
          const next = new Set(previous);
          next.add(tenderId);
          return next;
        });

        setTenders((previous) =>
          previous.map((tender) =>
            tender.id === tenderId
              ? { ...tender, isSaved: true }
              : tender,
          ),
        );
      }
    } catch (err) {
      console.error('Failed to update saved tender:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update saved tender',
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSavedTenders = () =>
    tenders.filter(
      (tender) =>
        savedTenderIds.has(tender.id) ||
        tender.isSaved === true,
    );

  const getAllIndustries = () => {
    const industries = Array.from(
      new Set(
        tenders
          .map((tender) => tender.industry)
          .filter(Boolean),
      ),
    );

    return industries;
  };

  const loadFilteredTenders = async (filters: TenderFilter) => {
    return fetchTenders(filters);
  };

  return {
    tenders,
    savedTenderIds,

    addTender,
    updateTender,
    deleteTender,

    toggleSavedTender,
    getSavedTenders,
    getAllIndustries,

    fetchTenders,
    fetchSavedTenders,
    loadFilteredTenders,

    total,
    page,
    size,
    totalPages,

    loading,
    error,
  };
};
