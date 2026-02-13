import React, { useState } from 'react';
import { X, Loader2, Save, User, Phone, Briefcase, GraduationCap } from 'lucide-react';
import { Student } from '../../types';

interface CreateStudentModalProps {
  initialPhone: string;
  initialName?: string;
  onClose: () => void;
  onSave: (student: Student) => Promise<void>;
}

export const CreateStudentModal: React.FC<CreateStudentModalProps> = ({ initialPhone, initialName, onClose, onSave }) => {
  const [fullName, setFullName] = useState(initialName || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [branch, setBranch] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [parentOccupation, setParentOccupation] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ID will be assigned by MongoDB
    const newStudent: Student = {
      id: '', 
      fullName,
      mobile: phone,
      branch,
      parentName,
      parentMobile,
      parentOccupation,
      joinedAt: Date.now()
    };

    await onSave(newStudent);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Student Profile</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Create a permanent record from this request.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="space-y-4">
              <h3 className="text-sm font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4" /> Student Details
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Branch / Class</label>
                    <div className="relative">
                        <GraduationCap className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input 
                        type="text" 
                        required
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="e.g. Computer Engineering (TE)"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                    </div>
                  </div>
              </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
             <h3 className="text-sm font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Parent / Guardian Info
              </h3>
              <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Parent Name</label>
                    <input 
                      type="text" 
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Parent Mobile</label>
                            <input 
                            type="tel" 
                            required
                            value={parentMobile}
                            onChange={(e) => setParentMobile(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Occupation</label>
                            <input 
                            type="text" 
                            required
                            value={parentOccupation}
                            onChange={(e) => setParentOccupation(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>
                   </div>
              </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Create Record</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};