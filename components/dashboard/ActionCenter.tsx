import React, { useEffect, useState } from 'react';
import { StudentRequest, RequestStatus, Student } from '../../types';
import { getRequests, updateRequestStatus, addStudent } from '../../services/mockDb';
import { RequestCard } from './RequestCard';
import { Inbox, CheckCircle, CalendarDays, RefreshCw } from 'lucide-react';
import { CreateStudentModal } from './CreateStudentModal';

export const ActionCenter: React.FC = () => {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestForProfile, setSelectedRequestForProfile] = useState<StudentRequest | null>(null);

  const fetchRequests = async () => {
    try {
      const data = await getRequests();
      // Sort by newest first
      setRequests(data.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Poll for new requests every 5 seconds
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id: string, status: RequestStatus) => {
    // Optimistic update for UI responsiveness
    setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status } : req
    ));
    
    const success = await updateRequestStatus(id, status);
    if (!success) {
        // Revert if failed
        fetchRequests();
    }
  };

  const handleCreateProfile = async (student: Student) => {
      const success = await addStudent(student);
      if (success && selectedRequestForProfile) {
          // Optional: Auto-archive or just close modal
      }
      setSelectedRequestForProfile(null);
  };

  const newRequests = requests.filter(r => r.status === RequestStatus.NEW);
  const contactedRequests = requests.filter(r => r.status === RequestStatus.CONTACTED);
  const scheduledRequests = requests.filter(r => r.status === RequestStatus.SCHEDULED);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Column 1: New Requests */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                <Inbox className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-white">New Requests</h3>
            <span className="ml-auto bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {newRequests.length}
            </span>
        </div>
        
        <div className="space-y-3">
            {newRequests.length === 0 && (
                <div className="text-center py-12 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-400 text-sm">No new requests</p>
                </div>
            )}
            {newRequests.map(req => (
                <RequestCard key={req.id} request={req} onUpdateStatus={handleStatusUpdate} />
            ))}
        </div>
      </div>

      {/* Column 2: In Progress */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg">
                <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-white">In Progress</h3>
             <span className="ml-auto bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {contactedRequests.length}
            </span>
        </div>

         <div className="space-y-3">
            {contactedRequests.length === 0 && (
                <div className="text-center py-12 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-400 text-sm">No active conversations</p>
                </div>
            )}
            {contactedRequests.map(req => (
                <RequestCard 
                    key={req.id} 
                    request={req} 
                    onUpdateStatus={handleStatusUpdate} 
                    onCreateProfile={(r) => setSelectedRequestForProfile(r)}
                />
            ))}
        </div>
      </div>

      {/* Column 3: Scheduled */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg">
                <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-white">Scheduled Sessions</h3>
            <span className="ml-auto bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {scheduledRequests.length}
            </span>
        </div>

        <div className="space-y-3">
             {scheduledRequests.length === 0 && (
                <div className="text-center py-12 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-400 text-sm">Calendar is clear</p>
                </div>
            )}
             {scheduledRequests.map(req => (
                <RequestCard 
                    key={req.id} 
                    request={req} 
                    onUpdateStatus={handleStatusUpdate} 
                    onCreateProfile={(r) => setSelectedRequestForProfile(r)}
                />
            ))}
        </div>
      </div>

      {selectedRequestForProfile && (
          <CreateStudentModal 
            initialPhone={selectedRequestForProfile.studentPhone}
            initialName={selectedRequestForProfile.studentName}
            onClose={() => setSelectedRequestForProfile(null)}
            onSave={handleCreateProfile}
          />
      )}

    </div>
  );
};