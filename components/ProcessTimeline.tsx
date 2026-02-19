import React from 'react';
import { MessageSquare, Calendar, Coffee, Sun } from 'lucide-react';

const STEPS = [
  {
    icon: MessageSquare,
    title: "1. Reach Out",
    desc: "Drop your details here. Takes 30 seconds."
  },
  {
    icon: Calendar,
    title: "2. We Coordinate",
    desc: "We'll message on WhatsApp to find a time."
  },
  {
    icon: Coffee,
    title: "3. We Chat",
    desc: "Private space. No judgment, just support."
  },
  {
    icon: Sun,
    title: "4. Feel Lighter",
    desc: "Walk away with a clearer mind and a plan."
  }
];

export const ProcessTimeline: React.FC = () => {
  return (
    <div className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-6">How it works</h2>
          <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            We've stripped away the complexity. Getting help is simple, transparent, and human.
          </p>
        </div>

        {/* Updated grid: grid-cols-2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-stone-100 dark:bg-stone-800 -z-10"></div>

          {STEPS.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-3xl bg-white dark:bg-[#1f201f] border-4 border-stone-50 dark:border-stone-800 flex items-center justify-center mb-4 md:mb-6 shadow-sm group-hover:-translate-y-2 transition-transform duration-300 relative z-10">
                <step.icon className="w-6 h-6 md:w-8 md:h-8 text-[#4a8067] dark:text-[#6ccca2]" strokeWidth={1.5} />
                <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center font-bold text-xs md:text-sm border-4 border-white dark:border-[#1f201f]">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-stone-900 dark:text-white mb-2 md:mb-3">{step.title}</h3>
              <p className="text-sm md:text-base text-stone-500 dark:text-stone-400 leading-relaxed max-w-[240px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};