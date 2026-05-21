export const logoUrl = `${import.meta.env.BASE_URL}Logo2.svg`;
export const footerLogoUrl = `${import.meta.env.BASE_URL}Logo3.svg`;

export const gradientBlue =
  'linear-gradient(135deg, #0D0F3B 0%, #1A1C52 25%, #2258A6 50%, #1C90E6 75%, #33B0FF 100%)';

export type PricingCtaType = 'get-started' | 'trial' | 'contact';

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight: boolean;
  ctaType: PricingCtaType;
}

export const plans: PricingPlan[] = [
  {
    name: 'Start-up',
    price: 'R99',
    period: '/month',
    features: [
      'Basic business tools',
      'Email support',
      'Community access',
    ],
    highlight: false,
    ctaType: 'get-started',
  },
  {
    name: 'Essential',
    price: 'R299',
    period: '/month',
    features: [
      'All Start-up features',
      'Advanced analytics',
      'Priority support',
      'AI business advisor',
    ],
    highlight: true,
    ctaType: 'trial',
  },
  {
    name: 'Premium',
    price: 'R999',
    period: '/month',
    features: [
      'All Essential features',
      'Dedicated support',
      'Custom integrations',
      'Advanced AI tools',
    ],
    highlight: false,
    ctaType: 'contact',
  },
];

export const featureHighlights = [
  {
    title: 'AI Business Advisor',
    desc: 'Personalized insights and next-best actions to accelerate growth.'
  },
  {
    title: 'Analytics Dashboard',
    desc: 'Understand performance in real time with clear, actionable metrics.'
  },
  {
    title: 'Service Desk',
    desc: 'Manage customer support and ticketing without leaving the platform.'
  }
];

export const comparisonRows = [
  { feature: 'Dashboard & Metrics', a: 'Included', b: 'Included', c: 'Included' },
  { feature: 'Learning Modules', a: 'Included', b: 'Included', c: 'Included' },
  { feature: 'Community Access', a: 'Included', b: 'Included', c: 'Included' },
  { feature: 'Schedule & Calendar', a: 'Included', b: 'Included', c: 'Included' },
  { feature: 'Marketplace', a: '—', b: 'Included', c: 'Included' },
  { feature: 'Mentorship Hub', a: '—', b: 'Included', c: 'Included' },
  { feature: 'Funding Finder', a: '—', b: 'Included', c: 'Included' },
  { feature: 'Data Input Tools', a: '—', b: 'Included', c: 'Included' },
  { feature: 'Roadmap Generator', a: '—', b: '—', c: 'Included' },
  { feature: 'Advanced Analytics', a: '—', b: '—', c: 'Included' },
  { feature: 'Resource Library', a: '—', b: '—', c: 'Included' },
  { feature: 'Expert Sessions', a: '—', b: '—', c: 'Included' },
  { feature: 'AI Business Analyst', a: '—', b: '—', c: 'Included' },
];

export const getPlanDescription = (planName: string, highlight: boolean) => {
  if (highlight) return 'For growing businesses';
  if (planName === 'Start-up') return 'Perfect for new businesses';
  return 'For established businesses';
};
