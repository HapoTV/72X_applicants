import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Crown } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import userSubscriptionService from '../../../services/UserSubscriptionService';
import { UserSubscriptionType } from '../../../interfaces/UserSubscriptionData';

export type EligibilityCheck = {
  isEligible: boolean;
  reason: string;
};

export type PackageConfig = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month';
  features: string[];
  backendType: UserSubscriptionType;
  iconType: 'zap' | 'sparkles' | 'crown';
  color: string;
  bgColor: string;
  popular?: boolean;
};

export function useSelectPackage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActivatingTrial, setIsActivatingTrial] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [userStatus, setUserStatus] = useState<string>('');
  const [requiresPackageSelection, setRequiresPackageSelection] = useState(false);
  const [freeTrialStatus, setFreeTrialStatus] = useState<any>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [eligibilityCheck, setEligibilityCheck] = useState<EligibilityCheck | null>(null);

  const packageConfigs: PackageConfig[] = useMemo(
    () => [
      {
        id: 'startup',
        name: 'Start-Up',
        description: 'Perfect for new businesses getting started',
        price: 99,
        currency: 'ZAR',
        interval: 'month',
        features: [
          'Basic business tools',
          'Email support',
          'Community access',
          '14-day free trial',
        ],
        backendType: UserSubscriptionType.START_UP,
        iconType: 'zap',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        id: 'essential',
        name: 'Essential',
        description: 'Everything growing businesses need',
        price: 299,
        currency: 'ZAR',
        interval: 'month',
        features: [
          'All Start-up features',
          'Advanced analytics',
          'Priority support',
          'AI business advisor',
          '14-day free trial',
        ],
        popular: true,
        backendType: UserSubscriptionType.ESSENTIAL,
        iconType: 'sparkles',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      },
      {
        id: 'premium',
        name: 'Premium',
        description: 'Enterprise-grade features for scaling',
        price: 999,
        currency: 'ZAR',
        interval: 'month',
        features: [
          'All Essential features',
          'Dedicated support',
          'Custom integrations',
          'Advanced AI tools',
          '14-day free trial',
        ],
        backendType: UserSubscriptionType.PREMIUM,
        iconType: 'crown',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
      },
    ],
    [],
  );

  const getIconComponent = useCallback((iconType: string) => {
    switch (iconType) {
      case 'zap':
        return React.createElement(Zap, { className: 'w-6 h-6' });
      case 'sparkles':
        return React.createElement(Sparkles, { className: 'w-6 h-6' });
      case 'crown':
        return React.createElement(Crown, { className: 'w-6 h-6' });
      default:
        return React.createElement(Zap, { className: 'w-6 h-6' });
    }
  }, []);

  const fetchCurrentSubscription = useCallback(async () => {
    try {
      const subscription = await userSubscriptionService.getCurrentUserPackage();
      if (subscription) {
        console.log('📊 Current subscription:', subscription);
        setCurrentSubscription(subscription);
        const currentPackageId = packageConfigs.find(
          (pkg) => pkg.backendType === subscription.subscriptionType,
        )?.id;
        if (currentPackageId) {
          setSelectedPackage(currentPackageId);
        }
      } else {
        console.log('📊 No current subscription found');
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  }, [packageConfigs]);

  const fetchFreeTrialStatus = useCallback(async () => {
    try {
      const status = await userSubscriptionService.getFreeTrialStatus();
      console.log('🎁 Free trial status:', status);
      setFreeTrialStatus(status);
    } catch (error) {
      console.error('Error fetching free trial status:', error);
    }
  }, []);

  const checkFreeTrialEligibility = useCallback(async () => {
    try {
      const response = await userSubscriptionService.checkFreeTrialEligibility();
      console.log('✅ Eligibility check:', response);

      if (response && typeof response === 'object') {
        setEligibilityCheck({
          isEligible: response.eligible === true,
          reason: `User status: ${response.userStatus || 'unknown'}`,
        });
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setEligibilityCheck({
        isEligible: false,
        reason: 'Error checking eligibility',
      });
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const ensureVerified = async () => {
      const emailVerified = localStorage.getItem('emailVerified') === 'true';
      if (emailVerified) return true;

      try {
        if (!supabase) return false;
        const { data, error } = await supabase.auth.getUser();
        if (error) return false;

        const confirmed = !!data.user?.email_confirmed_at;
        if (confirmed) {
          localStorage.setItem('emailVerified', 'true');
          return true;
        }
      } catch {
        return false;
      }

      return false;
    };

    const run = async () => {
      const ok = await ensureVerified();
      if (isCancelled) return;
      if (!ok) {
        navigate('/signup/success/provided');
        return;
      }

      const email = localStorage.getItem('userEmail');
      const status = localStorage.getItem('userStatus');
      const requiresPackage = localStorage.getItem('requiresPackageSelection');
      const savedPackage = localStorage.getItem('selectedPackage');

      if (!email) {
        navigate('/create-password');
        return;
      }

      setUserEmail(email);
      setUserStatus(status || '');
      setRequiresPackageSelection(requiresPackage === 'true');

      console.log('📦 Package page user state:', {
        email,
        status,
        requiresPackage,
        savedPackage: savedPackage ? JSON.parse(savedPackage) : null,
        isAuthenticated,
      });

      if (status === 'PENDING_PACKAGE') {
        console.log('⚠️ User has PENDING_PACKAGE status - mandatory package selection');
      }

      if (isAuthenticated) {
        fetchCurrentSubscription();
        fetchFreeTrialStatus();
        checkFreeTrialEligibility();
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [navigate, isAuthenticated, fetchCurrentSubscription, fetchFreeTrialStatus, checkFreeTrialEligibility]);

  const handlePackageSelect = useCallback((pkgId: string) => {
    setSelectedPackage(pkgId);
    setShowPaymentOptions(true);
  }, []);

  const formatPrice = useCallback((price: number, currency: string) => {
    if (currency === 'ZAR') {
      return `R${price}`;
    }
    return `${currency} ${price}`;
  }, []);

  const isCurrentPackage = useCallback(
    (pkgId: string) => {
      if (!currentSubscription) return false;
      const pkg = packageConfigs.find((p) => p.id === pkgId);
      return !!(pkg && currentSubscription.subscriptionType === pkg.backendType);
    },
    [currentSubscription, packageConfigs],
  );

  const handleLoginRedirect = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const isMandatorySelection = userStatus === 'PENDING_PACKAGE' || requiresPackageSelection;

  const isEligibleForFreeTrial = useCallback(() => {
    console.log('🔍 Checking eligibility:', {
      currentSubscription: !!currentSubscription,
      userStatus,
      freeTrialStatus,
      eligibilityCheck,
    });

    if (eligibilityCheck) {
      console.log('✅ Using backend eligibility check:', eligibilityCheck);
      return eligibilityCheck.isEligible;
    }

    if (currentSubscription) {
      console.log('❌ User has current subscription');
      return false;
    }

    if (userStatus === 'FREE_TRIAL') {
      console.log('❌ User is already on free trial');
      return false;
    }

    if (freeTrialStatus && freeTrialStatus.success === false) {
      console.log('❌ Free trial status indicates not eligible:', freeTrialStatus.message);
      return false;
    }

    const eligibleStatuses = ['PENDING_PACKAGE', 'PENDING_PAYMENT'];
    const isEligible = eligibleStatuses.includes(userStatus);

    console.log(`📊 Eligibility based on status (${userStatus}):`, isEligible);
    return isEligible;
  }, [eligibilityCheck, currentSubscription, userStatus, freeTrialStatus]);

  const shouldShowFreeTrial = isEligibleForFreeTrial();

  const handleActivateFreeTrial = useCallback(async () => {
    if (!selectedPackage) {
      alert('Please select a package to start free trial');
      return;
    }

    setIsActivatingTrial(true);

    try {
      const selectedPkg = packageConfigs.find((p) => p.id === selectedPackage);
      if (selectedPkg) {
        console.log('🎁 Activating free trial for package:', selectedPkg.name);
        console.log('📦 Package backend type:', selectedPkg.backendType);
        console.log('📦 Request payload:', { new_package: selectedPkg.backendType });

        const response = await userSubscriptionService.activateFreeTrial(selectedPkg.backendType);

        console.log('🎁 Free trial activation response:', response);

        if (response && response.success) {
          const serializablePackageData = {
            id: selectedPkg.id,
            name: selectedPkg.name,
            description: selectedPkg.description,
            price: selectedPkg.price,
            currency: selectedPkg.currency,
            interval: selectedPkg.interval,
            backendType: selectedPkg.backendType,
            features: selectedPkg.features,
            popular: selectedPkg.popular,
            color: selectedPkg.color,
            bgColor: selectedPkg.bgColor,
            iconType: selectedPkg.iconType,
          };

          localStorage.setItem('selectedPackage', JSON.stringify(serializablePackageData));

          localStorage.setItem('userStatus', 'FREE_TRIAL');
          localStorage.setItem('requiresPackageSelection', 'false');
          setUserStatus('FREE_TRIAL');

          alert(
            `✅ Free trial activated successfully! You have 14 days of free access to ${selectedPkg.name} features.`,
          );

          navigate('/dashboard');
        } else {
          const errorMessage = response?.error || response?.message || 'Unknown error';
          alert(`Failed to activate free trial: ${errorMessage}`);
        }
      }
    } catch (error: any) {
      console.error('Error activating free trial:', error);
      console.error('Error response:', error.response?.data);
      alert(
        `Error activating free trial: ${error.response?.data?.error || error.response?.data?.message || error.message}`,
      );
    } finally {
      setIsActivatingTrial(false);
    }
  }, [selectedPackage, packageConfigs, navigate]);

  const handleProceedToPayment = useCallback(async () => {
    if (!selectedPackage) {
      alert('Please select a package to continue');
      return;
    }

    setIsLoading(true);

    try {
      const selectedPkg = packageConfigs.find((p) => p.id === selectedPackage);
      if (selectedPkg) {
        const serializablePackageData = {
          id: selectedPkg.id,
          name: selectedPkg.name,
          description: selectedPkg.description,
          price: selectedPkg.price,
          currency: selectedPkg.currency,
          interval: selectedPkg.interval,
          backendType: selectedPkg.backendType,
          features: selectedPkg.features,
          popular: selectedPkg.popular,
          color: selectedPkg.color,
          bgColor: selectedPkg.bgColor,
          iconType: selectedPkg.iconType,
        };

        localStorage.setItem('selectedPackage', JSON.stringify(serializablePackageData));

        await userSubscriptionService.selectPackage(selectedPkg.backendType);

        localStorage.setItem('userStatus', 'PENDING_PAYMENT');
        localStorage.setItem('requiresPackageSelection', 'false');
        setUserStatus('PENDING_PAYMENT');

        navigate('/payments/new');
      }
    } catch (error) {
      console.error('Error proceeding to payment:', error);
      alert('Failed to proceed to payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPackage, packageConfigs, navigate]);

  return {
    isAuthenticated,
    selectedPackage,
    setSelectedPackage,
    isLoading,
    isActivatingTrial,
    userEmail,
    currentSubscription,
    userStatus,
    setUserStatus,
    requiresPackageSelection,
    freeTrialStatus,
    showPaymentOptions,
    setShowPaymentOptions,
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
  };
}
