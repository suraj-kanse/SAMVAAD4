import React from 'react';
import { Quote } from 'lucide-react';

const STORIES = [
  {
    text: "I always thought counseling was only for 'big' problems. But talking about my exam anxiety helped me realize I was just burning out. I sleep so much better now.",
    tag: "Third Year Student",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
  },
  {
    text: "I was terrified that my teachers would find out. The counselor assured me it was private, and she kept her word. It's the one place I can be completely honest.",
    tag: "Computer Engg. Student",
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
  },
  {
    text: "Homesickness hit me hard in the first semester. I almost quit. Just having someone listen without telling me to 'toughen up' made all the difference.",
    tag: "First Year Student",
    color: "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <div className="py-24 px-4 bg-white dark:bg-[#1f201f] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <div className="md:w-1/3">
            <h2 className="text-4xl font-bold text-stone-900 dark:text-white mb-6 leading-tight">
              Real stories from <br />
              <span className="text-[#cc6b3e]">students like you</span>
            </h2>
            <p className="text-lg text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
              Asking for help isn't a sign of weakness. It's a step towards clarity. Here is what your peers have to say about their experience.
            </p>
            <div className="hidden md:block w-16 h-1 bg-[#cc6b3e] rounded-full"></div>
          </div>

          <div className="md:w-2/3 grid gap-6">
            {STORIES.map((story, idx) => (
              <div key={idx} className="bg-stone-50 dark:bg-[#252525] p-6 md:p-8 rounded-2xl border border-stone-100 dark:border-stone-800 relative hover:shadow-md transition-shadow">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-stone-200 dark:text-stone-700/50" />
                <p className="text-stone-700 dark:text-stone-300 text-lg leading-relaxed mb-6 italic relative z-10">
                  "{story.text}"
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${story.color}`}>
                  {story.tag}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};