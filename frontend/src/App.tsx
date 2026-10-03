import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Common Components
import { EmergencyBanner } from './components/common/EmergencyBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PetListingPage } from './pages/PetListingPage';
import { PetDetailPage } from './pages/PetDetailPage';
import { AdoptionApplicationPage } from './pages/AdoptionApplicationPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { LostFoundReportPage } from './pages/LostFoundReportPage';
import { RescuePage } from './pages/RescuePage';
import { RescueReportPage } from './pages/RescueReportPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { NGOsPage } from './pages/NGOsPage';
import { VetsPage } from './pages/VetsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { PetCarePage } from './pages/PetCarePage';
import { PetCareAIPage } from './pages/PetCareAIPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';

// Admin Subpages
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminPetsPage } from './pages/AdminPetsPage';
import { AdminAdoptionsPage } from './pages/AdminAdoptionsPage';
import { AdminRescuePage } from './pages/AdminRescuePage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin Guard
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <EmergencyBanner />
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Core Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pets" element={<PetListingPage />} />
          <Route path="/pets/:id" element={<PetDetailPage />} />
          <Route path="/adoption" element={<AdoptionApplicationPage />} />
          <Route path="/adoption/:id" element={<AdoptionApplicationPage />} />
          <Route path="/lost-found" element={<LostFoundPage />} />
          <Route path="/lost-found/report" element={<LostFoundReportPage />} />
          <Route path="/rescue" element={<RescuePage />} />
          <Route path="/rescue/report" element={<RescueReportPage />} />
          <Route path="/volunteers" element={<VolunteersPage />} />
          <Route path="/ngos" element={<NGOsPage />} />
          <Route path="/vets" element={<VetsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/pet-care" element={<PetCarePage />} />
          <Route path="/pet-care/assistant" element={<PetCareAIPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

          {/* Admin Management Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/pets" element={<AdminRoute><AdminPetsPage /></AdminRoute>} />
          <Route path="/admin/adoptions" element={<AdminRoute><AdminAdoptionsPage /></AdminRoute>} />
          <Route path="/admin/rescue" element={<AdminRoute><AdminRescuePage /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><AdminReportsPage /></AdminRoute>} />

          {/* 404 Route */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
