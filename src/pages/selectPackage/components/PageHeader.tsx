import React from 'react';
import { AlertCircle, Clock, Gift, Check, Sparkles } from 'lucide-react';
import Logo from '../../../assets/Logo.svg';

interface PageHeaderProps {
  userStatus: string;
  currentSubscription: any;
  eligibilityCheck: any;
  shouldShowFreeTrial: boolean;
  freeTrialStatus: any;
  isMandatorySelection: boolean;
  isAuthenticated: boolean;
  userEmail: string;
  onLoginRedirect: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  userStatus,
  currentSubscription,
  eligibilityCheck,
  shouldShowFreeTrial,
  freeTrialStatus,
  isMandatorySelection,
  isAuthenticated,
  userEmail,
  onLoginRedirect,
}) => {
  return (
    <div className="text-center mb-10">
      <div className="flex justify-center mb-4">
        <img src={Logo} alt="SeventyTwoX Logo" className="w-16 h-16" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isMandatorySelection ? 'Choose Your Package' : 'Select a Package'}
      </h1>
      {shouldShowFreeTrial && (
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-center gap-3">
              <Gift className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">🎁 Start with a 14-day free trial!</p>
                <p className="text-xs text-green-600 mt-1">
                  Try all features for free. No credit card required until trial ends.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {freeTrialStatus && freeTrialStatus.remainingDays && (
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  ⏳ Free Trial Active: {freeTrialStatus.remainingDays} days remaining
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Your free trial ends in {freeTrialStatus.remainingDays} days
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMandatorySelection && (
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-medium">⚠️ Package Selection Required</p>
                <p className="text-sm text-yellow-600 mt-1">
                  You need to select a package to continue using the platform. This is a one-time selection that
                  will unlock all features.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        {shouldShowFreeTrial
          ? 'Choose Your Plan & Payment Option'
          : isMandatorySelection
            ? 'Select Your Package to Continue'
            : currentSubscription
              ? 'Your Current Plan'
              : 'Choose Your Plan'}
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {shouldShowFreeTrial
          ? 'Select your preferred plan and choose to start a free trial or proceed with payment.'
          : isMandatorySelection
            ? 'Choose the perfect plan to unlock all features. All plans include a 14-day free trial.'
            : currentSubscription
              ? 'You can upgrade or downgrade your plan at any time.'
              : 'Select the perfect plan for your business needs. All plans include a 14-day free trial.'}
      </p>
      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
        <span className="text-sm font-medium text-primary-700">
          {isAuthenticated ? `Signed in as: ${userEmail}` : `Welcome: ${userEmail}`}
        </span>
        {!isAuthenticated && (
          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Not logged in</span>
        )}
        {currentSubscription && (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
            Current: {currentSubscription.planName}
          </span>
        )}
        {userStatus === 'FREE_TRIAL' && (
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Free Trial Active</span>
        )}
        {isMandatorySelection && (
          <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">Required</span>
        )}
      </div>

      {!isAuthenticated && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            You need to login to select a package.
            <button onClick={onLoginRedirect} className="ml-2 text-primary-600 hover:text-primary-700 font-medium">
              Click here to login
            </button>
          </p>
        </div>
      )}

      <div className="hidden">
        <Check className="h-4 w-4" />
        <Sparkles className="h-4 w-4" />
      </div>
    </div>
  );
};

export default PageHeader;
