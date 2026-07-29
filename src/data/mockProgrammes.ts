import type { ProgrammeListItem } from '../pages/adminDashboard/programmes/types';

export const mockProgrammes: ProgrammeListItem[] = [
  {
    id: 'standard-bank-township-business-development',
    programmeName: 'Standard Bank Township Business Development Programme',
    partner: 'Standard Bank',
    province: 'Gauteng',
    duration: '12 weeks',
    applications: 124,
    status: 'Open',
    createdDate: '2026-06-12',
  },
  {
    id: 'sme-development-programme',
    programmeName: 'SME Development Programme',
    partner: 'COC',
    province: 'Western Cape',
    duration: '10 weeks',
    applications: 89,
    status: 'Closed',
    createdDate: '2026-05-02',
  },
  {
    id: 'enterprise-supplier-development',
    programmeName: 'Enterprise Supplier Development Programme',
    partner: 'Enterprise Bank',
    province: 'KwaZulu-Natal',
    duration: '14 weeks',
    applications: 57,
    status: 'Coming Soon',
    createdDate: '2026-07-01',
  },
  {
    id: 'ngo-development-programme',
    programmeName: 'NGO Development Programme',
    partner: 'NGO Alliance',
    province: 'Eastern Cape',
    duration: '8 weeks',
    applications: 34,
    status: 'Open',
    createdDate: '2026-06-22',
  },
];
