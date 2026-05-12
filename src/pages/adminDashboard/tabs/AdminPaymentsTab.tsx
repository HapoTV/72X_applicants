// src/pages/adminDashboard/tabs/AdminPaymentsTab.tsx
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { paymentService } from '../../../services/PaymentService';
import { PaymentStatus } from '../../../interfaces/PaymentData';
import type { PaymentResponse, PaymentFilters, RevenueAnalytics } from '../../../interfaces/PaymentData';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../../components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import {
  PageHeader,
  StatsCards,
  RevenueAnalyticsCard,
  TopCustomersCard,
  FiltersBar,
  PaymentsTableCard,
  SummaryStats,
  type PaymentStats,
  type TimeRange,
} from './components/AdminPaymentsView';
import {
  buildApiFilters,
  calculateAnalyticsDateRange,
  doesPaymentMatchSearchTerm,
  downloadBlob,
  formatPaymentCurrency,
  formatPaymentDateTime,
  getExportFilename,
  getPaymentStatusStyle,
} from './components/adminPaymentsHelpers';
import { AdminPaymentsLoading } from './components/AdminPaymentsLoading';

const AdminPaymentsTab: React.FC = () => {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [organisationFilter, setOrganisationFilter] = useState<string>('all');
  const [organisations, setOrganisations] = useState<string[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    totalPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    averageAmount: 0,
    topCustomers: []
  });
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');

  const fetchPayments = useCallback(async () => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      
      const apiFilters = buildApiFilters(filters, organisationFilter);
      
      const data = await paymentService.getAllPayments(apiFilters);
      console.log('Fetched payments:', data);
      setPayments(data);
      
      // Extract unique organisations for filter
      const orgs = [...new Set(data.map(p => p.organisation).filter(Boolean))];
      setOrganisations(orgs as string[]);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.message || 'Failed to load payments');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [filters, isSuperAdmin, organisationFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await paymentService.getAdminPaymentStats();
      console.log('Fetched stats:', statsData);
      setStats(statsData);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      // Set empty stats on error
      setStats({
        totalRevenue: 0,
        totalPayments: 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
        averageAmount: 0,
        topCustomers: []
      });
    }
  }, []);

  const fetchRevenueAnalytics = useCallback(async () => {
    try {
      const { startDateIso, endDateIso } = calculateAnalyticsDateRange(timeRange);
      const analytics = await paymentService.getRevenueAnalytics(startDateIso, endDateIso);
      console.log('Fetched revenue analytics:', analytics);
      setRevenueAnalytics(analytics);
    } catch (err: any) {
      console.error('Error fetching revenue analytics:', err);
      setRevenueAnalytics(null);
    }
  }, [timeRange]);

  useEffect(() => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }
    fetchPayments();
    fetchStats();
    fetchRevenueAnalytics();
  }, [fetchPayments, fetchRevenueAnalytics, fetchStats, isSuperAdmin]);

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      // Search filter
      if (!doesPaymentMatchSearchTerm(payment, searchTerm)) return false;
      
      return true;
    });
  }, [payments, searchTerm]);

  const pagination = useMemo(() => {
    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

    return {
      indexOfLastItem,
      indexOfFirstItem,
      currentItems,
      totalPages,
    };
  }, [currentPage, filteredPayments, itemsPerPage]);

  const getStatusBadge = (status: PaymentStatus) => {
    const { className, Icon, spin } = getPaymentStatusStyle(status);

    return (
      <Badge className={`${className} font-medium flex items-center gap-1`}>
        {Icon ? <Icon className={`h-3 w-3 mr-1${spin ? ' animate-spin' : ''}`} /> : null}
        {status}
      </Badge>
    );
  };

  const handleExport = async (format: 'csv' | 'excel' = 'csv') => {
    try {
      setExporting(true);
      const blob = await paymentService.exportPayments(format);
      
      downloadBlob(blob, getExportFilename(format));
    } catch (err: any) {
      setError(err.message || 'Failed to export payments');
    } finally {
      setExporting(false);
    }
  };

  const handleViewDetails = (paymentId: string) => {
    navigate(`/payments/${paymentId}`);
  };

  const handleViewCustomer = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const results = await paymentService.searchPayments(searchTerm);
        setPayments(results);
      } catch (err: any) {
        setError(err.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    } else {
      fetchPayments();
    }
  };

  const handleStatusFilter = (status: string) => {
    if (status === 'all') {
      setFilters({ ...filters, status: undefined });
    } else {
      setFilters({ ...filters, status: status as PaymentStatus });
    }
    setCurrentPage(1);
  };

  const formatCurrency = formatPaymentCurrency;
  const formatDate = formatPaymentDateTime;

  if (loading && payments.length === 0) {
    return <AdminPaymentsLoading />;
  }

  return (
    <div className="space-y-6">
      <PageHeader />

      <StatsCards stats={stats} formatCurrency={formatCurrency} />

      <RevenueAnalyticsCard
        revenueAnalytics={revenueAnalytics}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        formatCurrency={formatCurrency}
      />

      <TopCustomersCard
        topCustomers={stats.topCustomers}
        onViewCustomer={handleViewCustomer}
        formatCurrency={formatCurrency}
      />

      <FiltersBar
        loading={loading}
        exporting={exporting}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        organisations={organisations}
        organisationFilter={organisationFilter}
        setOrganisationFilter={setOrganisationFilter}
        onStatusFilter={handleStatusFilter}
        onExport={handleExport}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PaymentsTableCard
        filteredPayments={filteredPayments}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        fetchPayments={fetchPayments}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        getStatusBadge={getStatusBadge}
        onViewCustomer={handleViewCustomer}
        onViewDetails={handleViewDetails}
      />

      <SummaryStats stats={stats} />
    </div>
  );
};

export default AdminPaymentsTab;