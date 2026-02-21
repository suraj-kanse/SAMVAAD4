import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { DashboardLayout, DashboardView } from './components/dashboard/DashboardLayout';
import { ActionCenter } from './components/dashboard/ActionCenter';
import { StudentRepository } from './components/dashboard/StudentRepository';
import { StudentDetail } from './components/dashboard/StudentDetail';
import { AboutPage } from './components/AboutPage';
import { CounsellorPage } from './components/CounsellorPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { PendingApproval } from './components/PendingApproval';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { getMe, getToken, logout } from './services/api';
import { AuthUser } from './types';

type ViewState =
  | 'landing'
  | 'about'
  | 'counsellor'
  | 'counsellor-login'
  | 'counsellor-register'
  | 'counsellor-dashboard'
  | 'admin-login'
  | 'admin-dashboard';

type Theme = 'light' | 'dark';

function App() {
  // Read initial view from URL hash (e.g. #counsellor-login, #admin-login)
  const getViewFromHash = (): ViewState => {
    const hash = window.location.hash.replace('#', '');
    const validViews: ViewState[] = ['counsellor-login', 'counsellor-register', 'admin-login'];
    if (validViews.includes(hash as ViewState)) return hash as ViewState;
    return 'landing';
  };

  const [view, setView] = useState<ViewState>(getViewFromHash);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Auth state
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Dashboard routing state
  const [dashboardView, setDashboardView] = useState<DashboardView>('home');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Apply theme class to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync view with URL hash
  useEffect(() => {
    // Update hash when view changes
    const authViews = ['counsellor-login', 'counsellor-register', 'admin-login'];
    if (authViews.includes(view)) {
      window.location.hash = view;
    } else {
      // Clear hash for non-auth views
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [view]);

  // Listen for hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const newView = getViewFromHash();
      setView(newView);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Restore auth session on app load
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const user = await getMe();
        setAuthUser(user);

        // Auto-navigate to appropriate dashboard
        if (user.role === 'admin') {
          setView('admin-dashboard');
        } else if (user.role === 'counsellor') {
          if (user.status === 'approved') {
            setView('counsellor-dashboard');
          } else {
            // pending or blocked — handled in render
            setView('counsellor-dashboard');
          }
        }
      } catch {
        // Token invalid/expired — clear it
        logout();
        setAuthUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navigateToStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleDashboardNavigate = (view: DashboardView) => {
    setDashboardView(view);
    setSelectedStudentId(null);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    if (user.role === 'admin') {
      setView('admin-dashboard');
    } else if (user.role === 'counsellor') {
      if (user.status === 'approved') {
        setView('counsellor-dashboard');
      } else {
        setView('counsellor-dashboard'); // will show PendingApproval
      }
    }
  };

  const handleLogout = () => {
    logout();
    setAuthUser(null);
    setView('landing');
  };

  // Show loading while restoring session
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Public Pages */}
      {view === 'landing' && (
        <LandingPage
          onAboutClick={() => setView('about')}
          onMeetCounsellorClick={() => setView('counsellor')}
          isDark={theme === 'dark'}
          onThemeToggle={toggleTheme}
        />
      )}

      {view === 'about' && (
        <AboutPage
          onHomeClick={() => setView('landing')}
          onMeetCounsellorClick={() => setView('counsellor')}
          isDark={theme === 'dark'}
          onThemeToggle={toggleTheme}
        />
      )}

      {view === 'counsellor' && (
        <CounsellorPage
          onHomeClick={() => setView('landing')}
          onAboutClick={() => setView('about')}
          isDark={theme === 'dark'}
          onThemeToggle={toggleTheme}
        />
      )}

      {/* Auth Pages */}
      {view === 'counsellor-login' && (
        <LoginPage
          role="counsellor"
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setView('landing')}
          onRegisterClick={() => setView('counsellor-register')}
          isDark={theme === 'dark'}
        />
      )}

      {view === 'counsellor-register' && (
        <RegisterPage
          onBack={() => setView('landing')}
          onLoginClick={() => setView('counsellor-login')}
          isDark={theme === 'dark'}
        />
      )}

      {view === 'admin-login' && (
        <LoginPage
          role="admin"
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setView('landing')}
          isDark={theme === 'dark'}
        />
      )}

      {/* Counsellor Dashboard (with auth guard) */}
      {view === 'counsellor-dashboard' && authUser?.role === 'counsellor' && (
        <>
          {authUser.status !== 'approved' ? (
            <PendingApproval
              status={authUser.status}
              userName={authUser.name}
              onBack={() => setView('landing')}
              onLogout={handleLogout}
            />
          ) : (
            <DashboardLayout
              currentView={dashboardView}
              onNavigate={handleDashboardNavigate}
              onLogout={handleLogout}
              isDark={theme === 'dark'}
              onThemeToggle={toggleTheme}
            >
              {dashboardView === 'home' && <ActionCenter />}

              {dashboardView === 'students' && !selectedStudentId && (
                <StudentRepository onSelectStudent={navigateToStudent} />
              )}

              {dashboardView === 'students' && selectedStudentId && (
                <StudentDetail
                  studentId={selectedStudentId}
                  onBack={() => setSelectedStudentId(null)}
                />
              )}
            </DashboardLayout>
          )}
        </>
      )}

      {/* Admin Dashboard (with auth guard) */}
      {view === 'admin-dashboard' && authUser?.role === 'admin' && (
        <AdminDashboard
          adminName={authUser.name}
          onLogout={handleLogout}
          onBack={() => setView('landing')}
          isDark={theme === 'dark'}
          onThemeToggle={toggleTheme}
        />
      )}
    </div>
  );
}

export default App;
