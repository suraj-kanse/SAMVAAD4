import React, { useState } from 'react';
import { Loader2, Lock, Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { login } from '../services/auth';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onBack: () => void;
  onSignupClick: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack, onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.user) {
        // Save to local storage for persistence
        localStorage.setItem('samvaad_user', JSON.stringify(result.user));
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Login failed.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* Educational/Inspirational Left Panel (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-teal-600 dark:bg-teal-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pattern-dots"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full filter blur-3xl opacity-20 -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-teal-100 font-semibold tracking-wide uppercase text-sm"
          >
            <ShieldCheck className="w-5 h-5" /> Secured Portal
          </motion.div>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mb-6 leading-tight"
          >
            Empowering students through confidential and accessible support.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-teal-100 text-lg leading-relaxed"
          >
            "The greatest glory in living lies not in never falling, but in rising every time we fall."
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center gap-3"
          >
            <div className="h-0.5 w-12 bg-teal-300/50"></div>
            <span className="text-teal-200 font-medium">- Nelson Mandela</span>
          </motion.div>
        </div>

        <div className="relative z-10 text-teal-200/60 text-sm">
          &copy; {new Date().getFullYear()} Samvaad Platform. All rights reserved.
        </div>
      </div>

      {/* Login Form Panel */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12 lg:p-20 relative">
        <button
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="w-full max-w-md space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="h-14 w-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                <span className="text-white text-2xl font-bold">S</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Please verify your credentials to continue.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800 flex items-start"
              >
                <div className="shrink-0 mr-2 mt-0.5">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                </div>
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                    placeholder="counselor@avcoe.edu"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-teal-500/20 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-50 dark:bg-slate-950 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setLoading(true);
                  const res = await fetch('http://localhost:5000/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: credentialResponse.credential }),
                  });
                  const data = await res.json();
                  setLoading(false);
                  if (res.ok) {
                    localStorage.setItem('samvaad_user', JSON.stringify(data));
                    onLoginSuccess(data);
                  } else {
                    setError(data.error || 'Google Login Failed');
                  }
                } catch (err) {
                  setLoading(false);
                  setError('Network Error');
                }
              }}
              onError={() => {
                setError('Google Login Failed');
              }}
              useOneTap
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              New counselor joining the team? {' '}
              <button
                onClick={onSignupClick}
                className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors"
              >
                Request access here
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};