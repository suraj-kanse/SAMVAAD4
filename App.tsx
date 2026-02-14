import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { DashboardLayout, DashboardView } from './components/dashboard/DashboardLayout';
import { ActionCenter } from './components/dashboard/ActionCenter';
import { StudentRepository } from './components/dashboard/StudentRepository';
import { StudentDetail } from './components/dashboard/StudentDetail';
import { AdminPanel } from './components/admin/AdminPanel';
import { AboutPage } from './components/AboutPage';
import { CounselorPage } from './components/CounselorPage';
import { User } from './types';

type ViewState = 'landing' | 'login' | 'signup' | 'dashboard' | 'about' | 'counselor';
type Theme = 'light' | 'dark';

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "588187807226-rn5cb4vgdcugbs6u7nhdhuueqf82pkg9.apps.googleusercontent.com";

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Dashboard routing state
  const [dashboardView, setDashboardView] = useState<DashboardView>('home');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('samvaad_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setView('dashboard');
      } catch (e) {
        console.error("Failed to restore session");
        localStorage.removeItem('samvaad_user');
      }
    }
  }, []);

  // Apply theme class to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('dashboard');
    setDashboardView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  const navigateToStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleDashboardNavigate = (view: DashboardView) => {
    setDashboardView(view);
    setSelectedStudentId(null); // Reset detail view when changing tabs
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
        {view === 'landing' && (
          <LandingPage
            onLoginClick={() => setView('login')}
            onAboutClick={() => setView('about')}
            onMeetCounselorClick={() => setView('counselor')}
            isDark={theme === 'dark'}
            onThemeToggle={toggleTheme}
          />
        )}

        {view === 'about' && (
          <AboutPage
            onHomeClick={() => setView('landing')}
            onMeetCounselorClick={() => setView('counselor')}
            onLoginClick={() => setView('login')}
            isDark={theme === 'dark'}
            onThemeToggle={toggleTheme}
          />
        )}

        {view === 'counselor' && (
          <CounselorPage
            onHomeClick={() => setView('landing')}
            onAboutClick={() => setView('about')}
            onLoginClick={() => setView('login')}
            isDark={theme === 'dark'}
            onThemeToggle={toggleTheme}
          />
        )}

        {view === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setView('landing')}
            onSignupClick={() => setView('signup')}
          />
        )}

        {view === 'signup' && (
          <Signup onBack={() => setView('login')} />
        )}

        {view === 'dashboard' && user && (
          <DashboardLayout
            user={user}
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
                currentUser={user}
                onBack={() => setSelectedStudentId(null)}
              />
            )}

            {dashboardView === 'admin' && user.role === 'admin' && (
              <AdminPanel />
            )}
          </DashboardLayout>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;