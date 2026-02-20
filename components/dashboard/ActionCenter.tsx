import React, { useEffect, useState } from 'react';
import { StudentRequest, RequestStatus, Student, Session } from '../../types';
import { getRequests, updateRequestStatus, addStudent, getStudents, addSession } from '../../services/api';
import { RequestCard } from './RequestCard';
import { Inbox, CheckCircle, CalendarDays, RefreshCw } from 'lucide-react';
import { SessionModal } from './SessionModal';
import { RecentSessionsFeed } from './RecentSessionsFeed';

export const ActionCenter: React.FC = () => {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionModalStudentId, setSessionModalStudentId] = useState<string | null>(null);
  const [activeRequest, setActiveRequest] = useState<StudentRequest | null>(null);

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

  const handleLogSession = async (req: StudentRequest) => {
    try {
      setLoading(true);
      const allStudents = await getStudents();
      const existing = allStudents.find(s => s.mobile === req.studentPhone);

      if (existing) {
        setSessionModalStudentId(existing.id);
      } else {
        const newStudent: Omit<Student, 'id'> = {
          fullName: req.studentName || 'Anonymous Student',
          mobile: req.studentPhone,
          branch: req.department || '',
          parentName: '',
          parentMobile: '',
          parentOccupation: '',
          joinedAt: Date.now()
        };
        const created = await addStudent(newStudent as Student);
        if (created) {
          setSessionModalStudentId(created.id);
        } else {
          alert('Failed to initialize student profile.');
        }
      }
      setActiveRequest(req);
    } catch (e) {
      console.error(e);
      alert('Network error while mapping student.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSession = async (session: Session) => {
    await addSession(session);
    setSessionModalStudentId(null);
    if (activeRequest) {
      // Auto-archive the request once session is logged
      handleStatusUpdate(activeRequest.id, RequestStatus.ARCHIVED);
    }
    setActiveRequest(null);
  };

  const newRequests = requests.filter(r => r.status === RequestStatus.NEW);
  const scheduledRequests = requests.filter(r => r.status === RequestStatus.SCHEDULED);
  const inProgressRequests = requests.filter(r => r.status === RequestStatus.IN_PROGRESS);

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

      {/* Column 2: Scheduled */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg">
            <CalendarDays className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-white">Scheduled this Week</h3>
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
              onLogSession={handleLogSession}
            />
          ))}
        </div>
      </div>

      {/* Column 3: In Progress */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-white">In Progress</h3>
          <span className="ml-auto bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {inProgressRequests.length}
          </span>
        </div>

        <div className="space-y-3">
          {inProgressRequests.length === 0 && (
            <div className="text-center py-12 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-slate-400 text-sm">No active sessions</p>
            </div>
          )}
          {inProgressRequests.map(req => (
            <RequestCard
              key={req.id}
              request={req}
              onUpdateStatus={handleStatusUpdate}
              onLogSession={handleLogSession}
            />
          ))}
        </div>
      </div>

      {sessionModalStudentId && (
        <SessionModal
          studentId={sessionModalStudentId}
          onClose={() => setSessionModalStudentId(null)}
          onSave={handleSaveSession}
        />
      )}

      {/* Global Recent Sessions Feed */}
      <div className="col-span-1 lg:col-span-3">
        <RecentSessionsFeed />
      </div>

    </div>
  );
};