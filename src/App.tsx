import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Noticeboard from './pages/Noticeboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Onboarding from './pages/Onboarding';
import StudentDashboard from './pages/Student/Dashboard';
import AIAssistant from './pages/Student/AIAssistant';
import StudentProfile from './pages/Student/Profile';
import StudentInternships from './pages/Student/Internships';
import StudentApplications from './pages/Student/Applications';
import StudentSettings from './pages/Student/Settings';
import CompanyDashboard from './pages/Company/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import AccessDenied from './components/AccessDenied';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <AccessDenied requiredRole={allowedRoles[0]} />;
  }

  return <>{children}</>;
};

const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.isOnboarded) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const RoleBasedHome = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  if (user.role === 'student') return <StudentDashboard />;
  if (user.role === 'company') return <CompanyDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  
  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
              
              {/* Protected Routes inside Main Responsive Shell */}
              <Route path="/" element={<Layout />}>
                <Route index element={<ProtectedRoute><RoleBasedHome /></ProtectedRoute>} />
                <Route path="notices" element={<ProtectedRoute><Noticeboard /></ProtectedRoute>} />
                
                {/* Student Specific Sub-routes */}
                <Route path="student/assistant" element={<ProtectedRoute allowedRoles={['student']}><AIAssistant /></ProtectedRoute>} />
                <Route path="student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
                <Route path="student/internships" element={<ProtectedRoute allowedRoles={['student']}><StudentInternships /></ProtectedRoute>} />
                <Route path="student/applications" element={<ProtectedRoute allowedRoles={['student']}><StudentApplications /></ProtectedRoute>} />
                <Route path="student/settings" element={<ProtectedRoute allowedRoles={['student']}><StudentSettings /></ProtectedRoute>} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
