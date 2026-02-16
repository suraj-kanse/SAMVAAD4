import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { DashboardLayout, DashboardView } from './components/dashboard/DashboardLayout';
import { ActionCenter } from './components/dashboard/ActionCenter';
import { StudentRepository } from './components/dashboard/StudentRepository';
import { StudentDetail } from './components/dashboard/StudentDetail';
import { AboutPage } from './components/AboutPage';
import { CounselorPage } from './components/CounselorPage';

type ViewState = 'landing' | 'dashboard' | 'about' | 'counselor';
type Theme = 'light' | 'dark';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

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

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navigateToStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleDashboardNavigate = (view: DashboardView) => {
    setDashboardView(view);
    setSelectedStudentId(null); // Reset detail view when changing tabs
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {view === 'landing' && (
        <LandingPage

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

          isDark={theme === 'dark'}
          onThemeToggle={toggleTheme}
        />
      )}

      {view === 'counselor' && (
        <CounselorPage
          onHomeClick={() => setView('landing')}
          onAboutClick={() => setView('about')}

          isDark={theme === 'dark'}
          onThemeToggle={toggleTheme}
        />
      )}

      {view === 'dashboard' && (
        <DashboardLayout
          currentView={dashboardView}
          onNavigate={handleDashboardNavigate}
          onLogout={() => setView('landing')}
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
    </div>
  );
}

export default App;
