import React from 'react';
import { StudentRequest, RequestStatus } from '../../types';
import { Phone, User, Clock, CheckCircle2, Archive, Calendar, UserPlus } from 'lucide-react';

interface RequestCardProps {
  request: StudentRequest;
  onUpdateStatus: (id: string, status: RequestStatus) => void;
  onCreateProfile?: (request: StudentRequest) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onUpdateStatus, onCreateProfile }) => {
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
              onClick={() => onUpdateStatus(request.id, RequestStatus.CONTACTED)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Contacted
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

        {request.status === RequestStatus.CONTACTED && (
          <>
            <button 
              onClick={() => onUpdateStatus(request.id, RequestStatus.SCHEDULED)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
            {onCreateProfile && (
                <button 
                    onClick={() => onCreateProfile(request)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Create Student Profile"
                >
                    <UserPlus className="w-4 h-4" />
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
        
        {request.status === RequestStatus.SCHEDULED && (
            <>
                <div className="flex-1 text-center text-xs text-purple-600 dark:text-purple-400 font-medium py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    Session Scheduled
                </div>
                 {onCreateProfile && (
                    <button 
                        onClick={() => onCreateProfile(request)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Create Student Profile"
                    >
                        <UserPlus className="w-4 h-4" />
                    </button>
                )}
            </>
        )}
      </div>
    </div>
  );
};