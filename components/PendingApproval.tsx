import React from 'react';
import { Clock, ShieldX, ArrowLeft, LogOut } from 'lucide-react';
import { logout } from '../services/mockDb';
import { UserStatus } from '../types';

interface PendingApprovalProps {
    status: UserStatus;
    userName: string;
    onBack: () => void;
    onLogout: () => void;
}

export const PendingApproval: React.FC<PendingApprovalProps> = ({
    status,
    userName,
    onBack,
    onLogout
}) => {
    const isBlocked = status === 'blocked';

    const handleLogout = () => {
        logout();
        onLogout();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
            <div className="w-full max-w-md">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </button>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-black/30 border border-slate-200 dark:border-slate-800 p-8 text-center transition-colors duration-300">
                    {isBlocked ? (
                        <>
                            <div className="p-4 bg-red-50 dark:bg-red-900/40 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
                                <ShieldX className="w-10 h-10 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Access Blocked</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                Hello <span className="font-medium text-slate-700 dark:text-slate-200">{userName}</span>, your account has been blocked by the administrator. Please contact the admin for assistance.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/40 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
                                <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400 animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Awaiting Approval</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                Hello <span className="font-medium text-slate-700 dark:text-slate-200">{userName}</span>, your account is currently awaiting approval from the administrator. You'll be able to access the dashboard once approved.
                            </p>
                        </>
                    )}

                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};
