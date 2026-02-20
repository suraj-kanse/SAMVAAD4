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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Student Records</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Access history and longitudinal data.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, phone, or branch..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-950/50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-1">
                                        Student Name
                                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    onClick={() => handleSort('branch')}
                                >
                                    <div className="flex items-center gap-1">
                                        Branch
                                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mobile</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Parent Info</th>
                                <th className="relative px-6 py-3"><span className="sr-only">View</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        onClick={() => onSelectStudent(student.id)}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-teal-100 dark:bg-teal-900/40 rounded-full flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold">
                                                    {student.fullName.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{student.fullName}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Joined {new Date(student.joinedAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                                <BookOpen className="w-4 h-4 mr-2 text-slate-400" />
                                                {student.branch}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                                <Phone className="w-4 h-4 mr-2 text-slate-400" />
                                                {student.mobile}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900 dark:text-white">{student.parentName}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{student.parentOccupation}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                <button
                                                    onClick={(e) => handleDelete(e, student.id, student.fullName)}
                                                    disabled={isDeleting === student.id}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete Student"
                                                >
                                                    {isDeleting === student.id ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                                <button className="p-2 text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 rounded-lg transition-colors">
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