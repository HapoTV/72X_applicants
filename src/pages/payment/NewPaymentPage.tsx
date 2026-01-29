// src/pages/payment/NewPaymentPage.tsx - UPDATED VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { paymentService } from '../../services/PaymentService';
import { Currency } from '../../interfaces/PaymentData';
import type { PaymentRequest } from '../../interfaces/PaymentData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Loader2, CreditCard, AlertCircle, CheckCircle, Package } from 'lucide-react';
import userSubscriptionService from '../../services/UserSubscriptionService';
import { UserSubscriptionType } from '../../interfaces/UserSubscriptionData';
import { useAuth } from '../../context/AuthContext';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_public_key');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

interface SelectedPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  backendType: UserSubscriptionType;
}

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null);
  
  const [paymentDetails, setPaymentDetails] = useState<Omit<PaymentRequest, 'userId' | 'receiptEmail'>>({
    amount: 0,
    currency: Currency.ZAR,
    description: '',
    orderId: `ORD-${Date.now()}`,
    billingAddress: '',
    shippingAddress: '',
    isRecurring: true,
    recurringInterval: 'month'
  });

  // Load selected package on mount
  useEffect(() => {
    const pkgData = localStorage.getItem('selectedPackage');
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
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!paymentDetails.amount || paymentDetails.amount <= 0) {
      errors.push('Invalid amount');
    }

    if (!paymentDetails.description.trim()) {
      errors.push('Description is required');
    }

    if (!paymentDetails.orderId.trim()) {
      errors.push('Order ID is required');
    }

    return errors;
  };

  // AFTER SUCCESSFUL PAYMENT - UPDATE USER STATUS
  const handlePaymentSuccess = async (packageType: UserSubscriptionType) => {
    try {
      // Call backend to confirm payment and activate subscription
      if (selectedPackage?.backendType) {
        await userSubscriptionService.confirmPayment({
          packageType: selectedPackage.backendType,
          amount: selectedPackage.price,
          currency: selectedPackage.currency
        });
      }
      
      // Update user status to ACTIVE in localStorage
      localStorage.setItem('userStatus', 'ACTIVE');
      localStorage.removeItem('requiresPackageSelection');
      
      // Update user in context and localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, status: 'ACTIVE' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Clear temporary package selection data
      localStorage.removeItem('selectedPackage');
      localStorage.removeItem('tempPassword');
      
      console.log('✅ Payment successful, user status updated to ACTIVE');
      
    } catch (error) {
      console.error('❌ Error updating user status after payment:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPackage) {
      setError('No package selected. Please go back and select a package.');
      return;
    }

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    if (!stripe || !elements) {
      setError('Payment system is not initialized');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Get user email from localStorage
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        throw new Error('User not found. Please sign in again.');
      }

      // Create payment request
      const paymentRequest: PaymentRequest = {
        ...paymentDetails,
        userId: userEmail, // Using email as userId for now
        receiptEmail: userEmail,
      };

      const response = await paymentService.createPayment(paymentRequest);

      if (response.status === 'SUCCEEDED') {
        // Payment successful - update user status and complete registration
        await handlePaymentSuccess(selectedPackage.backendType);
        setSuccess(true);
      } else {
        // Payment needs confirmation
        await paymentService.confirmPayment(response.id);
        await handlePaymentSuccess(selectedPackage.backendType);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="text-center">
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
                <p className="text-xs text-gray-500 mt-2">
                  Enjoy 14-day free trial before billing starts
                </p>
              </div>
            )}
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  // Navigate to dashboard
                  navigate('/dashboard/overview');
                }}
                className="w-full"
              >
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
    );
  }

  if (!selectedPackage) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="text-center">
          <CardContent className="pt-8 pb-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Package Selected
            </h2>
            <p className="text-gray-600 mb-6">
              Please select a package before proceeding to payment.
            </p>
            <Button onClick={() => navigate('/select-package')}>
              Select Package
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Subscription</h1>
            <p className="text-gray-600 mt-1">Enter your payment details to activate your account</p>
          </div>
        </div>
        
        {/* Package Summary */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedPackage.name} Plan</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedPackage.interval === 'month' ? 'Monthly subscription' : 'Yearly subscription'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {selectedPackage.currency === 'ZAR' ? 'R' : selectedPackage.currency}{selectedPackage.price}
                </div>
                <div className="text-gray-500 text-sm">
                  per {selectedPackage.interval}
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> You will not be charged during the 14-day free trial. 
                You can cancel anytime before the trial ends.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Your subscription information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  name="orderId"
                  value={paymentDetails.orderId}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={paymentDetails.description}
                  readOnly
                  rows={2}
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">
                    {paymentDetails.currency === 'ZAR' ? 'R' : paymentDetails.currency}
                  </span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={paymentDetails.amount}
                    readOnly
                    className="pl-10 bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Details</CardTitle>
              <CardDescription>Enter your payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Card Information *</Label>
                <div className="mt-1 p-3 border border-gray-300 rounded-lg bg-white">
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Test card: 4242 4242 4242 4242
                </p>
              </div>

              <div>
                <Label htmlFor="billingAddress">Billing Address (Optional)</Label>
                <Textarea
                  id="billingAddress"
                  name="billingAddress"
                  value={paymentDetails.billingAddress}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Street, City, Postal Code"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/select-package')}
            disabled={loading}
          >
            Back to Packages
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Amount</div>
              <div className="text-2xl font-bold text-gray-900">
                {paymentDetails.currency === 'ZAR' ? 'R' : paymentDetails.currency}
                {paymentDetails.amount}
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading || !stripe}
              className="flex items-center gap-2 px-8"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Complete Subscription
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

const NewPaymentPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default NewPaymentPage;