// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PackageSelectionRedirect from './components/PackageSelectionRedirect';
import PaymentRedirect from './components/PaymentRedirect';
import RequirePackage from './components/RequirePackage';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Lazy-loaded pages
const DashboardOverview = React.lazy(() => import('./pages/dashboard/Overview'));
const DashboardMetrics = React.lazy(() => import('./pages/dashboard/Metrics'));
const DashboardCommunityFeed = React.lazy(() => import('./pages/dashboard/CommunityFeed'));
const Schedule = React.lazy(() => import('./pages/Schedule'));
const ScheduleEvents = React.lazy(() => import('./pages/schedule/Events'));
const ScheduleCalendar = React.lazy(() => import('./pages/schedule/Calendar'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const RoadmapGenerator = React.lazy(() => import('./pages/RoadmapGenerator'));
const Profile = React.lazy(() => import('./pages/Profile'));
const LearningModules = React.lazy(() => import('./pages/LearningModules'));
const Community = React.lazy(() => import('./pages/Community'));
const CommunityDiscussions = React.lazy(() => import('./pages/community/Discussion'));
const DiscussionDetails = React.lazy(() => import('./pages/community/DiscussionDetails'));
const CommunityNetworking = React.lazy(() => import('./pages/community/Networking'));
const CommunityMentorship = React.lazy(() => import('./pages/community/Mentorship'));
const FundingFinder = React.lazy(() => import('./pages/FundingFinder'));
const Marketplace = React.lazy(() => import('./pages/Marketplace'));
const MentorshipHub = React.lazy(() => import('./pages/MentorshipHub'));
const AIBusinessAnalyst = React.lazy(() => import('./pages/AIBusinessAnalyst'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
const UserLogin = React.lazy(() => import('./pages/login/UserLogin'));
const AdminLogin = React.lazy(() => import('./pages/login/AdminLogin'));
const SuperAdminLogin = React.lazy(() => import('./pages/login/SuperAdminLogin'));
const CocAdminLogin = React.lazy(() => import('./pages/login/CocAdminLogin'));
const VerifyOtp = React.lazy(() => import('./pages/VerifyOtp'));
const BizBoostChatbot = React.lazy(() => import('./components/Chatbot'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Signup = React.lazy(() => import('./pages/Signup'));
const SignupSuccessProvided = React.lazy(() => import('./pages/SignupSuccessProvided'));
const SignupSuccessGenerated = React.lazy(() => import('./pages/SignupSuccessGenerated'));
const SignupSuccessRouter = React.lazy(() => import('./pages/SignupSuccessRouter'));
const CreatePassword = React.lazy(() => import('./pages/CreatePassword'));
const SelectPackage = React.lazy(() => import('./pages/SelectPackage'));
const RequestDemo = React.lazy(() => import('./pages/RequestDemo'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const DataInput = React.lazy(() => import('./pages/DataInput'));
const TenderlyAI = React.lazy(() => import('./pages/applications/TenderlyAI'));
const ResetPasswordRequest = React.lazy(() => import('./pages/ResetPasswordRequest'));
const ResetPasswordVerify = React.lazy(() => import('./pages/ResetPasswordVerify'));
const CRM = React.lazy(() => import('./pages/applications/CRM'));
const FinanceManager = React.lazy(() => import('./pages/applications/FinanceManager'));
const BusinessPlanning = React.lazy(() => import('./pages/learning/BusinessPlanning'));
const MarketingSales = React.lazy(() => import('./pages/learning/MarketingSales'));
const FinancialManagement = React.lazy(() => import('./pages/learning/FinancialManagement'));
const Operations = React.lazy(() => import('./pages/learning/Operations'));
const Leadership = React.lazy(() => import('./pages/learning/Leadership'));
const Technical = React.lazy(() => import('./pages/learning/Technical'));
const MarketplaceUpgrade = React.lazy(() => import('./pages/upgrades/MarketplaceUpgrade'));
const MentorshipUpgrade = React.lazy(() => import('./pages/upgrades/MentorshipUpgrade'));
const FundingUpgrade = React.lazy(() => import('./pages/upgrades/FundingUpgrade'));
const DataInputUpgrade = React.lazy(() => import('./pages/upgrades/DataInputUpgrade'));
const AppStoreUpgrade = React.lazy(() => import('./pages/upgrades/AppStoreUpgrade'));
const ConnectionsUpgrade = React.lazy(() => import('./pages/upgrades/ConnectionsUpgrade'));
const RoadmapUpgrade = React.lazy(() => import('./pages/upgrades/RoadmapUpgrade'));
const AnalyticsUpgrade = React.lazy(() => import('./pages/upgrades/AnalyticsUpgrade'));
const AIAnalystUpgrade = React.lazy(() => import('./pages/upgrades/AIAnalystUpgrade'));
const SetupAccount = React.lazy(() => import('./pages/SetupAccount'));
const AdminRoutes = React.lazy(() => import('./routes/AdminRoutes'));
const CocAdminRoutes = React.lazy(() => import('./routes/CocAdminRoutes'));
const PaymentRoutes = React.lazy(() => import('./routes/paymentRoutes'));
const MyConnections = React.lazy(() => import('./pages/MyConnections'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes — data stays fresh, no refetch on revisit
      gcTime: 10 * 60 * 1000,   // 10 minutes — keep in cache after unmount
      retry: 1,
    },
  },
});

function App() {
  const isGitHubPagesHost = window.location.hostname.endsWith('github.io');

  if (!isGitHubPagesHost && window.location.pathname.startsWith('/72X_applicants/')) {
    const nextPath = window.location.pathname.replace(/^\/72X_applicants/, '') || '/';
    window.history.replaceState(null, '', `${nextPath}${window.location.search}${window.location.hash}`);
  }

  const runtimeBasename = isGitHubPagesHost ? '/72X_applicants' : '/';

  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <Router
          basename={runtimeBasename}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/login/asadmin" element={<AdminLogin />} />
              <Route path="/login/haposuperadmin" element={<SuperAdminLogin />} />
              <Route path="/login/cocadmin" element={<CocAdminLogin />} />
              <Route path="/setup-account" element={<SetupAccount />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/request-demo" element={<RequestDemo />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/success" element={<SignupSuccessRouter />} />
              <Route path="/signup/success/provided" element={<SignupSuccessProvided />} />
              <Route path="/signup/success/generated" element={<SignupSuccessGenerated />} />
              <Route path="/reset-password" element={<ResetPasswordRequest />} />
              <Route path="/reset-password/verify" element={<ResetPasswordVerify />} />
              <Route path="/create-password" element={<CreatePassword />} />
              <Route path="/select-package" element={<SelectPackage />} />

              <Route path="/admin/*" element={<ProtectedRoute requireAdmin={true}><AdminRoutes /></ProtectedRoute>} />

              <Route
                path="/cocadmin/*"
                element={
                  <ProtectedRoute
                    requireAdmin={true}
                    unauthenticatedRedirectTo="/login/cocadmin"
                    unauthorizedRedirectTo="/login/cocadmin"
                  >
                    <CocAdminRoutes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <Routes>
                            <Route path="/dashboard" element={<DashboardOverview />} />
                            <Route path="/dashboard/overview" element={<DashboardOverview />} />
                            <Route path="/dashboard/metrics" element={<DashboardMetrics />} />
                            <Route path="/dashboard/community-feed" element={<DashboardCommunityFeed />} />
                            <Route path="/schedule" element={<Schedule />} />
                            <Route path="/schedule/events" element={<ScheduleEvents />} />
                            <Route path="/schedule/calendar" element={<ScheduleCalendar />} />
                            <Route path="/learning" element={<LearningModules />} />
                            <Route path="/learning/business-planning" element={<BusinessPlanning />} />
                            <Route path="/learning/marketing-sales" element={<MarketingSales />} />
                            <Route path="/learning/financial-management" element={<FinancialManagement />} />
                            <Route path="/learning/operations" element={<Operations />} />
                            <Route path="/learning/leadership" element={<Leadership />} />
                            <Route path="/learning/technical" element={<Technical />} />
                            <Route path="/community" element={<Community />} />
                            <Route path="/community/discussions" element={<CommunityDiscussions />} />
                            <Route path="/community/:id" element={<DiscussionDetails />} />
                            <Route path="/community/networking" element={<CommunityNetworking />} />
                            <Route path="/community/mentorship" element={<RequirePackage required="essential" upgradePath="/upgrade/mentorship"><CommunityMentorship /></RequirePackage>} />
                            <Route path="/applications" element={<Navigate to="/applications/crm" replace />} />
                            <Route path="/applications/crm/*" element={<RequirePackage required="essential" upgradePath="/upgrade/app-store"><CRM /></RequirePackage>} />
                            <Route path="/applications/finance-manager" element={<RequirePackage required="essential" upgradePath="/upgrade/app-store"><FinanceManager /></RequirePackage>} />
                            <Route path="/applications/tenderlyai" element={<RequirePackage required="essential" upgradePath="/upgrade/app-store"><TenderlyAI /></RequirePackage>} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/marketplace" element={<RequirePackage required="essential" upgradePath="/upgrade/marketplace"><Marketplace /></RequirePackage>} />
                            <Route path="/mentorship" element={<RequirePackage required="essential" upgradePath="/upgrade/mentorship"><MentorshipHub /></RequirePackage>} />
                            <Route path="/funding" element={<RequirePackage required="essential" upgradePath="/upgrade/funding"><FundingFinder /></RequirePackage>} />
                            <Route path="/data-input" element={<RequirePackage required="essential" upgradePath="/upgrade/data-input"><DataInput /></RequirePackage>} />
                            <Route path="/roadmap" element={<RequirePackage required="premium" upgradePath="/upgrade/roadmap"><RoadmapGenerator /></RequirePackage>} />
                            <Route path="/analytics" element={<RequirePackage required="premium" upgradePath="/upgrade/analytics"><Analytics /></RequirePackage>} />
                            <Route path="/ai-analyst" element={<RequirePackage required="premium" upgradePath="/upgrade/ai-analyst"><AIBusinessAnalyst /></RequirePackage>} />
                            <Route path="/business-analyst" element={<RequirePackage required="premium" upgradePath="/upgrade/business-analyst"><AIBusinessAnalyst /></RequirePackage>} />
                            <Route path="/upgrade/marketplace" element={<MarketplaceUpgrade />} />
                            <Route path="/upgrade/mentorship" element={<MentorshipUpgrade />} />
                            <Route path="/upgrade/funding" element={<FundingUpgrade />} />
                            <Route path="/upgrade/data-input" element={<DataInputUpgrade />} />
                            <Route path="/upgrade/app-store" element={<AppStoreUpgrade />} />
                            <Route path="/upgrade/connections" element={<ConnectionsUpgrade />} />
                            <Route path="/upgrade/roadmap" element={<RoadmapUpgrade />} />
                            <Route path="/upgrade/analytics" element={<AnalyticsUpgrade />} />
                            <Route path="/upgrade/ai-analyst" element={<AIAnalystUpgrade />} />
                            <Route path="/upgrade/business-analyst" element={<AIAnalystUpgrade />} />
                            <Route path="/connections" element={<RequirePackage required="essential" upgradePath="/upgrade/connections"><MyConnections /></RequirePackage>} />
                            <Route path="/payments/*" element={<ProtectedRoute><PaymentRoutes /></ProtectedRoute>} />
                          </Routes>
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </NotificationProvider>
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
