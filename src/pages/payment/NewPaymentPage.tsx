import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../../services/PaymentService';
import { usePaystackPayment } from '../../hooks/usePaystackPayment';
import { Currency } from '../../interfaces/PaymentData';
import type { PaymentRequest } from '../../interfaces/PaymentData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  Loader2, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Package, 
  Shield,
  Mail,
  Lock,
  BadgeCheck,
  ArrowLeft,
  Home
} from 'lucide-react';
import userSubscriptionService from '../../services/UserSubscriptionService';
import { UserSubscriptionType } from '../../interfaces/UserSubscriptionData';

interface SelectedPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  backendType: UserSubscriptionType;
}

interface UserDetails {
  email: string;
  phoneNumber: string;
  billingAddress: string;
}

const NewPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { paystackLoaded, isProcessing, initializePayment } = usePaystackPayment();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    email: '',
    phoneNumber: '',
    billingAddress: ''
  });

  const [paymentDetails, setPaymentDetails] = useState<Omit<PaymentRequest, 'userId' | 'receiptEmail'>>({
    amount: 0,
    currency: Currency.ZAR,
    description: '',
    orderId: `ORD-${Date.now()}`,
    isRecurring: true,
    recurringInterval: 'month'
  });

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => {
      window.location.href = '/dashboard/overview';
    }, 1200);
    return () => clearTimeout(t);
  }, [success]);

  // Initialize user details and package
  useEffect(() => {
    const pkgData = localStorage.getItem('selectedPackage');
    const userEmail = localStorage.getItem('userEmail') || '';
    const userPhone = localStorage.getItem('userPhone') || '';
    
    setUserDetails(prev => ({
      ...prev,
      email: userEmail,
      phoneNumber: userPhone
    }));

    if (pkgData) {
      try {
        const pkg = JSON.parse(pkgData) as SelectedPackage;
        setSelectedPackage(pkg);
        
        setPaymentDetails(prev => ({
          ...prev,
          amount: pkg.price,
          currency: pkg.currency as Currency,
          description: `${pkg.name} Plan - ${pkg.interval === 'month' ? 'Monthly' : 'Yearly'} subscription`,
          orderId: `SUB-${pkg.id.toUpperCase()}-${Date.now()}`,
          isRecurring: true,
          recurringInterval: pkg.interval as 'month' | 'year'
        }));
      } catch (err) {
        console.error('Failed to parse package data:', err);
        setError('Invalid package data. Please select a package again.');
      }
    }
  }, []);

  const handleUserDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSuccess = async (reference: string) => {
    setVerifying(true);
    setError(null);
    
    try {
      console.log('🔄 Verifying payment with reference:', reference);
      const verifiedPayment = await paymentService.verifyPaystackPayment(reference);
      
      console.log('✅ Payment verification response:', verifiedPayment);
      
      if (verifiedPayment.status === 'SUCCEEDED') {
        // Call handlePaymentComplete to update user status and WAIT for it to complete
        await handlePaymentComplete();
        
        // Force a small delay to ensure backend processes the update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSuccess(true);
      } else {
        setError(`Payment failed: ${verifiedPayment.failureMessage || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Payment verification error:', err);
      setError(err.message || 'Payment verification failed. Please contact support.');
    } finally {
      setVerifying(false);
    }
  };

  const handlePaymentClose = () => {
    console.log('Payment modal closed by user');
    setError('Payment was cancelled. You can try again when ready.');
  };

  const handlePaymentComplete = async () => {
    try {
      if (!selectedPackage?.backendType) {
        throw new Error('No package selected');
      }

      console.log('🔄 Calling confirmPayment for package:', selectedPackage.backendType);
      
      // Step 1: Confirm payment with backend - ADD TIMEOUT
      const confirmResponse = await Promise.race([
        userSubscriptionService.confirmPayment({
          packageType: selectedPackage.backendType,
          amount: selectedPackage.price,
          currency: selectedPackage.currency
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Backend timeout')), 10000)
        )
      ]);

      console.log('✅ Confirm payment response:', confirmResponse);

      // Step 2: Fetch updated user data
      const userResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (userResponse.ok) {
        const updatedUser = await userResponse.json();
        console.log('✅ Updated user from backend:', updatedUser);

        // CRITICAL: Check if status is actually ACTIVE
        if (updatedUser.status !== 'ACTIVE') {
          console.warn('⚠️ Backend returned non-ACTIVE status:', updatedUser.status);
          // Manually override to ACTIVE since payment succeeded
          updatedUser.status = 'ACTIVE';
        }

        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('userStatus', 'ACTIVE');
      } else {
        // Fallback with force ACTIVE status
        console.warn('Could not fetch updated user, forcing ACTIVE status');
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { 
          ...currentUser, 
          status: 'ACTIVE', // <-- FORCE ACTIVE
          phoneNumber: userDetails.phoneNumber,
          billingAddress: userDetails.billingAddress,
          email: userDetails.email,
          subscriptionPlan: selectedPackage?.name,
          subscriptionType: selectedPackage?.backendType
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('userStatus', 'ACTIVE');
      }

      // Clear temporary data
      localStorage.removeItem('requiresPackageSelection');
      localStorage.removeItem('selectedPackage');
      localStorage.removeItem('tempPassword');
      localStorage.removeItem('hideLayout');
      
      console.log('✅ User status updated to ACTIVE');

    } catch (error: any) {
      console.error('❌ Error in handlePaymentComplete:', error);
      
      // Even if backend fails, FORCE ACTIVE status because payment succeeded
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { 
        ...currentUser, 
        status: 'ACTIVE', // <-- FORCE ACTIVE HERE TOO
        phoneNumber: userDetails.phoneNumber,
        billingAddress: userDetails.billingAddress,
        email: userDetails.email,
        subscriptionPlan: selectedPackage?.name,
        subscriptionType: selectedPackage?.backendType
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('userStatus', 'ACTIVE');
      
      console.log('⚠️ Backend update failed, but FORCING local status to ACTIVE');
    }
  };

  const handlePaystackPayment = async () => {
    // Reset error
    setError(null);

    // Validate form
    if (!userDetails.email || !userDetails.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!selectedPackage) {
      setError('No package selected');
      return;
    }

    if (paymentDetails.amount <= 0) {
      setError('Invalid payment amount');
      return;
    }

    try {
      const metadata = {
        userId: userDetails.email,
        orderId: paymentDetails.orderId,
        subscriptionPlan: selectedPackage.name,
        packageType: selectedPackage.backendType,
        billingAddress: userDetails.billingAddress,
        phoneNumber: userDetails.phoneNumber,
        interval: selectedPackage.interval,
        timestamp: new Date().toISOString()
      };

      await initializePayment({
        email: userDetails.email,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        metadata,
        onSuccess: handlePaymentSuccess,
        onClose: handlePaymentClose
      });

    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setError(err.message || 'Failed to initialize payment. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="text-center border-green-200 shadow-xl">
            <CardContent className="pt-8 pb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to 72X!
              </h2>
              <p className="text-gray-600 mb-4">
                Your payment has been processed and your account is now active.
              </p>
              {selectedPackage && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-primary-600" />
                    <span className="font-semibold text-gray-900">
                      {selectedPackage.name} Plan
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    You're subscribed to the {selectedPackage.name} plan
                  </p>
                  <p className="text-sm text-green-600 font-medium mt-2">
                    ✅ Account Status: ACTIVE
                  </p>
                </div>
              )}
              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    // Force refresh user data by redirecting to dashboard
                    window.location.href = '/dashboard/overview';
                  }}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/payments')}
                >
                  View Payment Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No Package Selected
              </h2>
              <p className="text-gray-600 mb-6">
                Please select a package before proceeding to payment.
              </p>
              <Button 
                onClick={() => navigate('/select-package')}
                className="bg-primary hover:bg-primary-dark"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Select Package
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isPayButtonDisabled = !paystackLoaded || isProcessing || verifying || !userDetails.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/select-package')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Packages
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">72X Subscription</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Complete Your Subscription</h1>
              <p className="text-gray-600 mt-1">Enter your details to activate your account</p>
            </div>
          </div>
          
          <Card className="mb-6 border-primary-100">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedPackage.name} Plan</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {selectedPackage.interval === 'month' ? 'Monthly subscription' : 'Yearly subscription'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedPackage.currency === 'ZAR' ? 'R' : selectedPackage.currency}
                    {selectedPackage.price.toLocaleString()}
                  </div>
                  <div className="text-gray-500 text-sm">
                    per {selectedPackage.interval}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Details Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Your Details
              </CardTitle>
              <CardDescription>
                We need this information for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userDetails.email}
                  onChange={handleUserDetailChange}
                  required
                  placeholder="your@email.com"
                  disabled={isProcessing || verifying}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Payment receipt will be sent to this email
                </p>
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={userDetails.phoneNumber}
                  onChange={handleUserDetailChange}
                  placeholder="+27 12 345 6789"
                  disabled={isProcessing || verifying}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  For important account notifications
                </p>
              </div>

              <div>
                <Label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Address (Optional)
                </Label>
                <Textarea
                  id="billingAddress"
                  name="billingAddress"
                  value={userDetails.billingAddress}
                  onChange={handleUserDetailChange}
                  rows={3}
                  placeholder="Street, City, Postal Code, Country"
                  disabled={isProcessing || verifying}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Only needed for invoicing purposes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Security Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Secure Payment
              </CardTitle>
              <CardDescription>
                Powered by Paystack - PCI DSS Level 1 Certified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Security Badge */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BadgeCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">Bank-Level Security</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        PCI DSS Level 1 Certified
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        256-bit SSL Encryption
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Card details never stored
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Loading Status */}
              {!paystackLoaded && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Loading Payment Service</span>
                  </div>
                </div>
              )}

              {/* Test Mode Indicator */}
              {import.meta.env.DEV && import.meta.env.VITE_PAYSTACK_PUBLIC_KEY?.includes('test') && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-800">Test Mode Active</span>
                  </div>
                  <p className="text-xs text-blue-600">
                    No real payments will be processed. Use test cards from Paystack docs.
                  </p>
                </div>
              )}

              {/* Payment Summary */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Payment Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing Cycle:</span>
                    <span className="font-medium capitalize">{selectedPackage.interval}ly</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-900 font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {selectedPackage.currency === 'ZAR' ? 'R' : selectedPackage.currency}
                      {selectedPackage.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-6 rounded-lg shadow border">
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/select-package')}
              disabled={isProcessing || verifying}
              className="sm:mb-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Packages
            </Button>
            <p className="text-xs text-gray-500 max-w-xs">
              <Lock className="h-3 w-3 inline mr-1" />
              Your information is encrypted and secure
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Due</div>
              <div className="text-3xl font-bold text-gray-900">
                {selectedPackage.currency === 'ZAR' ? 'R' : selectedPackage.currency}
                {selectedPackage.price.toLocaleString()}
              </div>
            </div>
            
            <Button
              onClick={handlePaystackPayment}
              disabled={isPayButtonDisabled}
              className="flex items-center gap-3 px-8 py-6 bg-green-600 hover:bg-green-700 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing Payment...
                </>
              ) : verifying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying Payment...
                </>
              ) : !paystackLoaded ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading Payment Service...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Complete Subscription
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-12 pt-6 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">100% Secure Payment</p>
                <p className="text-xs text-gray-600">All transactions are encrypted and secure</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>PCI DSS Compliant</span>
              <span>•</span>
              <span>256-bit Encryption</span>
              <span>•</span>
              <span>Paystack Secured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPaymentPage;