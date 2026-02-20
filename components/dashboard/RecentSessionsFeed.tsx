import React, { useEffect, useState } from 'react';
import { Session, Student } from '../../types';
import { getSessions, getStudents } from '../../services/api';
import { Clock, FileText, User as UserIcon, Loader2, Sparkles } from 'lucide-react';

export const RecentSessionsFeed: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [studentsMap, setStudentsMap] = useState<Record<string, Student>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sessionsData, studentsData] = await Promise.all([
                    getSessions(),
                    getStudents()
                ]);

                // Take only the 10 most recent sessions
                const recentSessions = sessionsData.sort((a, b) => b.date - a.date).slice(0, 10);
                setSessions(recentSessions);

                const map: Record<string, Student> = {};
                for (const student of studentsData) {
                    map[student.id] = student;
                }
                setStudentsMap(map);
            } catch (err) {
                console.error("Failed to fetch recent sessions data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Poll every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (sessions.length === 0) {
        return null; // Don't show the section if there are no sessions at all
    }

    return (
        <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                    <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white">Recent Sessions</h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {sessions.map(session => {
                    const student = studentsMap[session.studentId];
                    const studentName = student ? student.fullName : 'Unknown Student';
                    const sessionDate = new Date(session.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

                    return (
                        <div key={session.id} className="p-5 flex flex-col md:flex-row md:items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-slate-400" />
                                        {studentName}
                                    </h4>
                                    <span className="text-xs text-slate-500 font-medium">
                                        {sessionDate}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800/50 flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> {session.topic || 'General Check-in'}
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mt-2">
                                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Problems Identified</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{session.problems || 'None recorded'}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-yellow-500" /> Feedback / Next Steps
                                        </p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{session.feedback || 'None recorded'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
