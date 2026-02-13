// src/pages/dashboard/hooks/useDashboard.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Banknote, Users, TrendingUp, Target } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

export type Language = 'en' | 'af' | 'zu';

export interface TranslationKeys {
  welcome: string;
  subtitle: string;
  monthlyRevenue: string;
  activeCustomers: string;
  growthRate: string;
  goalsAchieved: string;
  dailyChallenge: string;
  yourProgress: string;
  quickActions: string;
  [key: string]: string;
}

export interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
  link: string;
  trend: 'up' | 'down';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  total: number;
  completed?: number;
}

const translations: Record<Language, TranslationKeys> = {
  en: {
    welcome: 'Welcome to SeventyTwoX',
    subtitle: 'Empowering South African entrepreneurs to build thriving businesses',
    monthlyRevenue: 'Monthly Revenue',
    activeCustomers: 'Active Customers',
    growthRate: 'Growth Rate',
    goalsAchieved: 'Goals Achieved',
    dailyChallenge: "Today's Challenge",
    yourProgress: 'Your Progress',
    quickActions: 'Quick Actions',
  },
  af: {
    welcome: 'Welkom by SeventyTwoX',
    subtitle: 'Bekwaam Suid-Afrikaanse entrepreneurs om florerende besighede te bou',
    monthlyRevenue: 'Maandelikse Inkomste',
    activeCustomers: 'Aktiewe Kliënte',
    growthRate: 'Groei Koers',
    goalsAchieved: 'Doelwitte Bereik',
    dailyChallenge: 'Vandag se Uitdaging',
    yourProgress: 'Jou Vordering',
    quickActions: 'Vinnige Aksies',
  },
  zu: {
    welcome: 'Wamkelekile kwiSeventyTwoX',
    subtitle: 'Ukuhlomisa osomabhizinisi baseMzansi Afrika ukuba bakhe amabhizinisi achumayo',
    monthlyRevenue: 'Imali Yenyanga',
    activeCustomers: 'Amakhasimende Asebenzayo',
    growthRate: 'Izinga Lokukhula',
    goalsAchieved: 'Izinjongo Ezifinyelelwe',
    dailyChallenge: 'Inselelo Yanamuhla',
    yourProgress: 'Inqubekelaphambili Yakho',
    quickActions: 'Izenzo Ezisheshayo',
  },
};

export function useDashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [showChallenges, setShowChallenges] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState<MetricCardProps[]>([]);

  const challenges = useMemo<Challenge[]>(
    () => [
      {
        id: 'marketplace_post',
        title: 'Post 3 products on the marketplace',
        description: 'Increase visibility by showcasing your best products.',
        reward: '50 XP + Visibility Badge',
        total: 3,
        completed: 1,
      },
      {
        id: 'complete_profile',
        title: 'Complete your profile',
        description: 'Add all your business details to get verified.',
        reward: '30 XP',
        total: 1,
        completed: 0,
      },
      {
        id: 'first_sale',
        title: 'Make your first sale',
        description: 'Get started by making your first sale on the platform.',
        reward: '100 XP',
        total: 1,
        completed: 0,
      },
    ],
    [],
  );

  const todayChallenge = useMemo(
    () => challenges[new Date().getDay() % challenges.length],
    [challenges],
  );

  const t = useCallback(
    (key: keyof TranslationKeys): string => {
      return translations[selectedLanguage][key];
    },
    [selectedLanguage],
  );

  useEffect(() => {
    const initialMetrics: MetricCardProps[] = [
      {
        title: t('monthlyRevenue'),
        value: localStorage.getItem('monthlyRevenue') || '--',
        change: '0',
        changeType: 'increase',
        icon: Banknote,
        link: '/revenue',
        trend: 'up',
      },
      {
        title: t('activeCustomers'),
        value: localStorage.getItem('activeCustomers') || '--',
        change: '0',
        changeType: 'increase',
        icon: Users,
        link: '/customers',
        trend: 'up',
      },
      {
        title: t('growthRate'),
        value: localStorage.getItem('growthRate') || '--',
        change: '0',
        changeType: 'increase',
        icon: TrendingUp,
        link: '/growth',
        trend: 'up',
      },
      {
        title: t('goalsAchieved'),
        value: localStorage.getItem('goalsAchieved') || '--',
        change: '0',
        changeType: 'increase',
        icon: Target,
        link: '/goals',
        trend: 'up',
      },
    ];
    setMetrics(initialMetrics);
  }, [selectedLanguage, t]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = useCallback((): string => {
    const hour = currentTime.getHours();
    if (selectedLanguage === 'zu') {
      if (hour < 12) return 'Sawubona';
      if (hour < 17) return 'Sanibonani';
      return 'Sawubona';
    } else if (selectedLanguage === 'af') {
      if (hour < 12) return 'Goeie môre';
      if (hour < 18) return 'Goeie middag';
      return 'Goeienaand';
    } else {
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    }
  }, [selectedLanguage, currentTime]);

  const getFirstName = useCallback((): string => {
    const stored = (localStorage.getItem('firstName') || localStorage.getItem('userFirstName') || '').trim();
    if (stored) return stored.split(' ')[0];
    const email = (localStorage.getItem('userEmail') || '').trim();
    if (email && email.includes('@')) {
      const prefix = email.split('@')[0];
      const guess = prefix.split(/[._-]/)[0];
      if (guess) return guess.charAt(0).toUpperCase() + guess.slice(1);
    }
    return 'User';
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!supabase) {
          console.warn('Supabase client not initialized');
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('Error getting user:', authError);
          return;
        }

        if (authData?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', authData.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          } else if (profile) {
            const name = profile.first_name || profile.email?.split('@')[0] || 'User';
            localStorage.setItem('userName', name);
            localStorage.setItem('firstName', profile.first_name || '');
            localStorage.setItem('userFirstName', profile.first_name || '');
            localStorage.setItem('userEmail', profile.email || '');
          }
        }

        if (!authData?.user) return;

        const { data: metricsRow } = await supabase
          .from('metrics')
          .select('*')
          .eq('user_id', authData.user.id)
          .maybeSingle();

        if (metricsRow) {
          localStorage.setItem('monthlyRevenue', metricsRow.monthly_revenue ?? '--');
          localStorage.setItem('activeCustomers', metricsRow.active_customers ?? '--');
          localStorage.setItem('growthRate', metricsRow.growth_rate ?? '--');
          localStorage.setItem('goalsAchieved', metricsRow.goals_achieved ?? '--');
        }

        const { data: highlights } = await supabase
          .from('community_highlights')
          .select('initials,title,message,timestamp')
          .order('timestamp', { ascending: false })
          .limit(20);
        if (highlights) {
          localStorage.setItem('communityUpdates', JSON.stringify(highlights));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return {
    selectedLanguage,
    setSelectedLanguage,
    showChallenges,
    setShowChallenges,
    currentTime,
    metrics,
    setMetrics,
    challenges,
    todayChallenge,
    t,
    getGreeting,
    getFirstName,
  };
}
