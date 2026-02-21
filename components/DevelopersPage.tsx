import React from 'react';
import { ArrowLeft, Github, Linkedin, Terminal } from 'lucide-react';

interface DevelopersPageProps {
  onBack: () => void;
}

const DEVS = [
  {
    name: "Soham Parikh",
    role: "Full Stack Engineer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Soham&backgroundColor=b6e3f4",
    bio: "Passionate about building scalable web applications and solving real-world problems through code."
  },
  // {
  //   name: "Aditi Rao",
  //   role: "UI/UX Designer",
  //   image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditi&backgroundColor=c0aede",
  //   bio: "Believes that great design is invisible. Focused on creating intuitive and accessible user experiences."
  // },
  // {
  //   name: "Rahul Verma",
  //   role: "Backend Developer",
  //   image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul&backgroundColor=ffdfbf",
  //   bio: "Ensuring the system runs smoothly and securely. Loves optimizing database queries and API performance."
  // }
];

export const DevelopersPage: React.FC<DevelopersPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </button>

        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-2xl mb-6">
            <Terminal className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Meet the Builders</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            The minds behind the Student Counselling platform. We are a group of students dedicated to making mental health support accessible to everyone on campus through technology.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {DEVS.map((dev, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center hover:shadow-lg dark:hover:shadow-slate-900/50 hover:-translate-y-1 transition-all duration-300">
              <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 mb-6 overflow-hidden border-4 border-white dark:border-slate-800 shadow-sm">
                <img src={dev.image} alt={dev.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{dev.name}</h3>
              <span className="inline-block px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium text-xs mb-4">
                {dev.role}
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                {dev.bio}
              </p>
              <div className="flex gap-4 mt-auto">
                <button className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                  <Github className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center border-t border-slate-200 dark:border-slate-800 pt-8">
          <p className="text-slate-400 dark:text-slate-600">Built with React, TypeScript & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};