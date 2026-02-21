import React, { useEffect, useState } from 'react';
import { StudentRequest, RequestStatus, Student, Session } from '../../types';
import { getRequests, updateRequestStatus, addStudent, getStudents, addSession } from '../../services/api';
import { RequestCard } from './RequestCard';
import { Inbox, CheckCircle, CalendarDays, RefreshCw, Coffee, Sunrise, Sunset, Sun } from 'lucide-react';
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
      <div className="flex flex-col h-64 items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-[#4a8067] dark:text-[#6ccca2] animate-spin" />
        <p className="text-stone-500 dark:text-stone-400 font-medium">Loading workspace...</p>
      </div>
    );
  }

  const hour = new Date().getHours();
  let greeting = "Good evening";
  let GreetingIcon = Sunset;
  if (hour < 12) {
    greeting = "Good morning";
    GreetingIcon = Sunrise;
  } else if (hour < 18) {
    greeting = "Good afternoon";
    GreetingIcon = Sun;
  }

  // Calculate some simple metrics for the greeting
  const completedSessions = requests.filter(r => r.status === RequestStatus.ARCHIVED).length;

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Greeting Widget */}
      <div className="bg-white/60 dark:bg-[#252525]/60 backdrop-blur-sm border border-stone-200/50 dark:border-stone-800/50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
            <GreetingIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-800 dark:text-white tracking-tight">{greeting}, Counsellor</h2>
            <p className="text-stone-500 dark:text-stone-400 mt-1 font-medium">
              You have {inProgressRequests.length} session{inProgressRequests.length !== 1 ? 's' : ''} in progress and {scheduledRequests.length} scheduled.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: New Requests */}
        <div className="space-y-4 bg-blue-50/50 dark:bg-blue-900/10 p-4 sm:p-5 rounded-3xl border border-blue-100/50 dark:border-blue-800/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-xl shadow-sm">
              <Inbox className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-800 dark:text-white tracking-tight text-lg">New Requests</h3>
            <span className="ml-auto bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {newRequests.length}
            </span>
          </div>

          <div className="space-y-3">
            {newRequests.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center justify-center space-y-3 opacity-70">
                <div className="w-12 h-12 bg-white/50 dark:bg-[#1f211f]/50 rounded-full flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-stone-400" />
                </div>
                <p className="text-stone-500 font-medium">No new requests</p>
              </div>
            )}
            {newRequests.map(req => (
              <RequestCard key={req.id} request={req} onUpdateStatus={handleStatusUpdate} />
            ))}
          </div>
        </div>

        {/* Column 2: Scheduled */}
        <div className="space-y-4 bg-purple-50/50 dark:bg-purple-900/10 p-4 sm:p-5 rounded-3xl border border-purple-100/50 dark:border-purple-800/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-xl shadow-sm">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-800 dark:text-white tracking-tight text-lg">Scheduled</h3>
            <span className="ml-auto bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {scheduledRequests.length}
            </span>
          </div>

          <div className="space-y-3">
            {scheduledRequests.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center justify-center space-y-3 opacity-70">
                <div className="w-12 h-12 bg-white/50 dark:bg-[#1f211f]/50 rounded-full flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-stone-400" />
                </div>
                <p className="text-stone-500 font-medium">Calendar is clear</p>
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
        <div className="space-y-4 bg-[#e8f3ee] dark:bg-[#1a2822] p-4 sm:p-5 rounded-3xl border border-[#dbece4] dark:border-[#21382f]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-[#4a8067] text-white rounded-xl shadow-sm">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-800 dark:text-white tracking-tight text-lg">In Progress</h3>
            <span className="ml-auto bg-green-100 dark:bg-[#253d32] text-[#4a8067] dark:text-[#6ccca2] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {inProgressRequests.length}
            </span>
          </div>

          <div className="space-y-3">
            {inProgressRequests.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center justify-center space-y-3 opacity-70">
                <div className="w-12 h-12 bg-white/50 dark:bg-[#1f211f]/50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#4a8067]" />
                </div>
                <p className="text-[#4a8067] font-medium">No active sessions</p>
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
    </div>
  );
};