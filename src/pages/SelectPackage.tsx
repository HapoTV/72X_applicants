// src/pages/SelectPackage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PackageGrid from './selectPackage/components/PackageGrid';
import PaymentOptions from './selectPackage/components/PaymentOptions';
import ContinueSection from './selectPackage/components/ContinueSection';
import PageHeader from './selectPackage/components/PageHeader';
import { useSelectPackage } from './selectPackage/hooks/useSelectPackage';

const SelectPackage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    selectedPackage,
    isLoading,
    isActivatingTrial,
    userEmail,
    currentSubscription,
    userStatus,
    freeTrialStatus,
    showPaymentOptions,
    eligibilityCheck,
    packageConfigs,
    getIconComponent,
    handlePackageSelect,
    handleActivateFreeTrial,
    handleProceedToPayment,
    formatPrice,
    isCurrentPackage,
    handleLoginRedirect,
    isMandatorySelection,
    shouldShowFreeTrial,
  } = useSelectPackage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <PageHeader
            userStatus={userStatus}
            currentSubscription={currentSubscription}
            eligibilityCheck={eligibilityCheck}
            shouldShowFreeTrial={shouldShowFreeTrial}
            freeTrialStatus={freeTrialStatus}
            isMandatorySelection={isMandatorySelection}
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            onLoginRedirect={handleLoginRedirect}
          />
        </div>

        <PackageGrid
          packageConfigs={packageConfigs}
          selectedPackage={selectedPackage}
          isAuthenticated={isAuthenticated}
          isMandatorySelection={isMandatorySelection}
          shouldShowFreeTrial={shouldShowFreeTrial}
          isCurrentPackage={isCurrentPackage}
          formatPrice={formatPrice}
          getIconComponent={getIconComponent}
          onSelect={handlePackageSelect}
        />

        {/* Payment Options Section (Only shows when a package is selected) */}
        <PaymentOptions
          show={showPaymentOptions}
          selectedPackage={selectedPackage}
          packageConfigs={packageConfigs}
          shouldShowFreeTrial={shouldShowFreeTrial}
          isActivatingTrial={isActivatingTrial}
          isLoading={isLoading}
          formatPrice={formatPrice}
          onActivateFreeTrial={handleActivateFreeTrial}
          onProceedToPayment={handleProceedToPayment}
        />

        {/* Original Continue Section (for non-free-trial-eligible users) */}
        <ContinueSection
          show={!showPaymentOptions || !shouldShowFreeTrial}
          selectedPackage={selectedPackage}
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          isMandatorySelection={isMandatorySelection}
          shouldShowFreeTrial={shouldShowFreeTrial}
          currentSubscription={currentSubscription}
          packageConfigs={packageConfigs}
          isCurrentPackage={isCurrentPackage}
          onProceedToPayment={handleProceedToPayment}
          onNavigate={navigate}
        />
      </div>
    </div>
  );
};

export default SelectPackage;