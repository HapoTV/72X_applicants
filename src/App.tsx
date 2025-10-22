import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardOverview from './pages/dashboard/Overview';
import DashboardMetrics from './pages/dashboard/Metrics';
import DashboardCommunityFeed from './pages/dashboard/CommunityFeed';
import Schedule from './pages/Schedule';
import ScheduleEvents from './pages/schedule/Events';
import ScheduleCalendar from './pages/schedule/Calendar';
import Analytics from './pages/Analytics';
import RoadmapGenerator from './pages/RoadmapGenerator';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import DataInput from './pages/DataInput';
import LearningModules from './pages/LearningModules';
import BusinessPlanning from './pages/learning/BusinessPlanning';
import MarketingSales from './pages/learning/MarketingSales';
import FinancialManagement from './pages/learning/FinancialManagement';
import Operations from './pages/learning/Operations';
import Leadership from './pages/learning/Leadership';
import Community from './pages/Community';
import CommunityDiscussions from './pages/community/Discussions';
import CommunityNetworking from './pages/community/Networking';
import CommunityMentorship from './pages/community/Mentorship';
import FundingFinder from './pages/FundingFinder';
import ExpertSessions from './pages/ExpertSessions';
import Marketplace from './pages/Marketplace';
import MentorshipHub from './pages/MentorshipHub';
import Applications from './pages/Applications';
import AIBusinessAnalyst from './pages/AIBusinessAnalyst';
import Login from './pages/Login';
import BizBoostChatbot from './components/Chatbot'; //New code added for chatbot

// Upgrade pages
import MarketplaceUpgrade from './pages/upgrades/MarketplaceUpgrade';
import MentorshipUpgrade from './pages/upgrades/MentorshipUpgrade';
import FundingUpgrade from './pages/upgrades/FundingUpgrade';
import DataInputUpgrade from './pages/upgrades/DataInputUpgrade';
import RoadmapUpgrade from './pages/upgrades/RoadmapUpgrade';
import AnalyticsUpgrade from './pages/upgrades/AnalyticsUpgrade';
import ResourcesUpgrade from './pages/upgrades/ResourcesUpgrade';
import ExpertsUpgrade from './pages/upgrades/ExpertsUpgrade';
import AIAnalystUpgrade from './pages/upgrades/AIAnalystUpgrade';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login route */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin route - outside of main layout to avoid sidebar and chatbot */}
        <Route path="/admin/dashboard" element={
          localStorage.getItem('userType') === 'admin' 
            ? <AdminDashboard /> 
            : <Navigate to="/login" replace />
        } />
        
        {/* All other routes with Layout */}
        <Route path="/*" element={
          <Layout>
            <BizBoostChatbot /> {/* Chatbot component */}
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
              <Route path="/community" element={<Community />} />
              <Route path="/community/discussions" element={<CommunityDiscussions />} />
              <Route path="/community/networking" element={<CommunityNetworking />} />
              <Route path="/community/mentorship" element={<CommunityMentorship />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Essential Package Features */}
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/mentorship" element={<MentorshipHub />} />
              <Route path="/funding" element={<FundingFinder />} />
              <Route path="/data-input" element={<DataInput />} />
              
              {/* Premium Package Features */}
              <Route path="/roadmap" element={<RoadmapGenerator />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/experts" element={<ExpertSessions />} />
              <Route path="/ai-analyst" element={<AIBusinessAnalyst />} />
              
              {/* Upgrade Pages */}
              <Route path="/upgrade/marketplace" element={<MarketplaceUpgrade />} />
              <Route path="/upgrade/mentorship" element={<MentorshipUpgrade />} />
              <Route path="/upgrade/funding" element={<FundingUpgrade />} />
              <Route path="/upgrade/data-input" element={<DataInputUpgrade />} />
              <Route path="/upgrade/roadmap" element={<RoadmapUpgrade />} />
              <Route path="/upgrade/analytics" element={<AnalyticsUpgrade />} />
              <Route path="/upgrade/resources" element={<ResourcesUpgrade />} />
              <Route path="/upgrade/experts" element={<ExpertsUpgrade />} />
              <Route path="/upgrade/ai-analyst" element={<AIAnalystUpgrade />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;