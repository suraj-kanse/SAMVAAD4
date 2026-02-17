import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, Smartphone, User } from 'lucide-react';
import { saveRequest } from '../services/mockDb';

export const ContactForm: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Log request to mock DB (keep existing logic)
      await saveRequest(phone, name);

      // 2. Send details to Counselor via Backend API
      const response = await fetch('http://localhost:5000/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, name }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // 3. Show Success Message (No Redirect)
      setIsSuccess(true);
      setPhone('');
      setName('');
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
        <h3 className="text-2xl font-bold text-stone-800 dark:text-white mb-2">Share your contact</h3>
        <p className="text-stone-500 dark:text-stone-400">
          We'll reach out to you directly. No filling out long forms.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="relative overflow-hidden w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white bg-stone-900 dark:bg-brand-green hover:bg-stone-800 dark:hover:bg-brand-greenHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 font-semibold text-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></span>
          {isSubmitting ? (
            <div className="relative z-10 flex items-center">
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Sending...
            </div>
          ) : (
            <div className="relative z-10 flex items-center">
              Connect with us <Send className="ml-2 h-4 w-4" />
            </div>
          )}
        </button>
      </form>
    </div>
  );
};