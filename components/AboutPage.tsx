import React from 'react';
import {
    Shield, MessageCircle, Heart, Github, Linkedin,
    Sparkles, Lock, Eye, Server, X, Terminal, Mail
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface AboutPageProps {
    onHomeClick: () => void;
    onMeetCounsellorClick: () => void;
    isDark: boolean;
    onThemeToggle: () => void;
}



const PRINCIPLES = [
    {
        icon: Shield,
        title: "Privacy by Design",
        desc: "No analytics tracking, no data selling. Conversations belong to you."
    },
    {
        icon: Lock,
        title: "Minimal Data",
        desc: "We only collect what's absolutely necessary: phone number and name."
    },
    {
        icon: Eye,
        title: "Transparency",
        desc: "We don't hide behind legal jargon. If you have questions, just ask."
    },
    {
        icon: Server,
        title: "Built for AVCOE",
        desc: "Designed to serve one college, one counsellor, for the long term."
    }
];

const NOT_LIST = [
    "Not a commercial product — no ads, no premium tiers.",
    "Not a replacement for clinical therapy — we connect you to a counsellor.",
    "Not a data company — we don't sell your info.",
    "Not trying to scale — focused on quality."
];

export const AboutPage: React.FC<AboutPageProps> = ({
    onHomeClick,
    onMeetCounsellorClick,
    isDark,
    onThemeToggle
}) => {


    return (
        <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#1a1c1a] transition-colors duration-300 font-sans">

            <Navbar
                onHomeClick={onHomeClick}
                onAboutClick={() => { }} // Already on About page
                onMeetCounsellorClick={onMeetCounsellorClick}
                isDark={isDark}
                onThemeToggle={onThemeToggle}
                activePage="about"
            />

            <main className="max-w-4xl mx-auto px-4 pt-28 pb-20 animate-fade-in">


                {/* Why This Platform Exists */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e3f0e8] dark:bg-[#1f3a2e] text-[#2c5f46] dark:text-[#7abfa1] text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>The Story Behind the Platform</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-6">Why This Platform Exists ?</h2>
                    <p className="text-lg text-stone-500 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed mb-4">
                        This service was built for Amrutvahini College of Engineering Students and Staff with a simple belief: accessing support should be as easy as scanning a QR code.
                    </p>
                    <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
                        This platform was built to remove the friction from seeking help. Mental health support should be accessible and simple.
                    </p>
                    <h1 className="text-3xl md:text-5xl font-bold text-stone-900 dark:text-white tracking-tight">
                        Bridging the gap between <br className="hidden md:block" />
                        <span className="text-[#4a8067] dark:text-[#6ccca2]">students and support</span>
                    </h1>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-24">
                    <div className="bg-white dark:bg-[#252525] p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-2">100% Confidential</h3>
                        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                            Your conversations stay between you and the counsellor. Nothing goes on your academic record. Ever.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-[#252525] p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
                        <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-2">Friction-Free</h3>
                        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                            No login required for students. No long intake forms. Just a phone number.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-[#252525] p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
                        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-2">Human First</h3>
                        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
                            Technology is just the bridge. The destination is a real human connection.
                        </p>
                    </div>
                </div>

                {/* Our Principles */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">Our Principles</h2>
                        <p className="text-stone-500 dark:text-stone-400">The values that guide every decision we make.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {PRINCIPLES.map((principle, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#252525] p-6 rounded-2xl border border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-[#e3f0e8] dark:bg-[#1f3a2e] flex items-center justify-center flex-shrink-0 text-[#2d5f48] dark:text-[#7abfa1]">
                                    <principle.icon className="w-6 h-6" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">{principle.title}</h3>
                                    <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-sm">{principle.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* What This is Not */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">What This is <span className="text-[#cc6b3e]">Not</span></h2>
                    </div>
                    <div className="space-y-4">
                        {NOT_LIST.map((item, idx) => (
                            <div key={idx} className="bg-[#fcfbf9] dark:bg-[#23211f] p-5 rounded-xl border border-stone-100 dark:border-stone-800 flex items-start gap-4">
                                <X className="w-5 h-5 text-[#cc6b3e] flex-shrink-0 mt-0.5" />
                                <p className="text-stone-600 dark:text-stone-300 font-medium">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>



                {/* Built With Care */}
                <div className="mb-24 bg-white dark:bg-[#252525] rounded-[2rem] border border-stone-200 dark:border-stone-800 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start">
                    <div className="w-full md:w-auto flex-shrink-0 flex flex-col items-center gap-6">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 transform transition-transform hover:scale-105 hover:rotate-3 duration-500 shadow-sm hover:shadow-md border-4 border-transparent hover:border-stone-200 dark:hover:border-stone-700">
                            <Terminal className="w-12 h-12" />
                        </div>

                        <div className="flex items-center justify-center gap-3 sm:gap-4">
                            <a href="https://linkedin.com/in/surajkanse" target="_blank" rel="noreferrer" className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-[#0a66c2] dark:hover:text-[#0a66c2] shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/50 transform transition-all duration-300 hover:-translate-y-1 hover:scale-110 active:scale-95">
                                <Linkedin className="w-5 h-5 transition-transform group-hover:scale-110" />
                            </a>
                            <a href="https://github.com/surajkanse" target="_blank" rel="noreferrer" className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-900 dark:hover:text-white shadow-sm hover:shadow-lg hover:border-stone-400 dark:hover:border-stone-500 transform transition-all duration-300 hover:-translate-y-1 hover:scale-110 active:scale-95">
                                <Github className="w-5 h-5 transition-transform group-hover:scale-110" />
                            </a>
                            <a href="mailto:surajkanse@gmail.com" className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-[#EA4335] dark:hover:text-[#EA4335] shadow-sm hover:shadow-lg hover:border-red-200 dark:hover:border-red-900/50 transform transition-all duration-300 hover:-translate-y-1 hover:scale-110 active:scale-95">
                                <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">Built with Care</h2>
                        <div className="space-y-4 text-stone-600 dark:text-stone-300 leading-relaxed">
                            <p>
                                Hi! I'm Suraj Kanse. I built this platform because I saw how hard it was for students to reach out. Too many forms, too much stigma.
                            </p>
                            <p className="font-medium text-stone-900 dark:text-white">
                                So I asked: What if getting support was as simple as scanning a QR code?
                            </p>
                            <p>
                                This is just a tool — built thoughtfully to make one counsellor's work easier and one college's students more supported.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Help Us Improve */}
                <div className="mb-20">
                    <div className="text-center mb-10">
                        <div className="w-12 h-12 bg-[#e3f0e8] dark:bg-[#1f3a2e] rounded-2xl flex items-center justify-center text-[#2d5f48] dark:text-[#7abfa1] mx-auto mb-6">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">Help Us Improve</h2>
                        <p className="text-stone-500 dark:text-stone-400 max-w-lg mx-auto">
                            Have suggestions? Your feedback helps make the platform better.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#252525] p-8 md:p-10 rounded-[2rem] border border-stone-200 dark:border-stone-800 max-w-2xl mx-auto shadow-sm text-center">
                        <p className="text-stone-600 dark:text-stone-300 mb-6 leading-relaxed">
                            Your feedback is valuable for us! We will definitely consider your suggestions to make this platform better.
                        </p>
                        <a
                            href={`mailto:surajkanse88@gmail.com?subject=${encodeURIComponent('I have some suggestions for your website')}&body=${encodeURIComponent(`I was going through your platform 'Counselling Centre, AVCOE'.\nI feel these things about it—\n\nThings I liked:\n\n\nI have some suggestions:\n\n\nThings I didn't like:\n\n`)}`}
                            className="inline-flex items-center justify-center gap-2 py-4 px-8 bg-[#cc6b3e] hover:bg-[#b55d34] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        >
                            <Mail className="w-5 h-5" />
                            Help Us Improve
                        </a>
                    </div>
                </div>

                <Footer
                    onHomeClick={onHomeClick}
                    onAboutClick={() => { }}
                    onMeetCounsellorClick={onMeetCounsellorClick}
                />

            </main >
        </div >
    );
};