import React, { useState } from 'react';
import { X, Upload, Loader2, Save } from 'lucide-react';
import { Session } from '../../types';

interface SessionModalProps {
  studentId: string;
  counselorId: string;
  counselorName: string;
  onClose: () => void;
  onSave: (session: Session) => Promise<void>;
}

const TOPICS = ["Exam Stress", "Family Issues", "Relationship", "Career Anxiety", "Depression", "Homesickness", "Substance Abuse", "Other"];

export const SessionModal: React.FC<SessionModalProps> = ({ studentId, counselorId, counselorName, onClose, onSave }) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [privateNote, setPrivateNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newSession: Session = {
      id: '', // Backend will generate ID
      studentId,
      counselorId,
      counselorName,
      topics: selectedTopics,
      reason,
      description,
      privateNote,
      date: Date.now()
    };

    await onSave(newSession);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Log New Session</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Topics */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Topics Discussed</label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(topic => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    selectedTopics.includes(topic)
                      ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-teal-200 dark:hover:border-teal-700'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason for Consulting</label>
            <input 
              type="text" 
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="e.g. Panic attack before internals"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Description</label>
            <textarea 
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="Record the student's concerns, demeanor, and key discussion points..."
            />
          </div>

          {/* Private Note */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Private Note <span className="text-slate-400 font-normal">(Only visible to counselors)</span>
            </label>
            <textarea 
              rows={2}
              value={privateNote}
              onChange={(e) => setPrivateNote(e.target.value)}
              className="w-full px-3 py-2 border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none resize-none text-slate-900 dark:text-white"
              placeholder="Internal observations, red flags, or follow-up reminders..."
            />
          </div>

          {/* Attachment (Mock) */}
          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Attachments</label>
             <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Click to upload handwritten notes or PDFs</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">(Feature simulated for prototype)</p>
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
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Session Record</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};