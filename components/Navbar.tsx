import React, { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface NavbarProps {
  onHomeClick: () => void;
  onAboutClick: () => void;
  onMeetCounselorClick: () => void;

  isDark: boolean;
  onThemeToggle: () => void;
  activePage: 'home' | 'about' | 'counselor';
}

export const Navbar: React.FC<NavbarProps> = ({
  onHomeClick,
  onAboutClick,
  onMeetCounselorClick,

  isDark,
  onThemeToggle,
  activePage
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNav = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed inset-x-0 top-0 h-16 bg-white/90 dark:bg-[#1a1c1a]/90 backdrop-blur-md border-b border-stone-200/50 dark:border-white/5 flex items-center justify-between px-4 z-[100] transition-colors duration-300">
        <button onClick={() => handleNav(onHomeClick)} className="text-lg font-bold text-stone-800 dark:text-white tracking-tight">
          Student Counselling
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-full border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-[90] bg-white dark:bg-[#1a1c1a] animate-fade-in flex flex-col p-4 overflow-y-auto">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => handleNav(onHomeClick)}
              className={`p-4 text-left text-lg font-medium rounded-xl transition-colors ${activePage === 'home' ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-300'}`}
            >
              Student Counselling
            </button>
            <button
              onClick={() => handleNav(onMeetCounselorClick)}
              className={`p-4 text-left text-lg font-medium rounded-xl transition-colors ${activePage === 'counselor' ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-300'}`}
            >
              Meet the Counsellor
            </button>
            <button
              onClick={() => handleNav(onAboutClick)}
              className={`p-4 text-left text-lg font-medium rounded-xl transition-colors ${activePage === 'about' ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-600 dark:text-stone-300'}`}
            >
              About
            </button>

          </nav>
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden md:flex justify-center pt-6 fixed w-full top-0 z-[100] pointer-events-none">
        <nav className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-white/90 dark:bg-[#202020]/90 backdrop-blur-xl border border-stone-200/50 dark:border-white/10 shadow-lg shadow-stone-200/20 dark:shadow-black/40 transition-all duration-300">

          <button
            onClick={onHomeClick}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${activePage === 'home' ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm' : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 hover:text-stone-900 dark:hover:text-white'}`}
          >
            Student Counselling
          </button>

          <button
            onClick={onMeetCounselorClick}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${activePage === 'counselor' ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm' : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 hover:text-stone-900 dark:hover:text-white'}`}
          >
            Meet the Counsellor
          </button>

          <button
            onClick={onAboutClick}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${activePage === 'about' ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm' : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 hover:text-stone-900 dark:hover:text-white'}`}
          >
            About
          </button>

          <div className="w-px h-4 bg-stone-300 dark:bg-white/10 mx-1"></div>

          <button
            onClick={onThemeToggle}
            className="p-2.5 rounded-full text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>
      </div>
    </>
  );
};