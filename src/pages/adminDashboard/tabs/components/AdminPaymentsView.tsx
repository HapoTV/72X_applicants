import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Badge } from '../../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import {
  Search,
  Eye,
  User,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building2
} from 'lucide-react';
import type { PaymentResponse, PaymentStatus, RevenueAnalytics } from '../../../../interfaces/PaymentData';

export interface PaymentStats {
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

export interface FormatCurrency {
  (amount: number, currency?: string): string;
}

export type TimeRange = '7days' | '30days' | '90days' | '1year';

export const PageHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Administration</h1>
        <p className="text-gray-600 mt-1">Manage and monitor all payments across all organisations</p>
      </div>
    </div>
  );
};

export const StatsCards: React.FC<{ stats: PaymentStats; formatCurrency: FormatCurrency }> = ({ stats, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
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
                {stats.totalPayments > 0 ? `${((stats.successfulPayments / stats.totalPayments) * 100).toFixed(1)}%` : '0%'}
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
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageAmount)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const RevenueAnalyticsCard: React.FC<{
  revenueAnalytics: RevenueAnalytics | null;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  formatCurrency: FormatCurrency;
}> = ({ revenueAnalytics, timeRange, setTimeRange, formatCurrency }) => {
  if (!revenueAnalytics || !revenueAnalytics.monthlyRevenue || revenueAnalytics.monthlyRevenue.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Analytics
          </CardTitle>
          <div className="flex gap-2">
            {(['7days', '30days', '90days', '1year'] as const).map((range) => (
              <Button key={range} variant={timeRange === range ? 'default' : 'outline'} onClick={() => setTimeRange(range)} size="sm">
                {range === '7days' ? '7 Days' : range === '30days' ? '30 Days' : range === '90days' ? '90 Days' : '1 Year'}
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
            <p className="text-2xl font-bold text-gray-900">{revenueAnalytics.profitMargin.toFixed(1)}%</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueAnalytics.totalRevenue)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TopCustomersCard: React.FC<{
  topCustomers: PaymentStats['topCustomers'];
  onViewCustomer: (userId: string) => void;
  formatCurrency: FormatCurrency;
}> = ({ topCustomers, onViewCustomer, formatCurrency }) => {
  if (!topCustomers || topCustomers.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Top Customers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCustomers.map((customer, index) => (
            <div
              key={customer.id || index}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => customer.id && onViewCustomer(customer.id)}
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
                  <p className="font-bold text-gray-900">{formatCurrency(customer.amount)}</p>
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
  );
};

export const FiltersBar: React.FC<{
  loading: boolean;
  exporting: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
  organisations: string[];
  organisationFilter: string;
  setOrganisationFilter: (org: string) => void;
  onStatusFilter: (status: string) => void;
  onExport: (format: 'csv' | 'excel') => void;
}> = ({
  loading,
  exporting,
  searchTerm,
  setSearchTerm,
  onSearch,
  organisations,
  organisationFilter,
  setOrganisationFilter,
  onStatusFilter,
  onExport,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex-1">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search payments by customer, order ID, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={onSearch} disabled={loading} className="flex items-center gap-2">
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

        <Select onValueChange={onStatusFilter}>
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

        <Select onValueChange={(value) => onExport(value as 'csv' | 'excel')} disabled={exporting}>
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
  );
};

export const PaymentsTableCard: React.FC<{
  filteredPayments: PaymentResponse[];
  pagination: { indexOfFirstItem: number; indexOfLastItem: number; currentItems: PaymentResponse[]; totalPages: number };
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchPayments: () => void;
  formatDate: (dateString: string) => string;
  formatCurrency: FormatCurrency;
  getStatusBadge: (status: PaymentStatus) => React.ReactNode;
  onViewCustomer: (userId: string) => void;
  onViewDetails: (paymentId: string) => void;
}> = ({
  filteredPayments,
  pagination,
  currentPage,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
  fetchPayments,
  formatDate,
  formatCurrency,
  getStatusBadge,
  onViewCustomer,
  onViewDetails,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>All Payments ({filteredPayments.length})</span>
          <div className="text-sm text-gray-500">
            Showing {filteredPayments.length > 0 ? pagination.indexOfFirstItem + 1 : 0}-{Math.min(pagination.indexOfLastItem, filteredPayments.length)} of {filteredPayments.length}
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
                pagination.currentItems.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-gray-50">
                    <TableCell className="whitespace-nowrap">{formatDate(payment.createdAt)}</TableCell>
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
                    <TableCell className="max-w-xs truncate">{payment.description}</TableCell>
                    <TableCell>
                      <div className="font-bold text-gray-900">{formatCurrency(payment.amount, payment.currency)}</div>
                      {payment.fee && <div className="text-xs text-gray-500">Fee: {formatCurrency(payment.fee, payment.currency)}</div>}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all">{payment.paystackReference || payment.orderId}</code>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {payment.userId && (
                          <Button variant="ghost" size="sm" onClick={() => onViewCustomer(payment.userId)} className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Profile
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => onViewDetails(payment.id)} className="flex items-center gap-1">
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

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">Page {currentPage} of {pagination.totalPages}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))} disabled={currentPage === pagination.totalPages}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const SummaryStats: React.FC<{ stats: PaymentStats }> = ({ stats }) => {
  return (
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
        <p className="text-xl font-bold text-blue-600">{stats.topCustomers?.length || 0}</p>
      </div>
    </div>
  );
};
