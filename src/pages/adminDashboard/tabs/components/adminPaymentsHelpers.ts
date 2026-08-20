import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react';
import { PaymentStatus } from '../../../../interfaces/PaymentData';
import type { PaymentFilters, PaymentResponse } from '../../../../interfaces/PaymentData';
import type { TimeRange } from './AdminPaymentsView';

export const formatPaymentCurrency = (amount: number, currency: string = 'ZAR'): string => {
  if (!amount && amount !== 0) return 'R0';
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPaymentDateTime = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export const doesPaymentMatchSearchTerm = (payment: PaymentResponse, searchTerm: string) => {
  if (!searchTerm) return true;
  const term = searchTerm.toLowerCase();

  return (
    payment.userEmail?.toLowerCase().includes(term) ||
    payment.userFullName?.toLowerCase().includes(term) ||
    payment.orderId?.toLowerCase().includes(term) ||
    payment.description?.toLowerCase().includes(term) ||
    payment.paystackReference?.toLowerCase().includes(term)
  );
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const getExportFilename = (format: 'csv' | 'excel') => {
  return `payments-export-${new Date().toISOString().split('T')[0]}.${format}`;
};

export const buildApiFilters = (filters: PaymentFilters, organisationFilter: string): PaymentFilters => {
  const apiFilters = { ...filters };
  if (organisationFilter !== 'all') {
    apiFilters.organisation = organisationFilter;
  }
  return apiFilters;
};

export const calculateAnalyticsDateRange = (timeRange: TimeRange) => {
  const endDate = new Date();
  const startDate = new Date(endDate);

  switch (timeRange) {
    case '7days':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30days':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90days':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case '1year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  return {
    startDateIso: startDate.toISOString(),
    endDateIso: endDate.toISOString(),
  };
};

export const getPaymentStatusStyle = (status: PaymentStatus) => {
  switch (status) {
    case 'SUCCEEDED':
      return { className: 'bg-green-100 text-green-800 border-green-200', Icon: CheckCircle, spin: false };
    case 'FAILED':
      return { className: 'bg-red-100 text-red-800 border-red-200', Icon: XCircle, spin: false };
    case 'PENDING':
      return { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', Icon: Clock, spin: false };
    case 'PROCESSING':
      return { className: 'bg-blue-100 text-blue-800 border-blue-200', Icon: Loader2, spin: true };
    case 'REFUNDED':
      return { className: 'bg-purple-100 text-purple-800 border-purple-200', Icon: null, spin: false };
    case 'CANCELED':
      return { className: 'bg-gray-100 text-gray-800 border-gray-200', Icon: null, spin: false };
    default:
      return { className: 'bg-gray-100 text-gray-800 border-gray-200', Icon: null, spin: false };
  }
};
