import type { LucideIcon } from 'lucide-react';
import {
  Users,
  Calendar,
  BookOpen,
  Handshake,
  DollarSign,
  Megaphone,
  ShieldAlert,
  CreditCard,
  Building2,
  KeyRound,
} from 'lucide-react';
import type { AdminTab } from '../AdminSidebar';

export type AdminMenuItem = {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
  path: string;
};

type Params = {
  basePath: string;
  isSuperAdmin: boolean;
  isCocAdmin: boolean;
};

export const getAdminMenuItems = ({ basePath, isSuperAdmin, isCocAdmin }: Params): AdminMenuItem[] => {
  const baseMenuItems: AdminMenuItem[] = [
    { id: 'applicants', label: 'Applicants', icon: Users, path: `${basePath}/dashboard/applicants` },
    { id: 'events', label: 'Events', icon: Calendar, path: `${basePath}/dashboard/events` },
    { id: 'learning', label: 'Learning Material', icon: BookOpen, path: `${basePath}/dashboard/learning` },
    { id: 'mentorship', label: 'Mentorship', icon: Handshake, path: `${basePath}/dashboard/mentorship` },
    { id: 'funding', label: 'Funding', icon: DollarSign, path: `${basePath}/dashboard/funding` },
  ];

  if (isSuperAdmin) {
    return [
      ...baseMenuItems,
      { id: 'ad', label: 'Ads', icon: Megaphone, path: `${basePath}/dashboard/ad` },
      { id: 'monitoring', label: 'Monitoring', icon: ShieldAlert, path: `${basePath}/dashboard/monitoring` },
      { id: 'payments', label: 'Payments', icon: CreditCard, path: `${basePath}/dashboard/payments` },
      { id: 'organisation', label: 'Organisations', icon: Building2, path: `${basePath}/dashboard/organisation` },
    ];
  }

  if (isCocAdmin) {
    return [
      ...baseMenuItems,
      { id: 'organisation', label: 'My Organisations', icon: Building2, path: `${basePath}/dashboard/organisation` },
      { id: 'business-ref', label: 'Business Reference', icon: KeyRound, path: `${basePath}/dashboard/business-ref` },
    ];
  }

  return [
    ...baseMenuItems,
    { id: 'business-ref', label: 'Business Reference', icon: KeyRound, path: `${basePath}/dashboard/business-ref` },
  ];
};
