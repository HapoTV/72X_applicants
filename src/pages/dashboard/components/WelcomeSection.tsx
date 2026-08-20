// src/components/dashboard/components/WelcomeSection.tsx
import React, { useMemo, useCallback } from 'react';
import { Crown } from 'lucide-react';

type Language = 'en' | 'af' | 'zu';

interface WelcomeSectionProps {
  currentTime: Date;
  selectedLanguage: Language;
}

const translations = {
  en: {
    welcome: "Welcome to SeventyTwoX",
    subtitle: "Empowering South African entrepreneurs to build thriving businesses",
  },
  af: {
    welcome: "Welkom by SeventyTwoX",
    subtitle: "Bemagtiging van Suid-Afrikaanse entrepreneurs om florerende besighede te bou",
  },
  zu: {
    welcome: "Siyakwamukela ku-SeventyTwoX",
    subtitle: "Sinikeza amandla osomabhizinisi baseNingizimu Afrika ukuthi bakhe amabhizinisi aphumelelayo",
  }
};

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ 
  currentTime, 
  selectedLanguage 
}) => {
  const t = useMemo(() => translations[selectedLanguage], [selectedLanguage]);

  const isPaidPremium = useMemo(() => {
    const pkg = localStorage.getItem('userPackage');
    const status = localStorage.getItem('userStatus');
    return pkg === 'premium' && status !== 'FREE_TRIAL';
  }, []);

  const getGreeting = useCallback((): string => {
    const hour = currentTime.getHours();
    if (selectedLanguage === 'zu') {
      if (hour < 12) return 'Sawubona';
      if (hour < 17) return 'Sanibonani';
      return 'Sawubona';
    } else if (selectedLanguage === 'af') {
      if (hour < 12) return 'Goeie môre';
      if (hour < 17) return 'Goeie middag';
      return 'Goeie aand';
    } else {
      if (hour < 12) return 'Good morning';
      if (hour < 17) return 'Good afternoon';
      return 'Good evening';
    }
  }, [currentTime, selectedLanguage]);

  const getFirstName = () => {
    const stored = (localStorage.getItem('firstName') || localStorage.getItem('userFirstName') || '').trim();
    if (stored) return stored.split(' ')[0];
    const email = (localStorage.getItem('userEmail') || '').trim();
    if (email && email.includes('@')) {
      const prefix = email.split('@')[0];
      const guess = prefix.split(/[._-]/)[0];
      if (guess) return guess.charAt(0).toUpperCase() + guess.slice(1);
    }
    return 'User';
  };

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-3 sm:p-4 text-white shadow-md">
      <h1 className="text-lg sm:text-xl font-bold mb-1">
        {getGreeting()},
        <span className="inline-flex items-center gap-2">
          <span>{getFirstName()}!</span>
          {isPaidPremium && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">
              <Crown className="w-3.5 h-3.5" />
              Premium
            </span>
          )}
        </span>{' '}
      </h1>
      <h2 className="text-base sm:text-lg font-semibold mb-1">{t.welcome}</h2>
      <p className="text-primary-100 mb-2 text-xs sm:text-sm">
        {t.subtitle}
      </p>
      <div className="text-xs text-primary-200">
        {currentTime.toLocaleDateString('en-ZA', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </div>
  );
};

export default WelcomeSection;