import type { ReactNode } from 'react';
import type { AdminTab } from './AdminSidebar';
import ApplicantsTab from './tabs/ApplicantsTab';
import EventsTab from './tabs/EventsTab';
import FundingTab from './tabs/FundingTab';
import LearningTab from './tabs/LearningTab';
import MentorshipTab from './tabs/MentorshipTab';
import AdTab from './tabs/AdTab';
import AdminProfile from './tabs/AdminProfile';
import AdminMonitor from './tabs/AdminMonitor';
import AdminPaymentsTab from './tabs/AdminPaymentsTab';
import AdminOrganisationManagement from './tabs/AdminOrganisationManagement';
import AdminManagement from './tabs/AdminManagement';
import OrgAdminBusinessRefPanel from './tabs/OrgAdminBusinessRefPanel';
import CocOrganisationManagement from './tabs/CocOrganisationManagement';
import CocBusinessRefPanel from './tabs/CocBusinessRefPanel';

interface AdminDashboardTabContentProps {
  activeTab: AdminTab;
  isSuperAdmin: boolean;
  isCocAdmin: boolean;
}

const accessDenied = <div className="p-8 text-center text-red-600">Access Denied</div>;

export function AdminDashboardTabContent({ activeTab, isSuperAdmin, isCocAdmin }: AdminDashboardTabContentProps): ReactNode {
  const tabRenderers: Record<AdminTab, () => ReactNode> = {
    applicants: () => <ApplicantsTab />,
    events: () => <EventsTab />,
    learning: () => <LearningTab isCocAdmin={isCocAdmin} />,
    mentorship: () => <MentorshipTab />,
    funding: () => <FundingTab />,
    ad: () => (isSuperAdmin ? <AdTab /> : accessDenied),
    profile: () => <AdminProfile />,
    payments: () => <AdminPaymentsTab />,
    monitoring: () => (isSuperAdmin ? <AdminMonitor /> : accessDenied),
    organisation: () => {
      if (isSuperAdmin) return <AdminOrganisationManagement />;
      if (isCocAdmin) return <CocOrganisationManagement />;
      return accessDenied;
    },
    admins: () => (isSuperAdmin ? <AdminManagement /> : accessDenied),
    'business-ref': () => {
      if (isCocAdmin) return <CocBusinessRefPanel />;
      if (!isSuperAdmin) return <OrgAdminBusinessRefPanel />;
      return accessDenied;
    },
  };

  return tabRenderers[activeTab]?.() ?? <ApplicantsTab />;
}
