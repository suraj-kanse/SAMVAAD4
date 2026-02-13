import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { getAllUsers, updateUserStatus } from '../../services/mockDb';
import { CheckCircle2, XCircle, Shield, User as UserIcon, Loader2 } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
        const data = await getAllUsers();
        setUsers(data);
    } catch (e) {
        console.error("Failed to fetch users");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleApproval = async (userId: string, currentStatus: boolean) => {
    setProcessingId(userId);
    const success = await updateUserStatus(userId, !currentStatus);
    if (success) {
        // Optimistic UI update or refetch
        fetchUsers();
    }
    setProcessingId(null);
  };

  // Split users
  const pendingUsers = users.filter(u => !u.isApproved);
  const activeUsers = users.filter(u => u.isApproved);

  if (loading) {
      return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
        <div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Control Panel</h2>
             <p className="text-slate-500 dark:text-slate-400 text-sm">Manage counselor access and permissions.</p>
        </div>

        {/* Pending Requests */}
        <div className="bg-white dark:bg-slate-900 border border-yellow-200 dark:border-yellow-900/30 rounded-xl shadow-sm overflow-hidden">
             <div className="bg-yellow-50 dark:bg-yellow-900/20 px-6 py-4 border-b border-yellow-100 dark:border-yellow-900/30">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
                    <UserIcon className="w-4 h-4" /> Pending Approval Requests
                    <span className="ml-2 bg-yellow-200 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 text-xs font-bold px-2 py-0.5 rounded-full">
                        {pendingUsers.length}
                    </span>
                </h3>
             </div>
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
                 {pendingUsers.length === 0 && (
                     <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">No pending requests</div>
                 )}
                 {pendingUsers.map(user => (
                     <div key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold">
                                 {user.name.charAt(0)}
                             </div>
                             <div>
                                 <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                                 <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                             </div>
                         </div>
                         <div className="flex gap-2">
                             <button 
                                onClick={() => handleToggleApproval(user.id, false)}
                                disabled={!!processingId}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                             >
                                 {processingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                 Approve
                             </button>
                         </div>
                     </div>
                 ))}
             </div>
        </div>

        {/* Active Users */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Active Staff
                </h3>
             </div>
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
                 {activeUsers.map(user => (
                     <div key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                         <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.role === 'admin' ? 'bg-purple-600' : 'bg-teal-600'}`}>
                                 {user.name.charAt(0)}
                             </div>
                             <div>
                                 <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                     {user.name}
                                     {user.role === 'admin' && <span className="text-[10px] uppercase bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-bold">Admin</span>}
                                 </p>
                                 <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                             </div>
                         </div>
                         
                         {user.role !== 'admin' && (
                             <button 
                                onClick={() => handleToggleApproval(user.id, true)}
                                disabled={!!processingId}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-100 dark:border-red-900/30 disabled:opacity-50"
                             >
                                 {processingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                 Revoke Access
                             </button>
                         )}
                     </div>
                 ))}
             </div>
        </div>
    </div>
  );
};