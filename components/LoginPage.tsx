import React, { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, UserPlus } from 'lucide-react';
import { login } from '../services/mockDb';
import { AuthUser, UserRole } from '../types';

interface LoginPageProps {
    role: UserRole;
    onLoginSuccess: (user: AuthUser) => void;
    onBack: () => void;
    onRegisterClick?: () => void;
    isDark: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
    role,
    onLoginSuccess,
    onBack,
    onRegisterClick,
    isDark
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await login(email, password);

            // For admin login, verify role is admin
            if (role === 'admin' && result.user.role !== 'admin') {
                setError('This login is for administrators only.');
                setIsLoading(false);
                return;
            }

            // For counselor login, verify role is counselor
            if (role === 'counselor' && result.user.role !== 'counselor') {
                setError('This login is for counselors only. Please use the admin login.');
                setIsLoading(false);
                return;
            }

            onLoginSuccess(result.user);
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isAdmin = role === 'admin';
    const title = isAdmin ? 'Admin Login' : 'Counselor Login';
    const subtitle = isAdmin
        ? 'Sign in to manage counselor access'
        : 'Sign in to access your dashboard';

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
            <div className="w-full max-w-md">
                {/* Back button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </button>

                {/* Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-black/30 border border-slate-200 dark:border-slate-800 p-8 transition-colors duration-300">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 ${isAdmin
                                ? 'bg-violet-100 dark:bg-violet-900/40'
                                : 'bg-teal-100 dark:bg-teal-900/40'
                            }`}>
                            <LogIn className={`w-7 h-7 ${isAdmin
                                    ? 'text-violet-600 dark:text-violet-400'
                                    : 'text-teal-600 dark:text-teal-400'
                                }`} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{subtitle}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    id="login-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="login-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center py-3.5 px-6 rounded-xl shadow-lg text-white font-semibold text-base transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed ${isAdmin
                                    ? 'bg-violet-600 hover:bg-violet-700 focus:ring-violet-500'
                                    : 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-5 w-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register link (counselor only) */}
                    {!isAdmin && onRegisterClick && (
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Don't have an account?{' '}
                                <button
                                    onClick={onRegisterClick}
                                    className="text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 transition-colors inline-flex items-center gap-1"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Register here
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
