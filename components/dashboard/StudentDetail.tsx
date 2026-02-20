import React, { useEffect, useState } from 'react';
import { Student, Session } from '../../types';
import { getStudentById, getSessionsByStudentId, addSession, deleteStudent } from '../../services/api';
import { ArrowLeft, Phone, Briefcase, User as UserIcon, Calendar, Plus, Clock, FileText, Lock, ArrowUpDown, Loader2, Trash2 } from 'lucide-react';
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
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDeleteStudent = async () => {
        if (!student) return;
        if (window.confirm(`Are you sure you want to delete ${student.fullName}? This will permanently remove their profile and all associated session history.`)) {
            setIsDeleting(true);
            const success = await deleteStudent(studentId);
            if (success) {
                onBack(); // Go back to the roster explicitly
            } else {
                alert('Failed to delete student.');
                setIsDeleting(false);
            }
        }
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
                    className="flex items-center text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 mb-4 transition-colors font-medium"
                >
                    <ArrowLeft className="w-4.5 h-4.5 mr-1.5" /> Back to List
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 dark:bg-[#252525]/60 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-stone-200/50 dark:border-stone-800/50 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#e3f0e8] dark:bg-[#1a2822] rounded-full flex items-center justify-center text-[#4a8067] dark:text-[#6ccca2] text-2xl font-bold">
                            {student.fullName.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight">{student.fullName}</h1>
                            <p className="text-stone-500 dark:text-stone-400 font-medium">{student.branch}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <a href={`tel:${student.mobile}`} className="flex items-center gap-2 px-4 py-2 bg-stone-50 dark:bg-[#1a1c1a] border border-stone-200 dark:border-stone-800 rounded-xl text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shadow-sm">
                            <Phone className="w-4 h-4" /> Call Student
                        </a>
                        <button
                            onClick={handleDeleteStudent}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-500 dark:text-red-400 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4.5 h-4.5" />}
                            Delete
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#4a8067] text-white rounded-xl font-bold hover:bg-[#3b6652] transition-colors shadow-sm"
                        >
                            <Plus className="w-4.5 h-4.5" /> Add Session
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

                {/* Left Col: Info */}
                <div className="md:col-span-1 space-y-6">
                    {/* Contact Card */}
                    <div className="bg-white/60 dark:bg-[#252525]/60 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-stone-200/50 dark:border-stone-800/50 shadow-sm">
                        <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest mb-4 opacity-80">Contact Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 font-medium">
                                <div className="p-2 bg-stone-100 dark:bg-[#1f211f] rounded-xl">
                                    <Phone className="w-4 h-4 text-stone-500" />
                                </div>
                                <span>{student.mobile}</span>
                            </div>
                            <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 font-medium">
                                <div className="p-2 bg-stone-100 dark:bg-[#1f211f] rounded-xl">
                                    <Calendar className="w-4 h-4 text-stone-500" />
                                </div>
                                <span>Joined: {new Date(student.joinedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Family Context */}
                    <div className="bg-white/60 dark:bg-[#252525]/60 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-stone-200/50 dark:border-stone-800/50 shadow-sm">
                        <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest mb-4 opacity-80">Family Context</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Parent Name</label>
                                <p className="font-bold text-stone-800 dark:text-white text-lg mt-0.5">{student.parentName}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Occupation</label>
                                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 font-medium mt-1">
                                    <Briefcase className="w-4 h-4 text-stone-400" /> {student.parentOccupation}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Parent Mobile</label>
                                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 font-medium mt-1">
                                    <Phone className="w-4 h-4 text-stone-400" /> {student.parentMobile}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Timeline */}
                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">Session Timeline</h3>
                        <button
                            onClick={() => setSortNewestFirst(!sortNewestFirst)}
                            className="flex items-center gap-2 text-sm font-bold text-stone-500 dark:text-stone-400 hover:text-[#4a8067] dark:hover:text-[#6ccca2] transition-colors"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            {sortNewestFirst ? 'Newest First' : 'Oldest First'}
                        </button>
                    </div>

                    <div className="relative border-l-2 border-stone-100 dark:border-stone-800 ml-4 space-y-8 pb-8">
                        {sortedSessions.length === 0 && (
                            <div className="pl-8 text-stone-400 italic">No sessions recorded yet.</div>
                        )}

                        {sortedSessions.map((session) => (
                            <div key={session.id} className="relative pl-8">
                                {/* Dot */}
                                <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-white dark:bg-[#1a1c1a] border-4 border-[#4a8067] dark:border-[#6ccca2] shadow-sm"></div>

                                <div className="bg-white dark:bg-[#252525] p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="px-3 py-1 rounded-lg bg-[#e3f0e8] dark:bg-[#1a2822] text-[#4a8067] dark:text-[#6ccca2] text-xs font-bold border border-[#dbece4] dark:border-[#21382f]">
                                                {session.topic}
                                            </span>
                                        </div>
                                        <span className="text-xs font-medium text-stone-400 flex items-center bg-stone-50 dark:bg-stone-800/50 px-3 py-1.5 rounded-full">
                                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                                            {new Date(session.date).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Problems Identified</h4>
                                        <p className="text-stone-800 dark:text-stone-200 text-sm leading-relaxed">
                                            {session.problems}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Feedback & Next Steps</h4>
                                        <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                                            {session.feedback}
                                        </p>
                                    </div>

                                    {session.privateNote && (
                                        <div className="mt-4 bg-[#fff8e6] dark:bg-yellow-900/10 p-4 rounded-xl border border-[#ffeeba] dark:border-yellow-900/30 flex gap-3">
                                            <Lock className="w-4.5 h-4.5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-yellow-800 dark:text-yellow-500 uppercase tracking-wider mb-1">Private Note</p>
                                                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200/80 leading-relaxed">{session.privateNote}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center text-xs text-stone-400 font-medium">
                                        <span className="flex items-center gap-1.5">
                                            <UserIcon className="w-3.5 h-3.5" /> Staff
                                        </span>
                                        {session.attachmentUrl && (
                                            <span className="flex items-center gap-1.5 text-[#4a8067] dark:text-[#6ccca2] font-bold cursor-pointer hover:underline">
                                                <FileText className="w-3.5 h-3.5" /> Attachment
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {
                isModalOpen && (
                    <SessionModal
                        studentId={studentId}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveSession}
                    />
                )
            }
        </div >
    );
};
