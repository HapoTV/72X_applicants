// src/components/dashboard/components/LanguageSelector.tsx
import React from 'react';

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
  return (
    <div className="flex justify-end mb-2">
      <select
        value={selectedLanguage}
        onChange={onLanguageChange}
        className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm transition-colors duration-200"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.name}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;