import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, Smartphone, User, Building2, MessageCircle } from 'lucide-react';
import { saveRequest } from '../services/mockDb';

// Use relative URLs so it works on both local dev and deployment
const BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

export const ContactForm: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [gender, setGender] = useState('');
  const [issue, setIssue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for exactly 10 digits (ignoring non-digit characters like spaces)
  const digitsOnly = phone.replace(/\D/g, '');
  const isPhoneValid = digitsOnly.length === 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPhoneValid) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Log request to mock DB (non-blocking — don't fail if DB is down)
      saveRequest(phone, name, department, gender, issue).catch((err) => {
        console.warn('DB save failed (non-critical):', err.message);
      });

      // 2. Send details to Counselor via Backend API
      const response = await fetch(`${BASE_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, name, department, gender, issue }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // 3. Show Success Message (No Redirect)
      setIsSuccess(true);
      setPhone('');
      setName('');
      setDepartment('');
      setGender('');
      setIssue('');
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-[#252525] p-8 md:p-10 flex flex-col items-center justify-center text-center animate-fade-in transition-colors duration-300 min-h-[300px]">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-teal-50 dark:bg-teal-900/50 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-teal-900 dark:text-teal-100 mb-3">Thank you</h3>
        <p className="text-stone-600 dark:text-stone-300 mb-8 max-w-xs mx-auto leading-relaxed">
          We will surely contact you As soon as Possible.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-800 dark:hover:text-teal-200 hover:underline transition-colors"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#252525] p-6 md:p-8 transition-colors duration-300">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-stone-800 dark:text-white mb-2">Drop Your Details Here</h3>
        <p className="text-stone-500 dark:text-stone-400">
          We'll reach out to you directly. No filling out long forms.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Phone Number — MANDATORY */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Smartphone className="h-5 w-5 text-stone-400" />
            </div>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 43210"
              className="block w-full pl-10 pr-3 py-3.5 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-stone-50 dark:bg-[#1a1c1a] focus:bg-white dark:focus:bg-[#2a2d2a] text-stone-900 dark:text-white placeholder-stone-400"
            />
          </div>
        </div>

        {/* Name — Optional */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            Name <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-stone-400" />
            </div>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nickname is fine"
              className="block w-full pl-10 pr-3 py-3.5 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-stone-50 dark:bg-[#1a1c1a] focus:bg-white dark:focus:bg-[#2a2d2a] text-stone-900 dark:text-white placeholder-stone-400"
            />
          </div>
        </div>

        {/* Department — Optional */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            Department <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-stone-400" />
            </div>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Keep empty if rather not say"
              className="block w-full pl-10 pr-3 py-3.5 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-stone-50 dark:bg-[#1a1c1a] focus:bg-white dark:focus:bg-[#2a2d2a] text-stone-900 dark:text-white placeholder-stone-400"
            />
          </div>
        </div>

        {/* Gender — Optional */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            Gender <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="block w-full px-3 py-3.5 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-stone-50 dark:bg-[#1a1c1a] focus:bg-white dark:focus:bg-[#2a2d2a] text-stone-900 dark:text-white appearance-none cursor-pointer"
          >
            <option value="">Rather not say</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Issue/Concern — Optional */}
        <div>
          <label htmlFor="issue" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            Your Concern <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-0 pl-3 flex items-start pointer-events-none">
              <MessageCircle className="h-5 w-5 text-stone-400" />
            </div>
            <textarea
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Briefly describe what you're going through..."
              rows={3}
              maxLength={300}
              className="block w-full pl-10 pr-3 py-3.5 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-stone-50 dark:bg-[#1a1c1a] focus:bg-white dark:focus:bg-[#2a2d2a] text-stone-900 dark:text-white placeholder-stone-400 resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isPhoneValid}
          className={`relative overflow-hidden w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white font-semibold text-lg transition-all disabled:cursor-not-allowed group ${isPhoneValid
            ? 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-600 hover:-translate-y-0.5'
            : 'bg-stone-400 dark:bg-stone-600 cursor-not-allowed opacity-70'
            }`}
        >
          {isPhoneValid && (
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></span>
          )}
          {isSubmitting ? (
            <div className="relative z-10 flex items-center">
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Sending...
            </div>
          ) : (
            <div className="relative z-10 flex items-center">
              Drop Your Details Here <Send className="ml-2 h-4 w-4" />
            </div>
          )}
        </button>
      </form>
    </div>
  );
};