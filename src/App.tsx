import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ── Landing page (existing) ── */
import {
  GovernmentHeader,
  HeroSection,
  FeaturesSection,
  ActiveSurveysSection,
  Footer,
} from "@/components/landing";

/* ── Layout ── */
import DashboardLayout from "@/components/layout/DashboardLayout";

/* ── Pages ── */
import LoginPage from "@/pages/LoginPage";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AISurveyBuilder from "@/pages/admin/AISurveyBuilder";
import SurveyImport from "@/pages/admin/SurveyImport";
import QuestionBank from "@/pages/admin/QuestionBank";
import SurveyRegistry from "@/pages/admin/SurveyRegistry";
import DeploymentCenter from "@/pages/admin/DeploymentCenter";
import MonitoringHub from "@/pages/admin/MonitoringHub";
import AIInsights from "@/pages/admin/AIInsights";
import UserManagement from "@/pages/admin/UserManagement";

import CitizenDashboard from "@/pages/citizen/CitizenDashboard";
import VoiceSurvey from "@/pages/citizen/VoiceSurvey";
import SurveyComplete from "@/pages/citizen/SurveyComplete";

import SupervisorDashboard from "@/pages/supervisor/SupervisorDashboard";
import QualityFlags from "@/pages/supervisor/QualityFlags";
import AuditLogs from "@/pages/supervisor/AuditLogs";
import ValidationQueue from "@/pages/supervisor/ValidationQueue";

import EnumeratorDashboard from "@/pages/enumerator/EnumeratorDashboard";

/* ── Landing page wrapper ── */
function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <GovernmentHeader />
      <main>
        <HeroSection />
        <ActiveSurveysSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="survey-builder" element={<AISurveyBuilder />} />
          <Route path="import" element={<SurveyImport />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="registry" element={<SurveyRegistry />} />
          <Route path="publish" element={<DeploymentCenter />} />
          <Route path="monitoring" element={<MonitoringHub />} />
          <Route path="insights" element={<AIInsights />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* Citizen */}
        <Route path="/citizen" element={<DashboardLayout role="citizen" />}>
          <Route index element={<CitizenDashboard />} />
          <Route path="survey" element={<VoiceSurvey />} />
          <Route path="complete" element={<SurveyComplete />} />
        </Route>

        {/* Supervisor */}
        <Route path="/supervisor" element={<DashboardLayout role="supervisor" />}>
          <Route index element={<SupervisorDashboard />} />
          <Route path="quality-flags" element={<QualityFlags />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="validation" element={<ValidationQueue />} />
        </Route>

        {/* Enumerator */}
        <Route path="/enumerator" element={<DashboardLayout role="enumerator" />}>
          <Route index element={<EnumeratorDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;