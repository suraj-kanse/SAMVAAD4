import React from 'react';
import { Quote } from 'lucide-react';

const STORIES = [
  {
    text: "I always thought counselling was only for 'big' problems. But talking about my exam anxiety helped me realize I was just burning out. I sleep so much better now.",
    tag: "Third Year Student",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
  },
  {
    text: "I was terrified that my teachers would find out. The counsellor assured me it was private, and she kept her word. It's the one place I can be completely honest.",
    tag: "Computer Engg. Student",
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
  },
  {
    text: "Homesickness hit me hard in the first semester. I almost quit. Just having someone listen without telling me to 'toughen up' made all the difference.",
    tag: "First Year Student",
    color: "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
  },
  {
    text: "I kept everything bottled up for months. One session and I felt lighter than I had in a year. I wish I had reached out sooner.",
    tag: "Final Year Student",
    color: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
  },
  {
    text: "The counsellor didn't give me solutions. She helped me find my own. That's what made the difference — I felt empowered, not dependent.",
    tag: "Second Year Student",
    color: "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300"
  },
  {
    text: "I thought asking for help would make me look weak. Turns out, it was the bravest thing I ever did. My grades and my friendships are both better now.",
    tag: "E&TC Student",
    color: "bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300"
  }
];

const TestimonialCard: React.FC<{ story: typeof STORIES[0] }> = ({ story }) => (
  <div className="flex-shrink-0 w-[320px] md:w-[380px] bg-stone-50 dark:bg-[#252525] p-6 md:p-8 rounded-2xl border border-stone-100 dark:border-stone-800 relative hover:shadow-md transition-shadow">
    <Quote className="absolute top-5 right-5 w-7 h-7 text-stone-200 dark:text-stone-700/50" />
    <p className="text-stone-700 dark:text-stone-300 text-base leading-relaxed mb-5 italic relative z-10">
      "{story.text}"
    </p>
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${story.color}`}>
      {story.tag}
    </span>
  </div>
);

export const Testimonials: React.FC = () => {
  return (
    <div className="py-20 md:py-24 px-4 bg-white dark:bg-[#1f201f] transition-colors duration-300 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Mobile: Stacked layout */}
        <div className="md:hidden">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-4 leading-tight">
              Real stories from <br />
              <span className="text-[#cc6b3e]">students like you</span>
            </h2>
            <p className="text-base text-stone-500 dark:text-stone-400 leading-relaxed">
              Asking for help isn't a sign of weakness. It's a step towards clarity. Here is what your peers have to say about their experience.
            </p>
          </div>

          {/* Horizontal marquee on mobile */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white dark:from-[#1f201f] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white dark:from-[#1f201f] to-transparent z-10 pointer-events-none"></div>
            <div className="flex overflow-hidden group">
              <div className="flex gap-4 animate-marquee shrink-0 items-stretch pr-4 group-hover:[animation-play-state:paused]">
                {STORIES.map((story, idx) => (
                  <TestimonialCard key={idx} story={story} />
                ))}
              </div>
              <div className="flex gap-4 animate-marquee shrink-0 items-stretch pr-4 group-hover:[animation-play-state:paused]">
                {STORIES.map((story, idx) => (
                  <TestimonialCard key={`dup-${idx}`} story={story} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Side-by-side layout with vertical marquee */}
        <div className="hidden md:flex flex-row gap-12 items-start">

          {/* Left: Static text */}
          <div className="w-2/5 sticky top-32 pt-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 dark:text-white mb-6 leading-tight">
              Real stories from <br />
              <span className="text-[#cc6b3e]">students like you</span>
            </h2>
            <p className="text-lg text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
              Asking for help isn't a sign of weakness. It's a step towards clarity. Here is what your peers have to say about their experience.
            </p>
            <div className="w-16 h-1 bg-[#cc6b3e] rounded-full"></div>
          </div>

          {/* Right: Vertical marquee */}
          <div className="w-3/5 relative h-[480px] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white dark:from-[#1f201f] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white dark:from-[#1f201f] to-transparent z-10 pointer-events-none"></div>

            <div className="flex flex-col overflow-hidden h-full group">
              <div className="flex flex-col gap-5 animate-marquee-vertical shrink-0 pb-5 group-hover:[animation-play-state:paused]">
                {STORIES.map((story, idx) => (
                  <div key={idx} className="bg-stone-50 dark:bg-[#252525] p-7 rounded-2xl border border-stone-100 dark:border-stone-800 relative hover:shadow-md transition-shadow">
                    <Quote className="absolute top-6 right-6 w-7 h-7 text-stone-200 dark:text-stone-700/50" />
                    <p className="text-stone-700 dark:text-stone-300 text-lg leading-relaxed mb-5 italic relative z-10">
                      "{story.text}"
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${story.color}`}>
                      {story.tag}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-5 animate-marquee-vertical shrink-0 pb-5 group-hover:[animation-play-state:paused]">
                {STORIES.map((story, idx) => (
                  <div key={`dup-${idx}`} className="bg-stone-50 dark:bg-[#252525] p-7 rounded-2xl border border-stone-100 dark:border-stone-800 relative hover:shadow-md transition-shadow">
                    <Quote className="absolute top-6 right-6 w-7 h-7 text-stone-200 dark:text-stone-700/50" />
                    <p className="text-stone-700 dark:text-stone-300 text-lg leading-relaxed mb-5 italic relative z-10">
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

      </div>
    </div>
  );
};