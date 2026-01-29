// src/pages/SelectPackage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import { Check, Sparkles, Zap, Crown, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userSubscriptionService from '../services/UserSubscriptionService';
import { UserSubscriptionType } from '../interfaces/UserSubscriptionData';
import type { PackageOption } from '../interfaces/UserSubscriptionData';
import authService from '../services/AuthService';

const SelectPackage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, isAuthenticated } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [userStatus, setUserStatus] = useState<string>('');
  const [requiresPackageSelection, setRequiresPackageSelection] = useState(false);

  useEffect(() => {
    // Check user status and package requirement
    const email = localStorage.getItem('userEmail');
    const status = localStorage.getItem('userStatus');
    const requiresPackage = localStorage.getItem('requiresPackageSelection');
    
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
      isAuthenticated
    });
    
    // If user has PENDING_PACKAGE status, show mandatory selection message
    if (status === 'PENDING_PACKAGE') {
      console.log('⚠️ User has PENDING_PACKAGE status - mandatory package selection');
    }
    
    // Fetch current subscription if user is authenticated
    if (isAuthenticated) {
      fetchCurrentSubscription();
    }
  }, [navigate, isAuthenticated]);

  const fetchCurrentSubscription = async () => {
    try {
      const subscription = await userSubscriptionService.getCurrentUserPackage();
      if (subscription) {
        setCurrentSubscription(subscription);
        // Pre-select current package if any
        const currentPackageId = packages.find(
          pkg => pkg.backendType === subscription.subscriptionType
        )?.id;
        if (currentPackageId) {
          setSelectedPackage(currentPackageId);
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  // Package configuration without React elements
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
        'Basic analytics'
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
        'API access'
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
        'SLA guarantee'
      ],
      backendType: UserSubscriptionType.PREMIUM,
      iconType: 'crown' as const,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  // Map icon types to actual React components
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

  // Create packages with icons for rendering
  const packages: PackageOption[] = packageConfigs.map(config => ({
    ...config,
    icon: getIconComponent(config.iconType)
  }));

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackage(pkgId);
  };

  const handleContinue = async () => {
    if (!selectedPackage) {
      alert('Please select a package to continue');
      return;
    }

    setIsLoading(true);
    
    try {
      const selectedPkg = packageConfigs.find(p => p.id === selectedPackage);
      if (selectedPkg) {
        // Store only serializable package data
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
        
        // Check if user is authenticated
        if (!isAuthenticated) {
          // Try to authenticate with stored credentials
          const email = localStorage.getItem('userEmail');
          const password = localStorage.getItem('tempPassword');
          
          if (email && password) {
            try {
              await authService.login({
                email,
                password,
                businessReference: user?.businessReference,
                loginType: 'user'
              });
            } catch (loginError) {
              // If login fails, redirect to login page
              alert('Please login first to select a package');
              navigate('/login');
              return;
            }
          } else {
            // Redirect to login
            navigate('/login');
            return;
          }
        }
        
        // Send package selection to backend
        await userSubscriptionService.selectPackage(selectedPkg.backendType);
        
        // Navigate to payment page
        navigate('/payments/new');
      }
    } catch (error) {
      console.error('Error selecting package:', error);
      alert('Failed to select package. Please try again.');
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

  // Check if user already has this package
  const isCurrentPackage = (pkgId: string) => {
    if (!currentSubscription) return false;
    const pkg = packageConfigs.find(p => p.id === pkgId);
    return pkg && currentSubscription.subscriptionType === pkg.backendType;
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Determine if package selection is mandatory
  const isMandatorySelection = userStatus === 'PENDING_PACKAGE' || requiresPackageSelection;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img src={Logo} alt="SeventyTwoX Logo" className="w-16 h-16" />
          </div>
          
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
            {isMandatorySelection ? 'Select Your Package to Continue' : 
             currentSubscription ? 'Your Current Plan' : 'Choose Your Plan'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isMandatorySelection 
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

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(pkg.price, pkg.currency)}
                      </span>
                      <span className="text-gray-500 ml-2">/{pkg.interval}</span>
                    </div>
                    {pkg.interval === 'month' && (
                      <p className="text-gray-500 text-sm mt-1">
                        Billed monthly • 14-day free trial
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePackageSelect(pkg.id)}
                    disabled={isCurrent || (!isAuthenticated && !isMandatorySelection)}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
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

        <div className="max-w-6xl mx-auto mt-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isMandatorySelection ? 'Complete Your Registration' : 
                   currentSubscription ? 'Change Your Plan' : 'Ready to get started?'}
                </h3>
                <p className="text-gray-600">
                  {selectedPackage 
                    ? `You've selected the ${packageConfigs.find(p => p.id === selectedPackage)?.name} plan`
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
                {!isMandatorySelection && (
                  <button
                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/create-password')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    {isAuthenticated ? 'Back to Dashboard' : 'Back'}
                  </button>
                )}
                
                <button
                  onClick={handleContinue}
                  disabled={!selectedPackage || isLoading || 
                    (!isAuthenticated && !isMandatorySelection) ||
                    (currentSubscription && isCurrentPackage(selectedPackage))}
                  className={`px-8 py-3 rounded-lg font-medium ${
                    isMandatorySelection
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                      : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? 'Processing...' : 
                    !isAuthenticated && !isMandatorySelection ? 'Login Required' :
                    isMandatorySelection ? 'Continue to Payment' :
                    currentSubscription ? 'Change Plan' : 'Continue to Payment'
                  }
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Need help choosing?{' '}
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Contact our sales team
              </button>
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {isMandatorySelection
                ? 'You must select a package to continue. No credit card required during 14-day trial.'
                : currentSubscription 
                ? 'Plan changes take effect immediately. Prorated charges may apply.'
                : 'All plans include a 14-day free trial. No credit card required until trial ends.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPackage;