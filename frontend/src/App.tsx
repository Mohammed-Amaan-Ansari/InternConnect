import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Public Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import RoleSelection from './pages/auth/RoleSelection';
import StudentLogin from './pages/auth/StudentLogin';
import IndustryLogin from './pages/auth/IndustryLogin';
import CollegeLogin from './pages/auth/CollegeLogin';
import StudentRegistration from './pages/auth/StudentRegistration';
import IndustryRegistration from './pages/auth/IndustryRegistration';
import CollegeRegistration from './pages/auth/CollegeRegistration';

// Student Portal
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import InternshipSearch from './pages/student/InternshipSearch';
import InternshipDetails from './pages/student/InternshipDetails';
import ApplicationsTracker from './pages/student/ApplicationsTracker';
import LearningHub from './pages/student/LearningHub';
import Logbook from './pages/student/Logbook';
import StudentMessagingCenter from './pages/student/StudentMessagingCenter';

// Industry Portal
import IndustryDashboard from './pages/industry/IndustryDashboard';
import PostInternship from './pages/industry/PostInternship';
import ManageListings from './pages/industry/ManageListings';
import CandidatesReview from './pages/industry/CandidatesReview';
import MessagingCenter from './pages/industry/MessagingCenter';
import IndustryAnalytics from './pages/industry/IndustryAnalytics';

// Admin Portal
import AdminDashboard from './pages/admin/AdminDashboard';
import OpportunityApproval from './pages/admin/OpportunityApproval';
import StudentMonitoring from './pages/admin/StudentMonitoring';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import SystemSettings from './pages/admin/SystemSettings';
import CompanyPartners from './pages/admin/CompanyPartners';
import ResourceManagement from './pages/admin/ResourceManagement';

// Common Pages
import NotificationsPage from './pages/common/NotificationsPage';
import SettingsPage from './pages/common/SettingsPage';
import HelpSupport from './pages/common/HelpSupport';
import TermsPage from './pages/common/TermsPage';
import PrivacyPage from './pages/common/PrivacyPage';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* ... */}
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Auth Routes */}
        <Route path="/auth/role-selection" element={<RoleSelection />} />
        <Route path="/auth/student/login" element={<StudentLogin />} />
        <Route path="/auth/industry/login" element={<IndustryLogin />} />
        <Route path="/auth/college/login" element={<CollegeLogin />} />
        <Route path="/auth/student/register" element={<StudentRegistration />} />
        <Route path="/auth/industry/register" element={<IndustryRegistration />} />
        <Route path="/auth/college/register" element={<CollegeRegistration />} />

        {/* Student Portal Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/search" element={<InternshipSearch />} />
        <Route path="/student/internship/:id" element={<InternshipDetails />} />
        <Route path="/student/applications" element={<ApplicationsTracker />} />
        <Route path="/student/learning" element={<LearningHub />} />
        <Route path="/student/logbook" element={<Logbook />} />
        <Route path="/student/messages" element={<StudentMessagingCenter />} />

        {/* Industry Portal Routes */}
        <Route path="/industry/dashboard" element={<IndustryDashboard />} />
        <Route path="/industry/post" element={<PostInternship />} />
        <Route path="/industry/manage" element={<ManageListings />} />
        <Route path="/industry/candidates" element={<CandidatesReview />} />
        <Route path="/industry/messages" element={<MessagingCenter />} />
        <Route path="/industry/analytics" element={<IndustryAnalytics />} />

        {/* Admin Portal Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/approvals" element={<OpportunityApproval />} />
        <Route path="/admin/students" element={<StudentMonitoring />} />
        <Route path="/admin/companies" element={<CompanyPartners />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<SystemSettings />} />
        <Route path="/admin/resources" element={<ResourceManagement />} />

        {/* Common Routes */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpSupport />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
