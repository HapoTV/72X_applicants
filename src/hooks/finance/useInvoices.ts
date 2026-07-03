import { useState, useEffect } from 'react';
import type { Invoice, InvoiceStatus, InvoiceFilter } from '../../interfaces/FinanceData';

const STORAGE_KEY = 'finance_manager_invoices';

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

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'INV-1024',
    customer: 'Maputo Retail Co.',
    invoiceNumber: 'INV-1024',
    reference: 'Store launch',
    total: 7800,
    status: 'Awaiting Payment',
    issuedAt: '2026-05-15',
    dueAt: '2026-06-15',
  },
  {
    id: 'INV-1025',
    customer: 'Greenfield Services',
    invoiceNumber: 'INV-1025',
    reference: 'Consulting fee',
    total: 2300,
    status: 'Paid',
    issuedAt: '2026-05-05',
    dueAt: '2026-05-20',
  },
];

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    loadStorage<Invoice[]>(STORAGE_KEY, DEFAULT_INVOICES),
  );
  const [loading, setLoading] = useState(false);

  // Persist invoices to localStorage whenever they change
  useEffect(() => {
    saveStorage(STORAGE_KEY, invoices);
  }, [invoices]);

  const createInvoice = async (invoiceData: Omit<Invoice, 'id'>) => {
    setLoading(true);
    try {
      const newInvoice: Invoice = {
        ...invoiceData,
        id:
          invoiceData.invoiceNumber ||
          `INV-${(invoices.length + 1024).toString()}`,
      };
      setInvoices((prev) => [newInvoice, ...prev]);
      return newInvoice;
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    setLoading(true);
    try {
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, ...invoiceData } : invoice,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    setLoading(true);
    try {
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (id: string, status: InvoiceStatus) => {
    setLoading(true);
    try {
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, status } : invoice,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceById = (id: string) => invoices.find((i) => i.id === id);

  const filterInvoices = (filter: InvoiceFilter) => {
    if (filter === 'All') return invoices;
    return invoices.filter((invoice) => invoice.status === filter);
  };

  const getInvoicesByStatus = (status: InvoiceStatus) => {
    return invoices.filter((invoice) => invoice.status === status);
  };

  return {
    invoices,
    loading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    getInvoiceById,
    filterInvoices,
    getInvoicesByStatus,
  };
};
