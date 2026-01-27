// src/pages/payment/AdminPaymentsPage.tsx
import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/PaymentService';
import { PaymentStatus } from '../../interfaces/PaymentData';
import type { PaymentResponse, PaymentFilters } from '../../interfaces/PaymentData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { 
  Loader2, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  User, 
  CreditCard, 
  DollarSign,
  TrendingUp,
  Users
} from 'lucide-react';

const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    successfulPayments: 0,
    averageAmount: 0,
    topCustomers: [] as any[]
  });

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      // In a real app, you would call an admin endpoint
      // For now, we'll simulate by getting all user payments
      const data = await paymentService.getPaymentsByStatus('SUCCEEDED');
      setPayments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Simulate stats fetching
      setStats({
        totalRevenue: 125000,
        totalPayments: 342,
        successfulPayments: 315,
        averageAmount: 397,
        topCustomers: [
          { name: 'John Doe', email: 'john@example.com', amount: 15000, payments: 12 },
          { name: 'Jane Smith', email: 'jane@example.com', amount: 12000, payments: 8 },
          { name: 'Bob Johnson', email: 'bob@example.com', amount: 9800, payments: 6 },
        ]
      });
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        payment.userEmail.toLowerCase().includes(term) ||
        payment.userFullName.toLowerCase().includes(term) ||
        payment.orderId.toLowerCase().includes(term) ||
        payment.description.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    const colors = paymentService.getStatusColor(status);
    return (
      <Badge className={`${colors} font-medium`}>
        {status}
      </Badge>
    );
  };

  const handleExport = () => {
    // Implement export functionality
    alert('Export feature coming soon!');
  };

  const handleViewDetails = (paymentId: string) => {
    // Navigate to payment details
    window.location.href = `/payments/${paymentId}`;
  };

  const handleViewCustomer = (userId: string) => {
    // Navigate to customer details
    window.location.href = `/admin/users/${userId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment Administration</h1>
        <p className="text-gray-600 mt-2">Manage and monitor all payments in the system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {paymentService.formatCurrency(stats.totalRevenue)}
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
                <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
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
                  {((stats.successfulPayments / stats.totalPayments) * 100).toFixed(1)}%
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
                  {paymentService.formatCurrency(stats.averageAmount)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.topCustomers.map((customer, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{customer.name}</h4>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                  <Badge variant="secondary">#{index + 1}</Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="font-bold text-gray-900">
                      {paymentService.formatCurrency(customer.amount)}
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

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search payments by customer, order ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            value={filters.status || 'all'}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as PaymentStatus })}
          >
            <option value="all">All Status</option>
            <option value="SUCCEEDED">Succeeded</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <Button
            onClick={fetchPayments}
            className="mt-2"
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {paymentService.formatDate(payment.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{payment.userFullName}</span>
                        <span className="text-sm text-gray-600">{payment.userEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {payment.description}
                    </TableCell>
                    <TableCell>
                      {paymentService.formatCurrency(payment.amount, payment.currency)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.status)}
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {payment.orderId}
                      </code>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCustomer(payment.userId)}
                          className="flex items-center gap-1"
                        >
                          <User className="h-4 w-4" />
                          Customer
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(payment.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {filteredPayments.length} of {payments.length} payments
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;