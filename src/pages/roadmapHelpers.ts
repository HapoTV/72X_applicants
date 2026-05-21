export interface FormData {
  businessType: string;
  industry: string;
  stage: string;
  revenue: string;
  employees: string;
  goals: string[];
  timeline: string;
}

export const businessTypes = [
  'Retail', 'Food & Beverage', 'Hospitality', 'Beauty & Wellness', 'Healthcare',
  'Service-Based', 'Transportation & Logistics', 'Agriculture', 'Manufacturing & Production',
  'Event & Rental Services', 'Automotive Services', 'Technology & Repair',
  'Corporate & Professional Services', 'Community & Public Sector', 'Other'
];

export const industries = [
  'Fast Food/Confectioners', 'Street Vendor/Spaza Shop', 'Farming', 'Hair Salon and Nail Salon',
  'Catering services', 'Butcher/Meat Cutter', 'NPOs & NGOs', 'Marketing & advertising',
  'Tent renters, Mobile Toilet and Fridge', 'Car washes', 'Phone Sellers/Repairers',
  'Craft and handmade goods', 'Internet cafés', 'Mechanic and Tyre Services', 'Grass Cutter', 'Other'
];

export const stages = [
  { id: 'startup', name: 'Startup (0-2 years)', desc: 'Just getting started' },
  { id: 'growth', name: 'Growth Stage (2-5 years)', desc: 'Scaling operations' },
  { id: 'established', name: 'Established (5+ years)', desc: 'Optimizing & expanding' }
];

export const goals = [
  'Increase Revenue', 'Expand Market Reach', 'Improve Operations', 
  'Build Team', 'Secure Funding', 'Digital Transformation',
  'Customer Retention', 'Cost Reduction'
];

/**
 * Get user ID from localStorage
 */
export const getUserId = (): string | null => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.userId || userData.id || null;
    } catch {
      return null;
    }
  }
  return null;
};
