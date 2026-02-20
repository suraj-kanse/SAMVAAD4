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
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          {request.studentName ? (
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              {request.studentName}
            </h4>
          ) : (
            <span className="italic text-slate-400 flex items-center gap-2 text-sm">
              <User className="w-3 h-3" /> Anonymous Student
            </span>
          )}
          <div className="flex items-center text-slate-600 dark:text-slate-400 mt-1 font-mono text-sm">
            <Phone className="w-3 h-3 mr-1.5" />
            {request.studentPhone}
          </div>
          {request.department && (
            <div className="flex items-center text-slate-500 dark:text-slate-400 mt-1 text-sm">
              <Building2 className="w-3 h-3 mr-1.5" />
              {request.department}
            </div>
          )}
          {request.gender && (
            <div className="flex items-center text-slate-500 dark:text-slate-400 mt-1 text-sm">
              <User className="w-3 h-3 mr-1.5" />
              {request.gender}
            </div>
          )}
          {request.issue && (
            <div className="flex items-start text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
              <MessageCircle className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" />
              <span className="italic">{request.issue}</span>
            </div>
          )}
        </div>
        <span className="text-xs text-slate-400 flex items-center bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full">
          <Clock className="w-3 h-3 mr-1" />
          {timeAgo(request.timestamp)}
        </span>
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        {request.status === RequestStatus.NEW && (
          <>
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.SCHEDULED)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.ARCHIVED)}
              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Archive"
            >
              <Archive className="w-4 h-4" />
            </button>
          </>
        )}

        {request.status === RequestStatus.SCHEDULED && (
          <>
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.NEW)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Undo to New"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.IN_PROGRESS)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              Start Session
            </button>
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.ARCHIVED)}
              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Archive"
            >
              <Archive className="w-4 h-4" />
            </button>
          </>
        )}

        {request.status === RequestStatus.IN_PROGRESS && (
          <>
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.SCHEDULED)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Undo to Scheduled"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            {onLogSession && (
              <button
                onClick={() => onLogSession(request)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-sm font-medium rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                title="Log Session & Add to Records"
              >
                <FilePlus className="w-4 h-4" />
                Log & Store
              </button>
            )}
            <button
              onClick={() => onUpdateStatus(request.id, RequestStatus.ARCHIVED)}
              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Archive"
            >
              <Archive className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};