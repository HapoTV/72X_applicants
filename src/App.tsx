// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PackageSelectionRedirect from './components/PackageSelectionRedirect';
import PaymentRedirect from './components/PaymentRedirect';
import RequirePackage from './components/RequirePackage';
import DashboardOverview from './pages/dashboard/Overview';
import DashboardMetrics from './pages/dashboard/Metrics';
import DashboardCommunityFeed from './pages/dashboard/CommunityFeed';
import Schedule from './pages/Schedule';
import ScheduleEvents from './pages/schedule/Events';
import ScheduleCalendar from './pages/schedule/Calendar';
import Analytics from './pages/Analytics';
import RoadmapGenerator from './pages/RoadmapGenerator';
import Profile from './pages/Profile';
import LearningModules from './pages/LearningModules';
import Community from './pages/Community';
import CommunityDiscussions from './pages/community/Discussion';
import CommunityNetworking from './pages/community/Networking';
import CommunityMentorship from './pages/community/Mentorship';
import FundingFinder from './pages/FundingFinder';
import Marketplace from './pages/Marketplace';
import MentorshipHub from './pages/MentorshipHub';
import AIBusinessAnalyst from './pages/AIBusinessAnalyst';
import Notifications from './pages/Notifications';
// Login pages
import UserLogin from './pages/login/UserLogin';
import AdminLogin from './pages/login/AdminLogin';
import SuperAdminLogin from './pages/login/SuperAdminLogin';
import VerifyOtp from './pages/VerifyOtp';
import BizBoostChatbot from './components/Chatbot';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import SignupSuccessProvided from './pages/SignupSuccessProvided';
import SignupSuccessGenerated from './pages/SignupSuccessGenerated';
import SignupSuccessRouter from './pages/SignupSuccessRouter';
import CreatePassword from './pages/CreatePassword';
import SelectPackage from './pages/SelectPackage';
import RequestDemo from './pages/RequestDemo';
import Pricing from './pages/Pricing';
import DataInput from './pages/DataInput';
import TenderlyAI from './pages/applications/TenderlyAI';
import ResetPasswordRequest from './pages/ResetPasswordRequest';
import ResetPasswordVerify from './pages/ResetPasswordVerify';
import CRM from './pages/applications/CRM';
import FinanceManager from './pages/applications/FinanceManager';

import BusinessPlanning from './pages/learning/BusinessPlanning';
import MarketingSales from './pages/learning/MarketingSales';
import FinancialManagement from './pages/learning/FinancialManagement';
import Operations from './pages/learning/Operations';
import Leadership from './pages/learning/Leadership';
import Technical from './pages/learning/Technical';

// Upgrade pages
import MarketplaceUpgrade from './pages/upgrades/MarketplaceUpgrade';
import MentorshipUpgrade from './pages/upgrades/MentorshipUpgrade';
import FundingUpgrade from './pages/upgrades/FundingUpgrade';
import DataInputUpgrade from './pages/upgrades/DataInputUpgrade';
import AppStoreUpgrade from './pages/upgrades/AppStoreUpgrade';
import ConnectionsUpgrade from './pages/upgrades/ConnectionsUpgrade';
import RoadmapUpgrade from './pages/upgrades/RoadmapUpgrade';
import AnalyticsUpgrade from './pages/upgrades/AnalyticsUpgrade';
import AIAnalystUpgrade from './pages/upgrades/AIAnalystUpgrade';

