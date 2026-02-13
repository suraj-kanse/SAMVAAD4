import React from 'react';
import { BookOpen, Compass, Users, Moon, Brain, Heart, Sparkles } from 'lucide-react';

const FEELINGS = [
  {
    icon: BookOpen,
    title: "Exam stress",
    desc: "Overwhelmed by pressure?"
  },
  {
    icon: Compass,
    title: "Career confusion",
    desc: "Unsure about your path?"
  },
  {
    icon: Users,
    title: "Feeling isolated",
    desc: "Struggling to connect?"
  },
  {
    icon: Moon,
    title: "Exhaustion",
    desc: "Can't sleep or sleeping too much?"
  },
  {
    icon: Brain,
    title: "Motivation",
    desc: "Lost interest in things?"
  },
  {
    icon: Heart,
    title: "Relationships",
    desc: "Family or friend issues?"
  }
];

export const FeelingsSection: React.FC = () => {
  return (
    <div className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12 md:mb-20">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#fdf2ea] dark:bg-[#382e25] text-[#cc6b3e] dark:text-[#e08c68] text-sm font-semibold mb-8 border border-[#fae4d3] dark:border-[#524236]">
          <Sparkles className="w-4 h-4" />
          <span>You're not alone in this</span>
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-50 mb-6 tracking-tight leading-[1.1]">
          Many students <br className="hidden md:block" /> experience these feelings
        </h2>
        <p className="text-lg md:text-xl text-stone-500 dark:text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
          These are some of the things students commonly talk about. Whatever you're going through, we're here to help.
        </p>
      </div>

      {/* Updated grid: grid-cols-2 on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {FEELINGS.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-[#23211f] p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-lg dark:shadow-none hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#e3f0e8] dark:bg-[#1a382e] flex items-center justify-center mb-4 md:mb-8 group-hover:scale-110 transition-transform duration-300">
              <item.icon className="w-5 h-5 md:w-6 md:h-6 text-[#2d5f48] dark:text-[#6ccca2]" strokeWidth={2} />
            </div>
            <h3 className="text-lg md:text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2 md:mb-4 tracking-tight leading-tight">{item.title}</h3>
            <p className="text-sm md:text-base text-stone-500 dark:text-stone-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};