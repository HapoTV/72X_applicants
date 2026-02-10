// src/pages/SelectPackage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import { Check, Sparkles, Zap, Crown, AlertCircle, Clock, Gift, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userSubscriptionService from '../services/UserSubscriptionService';
import { UserSubscriptionType } from '../interfaces/UserSubscriptionData';
import type { PackageOption } from '../interfaces/UserSubscriptionData';

const SelectPackage: React.FC = () => {
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
  const [eligibilityCheck, setEligibilityCheck] = useState<{
    isEligible: boolean;
    reason: string;
  } | null>(null);

  useEffect(() => {
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
      isAuthenticated
    });
    
    if (status === 'PENDING_PACKAGE') {
      console.log('⚠️ User has PENDING_PACKAGE status - mandatory package selection');
    }
    
    if (isAuthenticated) {
      fetchCurrentSubscription();
      fetchFreeTrialStatus();
      checkFreeTrialEligibility();
    }
  }, [navigate, isAuthenticated]);

  const fetchCurrentSubscription = async () => {
    try {
      const subscription = await userSubscriptionService.getCurrentUserPackage();
      if (subscription) {
        console.log('📊 Current subscription:', subscription);
        setCurrentSubscription(subscription);
        const currentPackageId = packages.find(
          pkg => pkg.backendType === subscription.subscriptionType
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
  };

  const fetchFreeTrialStatus = async () => {
    try {
      const status = await userSubscriptionService.getFreeTrialStatus();
      console.log('🎁 Free trial status:', status);
      setFreeTrialStatus(status);
    } catch (error) {
      console.error('Error fetching free trial status:', error);
    }
  };

  const checkFreeTrialEligibility = async () => {
    try {
      const response = await userSubscriptionService.checkFreeTrialEligibility();
      console.log('✅ Eligibility check:', response);
      
      if (response && typeof response === 'object') {
        setEligibilityCheck({
          isEligible: response.eligible === true,
          reason: `User status: ${response.userStatus || 'unknown'}`
        });
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setEligibilityCheck({
        isEligible: false,
        reason: 'Error checking eligibility'
      });
    }
  };

  const packageConfigs = [
    {
      id: 'startup',
      name: 'Start-Up',
      description: 'Perfect for new businesses getting started',
      price: 99,
      currency: 'ZAR',
      interval: 'month' as const,
      features: [
        'Basic business tools',
        'Email support',
        'Community access',
        'Up to 5 users',
        '1GB storage',
        'Basic analytics',
        '14-day free trial'
      ],
      backendType: UserSubscriptionType.START_UP,
      iconType: 'zap' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'essential',
      name: 'Essential',
      description: 'Everything growing businesses need',
      price: 299,
      currency: 'ZAR',
      interval: 'month' as const,
      features: [
        'Everything in Start-Up',
        'Advanced analytics',
        'Priority support',
        'AI business advisor',
        'Up to 20 users',
        '10GB storage',
        'Custom reports',
        'API access',
        '14-day free trial'
      ],
      popular: true,
      backendType: UserSubscriptionType.ESSENTIAL,
      iconType: 'sparkles' as const,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Enterprise-grade features for scaling',
      price: 999,
      currency: 'ZAR',
      interval: 'month' as const,
      features: [
        'Everything in Essential',
        'Dedicated account manager',
        'Advanced AI tools',
        'Unlimited users',
        '100GB storage',
        'Custom integrations',
        'White-label solution',
        '24/7 phone support',
        'SLA guarantee',
        '14-day free trial'
      ],
      backendType: UserSubscriptionType.PREMIUM,
      iconType: 'crown' as const,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'zap':
        return <Zap className="w-6 h-6" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'crown':
        return <Crown className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const packages: PackageOption[] = packageConfigs.map(config => ({
    ...config,
    icon: getIconComponent(config.iconType)
  }));

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackage(pkgId);
    setShowPaymentOptions(true);
  };

  const handleActivateFreeTrial = async () => {
    if (!selectedPackage) {
      alert('Please select a package to start free trial');
      return;
    }

    setIsActivatingTrial(true);
    
    try {
      const selectedPkg = packageConfigs.find(p => p.id === selectedPackage);
      if (selectedPkg) {
        console.log('🎁 Activating free trial for package:', selectedPkg.name);
        console.log('📦 Package backend type:', selectedPkg.backendType);
        console.log('📦 Request payload:', { new_package: selectedPkg.backendType });
        
        // Call the free trial activation endpoint
        const response = await userSubscriptionService.activateFreeTrial(selectedPkg.backendType);
        
        console.log('🎁 Free trial activation response:', response);
        
        if (response && response.success) {
          // Store package selection
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
            iconType: selectedPkg.iconType
          };
          
          localStorage.setItem('selectedPackage', JSON.stringify(serializablePackageData));
          
          // Update user status locally
          localStorage.setItem('userStatus', 'FREE_TRIAL');
          localStorage.setItem('requiresPackageSelection', 'false');
          setUserStatus('FREE_TRIAL');
          
          // Show success message
          alert(`✅ Free trial activated successfully! You have 14 days of free access to ${selectedPkg.name} features.`);
          
          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          const errorMessage = response?.error || response?.message || 'Unknown error';
          alert(`Failed to activate free trial: ${errorMessage}`);
        }
      }
    } catch (error: any) {
      console.error('Error activating free trial:', error);
      console.error('Error response:', error.response?.data);
      alert(`Error activating free trial: ${error.response?.data?.error || error.response?.data?.message || error.message}`);
    } finally {
      setIsActivatingTrial(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!selectedPackage) {
      alert('Please select a package to continue');
      return;
    }

    setIsLoading(true);
    
    try {
      const selectedPkg = packageConfigs.find(p => p.id === selectedPackage);
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
          iconType: selectedPkg.iconType
        };
        
        localStorage.setItem('selectedPackage', JSON.stringify(serializablePackageData));
        
        // Call selectPackage to set the subscription type without activating trial
        await userSubscriptionService.selectPackage(selectedPkg.backendType);
        
        // Set status to PENDING_PAYMENT
        localStorage.setItem('userStatus', 'PENDING_PAYMENT');
        localStorage.setItem('requiresPackageSelection', 'false');
        setUserStatus('PENDING_PAYMENT');
        
        // Navigate to payment page
        navigate('/payments/new');
      }
    } catch (error) {
      console.error('Error proceeding to payment:', error);
      alert('Failed to proceed to payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'ZAR') {
      return `R${price}`;
    }
    return `${currency} ${price}`;
  };

  const isCurrentPackage = (pkgId: string) => {
    if (!currentSubscription) return false;
    const pkg = packageConfigs.find(p => p.id === pkgId);
    return pkg && currentSubscription.subscriptionType === pkg.backendType;
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const isMandatorySelection = userStatus === 'PENDING_PACKAGE' || requiresPackageSelection;
  
  // Enhanced eligibility check with better logic
  const isEligibleForFreeTrial = () => {
    console.log('🔍 Checking eligibility:', {
      currentSubscription: !!currentSubscription,
      userStatus,
      freeTrialStatus,
      eligibilityCheck
    });

    // First check backend eligibility
    if (eligibilityCheck) {
      console.log('✅ Using backend eligibility check:', eligibilityCheck);
      return eligibilityCheck.isEligible;
    }

    // Fallback to frontend logic
    if (currentSubscription) {
      console.log('❌ User has current subscription');
      return false;
    }

    if (userStatus === 'FREE_TRIAL') {
      console.log('❌ User is already on free trial');
      return false;
    }

    // Check if free trial status indicates already used
    if (freeTrialStatus && freeTrialStatus.success === false) {
      console.log('❌ Free trial status indicates not eligible:', freeTrialStatus.message);
      return false;
    }

    // User is eligible if they are in PENDING_PACKAGE or PENDING_PAYMENT status
    const eligibleStatuses = ['PENDING_PACKAGE', 'PENDING_PAYMENT'];
    const isEligible = eligibleStatuses.includes(userStatus);
    
    console.log(`📊 Eligibility based on status (${userStatus}):`, isEligible);
    return isEligible;
  };

  const shouldShowFreeTrial = isEligibleForFreeTrial();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img src={Logo} alt="SeventyTwoX Logo" className="w-16 h-16" />
          </div>
          
          {/* Debug Info (remove in production) */}
          <div className="mb-4 max-w-2xl mx-auto text-left bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Debug Info:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>User Status: <span className="font-medium">{userStatus || 'none'}</span></p>
              <p>Has Subscription: <span className="font-medium">{currentSubscription ? 'Yes' : 'No'}</span></p>
              <p>Eligibility Check: <span className="font-medium">{eligibilityCheck ? JSON.stringify(eligibilityCheck) : 'pending'}</span></p>
              <p>Should Show Free Trial: <span className={`font-medium ${shouldShowFreeTrial ? 'text-green-600' : 'text-red-600'}`}>{shouldShowFreeTrial ? 'Yes' : 'No'}</span></p>
            </div>
          </div>

          {/* Free Trial Banner */}
          {shouldShowFreeTrial && (
            <div className="mb-6 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-center gap-3">
                  <Gift className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      🎁 Start with a 14-day free trial!
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Try all features for free. No credit card required until trial ends.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current Free Trial Status */}
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

          {/* Mandatory Selection Alert */}
          {isMandatorySelection && (
            <div className="mb-6 max-w-2xl mx-auto">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 font-medium">
                      ⚠️ Package Selection Required
                    </p>
                    <p className="text-sm text-yellow-600 mt-1">
                      You need to select a package to continue using the platform. 
                      This is a one-time selection that will unlock all features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {shouldShowFreeTrial ? 'Choose Your Plan & Payment Option' :
             isMandatorySelection ? 'Select Your Package to Continue' : 
             currentSubscription ? 'Your Current Plan' : 'Choose Your Plan'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {shouldShowFreeTrial 
              ? 'Select your preferred plan and choose to start a free trial or proceed with payment.'
              : isMandatorySelection 
              ? 'Choose the perfect plan to unlock all features. All plans include a 14-day free trial.'
              : currentSubscription 
              ? 'You can upgrade or downgrade your plan at any time.'
              : 'Select the perfect plan for your business needs. All plans include a 14-day free trial.'
            }
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
            <span className="text-sm font-medium text-primary-700">
              {isAuthenticated ? `Signed in as: ${userEmail}` : `Welcome: ${userEmail}`}
            </span>
            {!isAuthenticated && (
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                Not logged in
              </span>
            )}
            {currentSubscription && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                Current: {currentSubscription.planName}
              </span>
            )}
            {userStatus === 'FREE_TRIAL' && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                Free Trial Active
              </span>
            )}
            {isMandatorySelection && (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                Required
              </span>
            )}
          </div>
          
          {!isAuthenticated && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                You need to login to select a package. 
                <button 
                  onClick={handleLoginRedirect}
                  className="ml-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Click here to login
                </button>
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packageConfigs.map((pkg) => {
            const isCurrent = isCurrentPackage(pkg.id);
            const isSelected = selectedPackage === pkg.id;
            
            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                  isSelected
                    ? 'border-primary-500 shadow-xl shadow-primary-100'
                    : isCurrent
                    ? 'border-green-500 shadow-lg'
                    : 'border-gray-200 hover:border-primary-300'
                } ${pkg.popular ? 'transform md:scale-105' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 right-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className={`inline-flex p-3 rounded-xl ${pkg.bgColor} ${pkg.color} mb-4`}>
                    {getIconComponent(pkg.iconType)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-6">
                    {pkg.description}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(pkg.price, pkg.currency)}
                      </span>
                      <span className="text-gray-500 ml-2">/{pkg.interval}</span>
                    </div>
                    {shouldShowFreeTrial && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        Includes 14-day free trial option
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePackageSelect(pkg.id)}
                    disabled={isCurrent || (!isAuthenticated && !isMandatorySelection)}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors mb-2 ${
                      isCurrent
                        ? 'bg-green-100 text-green-800 cursor-default'
                        : !isAuthenticated && !isMandatorySelection
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : isSelected
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {!isAuthenticated && !isMandatorySelection ? 'Login to Select' : 
                      isCurrent ? 'Current Plan' : isSelected ? 'Selected' : 'Select Plan'
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Options Section (Only shows when a package is selected) */}
        {showPaymentOptions && selectedPackage && shouldShowFreeTrial && (
          <div className="max-w-6xl mx-auto mt-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Choose Your Payment Option
                </h3>
                <p className="text-gray-600">
                  You've selected the <span className="font-semibold text-primary-600">
                    {packageConfigs.find(p => p.id === selectedPackage)?.name}
                  </span> plan. Choose how you'd like to proceed:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Trial Option */}
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
                        <p className="font-medium text-gray-900">Full access for 14 days</p>
                        <p className="text-sm text-gray-600">Experience all features</p>
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
                    onClick={handleActivateFreeTrial}
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

                {/* Immediate Payment Option */}
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
                        {formatPrice(packageConfigs.find(p => p.id === selectedPackage)?.price || 0, 'ZAR')}
                      </span>
                      <span className="text-gray-500 ml-2">/month</span>
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-1">
                      First month billed today
                    </p>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
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
                  Need help deciding? <button className="text-primary-600 hover:text-primary-700 font-medium">Contact our sales team</button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Original Continue Section (for non-free-trial-eligible users) */}
        {(!showPaymentOptions || !shouldShowFreeTrial) && (
          <div className="max-w-6xl mx-auto mt-10">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {shouldShowFreeTrial ? 'Select a package to continue' :
                     isMandatorySelection ? 'Complete Your Registration' : 
                     currentSubscription ? 'Change Your Plan' : 'Ready to get started?'}
                  </h3>
                  <p className="text-gray-600">
                    {selectedPackage 
                      ? `You've selected the ${packageConfigs.find(p => p.id === selectedPackage)?.name} plan`
                      : shouldShowFreeTrial
                      ? 'Select a package to see payment options'
                      : isMandatorySelection
                      ? 'Select a package to continue to your dashboard'
                      : currentSubscription
                      ? 'Select a new plan to upgrade or downgrade'
                      : 'Select a plan to continue'
                    }
                  </p>
                  {!isAuthenticated && !isMandatorySelection && (
                    <p className="text-amber-600 text-sm mt-1">
                      Please login to proceed with package selection
                    </p>
                  )}
                  {currentSubscription && isCurrentPackage(selectedPackage) && (
                    <p className="text-amber-600 text-sm mt-1">
                      You are already on this plan
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {!isMandatorySelection && !shouldShowFreeTrial && (
                    <button
                      onClick={() => navigate(isAuthenticated ? '/dashboard' : '/create-password')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      {isAuthenticated ? 'Skip for now' : 'Back'}
                    </button>
                  )}
                  
                  <button
                    onClick={handleProceedToPayment}
                    disabled={!selectedPackage || isLoading || 
                      (!isAuthenticated && !isMandatorySelection) ||
                      (currentSubscription && isCurrentPackage(selectedPackage))}
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
                    ) : !isAuthenticated && !isMandatorySelection ? 'Login Required' :
                      isMandatorySelection ? 'Continue to Payment' :
                      currentSubscription ? 'Change Plan' : 'Continue'
                    }
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
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Contact our sales team
                </button>
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {shouldShowFreeTrial
                  ? 'Choose between starting with a free trial or immediate payment. Both options give you full access.'
                  : isMandatorySelection
                  ? 'You must select a package to continue. No credit card required during 14-day trial.'
                  : currentSubscription 
                  ? 'Plan changes take effect immediately. Prorated charges may apply.'
                  : 'All plans include a 14-day free trial. No credit card required until trial ends.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectPackage;