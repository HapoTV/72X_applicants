
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PackageSelectionRedirect from './components/PackageSelectionRedirect';
import PaymentRedirect from './components/PaymentRedirect';
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
import Login from './pages/Login';
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

// Upgrade pages
import MarketplaceUpgrade from './pages/upgrades/MarketplaceUpgrade';
import MentorshipUpgrade from './pages/upgrades/MentorshipUpgrade';
import FundingUpgrade from './pages/upgrades/FundingUpgrade';
import DataInputUpgrade from './pages/upgrades/DataInputUpgrade';
import RoadmapUpgrade from './pages/upgrades/RoadmapUpgrade';
import AnalyticsUpgrade from './pages/upgrades/AnalyticsUpgrade';
import AIAnalystUpgrade from './pages/upgrades/AIAnalystUpgrade';

// Admin Dashboard
import AdminDashboard from './pages/adminDashboard/AdminDashboard';
import AdminNotifications from './pages/adminDashboard/tabs/AdminNotifications';

import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Payment Route
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

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
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

            {/* Admin routes - outside of main layout to avoid sidebar and chatbot */}
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/*"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
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
                          <Route path="/learning/:category" element={<LearningModules />} />

                          {/* Community Routes */}
                          <Route path="/community" element={<Community />} />
                          <Route path="/community/discussions" element={<CommunityDiscussions />} />
                          <Route path="/community/networking" element={<CommunityNetworking />} />
                          <Route path="/community/mentorship" element={<CommunityMentorship />} />

                          {/* Other Protected Routes */}
                          <Route
                            path="/applications"
                            element={<Navigate to="/applications/crm" replace />}
                          />
                          <Route path="/applications/crm/*" element={<CRM />} />
                          <Route
                            path="/applications/finance-manager"
                            element={<FinanceManager />}
                          />
                          <Route path="/applications/tenderlyai" element={<TenderlyAI />} />
                          <Route path="/profile" element={<Profile />} />

                          <Route path="/notifications" element={<Notifications />} />

                          {/* Essential Package Features */}
                          <Route path="/marketplace" element={<Marketplace />} />
                          <Route path="/mentorship" element={<MentorshipHub />} />
                          <Route path="/funding" element={<FundingFinder />} />
                          <Route path="/data-input" element={<DataInput />} />

                          {/* Premium Package Features */}
                          <Route path="/roadmap" element={<RoadmapGenerator />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/ai-analyst" element={<AIBusinessAnalyst />} />

                          {/* Upgrade Pages */}
                          <Route path="/upgrade/marketplace" element={<MarketplaceUpgrade />} />
                          <Route path="/upgrade/mentorship" element={<MentorshipUpgrade />} />
                          <Route path="/upgrade/funding" element={<FundingUpgrade />} />
                          <Route path="/upgrade/data-input" element={<DataInputUpgrade />} />
                          <Route path="/upgrade/roadmap" element={<RoadmapUpgrade />} />
                          <Route path="/upgrade/analytics" element={<AnalyticsUpgrade />} />
                          <Route path="/upgrade/ai-analyst" element={<AIAnalystUpgrade />} />

                          <Route path="/connections" element={<MyConnections />} />

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