import React from 'react';
import { Check } from 'lucide-react';
import type { PackageConfig } from '../hooks/useSelectPackage';

interface PackageGridProps {
  packageConfigs: PackageConfig[];
  selectedPackage: string;
  isAuthenticated: boolean;
  isMandatorySelection: boolean;
  shouldShowFreeTrial: boolean;
  isCurrentPackage: (pkgId: string) => boolean;
  formatPrice: (price: number, currency: string) => string;
  getIconComponent: (iconType: string) => React.ReactNode;
  onSelect: (pkgId: string) => void;
}

const PackageGrid: React.FC<PackageGridProps> = ({
  packageConfigs,
  selectedPackage,
  isAuthenticated,
  isMandatorySelection,
  shouldShowFreeTrial,
  isCurrentPackage,
  formatPrice,
  getIconComponent,
  onSelect,
}) => {
  return (
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

              <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>

              <p className="text-gray-600 text-sm mb-6">{pkg.description}</p>

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
                onClick={() => onSelect(pkg.id)}
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
                {!isAuthenticated && !isMandatorySelection
                  ? 'Login to Select'
                  : isCurrent
                    ? 'Current Plan'
                    : isSelected
                      ? 'Selected'
                      : 'Select Plan'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PackageGrid;
