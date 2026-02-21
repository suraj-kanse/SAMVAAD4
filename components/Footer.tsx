import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
    onHomeClick: () => void;
    onAboutClick: () => void;
    onMeetCounsellorClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({
    onHomeClick,
    onAboutClick,
    onMeetCounsellorClick
}) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-stone-900 dark:bg-[#141614] text-stone-300 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Footer Content */}
                <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

                    {/* Brand Column */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-3 tracking-tight">Counselling Centre</h3>
                        <p className="text-stone-400 text-sm leading-relaxed mb-4">
                            A safe, confidential space for AVCOE students & staff — because reaching out should never feel hard.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://linkedin.com/in/surajkanse"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 rounded-lg bg-stone-800 dark:bg-stone-800/60 border border-stone-700/50 flex items-center justify-center text-stone-400 hover:text-[#0a66c2] hover:border-blue-800/50 hover:bg-stone-800/80 transition-all duration-200"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a
                                href="https://github.com/suraj-kanse"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 rounded-lg bg-stone-800 dark:bg-stone-800/60 border border-stone-700/50 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-600 hover:bg-stone-800/80 transition-all duration-200"
                                aria-label="GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:surajkanse88@gmail.com"
                                className="w-9 h-9 rounded-lg bg-stone-800 dark:bg-stone-800/60 border border-stone-700/50 flex items-center justify-center text-stone-400 hover:text-[#EA4335] hover:border-red-800/50 hover:bg-stone-800/80 transition-all duration-200"
                                aria-label="Email"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
                        <nav className="flex flex-col gap-2.5">
                            <button
                                onClick={onHomeClick}
                                className="text-stone-400 hover:text-white text-sm text-left transition-colors duration-200"
                            >
                                Home
                            </button>
                            <button
                                onClick={onMeetCounsellorClick}
                                className="text-stone-400 hover:text-white text-sm text-left transition-colors duration-200"
                            >
                                Meet the Counsellor
                            </button>
                            <button
                                onClick={onAboutClick}
                                className="text-stone-400 hover:text-white text-sm text-left transition-colors duration-200"
                            >
                                About
                            </button>
                        </nav>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Get In Touch</h4>
                        <div className="space-y-3 text-sm text-stone-400">
                            <p>Training and Placement Office</p>
                            <p>Amrutvahini College of Engineering</p>
                            <p>Amrutnagar, Sangamner</p>
                            <a
                                href={`mailto:surajkanse88@gmail.com?subject=${encodeURIComponent('I have some suggestions for your website')}&body=${encodeURIComponent(`I was going through your platform 'Counselling Centre, AVCOE'.\nI feel these things about it—\n\nThings I liked:\n\n\nI have some suggestions:\n\n\nThings I didn't like:\n\n`)}`}
                                className="inline-flex items-center gap-1.5 text-[#6ccca2] hover:text-[#7abfa1] transition-colors duration-200"
                            >
                                <Mail className="w-3.5 h-3.5" />
                                Help us improve
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-stone-800 dark:border-stone-800/60"></div>

                <div className="py-6 flex items-center justify-center">
                    <p className="text-xs text-stone-500">
                        © {currentYear} Counselling Centre, AVCOE. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
