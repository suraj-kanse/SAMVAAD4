import React from 'react';
import { LogOut, LayoutDashboard, Users, Sun, Moon } from 'lucide-react';

export type DashboardView = 'home' | 'students';

interface DashboardLayoutProps {
  currentView: DashboardView;
  onNavigate: (view: DashboardView) => void;
  onLogout: () => void;
  children: React.ReactNode;
  isDark: boolean;
  onThemeToggle: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentView,
  onNavigate,
  onLogout,
  children,
  isDark,
  onThemeToggle
}) => {

  const handleLogoutClick = () => {
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#1a1c1a] flex flex-col transition-colors duration-300 font-sans">
      {/* Top Navigation */}
      <nav className="bg-white/80 dark:bg-[#1f211f]/80 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300 border-b border-stone-100 dark:border-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[4.5rem] flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 bg-[#4a8067] dark:bg-[#6ccca2] rounded-xl flex items-center justify-center text-white dark:text-[#1a1c1a] font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                SC
              </div>
              <span className="font-bold text-stone-800 dark:text-white text-xl hidden md:block tracking-tight">Student Counseling</span>
            </div>

            <div className="hidden md:flex items-center space-x-2 bg-stone-100 dark:bg-[#252525] p-1 rounded-full border border-stone-200/50 dark:border-stone-800/50 shadow-inner">
              <button
                onClick={() => onNavigate('home')}
                className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-300 ${currentView === 'home'
                  ? 'bg-white dark:bg-[#333333] text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </button>
              <button
                onClick={() => onNavigate('students')}
                className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-300 ${currentView === 'students'
                  ? 'bg-white dark:bg-[#333333] text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                  }`}
              >
                <Users className="w-4 h-4" />
                Students
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onThemeToggle}
              className="p-2.5 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="h-6 w-px bg-stone-200 dark:bg-stone-700 mx-1"></div>
            <button
              onClick={handleLogoutClick}
              className="p-2.5 text-stone-500 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
