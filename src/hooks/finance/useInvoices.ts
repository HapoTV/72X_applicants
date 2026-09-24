import { useState, useEffect } from 'react';
import type {
  Invoice,
  InvoiceStatus,
  InvoiceFilter,
} from '../../interfaces/FinanceData';
import FinanceService from '../../services/FinanceService';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);

        const data = await FinanceService.getInvoices();

        setInvoices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load finance invoices:', error);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const createInvoice = async (
    invoiceData: Omit<Invoice, 'id'>,
  ) => {
    setLoading(true);

    try {
      const newInvoice = await FinanceService.createInvoice(invoiceData);

      setInvoices((prev) => [newInvoice, ...prev]);

      return newInvoice;
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (
    id: string,
    invoiceData: Partial<Invoice>,
  ) => {
    setLoading(true);

    try {
      const updatedInvoice = await FinanceService.updateInvoice(
        id,
        invoiceData,
      );

      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? updatedInvoice : invoice,
        ),
      );

      return updatedInvoice;
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    setLoading(true);

    try {
      await FinanceService.deleteInvoice(id);

      setInvoices((prev) =>
        prev.filter((invoice) => invoice.id !== id),
      );
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (
    id: string,
    status: InvoiceStatus,
  ) => {
    setLoading(true);

    try {
      const updatedInvoice =
        await FinanceService.updateInvoiceStatus(id, status);

      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? updatedInvoice : invoice,
        ),
      );

      return updatedInvoice;
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceById = (id: string) =>
    invoices.find((invoice) => invoice.id === id);

  const filterInvoices = (filter: InvoiceFilter) => {
    if (filter === 'All') {
      return invoices;
    }

    return invoices.filter(
      (invoice) => invoice.status === filter,
    );
  };

  const getInvoicesByStatus = (status: InvoiceStatus) => {
    return invoices.filter(
      (invoice) => invoice.status === status,
    );
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