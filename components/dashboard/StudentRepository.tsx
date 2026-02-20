import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { getStudents, deleteStudent } from '../../services/api';
import { Search, ChevronRight, Phone, BookOpen, ArrowUpDown, Loader2, Trash2 } from 'lucide-react';

interface StudentRepositoryProps {
    onSelectStudent: (studentId: string) => void;
}

type SortField = 'name' | 'branch' | 'date';

export const StudentRepository: React.FC<StudentRepositoryProps> = ({ onSelectStudent }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDesc, setSortDesc] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const fetchStudents = async () => {
        setLoading(true);
        const data = await getStudents();
        setStudents(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the student record for ${name}? This action cannot be undone and will delete all associated sessions.`)) {
            setIsDeleting(id);
            const success = await deleteStudent(id);
            if (success) {
                setStudents(students.filter(s => s.id !== id));
            } else {
                alert('Failed to delete student. Please try again.');
            }
            setIsDeleting(null);
        }
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDesc(!sortDesc);
        } else {
            setSortField(field);
            setSortDesc(false);
        }
    };

    const sortedStudents = [...students].sort((a, b) => {
        let valA, valB;

        switch (sortField) {
            case 'name':
                valA = a.fullName.toLowerCase();
                valB = b.fullName.toLowerCase();
                break;
            case 'branch':
                valA = (a.branch || '').toLowerCase();
                valB = (b.branch || '').toLowerCase();
                break;
            case 'date':
            default:
                valA = a.joinedAt;
                valB = b.joinedAt;
                break;
        }

        if (valA < valB) return sortDesc ? 1 : -1;
        if (valA > valB) return sortDesc ? -1 : 1;
        return 0;
    });

    const filteredStudents = sortedStudents.filter(s =>
        s.fullName.toLowerCase().includes(search.toLowerCase()) ||
        s.mobile.includes(search) ||
        (s.branch && s.branch.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 dark:bg-[#252525]/60 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-stone-200/50 dark:border-stone-800/50 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight">Student Records</h2>
                    <p className="text-stone-500 dark:text-stone-400 mt-1 font-medium">Access history and longitudinal data.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4.5 w-4.5 text-stone-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, phone, or branch..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 border border-stone-200 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-[#4a8067] focus:border-transparent outline-none text-sm font-medium bg-stone-50 dark:bg-[#1a1c1a] text-stone-900 dark:text-white transition-all shadow-inner"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-[#252525] border border-stone-200 shadow-sm dark:border-stone-800 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-stone-100 dark:divide-stone-800">
                        <thead className="bg-[#fbfbfa] dark:bg-[#1f211f]">
                            <tr>
                                <th
                                    className="px-6 py-4 text-left text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-1">
                                        Student Name
                                        <ArrowUpDown className="w-3 h-3 text-stone-400" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                    onClick={() => handleSort('branch')}
                                >
                                    <div className="flex items-center gap-1">
                                        Branch
                                        <ArrowUpDown className="w-3 h-3 text-stone-400" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Mobile</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Parent Info</th>
                                <th className="relative px-6 py-4"><span className="sr-only">View</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[#252525] divide-y divide-stone-100 dark:divide-stone-800">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-stone-500 dark:text-stone-400 font-medium">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        onClick={() => onSelectStudent(student.id)}
                                        className="hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-[#e3f0e8] dark:bg-[#1a2822] rounded-full flex items-center justify-center text-[#4a8067] dark:text-[#6ccca2] font-bold">
                                                    {student.fullName.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-stone-900 dark:text-white tracking-tight">{student.fullName}</div>
                                                    <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Joined {new Date(student.joinedAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm font-medium text-stone-600 dark:text-stone-300">
                                                <BookOpen className="w-4.5 h-4.5 mr-2 text-stone-400" />
                                                {student.branch}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm font-medium text-stone-600 dark:text-stone-300">
                                                <Phone className="w-4.5 h-4.5 mr-2 text-stone-400" />
                                                {student.mobile}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-stone-900 dark:text-white tracking-tight">{student.parentName}</div>
                                            <div className="text-xs text-stone-500 dark:text-stone-400 font-medium opacity-90">{student.parentOccupation}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                <button
                                                    onClick={(e) => handleDelete(e, student.id, student.fullName)}
                                                    disabled={isDeleting === student.id}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-xl transition-colors disabled:opacity-50"
                                                    title="Delete Student"
                                                >
                                                    {isDeleting === student.id ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                                <button className="p-2 text-[#4a8067] hover:text-[#3b6652] dark:text-[#6ccca2] dark:hover:text-[#8cebc1] hover:bg-[#e8f3ee] dark:hover:bg-[#1f3a2e] rounded-xl transition-colors">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};