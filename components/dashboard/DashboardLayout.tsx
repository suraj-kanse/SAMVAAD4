import React from 'react';
import { User } from '../../types';
import { LogOut, User as UserIcon, LayoutDashboard, Users, Shield, Sun, Moon } from 'lucide-react';

export type DashboardView = 'home' | 'students' | 'admin';

interface DashboardLayoutProps {
  user: User;
  currentView: DashboardView;
  onNavigate: (view: DashboardView) => void;
  onLogout: () => void;
  children: React.ReactNode;
  isDark: boolean;
  onThemeToggle: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  user, 
  currentView,
  onNavigate,
  onLogout, 
  children,
  isDark,
  onThemeToggle
}) => {

  const handleLogoutClick = () => {
      localStorage.removeItem('samvaad_user');
      onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    SC
                </div>
                <span className="font-semibold text-slate-800 dark:text-white text-lg hidden md:block">Student Counselling</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
                <button 
                    onClick={() => onNavigate('home')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                        currentView === 'home' 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Overview
                </button>
                <button 
                    onClick={() => onNavigate('students')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                        currentView === 'students' 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                    <Users className="w-4 h-4" />
                    Students
                </button>
                {user.role === 'admin' && (
                    <button 
                        onClick={() => onNavigate('admin')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                            currentView === 'admin' 
                            ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Shield className="w-4 h-4" />
                        Admin
                    </button>
                )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
                onClick={onThemeToggle}
                className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                aria-label="Toggle Theme"
            >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{user.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</span>
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 ${user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900' : 'bg-slate-100 dark:bg-slate-800'}`}>
               <UserIcon className={`w-4 h-4 ${user.role === 'admin' ? 'text-purple-600 dark:text-purple-300' : 'text-slate-500 dark:text-slate-300'}`} />
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button 
              onClick={handleLogoutClick}
              className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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