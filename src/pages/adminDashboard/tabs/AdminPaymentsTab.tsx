// src/pages/adminDashboard/tabs/AdminPaymentsTab.tsx
import React, { useState, useEffect } from 'react';
import { paymentService } from '../../../services/PaymentService';
import { PaymentStatus } from '../../../interfaces/PaymentData';
import type { PaymentResponse, PaymentFilters, RevenueAnalytics } from '../../../interfaces/PaymentData';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { 
  Loader2, 
  Search, 
  Download, 
  Eye, 
  User, 
  CreditCard, 
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building2,
  Crown,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '../../../components/ui/alert';

interface PaymentStats {
  totalRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  averageAmount: number;
  topCustomers: Array<{
    id: string;
    name: string;
    email: string;
    amount: number;
    payments: number;
    organisation?: string;
  }>;
}

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
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | '1year'>('30days');

  // Check if user is super admin
  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="bg-red-50 p-8 rounded-xl text-center max-w-md">
          <Crown className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">
            Only Super Admins can access the Payment Administration page.
          </p>
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-sm text-red-700">
              If you need payment administration access, please contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchPayments();
    fetchStats();
    fetchRevenueAnalytics();
  }, [filters, timeRange, organisationFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiFilters = { ...filters };
      if (organisationFilter !== 'all') {
        apiFilters.organisation = organisationFilter;
      }
      
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
  };

  const fetchStats = async () => {
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
  };

  const fetchRevenueAnalytics = async () => {
    try {
      // Calculate date range
      const endDate = new Date().toISOString();
      let startDate = new Date();
      
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
      
      const analytics = await paymentService.getRevenueAnalytics(
        startDate.toISOString(),
        endDate
      );
      console.log('Fetched revenue analytics:', analytics);
      setRevenueAnalytics(analytics);
    } catch (err: any) {
      console.error('Error fetching revenue analytics:', err);
      setRevenueAnalytics(null);
    }
  };

  const filteredPayments = payments.filter(payment => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        payment.userEmail?.toLowerCase().includes(term) ||
        payment.userFullName?.toLowerCase().includes(term) ||
        payment.orderId?.toLowerCase().includes(term) ||
        payment.description?.toLowerCase().includes(term) ||
        payment.paystackReference?.toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const getStatusBadge = (status: PaymentStatus) => {
    const getIcon = () => {
      switch (status) {
        case 'SUCCEEDED': return <CheckCircle className="h-3 w-3 mr-1" />;
        case 'FAILED': return <XCircle className="h-3 w-3 mr-1" />;
        case 'PENDING': return <Clock className="h-3 w-3 mr-1" />;
        case 'PROCESSING': return <Loader2 className="h-3 w-3 mr-1 animate-spin" />;
        default: return null;
      }
    };

    const getColor = () => {
      switch (status) {
        case 'SUCCEEDED': return 'bg-green-100 text-green-800 border-green-200';
        case 'FAILED': return 'bg-red-100 text-red-800 border-red-200';
        case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'REFUNDED': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'CANCELED': return 'bg-gray-100 text-gray-800 border-gray-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <Badge className={`${getColor()} font-medium flex items-center gap-1`}>
        {getIcon()}
        {status}
      </Badge>
    );
  };

  const handleExport = async (format: 'csv' | 'excel' = 'csv') => {
    try {
      setExporting(true);
      const blob = await paymentService.exportPayments(format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
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

  const formatCurrency = (amount: number, currency: string = 'ZAR'): string => {
    if (!amount && amount !== 0) return 'R0';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Administration</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all payments across all organisations
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPayments.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPayments > 0 
                    ? `${((stats.successfulPayments / stats.totalPayments) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Payment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.averageAmount)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Filter for Analytics */}
      {revenueAnalytics && revenueAnalytics.monthlyRevenue && revenueAnalytics.monthlyRevenue.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Analytics
              </CardTitle>
              <div className="flex gap-2">
                {(['7days', '30days', '90days', '1year'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? 'default' : 'outline'}
                    onClick={() => setTimeRange(range)}
                    size="sm"
                  >
                    {range === '7days' ? '7 Days' :
                     range === '30days' ? '30 Days' :
                     range === '90days' ? '90 Days' : '1 Year'}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                <p className={`text-2xl font-bold ${revenueAnalytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueAnalytics.revenueGrowth >= 0 ? '+' : ''}{revenueAnalytics.revenueGrowth.toFixed(1)}%
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                <p className="text-2xl font-bold text-gray-900">
                  {revenueAnalytics.profitMargin.toFixed(1)}%
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(revenueAnalytics.totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Customers */}
      {stats.topCustomers && stats.topCustomers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.topCustomers.map((customer, index) => (
                <div 
                  key={customer.id || index} 
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" 
                  onClick={() => customer.id && handleViewCustomer(customer.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{customer.name}</h4>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      {customer.organisation && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          {customer.organisation}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="font-bold text-gray-900">
                        {formatCurrency(customer.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payments</p>
                      <p className="font-bold text-gray-900">{customer.payments}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search payments by customer, order ID, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          {organisations.length > 0 && (
            <Select value={organisationFilter} onValueChange={setOrganisationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by organisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organisations</SelectItem>
                {organisations.map(org => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Select onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="SUCCEEDED">Succeeded</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleExport(value as 'csv' | 'excel')} disabled={exporting}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Export format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">Export as CSV</SelectItem>
              <SelectItem value="excel">Export as Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              All Payments ({filteredPayments.length})
            </span>
            <div className="text-sm text-gray-500">
              Showing {filteredPayments.length > 0 ? indexOfFirstItem + 1 : 0}-
              {Math.min(indexOfLastItem, filteredPayments.length)} of {filteredPayments.length}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                      {searchTerm ? (
                        <div className="flex flex-col items-center">
                          <Search className="h-8 w-8 text-gray-300 mb-2" />
                          <p>No payments found matching your search</p>
                          <Button
                            variant="link"
                            onClick={() => {
                              setSearchTerm('');
                              fetchPayments();
                            }}
                            className="mt-2"
                          >
                            Clear search
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <CreditCard className="h-8 w-8 text-gray-300 mb-2" />
                          <p>No payments found</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-gray-50">
                      <TableCell className="whitespace-nowrap">
                        {formatDate(payment.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{payment.userFullName || 'Unknown'}</span>
                          <span className="text-sm text-gray-600">{payment.userEmail || 'No email'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.organisation ? (
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-sm">{payment.organisation}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {payment.description}
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-gray-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </div>
                        {payment.fee && (
                          <div className="text-xs text-gray-500">
                            Fee: {formatCurrency(payment.fee, payment.currency)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all">
                          {payment.paystackReference || payment.orderId}
                        </code>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {payment.userId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCustomer(payment.userId)}
                              className="flex items-center gap-1"
                            >
                              <User className="h-3 w-3" />
                              Profile
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(payment.id)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Successful Payments</p>
          <p className="text-xl font-bold text-green-600">{stats.successfulPayments.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Failed Payments</p>
          <p className="text-xl font-bold text-red-600">{stats.failedPayments.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Pending Payments</p>
          <p className="text-xl font-bold text-yellow-600">{stats.pendingPayments.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Unique Customers</p>
          <p className="text-xl font-bold text-blue-600">
            {stats.topCustomers?.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsTab;