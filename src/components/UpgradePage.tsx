import React from 'react';
import { Lock, Star, Zap, Check } from 'lucide-react';

interface UpgradePageProps {
  featureName: string;
  featureIcon: React.ComponentType<{ className?: string }>;
  packageType: 'essential' | 'premium';
  description: string;
  benefits: string[];
}

const UpgradePage: React.FC<UpgradePageProps> = ({
  featureName,
  featureIcon: FeatureIcon,
  packageType,
  description,
  benefits,
}) => {
  const packageInfo = {
    essential: {
      name: 'Essential',
      icon: Star,
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-700',
      buttonBg: 'bg-blue-500 hover:bg-blue-600',
    },
    premium: {
      name: 'Premium',
      icon: Zap,
      color: 'purple',
      bgGradient: 'from-purple-500 to-purple-600',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-700',
      buttonBg: 'bg-purple-500 hover:bg-purple-600',
    },
  };

  const info = packageInfo[packageType];
  const PackageIcon = info.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-2xl w-full">
        {/* Locked Feature Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${info.bgGradient} p-8 text-white text-center`}>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <FeatureIcon className="w-10 h-10" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Lock className={`w-4 h-4 text-${info.color}-500`} />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{featureName}</h1>
            <div className={`inline-flex items-center space-x-2 ${info.badgeBg} ${info.badgeText} px-4 py-2 rounded-full`}>
              <PackageIcon className="w-4 h-4" />
              <span className="font-semibold">{info.name} Package Required</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What you'll find in this feature:
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Benefits List */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits:</h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 ${info.badgeBg} rounded-full flex items-center justify-center mt-0.5`}>
                      <Check className={`w-4 h-4 ${info.badgeText}`} />
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade Button */}
            <div className="text-center">
              <button
                className={`${info.buttonBg} text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-2`}
              >
                <PackageIcon className="w-5 h-5" />
                <span>Ready to Upgrade</span>
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Unlock this feature and many more with the {info.name} package
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Questions about upgrading?{' '}
            <a href="#" className={`${info.badgeText} font-medium hover:underline`}>
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
