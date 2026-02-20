import React from 'react';
import { StudentRequest, RequestStatus } from '../../types';
import { Phone, User, Clock, CheckCircle2, Archive, Calendar, FilePlus, Building2, MessageCircle, Undo2, ArrowRight } from 'lucide-react';

interface RequestCardProps {
  request: StudentRequest;
  onUpdateStatus: (id: string, status: RequestStatus) => void;
  onLogSession?: (request: StudentRequest) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onUpdateStatus, onLogSession }) => {
  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-white dark:bg-[#252525] p-5 rounded-[1.25rem] border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[#00000040] transition-all duration-300 relative group">
      <div className="flex justify-between items-start mb-4">
        <div>
          {request.studentName ? (
            <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-2 text-[1.1rem] tracking-tight">
              {request.studentName}
            </h4>
          ) : (
            <span className="italic text-stone-400 flex items-center gap-2 text-sm font-medium">
              <User className="w-3.5 h-3.5" /> Anonymous Student
            </span>
          )}
          <div className="flex items-center text-stone-500 dark:text-stone-400 mt-1 font-mono text-sm opacity-90">
            <Phone className="w-3.5 h-3.5 mr-1.5" />
            {request.studentPhone}
          </div>
          {request.department && (
            <div className="flex items-center text-stone-500 dark:text-stone-400 mt-1.5 text-sm">
              <Building2 className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
              {request.department}
            </div>
          )}
          {request.gender && (
            <div className="flex items-center text-stone-500 dark:text-stone-400 mt-1.5 text-sm">
              <User className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
              {request.gender}
            </div>
          )}
          {request.issue && (
            <div className="flex items-start text-stone-600 dark:text-stone-300 mt-3 text-sm bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-100 dark:border-stone-800">
              <MessageCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-stone-400" />
              <span className="italic leading-relaxed">"{request.issue}"</span>
            </div>
          )}
        </div>
        <span className="text-xs text-stone-400 font-medium flex items-center bg-stone-50 dark:bg-[#1a1c1a] px-3 py-1.5 rounded-full border border-stone-100 dark:border-stone-800">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          {timeAgo(request.timestamp)}
        </span>
      </div>

      <div className="flex gap-2 mt-5 pt-4 border-t border-stone-100 dark:border-stone-800">
        {request.status === RequestStatus.NEW && (
          <>
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.SCHEDULED)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 bg-[#f3e8ff] dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-bold rounded-xl hover:bg-[#ebd5ff] dark:hover:bg-purple-900/40 transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.ARCHIVED)}
              className="p-2 text-stone-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
              title="Archive"
            >
              <Archive className="w-4.5 h-4.5" />
            </button>
          </>
        )}

        {request.status === RequestStatus.SCHEDULED && (
          <>
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.NEW)}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
              title="Undo to New"
            >
              <Undo2 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.IN_PROGRESS)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 bg-[#fff3cd] dark:bg-yellow-900/20 text-[#856404] dark:text-yellow-400 text-sm font-bold rounded-xl hover:bg-[#ffeeba] dark:hover:bg-yellow-900/40 transition-colors shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
              Start Session
            </button>
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.ARCHIVED)}
              className="p-2 text-stone-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
              title="Archive"
            >
              <Archive className="w-4.5 h-4.5" />
            </button>
          </>
        )}

        {request.status === RequestStatus.IN_PROGRESS && (
          <>
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.SCHEDULED)}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
              title="Undo to Scheduled"
            >
              <Undo2 className="w-4.5 h-4.5" />
            </button>
            {onLogSession && (
              <button
                onClick={() => onLogSession(request)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 bg-[#4a8067] hover:bg-[#3b6652] text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                title="Log Session & Add to Records"
              >
                <FilePlus className="w-4 h-4" />
                Log & Store
              </button>
            )}
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.ARCHIVED)}
              className="p-2 text-stone-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
              title="Archive"
            >
              <Archive className="w-4.5 h-4.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};