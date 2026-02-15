import React, { useState, useEffect } from 'react';
import { DashboardLayout, DashboardView } from './components/dashboard/DashboardLayout';
import { ActionCenter } from './components/dashboard/ActionCenter';
import { StudentRepository } from './components/dashboard/StudentRepository';
import { StudentDetail } from './components/dashboard/StudentDetail';

type Theme = 'light' | 'dark';

function App() {
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
    <DashboardLayout
      currentView={dashboardView}
      onNavigate={handleDashboardNavigate}
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
  );
}

export default App;
