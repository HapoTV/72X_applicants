import React from 'react';
import { Check, Gift, CreditCard } from 'lucide-react';
import type { PackageConfig } from '../hooks/useSelectPackage';

interface PaymentOptionsProps {
  show: boolean;
  selectedPackage: string;
  packageConfigs: PackageConfig[];
  shouldShowFreeTrial: boolean;
  isActivatingTrial: boolean;
  isLoading: boolean;
  formatPrice: (price: number, currency: string) => string;
  onActivateFreeTrial: () => void;
  onProceedToPayment: () => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  show,
  selectedPackage,
  packageConfigs,
  shouldShowFreeTrial,
  isActivatingTrial,
  isLoading,
  formatPrice,
  onActivateFreeTrial,
  onProceedToPayment,
}) => {
  if (!show || !selectedPackage || !shouldShowFreeTrial) return null;

  const handleContactSales = () => {
    const to = 'admin@hapogroup.co.za';
    const subject = 'Package enquiry';
    const body = `Hi Support Team,\n\nI need help deciding on a package.\n\nThank you.`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Payment Option</h3>
          <p className="text-gray-600">
            You've selected the{' '}
            <span className="font-semibold text-primary-600">
              {packageConfigs.find((p) => p.id === selectedPackage)?.name}
            </span>{' '}
            plan. Choose how you'd like to proceed:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-green-200 rounded-xl p-6 hover:border-green-300 transition-colors bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Gift className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Start Free Trial</h4>
                  <p className="text-sm text-gray-600">14 days, no payment now</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                Recommended
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Access for 14 days</p>
                  <p className="text-sm text-gray-600">Trial access follows the package you select (Premium unlocks everything)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">No credit card required</p>
                  <p className="text-sm text-gray-600">Add payment later</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Cancel anytime</p>
                  <p className="text-sm text-gray-600">No obligations</p>
                </div>
              </div>
            </div>

            <button
              onClick={onActivateFreeTrial}
              disabled={isActivatingTrial}
              className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isActivatingTrial ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Activating...
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  Start 14-Day Free Trial
                </>
              )}
            </button>
          </div>

          <div className="border-2 border-blue-200 rounded-xl p-6 hover:border-blue-300 transition-colors bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Pay Now & Start</h4>
                  <p className="text-sm text-gray-600">Immediate access</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                Instant
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Uninterrupted access</p>
                  <p className="text-sm text-gray-600">Skip the trial period</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">30-day money-back guarantee</p>
                  <p className="text-sm text-gray-600">Full refund if unsatisfied</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Priority support</p>
                  <p className="text-sm text-gray-600">Dedicated assistance</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(packageConfigs.find((p) => p.id === selectedPackage)?.price || 0, 'ZAR')}
                </span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <p className="text-center text-sm text-gray-600 mt-1">First month billed today</p>
            </div>

            <button
              onClick={onProceedToPayment}
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Need help deciding?{' '}
            <button type="button" onClick={handleContactSales} className="text-primary-600 hover:text-primary-700 font-medium">
              Contact our sales team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