// Admin Routes
import AdminRoutes from './routes/AdminRoutes';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Routes
import PaymentRoutes from './routes/paymentRoutes';
import MyConnections from './pages/MyConnections';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        {/* Add future flags to suppress warnings */}
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<LandingPage />} />

            {/* Public routes - Split Login Pages */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/login/asadmin" element={<AdminLogin />} />
            <Route path="/login/haposuperadmin" element={<SuperAdminLogin />} />
            
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

            {/* Admin routes - OUTSIDE main layout to avoid user sidebar */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminRoutes />
                </ProtectedRoute>
              }
            />

            {/* All other routes with Layout - protected */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  {/* Add PaymentRedirect wrapper before PackageSelectionRedirect */}
                  <PaymentRedirect>
                    <PackageSelectionRedirect>
                      <Layout>
                        <BizBoostChatbot />
                        <Routes>
                          {/* Dashboard Routes */}
                          <Route path="/dashboard" element={<DashboardOverview />} />
                          <Route path="/dashboard/overview" element={<DashboardOverview />} />
                          <Route path="/dashboard/metrics" element={<DashboardMetrics />} />
                          <Route path="/dashboard/community-feed" element={<DashboardCommunityFeed />} />

                          {/* Schedule Routes */}
                          <Route path="/schedule" element={<Schedule />} />
                          <Route path="/schedule/events" element={<ScheduleEvents />} />
                          <Route path="/schedule/calendar" element={<ScheduleCalendar />} />

                          {/* Learning Routes */}
                          <Route path="/learning" element={<LearningModules />} />
                          
                          <Route path="/learning/business-planning" element={<BusinessPlanning />} />
                          <Route path="/learning/marketing-sales" element={<MarketingSales />} />
                          <Route path="/learning/financial-management" element={<FinancialManagement />} />
                          <Route path="/learning/operations" element={<Operations />} />
                          <Route path="/learning/leadership" element={<Leadership />} />
                          <Route path="/learning/technical" element={<Technical />} />

                          {/* Community Routes */}
                          <Route path="/community" element={<Community />} />
                          <Route path="/community/discussions" element={<CommunityDiscussions />} />
                          <Route path="/community/networking" element={<CommunityNetworking />} />
                          <Route
                            path="/community/mentorship"
                            element={
                              <RequirePackage required="essential" upgradePath="/upgrade/mentorship">
                                <CommunityMentorship />
                              </RequirePackage>
                            }
                          />

                          {/* Other Protected Routes */}
                          <Route
                            path="/applications"
                            element={<Navigate to="/applications/crm" replace />}
                          />
                          <Route
                            path="/applications/crm/*"
                            element={
                              <RequirePackage required="essential" upgradePath="/upgrade/app-store">
                                <CRM />
                              </RequirePackage>
                            }
                          />
                          <Route
                            path="/applications/finance-manager"
                            element={
                              <RequirePackage required="essential" upgradePath="/upgrade/app-store">
                                <FinanceManager />
                              </RequirePackage>
                            }
                          />
                          <Route
                            path="/applications/tenderlyai"
                            element={
                              <RequirePackage required="essential" upgradePath="/upgrade/app-store">
                                <TenderlyAI />
                              </RequirePackage>
                            }
                          />
                          <Route path="/profile" element={<Profile />} />

                          <Route path="/notifications" element={<Notifications />} />

                          {/* Essential Package Features */}
                          <Route
                            path="/marketplace"
                            element={
                              <RequirePackage required="essential" upgradePath="/upgrade/marketplace">
                                <Marketplace />
                              </RequirePackage>
                            }
                          />
                          <Route
                            path="/mentorship"
                            element={
                              <RequirePackage required="essential" upgradePath="/upgrade/mentorship">
                                <MentorshipHub />
                              </RequirePackage>
                            }
                          />
                          <Route
                            path="/funding"
                            element={
                              <RequirePackage required="essential" upgradePath="/upgrade/funding">
                                <FundingFinder />
                              </RequirePackage>
                            }
                          />
                          <Route
                            path="/data-input"
                            element={
                              <RequirePackage required="essential" upgradePath="/upgrade/data-input">
                                <DataInput />
                              </RequirePackage>
                            }
                          />

                          {/* Premium Package Features */}
                          <Route
                            path="/roadmap"
                            element={
                              <RequirePackage required="premium" upgradePath="/upgrade/roadmap">
                                <RoadmapGenerator />
                              </RequirePackage>
                            }
                          />
                          <Route
                            path="/analytics"
                            element={
                              <RequirePackage required="premium" upgradePath="/upgrade/analytics">
                                <Analytics />
                              </RequirePackage>
                            }
                          />
                          <Route
                            path="/ai-analyst"
                            element={
                              <RequirePackage required="premium" upgradePath="/upgrade/ai-analyst">
                                <AIBusinessAnalyst />
                              </RequirePackage>
                            }
                          />

                          {/* Upgrade Pages */}
                          <Route path="/upgrade/marketplace" element={<MarketplaceUpgrade />} />
                          <Route path="/upgrade/mentorship" element={<MentorshipUpgrade />} />
                          <Route path="/upgrade/funding" element={<FundingUpgrade />} />
                          <Route path="/upgrade/data-input" element={<DataInputUpgrade />} />
                          <Route path="/upgrade/app-store" element={<AppStoreUpgrade />} />
                          <Route path="/upgrade/connections" element={<ConnectionsUpgrade />} />
                          <Route path="/upgrade/roadmap" element={<RoadmapUpgrade />} />
                          <Route path="/upgrade/analytics" element={<AnalyticsUpgrade />} />
                          <Route path="/upgrade/ai-analyst" element={<AIAnalystUpgrade />} />

                          <Route
                            path="/connections"
                            element={
                              <RequirePackage required="essential" upgradePath="/upgrade/connections">
                                <MyConnections />
                              </RequirePackage>
                            }
                          />

                          {/* Payment Pages - Use PaymentRoutes component */}
                          <Route
                            path="/payments/*"
                            element={
                              <ProtectedRoute>
                                <PaymentRoutes />
                              </ProtectedRoute>
                            }
                          />
                        </Routes>
                      </Layout>
                    </PackageSelectionRedirect>
                  </PaymentRedirect>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;