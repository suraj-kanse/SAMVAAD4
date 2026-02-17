import React, { useState } from 'react';
import { X, Lightbulb, HelpCircle, MessageCircle } from 'lucide-react';

interface Problem {
  id: string;
  text: string;
  description: string;
  solution: string;
}

const PROBLEMS: Problem[] = [
  {
    id: '1',
    text: "Overthinking",
    description: "Caught in a loop of 'what ifs' and worst-case scenarios? Overthinking paralyzes action and drains your mental energy on things that haven't happened yet.",
    solution: "Practice 'worry time'—set aside 15 mins a day to worry, then stop. Focus on what you can control right now, not the uncertain future."
  },
  {
    id: '2',
    text: "Academic Pressure",
    description: "The weight of grades, assignments, and expectations can feel crushing. It's easy to tie your self-worth to your performance.",
    solution: "Break tasks into tiny, manageable steps. Remember, one exam or assignment doesn't define your entire future. Progress > Perfection."
  },
  {
    id: '3',
    text: "Stress & Anxiety",
    description: "Feeling constantly on edge, racing heart, or unable to relax. Stress is your body's alarm system stuck in the 'on' position.",
    solution: "Reset your nervous system with deep breathing (4-7-8 technique), physical movement, or talking to a counselor to identify triggers."
  },
  {
    id: '4',
    text: "Behavioural Issues",
    description: "Finding yourself reacting aggressively, withdrawing, or acting out of character? These are often defenses against deeper feelings.",
    solution: "Pause before reacting. Ask yourself: 'What am I actually feeling?' (Hurt? Fear?). Understanding the emotion helps change the reaction."
  },
  {
    id: '5',
    text: "Addiction",
    description: "Whether it's substances, gaming, or habits that feel out of control. It often starts as an escape but becomes a trap.",
    solution: "Acknowledge the pattern. You don't have to quit alone. Professional support and peer groups are powerful tools for reclaiming control."
  },
  {
    id: '6',
    text: "Gadget Dependancy",
    description: "Can't look away from the screen? Doom-scrolling and constant connectivity can increase anxiety and disturb sleep.",
    solution: "Create 'tech-free zones' (like the bedroom). Replace screen time with offline hobbies. Reconnect with the real world, one hour at a time."
  },
  {
    id: '7',
    text: "Social Adjustment",
    description: "Feeling like you don't fit in, struggling to make friends, or navigating complex peer dynamics in college.",
    solution: "Be patient with yourself. Real connections take time. Join clubs or groups around your interests to meet like-minded people naturally."
  },
  {
    id: '8',
    text: "Self Harm",
    description: "When emotional pain feels too big, physical pain can seem like a release. But it's a temporary fix that leaves lasting scars.",
    solution: "Reach out immediately. You are not broken; you are in pain. There are safer ways to cope with intense emotions. We are here to help you find them."
  },
  {
    id: '9',
    text: "Personal Issues",
    description: "Family conflict, identity crisis, or relationship breakups. Personal life struggles inevitably bleed into academic life.",
    solution: "Compartmentalize when needed, but don't ignore them. Give yourself space to grieve or process. Your personal well-being comes first."
  },
  {
    id: '10',
    text: "Other Struggles",
    description: "Facing something not listed here? Grief, trauma, financial stress, or just feeling 'off' without a name for it.",
    solution: "Your struggle is valid, even if it doesn't have a label. The counselling centre is a safe space for *anything* that's on your mind."
  }
];

const ROW_1 = PROBLEMS.slice(0, 5);
const ROW_2 = PROBLEMS.slice(5, 10);

// Extract Bubble component to avoid recreating it on every render and fix key prop issues
const Bubble: React.FC<{ item: Problem; onSelect: (p: Problem) => void }> = ({ item, onSelect }) => (
  <button
    onClick={() => onSelect(item)}
    className="flex-shrink-0 px-8 py-5 rounded-[2rem] bg-stone-50 dark:bg-[#252525] border border-stone-200 dark:border-stone-700/50 shadow-sm text-stone-600 dark:text-stone-300 text-lg font-medium hover:scale-105 hover:shadow-md hover:border-[#4a8067] dark:hover:border-[#6ccca2] hover:bg-white dark:hover:bg-[#2a2d2a] transition-all duration-300 text-left cursor-pointer outline-none focus:ring-2 focus:ring-[#4a8067] focus:ring-offset-2 dark:focus:ring-offset-[#1a1c1a]"
  >
    "{item.text}"
  </button>
);

export const MarqueeWall: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  return (
    <>
      <div className="w-full bg-white dark:bg-[#1a1c1a] py-16 border-y border-stone-100 dark:border-stone-800 relative overflow-hidden flex flex-col gap-6">
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-[#1a1c1a] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-[#1a1c1a] to-transparent z-10 pointer-events-none"></div>

        {/* Row 1 */}
        <div className="flex overflow-hidden group">
          <div className="flex gap-6 animate-marquee shrink-0 items-center pr-6 group-hover:[animation-play-state:paused]">
            {ROW_1.map((item) => (
              <Bubble key={item.id} item={item} onSelect={setSelectedProblem} />
            ))}
          </div>
          <div className="flex gap-6 animate-marquee shrink-0 items-center pr-6 group-hover:[animation-play-state:paused]">
            {ROW_1.map((item) => (
              <Bubble key={`dup-${item.id}`} item={item} onSelect={setSelectedProblem} />
            ))}
          </div>
        </div>

        {/* Row 2 - Slower/Staggered */}
        <div className="flex overflow-hidden group">
          <div className="flex gap-6 animate-marquee-slow shrink-0 items-center pr-6 group-hover:[animation-play-state:paused]">
            {ROW_2.map((item) => (
              <Bubble key={item.id} item={item} onSelect={setSelectedProblem} />
            ))}
          </div>
          <div className="flex gap-6 animate-marquee-slow shrink-0 items-center pr-6 group-hover:[animation-play-state:paused]">
            {ROW_2.map((item) => (
              <Bubble key={`dup-${item.id}`} item={item} onSelect={setSelectedProblem} />
            ))}
          </div>
        </div>
      </div>

      {/* Answer Modal */}
      {selectedProblem && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedProblem(null)}
        >
          <div
            className="bg-white dark:bg-[#252525] w-full max-w-lg rounded-3xl p-8 relative shadow-2xl border border-stone-100 dark:border-stone-800 transform transition-all scale-100 opacity-100"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProblem(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 bg-stone-100 dark:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
                <HelpCircle className="w-3 h-3" /> Common Question
              </div>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-white leading-tight">
                "{selectedProblem.text}"
              </h3>
            </div>

            <div className="space-y-6">
              <div className="bg-stone-50 dark:bg-[#1a1c1a] p-5 rounded-2xl border border-stone-100 dark:border-stone-800">
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-sm">
                  {selectedProblem.description}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-[#4a8067] dark:text-[#6ccca2] font-bold">
                  <Lightbulb className="w-5 h-5" />
                  <span>Suggestion</span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-lg">
                  {selectedProblem.solution}
                </p>

                <div className="mt-8">
                  <a
                    href={`https://wa.me/918698801090?text=${encodeURIComponent(`Hello, I would like to speak with a student counsellor about: ${selectedProblem.text}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 bg-[#cc6b3e] hover:bg-[#b55d34] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                  >
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Talk to Counselor about this
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};