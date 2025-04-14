import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import Dashboard from './pages/Dashboard';
import Auth from './components/Auth';
import AboutSection from './components/AboutSection';
import BlogOverview from './pages/Blog/BlogOverview';
import BlogDetail from './pages/Blog/BlogDetail';
import NotFound from './components/NotFound';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import PersonalCoachChat from './components/PersonalCoachChat';
import FeatureDetails from './components/FeatureDetails';
import WellnessProfile from './pages/WellnessProfile';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/Marketplace/ProductDetail';
import ProfileSetup from './components/ProfileSetup';
import { SettingsPanel } from './components/SettingsPanel';
import { useAuthStore } from './store/authStore';
import FloatingActionButton from './components/FloatingActionButton';
import GamificationPage from './pages/Gamification';
import OnboardingNew from './components/OnboardingNew';
import { useUser } from './context/UserContext';
import FitnessProfileSetup from './components/FitnessProfileSetup';
import MultiGoalSetup from './components/MultiGoalSetup';
import GoalSettingsPage from './pages/GoalSettingsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-biowellGreen"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}

export default function App() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { hasCompletedOnboarding } = useUser();

  const handleChatClick = () => {
    navigate('/coach');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/articles" element={<BlogOverview />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile-setup" element={
            <PrivateRoute>
              <ProfileSetup />
            </PrivateRoute>
          } />
          <Route path="/fitness-setup" element={
            <PrivateRoute>
              <FitnessProfileSetup />
            </PrivateRoute>
          } />
          <Route path="/onboarding" element={
            <PrivateRoute>
              <OnboardingNew />
            </PrivateRoute>
          } />
          <Route path="/goals" element={
            <PrivateRoute>
              <MultiGoalSetup />
            </PrivateRoute>
          } />
          <Route path="/onboarding-wizard" element={
            <PrivateRoute>
              <OnboardingWizard />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              {!hasCompletedOnboarding ? <Navigate to="/onboarding" /> : <Dashboard />}
            </PrivateRoute>
          } />
          <Route path="/coach" element={
            <PrivateRoute>
              <PersonalCoachChat />
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <SettingsPanel />
            </PrivateRoute>
          } />
          <Route path="/settings/goals" element={
            <PrivateRoute>
              <GoalSettingsPage />
            </PrivateRoute>
          } />
          <Route path="/wellness-profile" element={
            <PrivateRoute>
              <WellnessProfile />
            </PrivateRoute>
          } />
          <Route path="/marketplace" element={
            <PrivateRoute>
              <Marketplace />
            </PrivateRoute>
          } />
          <Route path="/marketplace/product/:id" element={
            <PrivateRoute>
              <ProductDetail />
            </PrivateRoute>
          } />
          <Route path="/journey" element={
            <PrivateRoute>
              <GamificationPage />
            </PrivateRoute>
          } />
          <Route path="/features/:feature" element={<FeatureDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {user && (
          <FloatingActionButton onClick={handleChatClick} />
        )}
      </div>
    </ErrorBoundary>
  );
}