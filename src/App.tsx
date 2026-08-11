// src/App.tsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PackageSelectionRedirect from './components/PackageSelectionRedirect';
import PaymentRedirect from './components/PaymentRedirect';
import RequirePackage from './components/RequirePackage';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy-loaded pages
const DashboardOverview = React.lazy(() => import('./pages/dashboard/Overview'));
const DashboardMetrics = React.lazy(() => import('./pages/dashboard/Metrics'));
const DashboardCommunityFeed = React.lazy(() => import('./pages/dashboard/CommunityFeed'));
const Schedule = React.lazy(() => import('./pages/Schedule'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const RoadmapGenerator = React.lazy(() => import('./pages/RoadmapGenerator'));
const Profile = React.lazy(() => import('./pages/Profile'));
const LearningModules = React.lazy(() => import('./pages/LearningModules'));
const Community = React.lazy(() => import('./pages/Community'));
const DiscussionDetails = React.lazy(() => import('./pages/community/DiscussionDetails'));
const FundingFinder = React.lazy(() => import('./pages/FundingFinder'));
const Marketplace = React.lazy(() => import('./pages/Marketplace'));
const AppStore = React.lazy(() => import('./pages/AppStore'));
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
const ProgramsPage = React.lazy(() => import('./pages/programmes/ProgramsPage'));
const ProgrammeDetailsPage = React.lazy(() => import('./pages/programmes/ProgrammeDetailsPage'));
const ApplicationForm = React.lazy(() => import('./pages/programmes/ApplicationForm'));
const TenderlyAI = React.lazy(() => import('./pages/applications/TenderlyAI'));
const ResetPasswordRequest = React.lazy(() => import('./pages/ResetPasswordRequest'));
const ResetPasswordVerify = React.lazy(() => import('./pages/ResetPasswordVerify'));
const CRM = React.lazy(() => import('./pages/applications/CRM'));
const FinanceManager = React.lazy(() => import('./pages/applications/FinanceManager'));
const MarketplaceUpgrade = React.lazy(() => import('./pages/upgrades/MarketplaceUpgrade'));
const MentorshipUpgrade = React.lazy(() => import('./pages/upgrades/MentorshipUpgrade'));
const FundingUpgrade = React.lazy(() => import('./pages/upgrades/FundingUpgrade'));
const AppStoreUpgrade = React.lazy(() => import('./pages/upgrades/AppStoreUpgrade'));
const ConnectionsUpgrade = React.lazy(() => import('./pages/upgrades/ConnectionsUpgrade'));
const RoadmapUpgrade = React.lazy(() => import('./pages/upgrades/RoadmapUpgrade'));
const AnalyticsUpgrade = React.lazy(() => import('./pages/upgrades/AnalyticsUpgrade'));
const AIAnalystUpgrade = React.lazy(() => import('./pages/upgrades/AIAnalystUpgrade'));
const SetupAccount = React.lazy(() => import('./pages/SetupAccount'));
const AdminRoutes = React.lazy(() => import('./routes/AdminRoutes'));
const CocAdminRoutes = React.lazy(() => import('./routes/CocAdminRoutes'));
const AdminPageWrapper = React.lazy(() => import('./pages/adminDashboard/AdminPageWrapper'));
const AdminProgrammeManagementPage = React.lazy(() => import('./pages/adminDashboard/programmes/ProgrammeManagementPage'));
const AdminCreateProgrammePage = React.lazy(() => import('./pages/adminDashboard/programmes/CreateProgrammePage'));
const AdminProgrammeApplicationsPage = React.lazy(() => import('./pages/adminDashboard/programmes/ProgrammeApplicationsPage'));
const PaymentRoutes = React.lazy(() => import('./routes/paymentRoutes'));

const RedirectWithSearch: React.FC<{ to: string }> = ({ to }) => {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}`} replace />;
};

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/login/asadmin" element={<AdminLogin />} />
              <Route path="/login/haposuperadmin" element={<SuperAdminLogin />} />
              <Route path="/login/cocadmin" element={<CocAdminLogin />} />
              <Route path="/setup-account" element={<SetupAccount />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/request-demo" element={<RequestDemo />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/programs/:slug" element={<ProgrammeDetailsPage />} />
              <Route path="/programs/:slug/apply" element={<ApplicationForm />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/success" element={<SignupSuccessRouter />} />
              <Route path="/signup/success/provided" element={<SignupSuccessProvided />} />
              <Route path="/signup/success/generated" element={<SignupSuccessGenerated />} />
              <Route path="/reset-password" element={<ResetPasswordRequest />} />
              <Route path="/reset-password/verify" element={<ResetPasswordVerify />} />
              <Route path="/create-password" element={<CreatePassword />} />
              <Route path="/select-package" element={<SelectPackage />} />

              {/* Admin Routes */}
              <Route
                path="/admin/programmes"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPageWrapper>
                      <AdminProgrammeManagementPage />
                    </AdminPageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/programmes/create"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPageWrapper>
                      <AdminCreateProgrammePage />
                    </AdminPageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/programme-applications"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPageWrapper>
                      <AdminProgrammeApplicationsPage />
                    </AdminPageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminRoutes />
                  </ProtectedRoute>
                }
              />

              {/* COC Admin Routes */}
              <Route
                path="/cocadmin/programmes"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPageWrapper>
                      <AdminProgrammeManagementPage />
                    </AdminPageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cocadmin/programmes/create"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPageWrapper>
                      <AdminCreateProgrammePage />
                    </AdminPageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cocadmin/programme-applications"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPageWrapper>
                      <AdminProgrammeApplicationsPage />
                    </AdminPageWrapper>
                  </ProtectedRoute>
                }
              />
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

              {/* Protected Routes with Layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <DashboardOverview />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/overview"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <DashboardOverview />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/metrics"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <DashboardMetrics />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/community-feed"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <DashboardCommunityFeed />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <Schedule />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learning"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <LearningModules />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <Community />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community/discussions"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <Navigate to="/community" replace />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community/discussions/:id"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <DiscussionDetails />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community/:id"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <DiscussionDetails />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community/networking"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RedirectWithSearch to="/community?tab=connections" />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community/mentorship"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RedirectWithSearch to="/community?tab=mentorship" />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <AppStore />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications/crm/*"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RequirePackage required="essential" upgradePath="/upgrade/app-store">
                            <CRM />
                          </RequirePackage>
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications/finance-manager"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RequirePackage required="essential" upgradePath="/upgrade/app-store">
                            <FinanceManager />
                          </RequirePackage>
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications/tenderlyai"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RequirePackage required="essential" upgradePath="/upgrade/app-store">
                            <TenderlyAI />
                          </RequirePackage>
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <Profile />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <Notifications />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RequirePackage required="essential" upgradePath="/upgrade/marketplace">
                            <Marketplace />
                          </RequirePackage>
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/funding"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RequirePackage required="essential" upgradePath="/upgrade/funding">
                            <FundingFinder />
                          </RequirePackage>
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RequirePackage required="premium" upgradePath="/upgrade/roadmap">
                            <RoadmapGenerator />
                          </RequirePackage>
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RequirePackage required="premium" upgradePath="/upgrade/analytics">
                            <Analytics />
                          </RequirePackage>
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-analyst"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RequirePackage required="premium" upgradePath="/upgrade/ai-analyst">
                            <AIBusinessAnalyst />
                          </RequirePackage>
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business-analyst"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RequirePackage required="premium" upgradePath="/upgrade/business-analyst">
                            <AIBusinessAnalyst />
                          </RequirePackage>
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upgrade/marketplace"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <MarketplaceUpgrade />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upgrade/mentorship"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <MentorshipUpgrade />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upgrade/funding"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <FundingUpgrade />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upgrade/app-store"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <AppStoreUpgrade />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upgrade/connections"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <ConnectionsUpgrade />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upgrade/roadmap"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RoadmapUpgrade />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upgrade/analytics"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <AnalyticsUpgrade />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upgrade/ai-analyst"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <AIAnalystUpgrade />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upgrade/business-analyst"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <AIAnalystUpgrade />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/connections"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RedirectWithSearch to="/community?tab=connections" />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentorship"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <RedirectWithSearch to="/community?tab=mentorship" />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments/*"
                element={
                  <ProtectedRoute>
                    <PaymentRedirect>
                      <PackageSelectionRedirect>
                        <Layout>
                          <BizBoostChatbot />
                          <PaymentRoutes />
                        </Layout>
                      </PackageSelectionRedirect>
                    </PaymentRedirect>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;