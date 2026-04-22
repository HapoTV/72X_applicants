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
  const { isAuthenticated, userOrganisation } = useAuth();

  const isStandaloneOrg = !userOrganisation || userOrganisation.trim().toLowerCase() === 'hapo';

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
      case 'zap': return React.createElement(Zap, { className: 'w-6 h-6' });
      case 'sparkles': return React.createElement(Sparkles, { className: 'w-6 h-6' });
      case 'crown': return React.createElement(Crown, { className: 'w-6 h-6' });
      default: return React.createElement(Zap, { className: 'w-6 h-6' });
    }
  }, []);

  const fetchCurrentSubscription = useCallback(async () => {
    try {
      const subscription = await userSubscriptionService.getCurrentUserPackage();
      if (subscription) {
        setCurrentSubscription(subscription);
        const currentPackageId = packageConfigs.find(
          (pkg) => pkg.backendType === subscription.subscriptionType,
        )?.id;
        if (currentPackageId) setSelectedPackage(currentPackageId);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  }, [packageConfigs]);

  const fetchFreeTrialStatus = useCallback(async () => {
    try {
      const status = await userSubscriptionService.getFreeTrialStatus();
      setFreeTrialStatus(status);
    } catch (error) {
      console.error('Error fetching free trial status:', error);
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
        if (confirmed) { localStorage.setItem('emailVerified', 'true'); return true; }
      } catch { return false; }
      return false;
    };

    const run = async () => {
      // Authenticated backend users (JWT) skip Supabase email verification
      if (!isAuthenticated) {
        const ok = await ensureVerified();
        if (isCancelled) return;
        if (!ok) { navigate('/signup/success/provided'); return; }
      }
      if (isCancelled) return;

      // Real organisation users should not use the standalone package selection flow.
      // Their organisation is expected to have provisioned/paid a plan for them.
      if (isAuthenticated && !isStandaloneOrg) {
        navigate('/dashboard/overview', { replace: true });
        return;
      }

      const email = localStorage.getItem('userEmail');
      const status = localStorage.getItem('userStatus');
      const requiresPackage = localStorage.getItem('requiresPackageSelection');

      if (!email) { navigate('/create-password'); return; }

      setUserEmail(email);
      setUserStatus(status || '');
      setRequiresPackageSelection(requiresPackage === 'true');

      if (isAuthenticated) {
        fetchCurrentSubscription();
        // Org employees don't need free trial checks — "Hapo" is the default standalone org.
        // Additionally, some backend eligibility checks may classify any org user as ineligible.
        // For the standalone org (Hapo), we rely on frontend/userStatus gating to avoid UI flicker.
        if (isStandaloneOrg) {
          fetchFreeTrialStatus();
        } else {
          setEligibilityCheck({ isEligible: false, reason: 'Organisation user' });
        }
      }
    };

    run();
    return () => { isCancelled = true; };
  }, [navigate, isAuthenticated, userOrganisation, fetchCurrentSubscription, fetchFreeTrialStatus, isStandaloneOrg]);

  const handlePackageSelect = useCallback((pkgId: string) => {
    setSelectedPackage(pkgId);
    setShowPaymentOptions(true);
  }, []);

  const formatPrice = useCallback((price: number, currency: string) => {
    return currency === 'ZAR' ? `R${price}` : `${currency} ${price}`;
  }, []);

  const isCurrentPackage = useCallback(
    (pkgId: string) => {
      if (!currentSubscription) return false;
      const pkg = packageConfigs.find((p) => p.id === pkgId);
      return !!(pkg && currentSubscription.subscriptionType === pkg.backendType);
    },
    [currentSubscription, packageConfigs],
  );

  const handleLoginRedirect = useCallback(() => { navigate('/login'); }, [navigate]);

  const isMandatorySelection = userStatus === 'PENDING_PACKAGE' || requiresPackageSelection;

  // User is on an active free trial
  const isOnFreeTrial = userStatus === 'FREE_TRIAL';

  const isEligibleForFreeTrial = useCallback(() => {
    // Org employees never get free trial — they're on the org plan.
    if (!isStandaloneOrg) return false;

    // For the standalone org (Hapo / no org), derive eligibility deterministically from state
    // to avoid flicker caused by async backend checks.
    if (userStatus === 'PENDING_PACKAGE' && !currentSubscription) {
      return true;
    }

    // Already has a paid subscription
    if (currentSubscription) return false;

    // Already on or completed free trial
    if (userStatus === 'FREE_TRIAL') return false;

    // Backend explicitly said not eligible (when available)
    if (freeTrialStatus && freeTrialStatus.success === false) return false;

    // Only PENDING_PACKAGE qualifies
    return userStatus === 'PENDING_PACKAGE';
  }, [currentSubscription, userStatus, freeTrialStatus, isStandaloneOrg]);

  const shouldShowFreeTrial = isEligibleForFreeTrial();

  const handleActivateFreeTrial = useCallback(async () => {
    if (!selectedPackage) { alert('Please select a package to start free trial'); return; }

    setIsActivatingTrial(true);
    try {
      const selectedPkg = packageConfigs.find((p) => p.id === selectedPackage);
      if (selectedPkg) {
        const response = await userSubscriptionService.activateFreeTrial(selectedPkg.backendType);
        if (response && response.success) {
          const serializablePackageData = {
            id: selectedPkg.id, name: selectedPkg.name, description: selectedPkg.description,
            price: selectedPkg.price, currency: selectedPkg.currency, interval: selectedPkg.interval,
            backendType: selectedPkg.backendType, features: selectedPkg.features,
            popular: selectedPkg.popular, color: selectedPkg.color, bgColor: selectedPkg.bgColor,
            iconType: selectedPkg.iconType,
          };
          localStorage.setItem('selectedPackage', JSON.stringify(serializablePackageData));
          localStorage.setItem('userPackage', selectedPkg.id);
          window.dispatchEvent(new CustomEvent('user-package-updated'));
          localStorage.setItem('userStatus', 'FREE_TRIAL');
          localStorage.setItem('requiresPackageSelection', 'false');
          if (!localStorage.getItem('freeTrialStartDate')) {
            localStorage.setItem('freeTrialStartDate', new Date().toISOString());
          }
          setUserStatus('FREE_TRIAL');
          alert(`✅ Free trial activated! You have 14 days of free access to ${selectedPkg.name} features.`);
          navigate('/dashboard');
        } else {
          alert(`Failed to activate free trial: ${response?.error || response?.message || 'Unknown error'}`);
        }
      }
    } catch (error: any) {
      alert(`Error activating free trial: ${error.response?.data?.error || error.response?.data?.message || error.message}`);
    } finally {
      setIsActivatingTrial(false);
    }
  }, [selectedPackage, packageConfigs, navigate]);

  const handleProceedToPayment = useCallback(async () => {
    if (!selectedPackage) { alert('Please select a package to continue'); return; }

    setIsLoading(true);
    try {
      const selectedPkg = packageConfigs.find((p) => p.id === selectedPackage);
      if (selectedPkg) {
        const serializablePackageData = {
          id: selectedPkg.id, name: selectedPkg.name, description: selectedPkg.description,
          price: selectedPkg.price, currency: selectedPkg.currency, interval: selectedPkg.interval,
          backendType: selectedPkg.backendType, features: selectedPkg.features,
          popular: selectedPkg.popular, color: selectedPkg.color, bgColor: selectedPkg.bgColor,
          iconType: selectedPkg.iconType,
        };
        localStorage.setItem('selectedPackage', JSON.stringify(serializablePackageData));
        localStorage.setItem('userPackage', selectedPkg.id);
        window.dispatchEvent(new CustomEvent('user-package-updated'));
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
    isOnFreeTrial,
  };
}
