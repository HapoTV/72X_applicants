// src/components/dashboard/components/LanguageSelector.tsx
import React from 'react';
import { useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

type Language = 'en' | 'af' | 'zu';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const languages = [
  { code: 'en' as const, name: 'English' },
  { code: 'af' as const, name: 'Afrikaans' },
  { code: 'zu' as const, name: 'isiZulu' },
  { code: 'xh' as const, name: 'isiXhosa' },
  { code: 'st' as const, name: 'Sesotho' },
  { code: 'tn' as const, name: 'Setswana' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  onLanguageChange 
}) => {
  const { userPackage } = useAuth();
  const [hoverLocked, setHoverLocked] = useState(false);

  const isLocked = useMemo(() => {
    const ls = localStorage.getItem('userPackage');
    const pkg = (userPackage || ls || 'startup') as 'startup' | 'essential' | 'premium';
    const order: Record<'startup' | 'essential' | 'premium', number> = { startup: 0, essential: 1, premium: 2 };
    return (order[pkg] ?? 0) < order.premium;
  }, [userPackage]);

  const openLockedDrawer = () => {
    window.dispatchEvent(
      new CustomEvent('open-locked-feature', {
        detail: {
          title: 'Multi-language Support',
          requiredPackage: 'premium',
          description:
            'Switch the app language for a more personalized experience. Premium members can choose from multiple South African languages.',
          benefits: [
            'Choose your preferred language',
            'Better accessibility for your team',
            'Localized tips and guidance',
            'Improved user experience across the platform',
          ],
          upgradePath: '/select-package',
        },
      })
    );
  };

  return (
    <div className="flex justify-end mb-2 relative">
      <select
        value={isLocked ? 'en' : selectedLanguage}
        onChange={(e) => {
          if (isLocked) {
            e.preventDefault();
            openLockedDrawer();
            return;
          }
          onLanguageChange(e);
        }}
        disabled={isLocked}
        className={`px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm transition-colors duration-200 ${
          isLocked ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.name}</option>
        ))}
      </select>

      {isLocked && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openLockedDrawer();
          }}
          onMouseEnter={() => setHoverLocked(true)}
          onMouseLeave={() => setHoverLocked(false)}
          className="absolute inset-0 rounded-lg"
          aria-label="Multi-language support is locked"
        />
      )}

      {isLocked && hoverLocked && (
        <div
          className="absolute right-0 top-8 bg-orange-50 border-2 border-orange-400 text-gray-800 px-4 py-2 rounded-lg text-sm shadow-lg whitespace-nowrap flex items-center space-x-2"
          style={{ zIndex: 9999 }}
        >
          <span className="text-orange-500">⚠</span>
          <span>
            This feature is for <span className="font-semibold text-orange-600">Premium</span> package. <br />
            Upgrade to change language.
          </span>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;