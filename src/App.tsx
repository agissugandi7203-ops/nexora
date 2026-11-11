import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Code-splitting dengan React.lazy() untuk performa muat awal sub-detik
const LandingPage = React.lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const ViktorLandingPage = React.lazy(() => import('./pages/ViktorLandingPage').then(m => ({ default: m.ViktorLandingPage })));
const LoginAdmin = React.lazy(() => import('./pages/LoginAdmin').then(m => ({ default: m.LoginAdmin })));
const LoginStudent = React.lazy(() => import('./pages/LoginStudent').then(m => ({ default: m.LoginStudent })));
const SignupPage = React.lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const StudentLayout = React.lazy(() => import('./pages/student/StudentLayout').then(m => ({ default: m.StudentLayout })));

// Loading placeholder minimalis & super cepat saat berpindah rute
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
    <div className="w-10 h-10 rounded-2xl bg-[#051A24] flex items-center justify-center animate-pulse mb-3 shadow-md">
      <svg className="w-5 h-5 fill-white" viewBox="0 0 256 256" aria-hidden="true">
        <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
      </svg>
    </div>
    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '70%' }} />
    </div>
  </div>
);

// Proteksi Halaman Guru: Siswa atau Pengguna Belum Login DILARANG Masuk
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login-admin" replace />;
  if (role !== 'admin') return <Navigate to="/student" replace />;
  return <>{children}</>;
};

// Proteksi Halaman Siswa: Guru atau Pengguna Belum Login DILARANG Masuk
const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login-siswa" replace />;
  if (role !== 'student') return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

// Route untuk Login: Jika sudah login, langsung arahkan ke dashboard masing-masing
const PublicAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/student'} replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <div className="min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/viktor" element={<ViktorLandingPage />} />
                <Route
                  path="/login"
                  element={
                    <PublicAuthRoute>
                      <LoginStudent />
                    </PublicAuthRoute>
                  }
                />
                <Route
                  path="/login-admin"
                  element={
                    <PublicAuthRoute>
                      <LoginAdmin />
                    </PublicAuthRoute>
                  }
                />
                <Route
                  path="/login-siswa"
                  element={
                    <PublicAuthRoute>
                      <LoginStudent />
                    </PublicAuthRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicAuthRoute>
                      <SignupPage />
                    </PublicAuthRoute>
                  }
                />
                <Route
                  path="/daftar"
                  element={
                    <PublicAuthRoute>
                      <SignupPage />
                    </PublicAuthRoute>
                  }
                />

                {/* Protected Admin / Guru Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                />

                {/* Protected Student Routes */}
                <Route
                  path="/student/*"
                  element={
                    <StudentRoute>
                      <StudentLayout />
                    </StudentRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  );
};

export default App;
