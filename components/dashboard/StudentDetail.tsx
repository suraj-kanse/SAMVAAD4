import React, { useEffect, useState } from 'react';
import { Student, Session } from '../../types';
import { getStudentById, getSessionsByStudentId, addSession } from '../../services/mockDb';
import { ArrowLeft, Phone, Briefcase, User as UserIcon, Calendar, Plus, Clock, FileText, Lock, ArrowUpDown, Loader2 } from 'lucide-react';
import { SessionModal } from './SessionModal';

interface StudentDetailProps {
    studentId: string;
    onBack: () => void;
}

export const StudentDetail: React.FC<StudentDetailProps> = ({ studentId, onBack }) => {
    const [student, setStudent] = useState<Student | undefined>(undefined);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortNewestFirst, setSortNewestFirst] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const [sData, sessData] = await Promise.all([
            getStudentById(studentId),
            getSessionsByStudentId(studentId)
        ]);
        setStudent(sData);
        setSessions(sessData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [studentId]);

    const handleSaveSession = async (newSession: Session) => {
        await addSession(newSession);
        // Don't full reload, just fetch sessions
        const sessData = await getSessionsByStudentId(studentId);
        setSessions(sessData);
    };

    const sortedSessions = [...sessions].sort((a, b) => {
        return sortNewestFirst ? b.date - a.date : a.date - b.date;
    });

    if (loading) {
        return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
    }

    if (!student) return <div className="p-8 text-center text-slate-500">Student not found</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            {/* Header & Back */}
            <div>
                <button
                    onClick={onBack}
                    className="flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-4 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/40 rounded-full flex items-center justify-center text-teal-700 dark:text-teal-400 text-2xl font-bold">
                            {student.fullName.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{student.fullName}</h1>
                            <p className="text-slate-500 dark:text-slate-400">{student.branch}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <a href={`tel:${student.mobile}`} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <Phone className="w-4 h-4" /> Call Student
                        </a>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Add Session
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

                {/* Left Col: Info */}
                <div className="md:col-span-1 space-y-6">
                    {/* Contact Card */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-4">Contact Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span>{student.mobile}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>Joined: {new Date(student.joinedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Family Context */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-4">Family Context</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400">Parent Name</label>
                                <p className="font-medium text-slate-800 dark:text-slate-200">{student.parentName}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Occupation</label>
                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Briefcase className="w-3 h-3" /> {student.parentOccupation}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Parent Mobile</label>
                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Phone className="w-3 h-3" /> {student.parentMobile}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Timeline */}
                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Session Timeline</h3>
                        <button
                            onClick={() => setSortNewestFirst(!sortNewestFirst)}
                            className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            {sortNewestFirst ? 'Newest First' : 'Oldest First'}
                        </button>
                    </div>

                    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-8 pb-8">
                        {sortedSessions.length === 0 && (
                            <div className="pl-8 text-slate-500 italic">No sessions recorded yet.</div>
                        )}

                        {sortedSessions.map((session) => (
                            <div key={session.id} className="relative pl-8">
                                {/* Dot */}
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-4 border-teal-500"></div>

                                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {session.topics.map(t => (
                                                <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-xs text-slate-400 flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(session.date).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h4 className="font-semibold text-slate-800 dark:text-white text-lg mb-1">{session.reason}</h4>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                                        {session.description}
                                    </p>

                                    {session.privateNote && (
                                        <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30 flex gap-3">
                                            <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-yellow-800 dark:text-yellow-400 uppercase mb-0.5">Private Note</p>
                                                <p className="text-xs text-yellow-800 dark:text-yellow-200/80">{session.privateNote}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
                                        {session.attachmentUrl && (
                                            <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium cursor-pointer hover:underline">
                                                <FileText className="w-3 h-3" /> Attachment
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <SessionModal
                    studentId={studentId}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveSession}
                />
            )}
        </div>
    );
};
