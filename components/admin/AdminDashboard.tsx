import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, Loader2, LogOut, Sun, Moon, ArrowLeft, Users, RefreshCw, Search, Filter } from 'lucide-react';
import { getCounsellors, updateCounsellorStatus, logout } from '../../services/api';
import { Counsellor } from '../../types';

interface AdminDashboardProps {
    adminName: string;
    onLogout: () => void;
    onBack: () => void;
    isDark: boolean;
    onThemeToggle: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    adminName,
    onLogout,
    onBack,
    isDark,
    onThemeToggle
}) => {
    const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchCounsellors = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCounsellors();
            setCounsellors(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load counsellors.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCounsellors();
    }, []);

    const handleStatusChange = async (id: string, status: string) => {
        setUpdatingId(id);
        try {
            const updated = await updateCounsellorStatus(id, status);
            setCounsellors(prev =>
                prev.map(c => c.id === id ? { ...c, status: updated.status } : c)
            );
        } catch (err: any) {
            setError(err.message || 'Failed to update counsellor status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleLogout = () => {
        logout();
        onLogout();
    };

    const totalCounsellors = counsellors.length;
    const pendingCounsellors = counsellors.filter(c => c.status === 'pending').length;
    const approvedCounsellors = counsellors.filter(c => c.status === 'approved').length;
    const blockedCounsellors = counsellors.filter(c => c.status === 'blocked').length;

    const filteredCounsellors = counsellors.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approved
                    </span>
                );
            case 'blocked':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        <XCircle className="w-3.5 h-3.5" />
                        Blocked
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            {/* Top Navigation */}
            <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors font-medium text-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Back to Home</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                <Shield className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-white text-lg hidden md:block">Admin Panel</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                            Welcome, <span className="font-medium text-slate-700 dark:text-slate-200">{adminName}</span>
                        </span>
                        <button
                            onClick={onThemeToggle}
                            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                            <Users className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                            Manage Counsellors
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Approve or block counsellor access to the platform</p>
                    </div>
                    <button
                        onClick={fetchCounsellors}
                        disabled={isLoading}
                        className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {!isLoading && counsellors.length > 0 && (
                    <>
                        {/* Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{totalCounsellors}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                                <p className="text-sm font-medium text-amber-600 dark:text-amber-500">Pending</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{pendingCounsellors}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                                <p className="text-sm font-medium text-green-600 dark:text-green-500">Approved</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{approvedCounsellors}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                                <p className="text-sm font-medium text-red-600 dark:text-red-500">Blocked</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{blockedCounsellors}</p>
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="relative w-full sm:w-48">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Filter className="h-4 w-4 text-slate-400" />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="block w-full pl-10 pr-8 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white appearance-none"
                                >
                                    <option value="all">All Counsellors</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}

                {error && (
                    <div className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 mb-6">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-violet-600 dark:text-violet-400 animate-spin" />
                    </div>
                ) : filteredCounsellors.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center transition-colors duration-300">
                        <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No counsellors found</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Try adjusting your search or filters.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredCounsellors.map((counsellor) => (
                            <div
                                key={counsellor.id}
                                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300 hover:border-slate-300 dark:hover:border-slate-700"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-base font-semibold text-slate-800 dark:text-white">{counsellor.name}</h3>
                                        {getStatusBadge(counsellor.status)}
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{counsellor.email}</p>
                                    {counsellor.createdAt && (
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                            Registered: {new Date(counsellor.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                    {counsellor.status !== 'approved' && (
                                        <button
                                            onClick={() => handleStatusChange(counsellor.id, 'approved')}
                                            disabled={updatingId === counsellor.id}
                                            className="px-4 py-2 text-sm font-medium rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 border border-green-200 dark:border-green-900/30 transition-colors disabled:opacity-50"
                                        >
                                            {updatingId === counsellor.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                'Approve'
                                            )}
                                        </button>
                                    )}

                                    {counsellor.status !== 'pending' && (
                                        <button
                                            onClick={() => handleStatusChange(counsellor.id, 'pending')}
                                            disabled={updatingId === counsellor.id}
                                            className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-900/30 transition-colors disabled:opacity-50"
                                        >
                                            {updatingId === counsellor.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                'Set Pending'
                                            )}
                                        </button>
                                    )}

                                    {counsellor.status !== 'blocked' && (
                                        <button
                                            onClick={() => handleStatusChange(counsellor.id, 'blocked')}
                                            disabled={updatingId === counsellor.id}
                                            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/30 transition-colors disabled:opacity-50"
                                        >
                                            {updatingId === counsellor.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                'Block'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
