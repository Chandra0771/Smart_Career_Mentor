import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ui/ProtectedRoute';
import { PageLoader } from './components/ui/LoadingSpinner';
import Navbar from './components/layout/Navbar';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'));
const ChatPage = lazy(() => import('./pages/dashboard/ChatPage'));
const ResumePage = lazy(() => import('./pages/dashboard/ResumePage'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: 'rgba(30,30,50,0.9)', color: 'white', border: '1px solid rgba(139,92,246,0.3)', backdropFilter: 'blur(10px)', borderRadius: '12px' },
            success: { iconTheme: { primary: '#8b5cf6', secondary: 'white' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } }
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<><Navbar /><HomePage /></>} />
            <Route path="/login" element={<PublicOnlyRoute><Navbar /><LoginPage /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Navbar /><RegisterPage /></PublicOnlyRoute>} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardHome /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/chat" element={<ProtectedRoute><DashboardLayout><ChatPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/resume" element={<ProtectedRoute><DashboardLayout><ResumePage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
            
            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><DashboardLayout><AdminPanel /></DashboardLayout></ProtectedRoute>} />
            
            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen mesh-bg flex items-center justify-center text-center">
                <div>
                  <div className="text-7xl font-black text-gradient mb-4">404</div>
                  <p className="text-white/60 mb-6">Page not found</p>
                  <a href="/" className="gradient-btn px-6 py-3 rounded-xl inline-block">Go Home</a>
                </div>
              </div>
            } />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
