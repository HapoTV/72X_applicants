import { X, Star, Zap } from 'lucide-react';

export type PackageType = 'startup' | 'essential' | 'premium';

export type LockedFeaturePayload = {
  title: string;
  requiredPackage: PackageType;
  description: string;
  benefits: string[];
  upgradePath: string;
};

type LockedFeatureDrawerProps = {
  open: boolean;
  feature: LockedFeaturePayload | null;
  onClose: () => void;
};

export default function LockedFeatureDrawer({ open, feature, onClose }: LockedFeatureDrawerProps) {
  if (!open || !feature) return null;

  const PackageIcon = feature.requiredPackage === 'premium' ? Zap : Star;
  const packageLabel = feature.requiredPackage === 'premium' ? 'Premium' : 'Essential';

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PackageIcon className={feature.requiredPackage === 'premium' ? 'w-5 h-5 text-purple-600' : 'w-5 h-5 text-blue-600'} />
              <span
                className={
                  feature.requiredPackage === 'premium'
                    ? 'text-purple-700 bg-purple-50 border border-purple-200'
                    : 'text-blue-700 bg-blue-50 border border-blue-200'
                }
              >
                {packageLabel} Package Required
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">{feature.title}</h2>
            <p className="mt-2 text-gray-600">{feature.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-50 text-gray-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Benefits</h3>
          <ul className="space-y-2">
            {feature.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                <span className={feature.requiredPackage === 'premium' ? 'mt-1 w-2 h-2 rounded-full bg-purple-600' : 'mt-1 w-2 h-2 rounded-full bg-blue-600'} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              window.location.href = feature.upgradePath;
            }}
            className={feature.requiredPackage === 'premium'
              ? 'w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors'
              : 'w-full py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors'
            }
          >
            Upgrade to unlock
          </button>
        </div>
      </div>
    </div>
  );
}
