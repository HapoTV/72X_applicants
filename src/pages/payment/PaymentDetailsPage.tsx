import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentService } from '../../services/PaymentService';
import type { PaymentResponse } from '../../interfaces/PaymentData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  Loader2, 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  User, 
  Mail, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Printer,
  Home,
  Shield
} from 'lucide-react';

const PaymentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Force hide navbar and sidebar for payment pages
  useEffect(() => {
    localStorage.setItem('hideLayout', 'true');
    
    return () => {
      localStorage.removeItem('hideLayout');
    };
  }, []);

  useEffect(() => {
    if (id) {
      fetchPayment(id);
    }
  }, [id]);

  const fetchPayment = async (paymentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentService.getPayment(paymentId);
      setPayment(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (id) {
      await fetchPayment(id);
    }
  };

  const handleConfirmPayment = async () => {
    if (!payment) return;
    
    try {
      setProcessing(true);
      await paymentService.confirmPayment(payment.id);
      await fetchPayment(payment.id);
    } catch (err: any) {
      setError(err.message || 'Failed to confirm payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!payment) return;
    
    if (!window.confirm('Are you sure you want to cancel this payment?')) {
      return;
    }

    try {
      setProcessing(true);
      await paymentService.cancelPayment(payment.id);
      await fetchPayment(payment.id);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadReceipt = () => {
    // Implement receipt download logic
    alert('Receipt download feature coming soon!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'PENDING':
      case 'PROCESSING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Alert variant="destructive">
            <AlertDescription>
              {error || 'Payment not found'}
            </AlertDescription>
          </Alert>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => navigate('/payments')}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Payments
            </Button>
            <Button
              onClick={() => navigate('/dashboard/overview')}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/payments')}
                  className="-ml-3"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Payments
                </Button>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Secure Payment Details</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Payment Details</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={handleDownloadReceipt}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                Receipt
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <div className={`mb-8 p-6 rounded-lg border ${paymentService.getStatusColor(payment.status)} shadow-sm`}>
          <div className="flex items-center gap-4">
            {getStatusIcon(payment.status)}
            <div>
              <h3 className="text-xl font-semibold">Payment Status: {payment.status}</h3>
              <p className="text-sm opacity-90">
                Last updated: {paymentService.formatDate(payment.updatedAt)}
              </p>
              {payment.failureMessage && (
                <p className="text-sm mt-2">
                  <strong>Error:</strong> {payment.failureMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {paymentService.formatCurrency(payment.amount, payment.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Currency</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {payment.currency}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-gray-900">{payment.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Order ID</p>
                  <code className="text-sm bg-gray-100 px-3 py-2 rounded font-mono block mt-1">
                    {payment.orderId}
                  </code>
                </div>

                {payment.metadata && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Metadata</p>
                    <pre className="text-sm bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
                      {JSON.stringify(JSON.parse(payment.metadata), null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">User</p>
                    <p className="text-gray-900">{payment.userFullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{payment.userEmail}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Reference</p>
                  <code className="text-sm bg-gray-100 px-3 py-2 rounded font-mono block mt-1">
                    {payment.paystackReference || 'N/A'}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Timeline */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(payment.status === 'PENDING' || payment.status === 'PROCESSING') && (
                  <Button
                    onClick={handleConfirmPayment}
                    disabled={processing}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Payment
                  </Button>
                )}

                {(payment.status === 'PENDING' || payment.status === 'PROCESSING') && (
                  <Button
                    onClick={handleCancelPayment}
                    disabled={processing}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Payment
                  </Button>
                )}

                <Button
                  onClick={handleDownloadReceipt}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>

                <Button
                  onClick={() => window.print()}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Details
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-gray-900">
                      {paymentService.formatDate(payment.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-gray-900">
                      {paymentService.formatDate(payment.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recurring Payment Info */}
            {payment.isRecurring && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Recurring Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Interval</p>
                      <Badge variant="secondary" className="capitalize">
                        {payment.recurringInterval}
                      </Badge>
                    </div>
                    {payment.subscriptionId && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Subscription ID</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono block mt-1">
                          {payment.subscriptionId}
                        </code>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsPage;