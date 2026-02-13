import React, { useState } from 'react';
import { X, Lightbulb, HelpCircle } from 'lucide-react';

interface Problem {
  id: string;
  text: string;
  description: string;
  solution: string;
}

const PROBLEMS: Problem[] = [
  { 
    id: '1', 
    text: "Why do I feel so anxious?",
    description: "Anxiety is your body's natural response to stress. It can feel like a racing heart, constant worry, or a pit in your stomach, often triggered by fear of the unknown or high expectations.",
    solution: "Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste. This helps bring your focus back to the present moment."
  },
  { 
    id: '2', 
    text: "I can't focus on my studies.",
    description: "Loss of focus is often a sign of burnout or emotional clutter, not laziness. When your mind is preoccupied with worry, it has less capacity for learning.",
    solution: "Break your study time into small chunks using the Pomodoro technique (25 minutes focus, 5 minutes break). Be kind to yourself—progress is better than perfection."
  },
  { 
    id: '3', 
    text: "Am I good enough?",
    description: "Imposter syndrome affects almost everyone. You might feel like a fraud or that you don't belong, especially in a competitive environment.",
    solution: "Remind yourself that you earned your place here. Your worth is not defined by grades or achievements. Celebrate your small wins and remember that growth takes time."
  },
  { 
    id: '4', 
    text: "I feel overwhelmed by exams.",
    description: "Exam pressure can trigger a 'fight or flight' response. It feels like a mountain you can't climb, leading to procrastination or panic.",
    solution: "Create a realistic schedule. Focus on one topic at a time. Remember, exams measure memory at a specific time, not your intelligence or future success."
  },
  { 
    id: '5', 
    text: "Why am I always tired?",
    description: "Chronic fatigue is often emotional, not just physical. Carrying the weight of unexpressed feelings or constant stress drains your energy battery.",
    solution: "Prioritize sleep hygiene, but also 'emotional rest'. Take breaks from social media, spend time in nature, or do nothing for a while without guilt."
  },
  { 
    id: '6', 
    text: "I just need someone to listen.",
    description: "Sometimes we don't need advice or solutions; we just need to feel heard and validated. Keeping things bottled up increases the pressure.",
    solution: "Reach out to a friend, family member, or a counselor. Speaking your thoughts out loud can often clarify your feelings and lift the weight off your shoulders."
  },
  { 
    id: '7', 
    text: "Is it normal to feel lonely?",
    description: "Yes, even in a crowded college, loneliness is common. It happens when we feel disconnected or misunderstood by those around us.",
    solution: "Focus on deepening one or two connections rather than trying to be popular. Vulnerability builds connection—share how you feel with someone you trust."
  },
  { 
    id: '8', 
    text: "I miss my home.",
    description: "Homesickness is grieving the loss of familiarity and comfort. It's a sign that you have strong bonds and happy memories.",
    solution: "Create a routine that includes things you love from home (food, music). Call your family, but also actively engage in campus life to build a new 'home away from home'."
  },
  { 
    id: '9', 
    text: "Everyone else seems to have it figured out.",
    description: "This is the 'highlight reel' effect. People show their success, not their struggles. You are comparing your insides to everyone else's outsides.",
    solution: "Focus on your own journey. Everyone is fighting their own battles. It's okay to be a work in progress."
  },
  { 
    id: '10', 
    text: "Is my stress valid?",
    description: "We often minimize our pain by thinking 'others have it worse'. But pain is not a competition. If it hurts you, it matters.",
    solution: "Validate your own feelings. You don't need to earn the right to struggle. Acknowledging your stress is the first step to managing it."
  },
  { 
    id: '11', 
    text: "Can I actually get better?",
    description: "Depression or anxiety can lie to you, making you feel like this state is permanent. But mental health is dynamic and changeable.",
    solution: "Yes. Neuroplasticity means your brain can heal and change. With support, time, and small steps, things do get better. Trust the process."
  },
  { 
    id: '12', 
    text: "I don't know who to talk to.",
    description: "Confusion about where to turn is a major barrier to help. You might fear burdening friends or being judged.",
    solution: "That's exactly why we exist. It's a safe, neutral, and confidential space to start. You don't need to have a 'big problem' to reach out."
  },
  { 
    id: '13', 
    text: "Pressure from parents is too much.",
    description: "Parental expectations often come from love but can feel suffocating. It can make you feel like your loveability depends on your performance.",
    solution: "Try to communicate your feelings calmly, or speak to a counselor to learn strategies for setting healthy boundaries while maintaining relationships."
  },
  { 
    id: '14', 
    text: "I feel stuck in my career.",
    description: "Fear of choosing the wrong path or falling behind peers causes 'analysis paralysis'.",
    solution: "Action cures fear. Take small steps—an internship, a project, or learning a skill. You can always pivot later; no decision is final."
  },
  { 
    id: '15', 
    text: "I'm scared of failing.",
    description: "Fear of failure is often fear of shame. It keeps you in your comfort zone where you can't grow.",
    solution: "Redefine failure as data. It tells you what didn't work. Every expert was once a beginner. Be kind to yourself when you stumble."
  },
  { 
    id: '16', 
    text: "My sleep cycle is ruined.",
    description: "Revenge Bedtime Procrastination—staying up late to reclaim time—is a common response to a busy day.",
    solution: "Set a 'digital sunset' time. Create a winding-down ritual. Consistent wake-up times help regulate your internal clock better than forcing sleep."
  }
];

const ROW_1 = PROBLEMS.slice(0, 8);
const ROW_2 = PROBLEMS.slice(8, 16);

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
            <div className="flex overflow-hidden gap-6 group">
                <div className="flex gap-6 animate-marquee shrink-0 min-w-full items-center group-hover:[animation-play-state:paused]">
                    {ROW_1.map((item) => (
                        <Bubble key={item.id} item={item} onSelect={setSelectedProblem} />
                    ))}
                </div>
                <div className="flex gap-6 animate-marquee shrink-0 min-w-full items-center group-hover:[animation-play-state:paused]">
                    {ROW_1.map((item) => (
                        <Bubble key={`dup-${item.id}`} item={item} onSelect={setSelectedProblem} />
                    ))}
                </div>
            </div>

            {/* Row 2 - Slower/Staggered */}
            <div className="flex overflow-hidden gap-6 group">
                <div className="flex gap-6 animate-marquee-slow shrink-0 min-w-full items-center group-hover:[animation-play-state:paused]">
                    {ROW_2.map((item) => (
                        <Bubble key={item.id} item={item} onSelect={setSelectedProblem} />
                    ))}
                </div>
                <div className="flex gap-6 animate-marquee-slow shrink-0 min-w-full items-center group-hover:[animation-play-state:paused]">
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
                        </div>
                    </div>
                </div>
             </div>
        )}
    </>
  );
};