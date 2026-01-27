// src/pages/payment/NewPaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { paymentService } from '../../services/PaymentService';
import {Currency} from '../../interfaces/PaymentData';
import type { PaymentRequest } from '../../interfaces/PaymentData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Loader2, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

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

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<Omit<PaymentRequest, 'userId' | 'receiptEmail'>>({
    amount: 0,
    currency: Currency.ZAR,
    description: '',
    orderId: `ORD-${Date.now()}`,
    billingAddress: '',
    shippingAddress: '',
    isRecurring: false,
    recurringInterval: 'month'
  });

  // Auto-generate order ID on mount
  useEffect(() => {
    setPaymentDetails(prev => ({
      ...prev,
      orderId: `ORD-${Date.now()}`
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setPaymentDetails(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              value
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!paymentDetails.amount || paymentDetails.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!paymentService.validatePaymentAmount(paymentDetails.amount)) {
      errors.push('Amount exceeds maximum limit');
    }

    if (!paymentDetails.description.trim()) {
      errors.push('Description is required');
    }

    if (!paymentDetails.orderId.trim()) {
      errors.push('Order ID is required');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    if (!stripe || !elements) {
      setError('Stripe is not initialized');
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

      // Create payment request
      const paymentRequest: PaymentRequest = {
        ...paymentDetails,
        userId: '', // Will be set by service from auth context
        receiptEmail: '', // Will be set by service from auth context
      };

      const response = await paymentService.createPayment(paymentRequest);

      if (response.status === 'SUCCEEDED') {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/payments/${response.id}`);
        }, 2000);
      } else {
        // Payment needs confirmation
        await paymentService.confirmPayment(response.id);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/payments/${response.id}`);
        }, 2000);
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
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully.
            </p>
            <div className="space-y-4">
              <Button onClick={() => navigate('/payments')}>
                View Payment History
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Make a Payment</h1>
        <p className="text-gray-600 mt-2">Enter your payment details below</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Enter the payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">
                    {paymentDetails.currency === 'ZAR' ? 'R' : paymentDetails.currency}
                  </span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={paymentDetails.amount}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="currency">Currency *</Label>
                <Select
                  id="currency"
                  name="currency"
                  value={paymentDetails.currency}
                  onChange={handleInputChange}
                  required
                >
                  {Object.values(Currency).map((currency) => (
                    <option key={currency} value={currency}>
                      {currency} - {currency === 'ZAR' ? 'South African Rand' : currency}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="orderId">Order/Reference ID *</Label>
                <Input
                  id="orderId"
                  name="orderId"
                  value={paymentDetails.orderId}
                  onChange={handleInputChange}
                  required
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={paymentDetails.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Payment for services..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  name="isRecurring"
                  checked={paymentDetails.isRecurring}
                  onChange={(e) => setPaymentDetails(prev => ({
                    ...prev,
                    isRecurring: e.target.checked
                  }))}
                  className="h-4 w-4 text-primary rounded"
                />
                <Label htmlFor="isRecurring">This is a recurring payment</Label>
              </div>

              {paymentDetails.isRecurring && (
                <div>
                  <Label htmlFor="recurringInterval">Recurring Interval</Label>
                  <Select
                    id="recurringInterval"
                    name="recurringInterval"
                    value={paymentDetails.recurringInterval}
                    onChange={handleInputChange}
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                    <option value="week">Weekly</option>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Details</CardTitle>
              <CardDescription>Enter your card information</CardDescription>
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

              <div>
                <Label htmlFor="shippingAddress">Shipping Address (Optional)</Label>
                <Textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  value={paymentDetails.shippingAddress}
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

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/payments')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !stripe}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Pay {paymentService.formatCurrency(paymentDetails.amount, paymentDetails.currency)}
              </>
            )}
          </Button>
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