import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Toaster } from './components/ui/sonner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SurveysPage from './pages/SurveysPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSurveys from './pages/admin/AdminSurveys';
import AdminSurveyBuilder from './pages/admin/AdminSurveyBuilder';
import AdminSurveysPage from './pages/admin/AdminSurveysPage';
import AdminSurveyAnalytics from './pages/admin/AdminSurveyAnalytics';
import AdminQuestionBank from './pages/admin/AdminQuestionBank';
import AdminAssignments from './pages/admin/AdminAssignments';
import AdminSupervisors from './pages/admin/AdminSupervisors';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminHistory from './pages/admin/AdminHistory';
import AdminSettings from './pages/admin/AdminSettings';

// Supervisor Pages
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';

// Enumerator Pages
import EnumeratorDashboard from './pages/enumerator/EnumeratorDashboard';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CitizenSurveyFill from './pages/citizen/CitizenSurveyFill';

function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');
  const { currentUser } = useStore();

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Route protection
  useEffect(() => {
    const protectedRoutes = ['/admin', '/supervisor', '/enumerator', '/citizen'];
    const isProtectedRoute = protectedRoutes.some(route => currentRoute.startsWith(`#${route}`));
    
    if (isProtectedRoute && !currentUser) {
      window.location.hash = '/login';
    }
  }, [currentRoute, currentUser]);

  // Route matching
  const route = currentRoute.replace('#', '');

  // Public routes
  if (route === '/' || route === '') {
    // If user is already logged in, redirect to their dashboard
    if (currentUser) {
      window.location.hash = `/${currentUser.role}/dashboard`;
      return null;
    }
    return (
      <>
        <Toaster position="top-right" />
        <HomePage />
      </>
    );
  }

  if (route === '/login') {
    // If user is already logged in, redirect to their dashboard
    if (currentUser) {
      window.location.hash = `/${currentUser.role}/dashboard`;
      return null;
    }
    return (
      <>
        <Toaster position="top-right" />
        <LoginPage />
      </>
    );
  }

  if (route === '/surveys') {
    return (
      <>
        <Toaster position="top-right" />
        <SurveysPage />
      </>
    );
  }

  // Admin routes
  if (route === '/admin/dashboard') {
    return (
      <>
        <Toaster position="top-right" />
        <AdminDashboard />
      </>
    );
  }

  if (route === '/admin/surveys') {
    return (
      <>
        <Toaster position="top-right" />
        <AdminSurveys />
      </>
    );
  }

  if (route === '/admin/surveys/new') {
    return (
      <>
        <Toaster position="top-right" />
        <AdminSurveyBuilder />
      </>
    );
  }

  if (route.startsWith('/admin/surveys/') && route.endsWith('/edit')) {
    const surveyId = route.split('/')[3];
    return (
      <>
        <Toaster position="top-right" />
        <AdminSurveyBuilder surveyId={surveyId} />
      </>
    );
  }

  if (route.startsWith('/admin/surveys/') && route.endsWith('/analytics')) {
    const surveyId = route.split('/')[3];
    return (
      <>
        <Toaster position="top-right" />
        <AdminSurveyAnalytics surveyId={surveyId} />
      </>
    );
  }

  if (route === '/admin/surveys/page') {
    return (
      <>
        <Toaster position="top-right" />
        <AdminSurveysPage />
      </>
    );
  }

  if (route === '/admin/question-bank') {
    return (
      <>
        <Toaster position="top-right" />
        <AdminQuestionBank />
      </>
    );
  }

  if (route === '/admin/assignments') {
    return (
      <>
        <Toaster position="top-right" />
        <AdminAssignments />
      </>
    );
  }

  if (route === '/admin/supervisors') {
    return (
      <>
        <Toaster position="top-right" />
        <AdminSupervisors />
      </>
    );
  }

  if (route === '/admin/analytics') {
    return (
      <>
        <Toaster position="top-right" />
        <AdminAnalytics />
      </>
    );
  }

  if (route === '/admin/history') {
    return (
      <>
        <Toaster position="top-right" />
        <AdminHistory />
      </>
    );
  }

  if (route === '/admin/settings') {
    return (
      <>
        <Toaster position="top-right" />
        <AdminSettings />
      </>
    );
  }

  // Supervisor routes
  if (route === '/supervisor/dashboard') {
    return (
      <>
        <Toaster position="top-right" />
        <SupervisorDashboard />
      </>
    );
  }

  // Enumerator routes
  if (route === '/enumerator/dashboard') {
    return (
      <>
        <Toaster position="top-right" />
        <EnumeratorDashboard />
      </>
    );
  }

  // Citizen routes
  if (route === '/citizen/dashboard') {
    return (
      <>
        <Toaster position="top-right" />
        <CitizenDashboard />
      </>
    );
  }

  if (route.startsWith('/citizen/surveys/') && route.includes('/fill')) {
    const surveyId = route.split('/')[3];
    return (
      <>
        <Toaster position="top-right" />
        <CitizenSurveyFill surveyId={surveyId} />
      </>
    );
  }

  // 404
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
          <p className="text-slate-600 mb-4">Page not found</p>
          <a href="#/" className="text-blue-600 hover:underline">Go back home</a>
        </div>
      </div>
    </>
  );
}

export default App;