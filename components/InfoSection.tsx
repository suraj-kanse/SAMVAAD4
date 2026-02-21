import React from 'react';
import { Shield, FileX, Lock, Heart } from 'lucide-react';

const FEATURES = [
  {
    icon: Lock,
    title: "Completely Confidential",
    desc: "Everything you share stays between you and the counsellor."
  },
  {
    icon: FileX,
    title: "Off the Records",
    desc: "Nothing goes in your academic file. This is separate from studies."
  },
  {
    icon: Shield,
    title: "Safe Space",
    desc: "No judgment, no pressure. Just a safe place to talk."
  },
  {
    icon: Heart,
    title: "Always Free",
    desc: "Counselling is free for all students and staff. No hidden costs."
  }
];

export const InfoSection: React.FC = () => {
  return (
    <div className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-white mb-6">
            Your privacy matters to us
          </h2>
          <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            We understand that reaching out takes courage. Here's our promise to you.
          </p>
        </div>

        {/* Updated grid: grid-cols-2 on mobile (default), md:grid-cols-2, lg:grid-cols-4 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {FEATURES.map((feat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#252525] p-6 md:p-8 rounded-3xl md:rounded-[2rem] shadow-sm border border-stone-100 dark:border-stone-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 mb-4 md:mb-6">
                <feat.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-stone-800 dark:text-white mb-2 md:mb-3 leading-tight">{feat.title}</h3>
              <p className="text-sm md:text-base text-stone-500 dark:text-stone-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};