// src/pages/payment/PaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../../services/PaymentService';
import { PaymentStatus } from '../../interfaces/PaymentData';
import type { PaymentResponse } from '../../interfaces/PaymentData';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { 
  Loader2, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Eye, 
  ArrowLeft, 
  Home,
  Building2,
  Crown
} from 'lucide-react';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSuperAdmin, userOrganisation } = useAuth();
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Force hide navbar and sidebar for payment pages
  useEffect(() => {
    localStorage.setItem('hideLayout', 'true');
    
    return () => {
      localStorage.removeItem('hideLayout');
    };
  }, []);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentService.getMyPayments();
      setPayments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    const colors = paymentService.getStatusColor(status);
    const icon = paymentService.getStatusIcon(status);
    
    return (
      <Badge className={`${colors} font-medium`}>
        <span className="mr-1">{icon}</span>
        {status}
      </Badge>
    );
  };

  const handleViewDetails = (paymentId: string) => {
    navigate(`/payments/${paymentId}`);
  };

  const handleNewPayment = () => {
    navigate('/payments/new');
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const successfulPayments = payments.filter(p => p.status === 'SUCCEEDED').length;
  const pendingPayments = payments.filter(p => p.status === 'PENDING' || p.status === 'PROCESSING').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/overview')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Payment History</h1>
                <p className="text-sm text-gray-600">View and manage all your payments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {userOrganisation && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {userOrganisation}
                </span>
              )}
              {isSuperAdmin && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Super Admin
                </span>
              )}
              <Button
                onClick={() => navigate('/dashboard/overview')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {paymentService.formatCurrency(totalAmount)}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{successfulPayments}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="all">All Payments</option>
              <option value="SUCCEEDED">Succeeded</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELED">Canceled</option>
              <option value="REFUNDED">Refunded</option>
            </Select>
            
            <Button
              variant="outline"
              onClick={fetchPayments}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <Button
            onClick={handleNewPayment}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CreditCard className="h-4 w-4" />
            New Payment
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Payments Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              Recent Payments
              {userOrganisation && (
                <span className="text-sm font-normal text-gray-500 ml-2">for {userOrganisation}</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order ID</TableHead>
                  {isSuperAdmin && <TableHead>Organisation</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isSuperAdmin ? 7 : 6} className="text-center py-8 text-gray-500">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {paymentService.formatDate(payment.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium">
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
                      {isSuperAdmin && (
                        <TableCell>
                          {payment.organisation ? (
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-sm">{payment.organisation}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(payment.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;