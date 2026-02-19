import React from 'react';
import { Clock, Check, Sparkles } from 'lucide-react';
import type { PackageConfig } from '../hooks/useSelectPackage';

interface ContinueSectionProps {
  show: boolean;
  selectedPackage: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMandatorySelection: boolean;
  shouldShowFreeTrial: boolean;
  currentSubscription: any;
  packageConfigs: PackageConfig[];
  isCurrentPackage: (pkgId: string) => boolean;
  onProceedToPayment: () => void;
  onNavigate: (to: string) => void;
}

const ContinueSection: React.FC<ContinueSectionProps> = ({
  show,
  selectedPackage,
  isLoading,
  isAuthenticated,
  isMandatorySelection,
  shouldShowFreeTrial,
  currentSubscription,
  packageConfigs,
  isCurrentPackage,
  onProceedToPayment,
  onNavigate,
}) => {
  if (!show) return null;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {shouldShowFreeTrial
                ? 'Select a package to continue'
                : isMandatorySelection
                  ? 'Complete Your Registration'
                  : currentSubscription
                    ? 'Change Your Plan'
                    : 'Ready to get started?'}
            </h3>
            <p className="text-gray-600">
              {selectedPackage
                ? `You've selected the ${packageConfigs.find((p) => p.id === selectedPackage)?.name} plan`
                : shouldShowFreeTrial
                  ? 'Select a package to see payment options'
                  : isMandatorySelection
                    ? 'Select a package to continue to your dashboard'
                    : currentSubscription
                      ? 'Select a new plan to upgrade or downgrade'
                      : 'Select a plan to continue'}
            </p>
            {!isAuthenticated && !isMandatorySelection && (
              <p className="text-amber-600 text-sm mt-1">Please login to proceed with package selection</p>
            )}
            {currentSubscription && isCurrentPackage(selectedPackage) && (
              <p className="text-amber-600 text-sm mt-1">You are already on this plan</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {!isMandatorySelection && !shouldShowFreeTrial && (
              <button
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    localStorage.removeItem('selectedPackage');
                  }
                  onNavigate(isAuthenticated ? '/dashboard' : '/create-password');
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                {isAuthenticated ? 'Skip for now' : 'Back'}
              </button>
            )}

            <button
              onClick={onProceedToPayment}
              disabled={
                !selectedPackage ||
                isLoading ||
                (!isAuthenticated && !isMandatorySelection) ||
                (currentSubscription && isCurrentPackage(selectedPackage))
              }
              className={`px-8 py-3 rounded-lg font-medium ${
                isMandatorySelection
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                  : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
              } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : !isAuthenticated && !isMandatorySelection ? (
                'Login Required'
              ) : isMandatorySelection ? (
                'Continue to Payment'
              ) : currentSubscription ? (
                'Change Plan'
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900">14-Day Free Trial</span>
            </div>
            <p className="text-xs text-gray-600">Full access to all features</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-900">No Credit Card Required</span>
            </div>
            <p className="text-xs text-gray-600">For free trial option</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-900">Cancel Anytime</span>
            </div>
            <p className="text-xs text-gray-600">No long-term contracts</p>
          </div>
        </div>

        <p className="text-gray-500 text-sm">
          Need help choosing?{' '}
          <button className="text-primary-600 hover:text-primary-700 font-medium">Contact our sales team</button>
        </p>
        <p className="text-gray-400 text-sm mt-2">
          {shouldShowFreeTrial
            ? 'Choose between starting with a free trial or immediate payment. Both options give you full access.'
            : isMandatorySelection
              ? 'You must select a package to continue. No credit card required during 14-day trial.'
              : currentSubscription
                ? 'Plan changes take effect immediately. Prorated charges may apply.'
                : 'All plans include a 14-day free trial. No credit card required until trial ends.'}
        </p>
      </div>
    </div>
  );
};

export default ContinueSection;
