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
        <div className="mt-8 bg-white/60 dark:bg-[#252525]/60 backdrop-blur-sm rounded-3xl border border-stone-200/50 dark:border-stone-800/50 shadow-sm overflow-hidden transform transition-all">
            <div className="p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800 flex items-center gap-3 bg-stone-50 dark:bg-stone-800/20">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl shadow-sm">
                    <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-stone-900 dark:text-white text-lg tracking-tight">Recent Sessions</h3>
            </div>

            <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {sessions.map(session => {
                    const student = studentsMap[session.studentId];
                    const studentName = student ? student.fullName : 'Unknown Student';
                    const sessionDate = new Date(session.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

                    return (
                        <div key={session.id} className="p-5 sm:p-6 flex flex-col md:flex-row md:items-start gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-2 text-lg tracking-tight">
                                        <div className="p-1.5 bg-stone-100 dark:bg-[#1a1c1a] rounded-lg">
                                            <UserIcon className="w-4 h-4 text-stone-500" />
                                        </div>
                                        {studentName}
                                    </h4>
                                    <span className="text-xs text-stone-400 font-medium flex items-center bg-stone-50 dark:bg-[#1a1c1a] px-3 py-1.5 rounded-full border border-stone-100 dark:border-stone-800">
                                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                                        {sessionDate}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-lg bg-[#e3f0e8] dark:bg-[#1a2822] text-[#4a8067] dark:text-[#6ccca2] text-xs font-bold border border-[#dbece4] dark:border-[#21382f] flex items-center gap-1.5 shadow-sm">
                                        <FileText className="w-3.5 h-3.5" /> {session.topic || 'General Check-in'}
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mt-3">
                                    <div className="bg-white dark:bg-[#1f211f] p-4 rounded-2xl border border-stone-100 dark:border-stone-800/50 shadow-sm">
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Problems Identified</p>
                                        <p className="text-sm font-medium text-stone-700 dark:text-stone-300 leading-relaxed">{session.problems || 'None recorded'}</p>
                                    </div>
                                    <div className="bg-white dark:bg-[#1f211f] p-4 rounded-2xl border border-stone-100 dark:border-stone-800/50 shadow-sm">
                                        <p className="text-xs font-bold text-[#b89547] dark:text-[#cca95e] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                            <Sparkles className="w-4 h-4 text-yellow-500" /> Feedback / Next Steps
                                        </p>
                                        <p className="text-sm font-medium text-stone-700 dark:text-stone-300 leading-relaxed">{session.feedback || 'None recorded'}</p>
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
