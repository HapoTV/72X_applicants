import { useState, useEffect } from 'react';
import type { TenderItem } from '../../interfaces/TenderlyAIData';

const STORAGE_KEY = 'tenderlyai_tenders';
const SAVED_TENDERS_KEY = 'tenderlyai_saved_tenders';

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

const DEFAULT_TENDERS: TenderItem[] = [
  {
    id: 'tnd-001',
    title: 'Agricultural Equipment Supply',
    buyer: 'Free State Agriculture Department',
    province: 'Free State',
    industry: 'Agriculture',
    publishedAt: 'Dec 18, 2024',
    closingAt: 'Feb 05, 2026',
    source: 'fs.gov.za',
    documentsCount: 2,
    status: 'EXPIRED',
  },
  {
    id: 'tnd-002',
    title: 'Software Licensing & Support',
    buyer: 'City of Johannesburg',
    province: 'Gauteng',
    industry: 'ICT & Software',
    publishedAt: 'Jan 09, 2026',
    closingAt: 'May 10, 2026',
    source: 'joburg.org.za',
    documentsCount: 4,
    status: 'OPEN',
  },
  {
    id: 'tnd-003',
    title: 'Cleaning Services for Public Facilities',
    buyer: 'Department of Public Works',
    province: 'Western Cape',
    industry: 'Cleaning & Hygiene',
    publishedAt: 'Jan 22, 2026',
    closingAt: 'May 02, 2026',
    source: 'gov.za',
    documentsCount: 3,
    status: 'OPEN',
  },
  {
    id: 'tnd-004',
    title: 'Security Services (24/7 Guarding)',
    buyer: 'Provincial Treasury',
    province: 'KwaZulu-Natal',
    industry: 'Security Services',
    publishedAt: 'Feb 14, 2026',
    closingAt: 'Apr 29, 2026',
    source: 'kzn.gov.za',
    documentsCount: 1,
    status: 'OPEN',
  },
  {
    id: 'tnd-005',
    title: 'Road Maintenance & Rehabilitation',
    buyer: 'SANRAL',
    province: 'North West',
    industry: 'Construction',
    publishedAt: 'Feb 01, 2026',
    closingAt: 'Jun 18, 2026',
    source: 'sanral.co.za',
    documentsCount: 6,
    status: 'OPEN',
  },
];

export const useTenders = () => {
  const [tenders, setTenders] = useState<TenderItem[]>(() =>
    loadStorage<TenderItem[]>(STORAGE_KEY, DEFAULT_TENDERS),
  );
  const [savedTenderIds, setSavedTenderIds] = useState<Set<string>>(() =>
    new Set(loadStorage<string[]>(SAVED_TENDERS_KEY, [])),
  );
  const [loading, setLoading] = useState(false);

  // Persist tenders to localStorage whenever they change
  useEffect(() => {
    saveStorage(STORAGE_KEY, tenders);
  }, [tenders]);

  // Persist saved tenders to localStorage whenever they change
  useEffect(() => {
    saveStorage(SAVED_TENDERS_KEY, Array.from(savedTenderIds));
  }, [savedTenderIds]);

  const addTender = async (tenderData: Omit<TenderItem, 'id'>) => {
    setLoading(true);
    try {
      const newTender: TenderItem = {
        ...tenderData,
        id: `tnd-${(tenders.length + 1).toString().padStart(3, '0')}`,
      };
      setTenders((prev) => [newTender, ...prev]);
      return newTender;
    } finally {
      setLoading(false);
    }
  };

  const updateTender = async (id: string, tenderData: Partial<TenderItem>) => {
    setLoading(true);
    try {
      setTenders((prev) =>
        prev.map((tender) => (tender.id === id ? { ...tender, ...tenderData } : tender)),
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteTender = async (id: string) => {
    setLoading(true);
    try {
      setTenders((prev) => prev.filter((tender) => tender.id !== id));
      // Also remove from saved if it was saved
      setSavedTenderIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSavedTender = (tenderId: string) => {
    setSavedTenderIds((prev) => {
      const next = new Set(prev);
      if (next.has(tenderId)) {
        next.delete(tenderId);
      } else {
        next.add(tenderId);
      }
      return next;
    });
  };

  const getSavedTenders = () => tenders.filter((t) => savedTenderIds.has(t.id));

  const getAllIndustries = () => {
    const industries = Array.from(new Set(tenders.map((t) => t.industry))).filter(Boolean);
    return industries;
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
    loading,
  };
};
