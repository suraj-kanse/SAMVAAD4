import React, { useEffect } from 'react';
import { Award, BookHeart, GraduationCap, Quote, Lock, FileX, Shield, MessageCircle } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface CounsellorPageProps {
    onHomeClick: () => void;
    onAboutClick: () => void;
    isDark: boolean;
    onThemeToggle: () => void;
}

export const CounsellorPage: React.FC<CounsellorPageProps> = ({
    onHomeClick,
    onAboutClick,
    isDark,
    onThemeToggle
}) => {
    useEffect(() => {
        document.title = "Counsellor | Samvaad";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute("content", "Meet Dr. Maya Patil, Student Counsellor at Samvaad. Book a confidential counselling session today.");
        } else {
            const meta = document.createElement('meta');
            meta.name = "description";
            meta.content = "Meet Dr. Maya Patil, Student Counsellor at Samvaad. Book a confidential counselling session today.";
            document.head.appendChild(meta);
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#1a1c1a] transition-colors duration-300 font-sans">

            <Navbar
                onHomeClick={onHomeClick}
                onAboutClick={onAboutClick}
                onMeetCounsellorClick={() => { }} // Already on Counsellor page
                isDark={isDark}
                onThemeToggle={onThemeToggle}
                activePage="counsellor"
            />

            <main className="max-w-4xl mx-auto px-4 pt-28 pb-20 animate-fade-in">
                {/* Profile Section */}
                <div className="flex flex-col md:flex-row gap-12 items-start mb-24">
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                        <div className="w-64 h-64 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-stone-800 mb-6 relative group bg-stone-200 dark:bg-stone-800">
                            <img
                                src="/images/counsellor.jpg"
                                alt="Dr. Maya Patil"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="text-center w-full">
                            <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Dr. Maya Patil</h1>
                            <p className="text-[#4a8067] dark:text-[#6ccca2] font-medium mb-6">Student Counsellor</p>

                            <div className="mt-6 md:hidden w-full">
                                <a
                                    href="https://wa.me/918698801090?text=Hello,%20I%20would%20like%20to%20speak%20with%20a%20student%20counsellor."
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-3 px-6 bg-[#4a8067] hover:bg-[#3d6b56] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                                >
                                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Talk to Counsellor
                                </a>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center mt-6">
                                <span className="px-3 py-1 bg-white dark:bg-[#252525] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 text-xs rounded-full font-medium">M.A. Clinical Psychology</span>
                                <span className="px-3 py-1 bg-white dark:bg-[#252525] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 text-xs rounded-full font-medium">Child & Adolescent Psychology</span>
                            </div>

                            <div className="mt-8 w-full hidden md:block">
                                <a
                                    href="https://wa.me/918698801090?text=Hello,%20I%20would%20like%20to%20speak%20with%20a%20student%20counsellor."
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-3 px-6 bg-[#4a8067] hover:bg-[#3d6b56] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                                >
                                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Talk to Counsellor
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 space-y-8">
                        <div className="bg-white dark:bg-[#252525] p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm relative">
                            <Quote className="absolute top-8 left-6 w-8 h-8 text-[#dbece4] dark:text-[#2c3e34] -z-0" />
                            <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed relative z-10 italic pl-6">
                                "My goal is to create a space where students feel truly safe. College life is exciting and transformative, but it can also feel overwhelming. I'm here to listen — without judgment — and help you discover your own strength."
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2">
                                <BookHeart className="w-5 h-5 text-[#4a8067] dark:text-[#6ccca2]" />
                                My Methodology
                            </h3>
                            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                I believe in an approach that sees you as a whole person — not just a problem to solve. Whether it's academic pressure, relationship struggles, or simply needing someone to talk to, our sessions are completely confidential and move at your pace. I use practical, evidence-based techniques — including mindfulness — to help you manage stress and build resilience.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-5 bg-white dark:bg-[#252525] rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg">
                                        <GraduationCap className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-semibold text-stone-800 dark:text-white">Education</h4>
                                </div>
                                <ul className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed space-y-1 list-disc pl-4">
                                    <li>B.H.M.S, M.U.H.S Nashik</li>
                                    <li>M.A. Clinical Psychology, SPPU Pune</li>
                                    <li>Adv. Diploma in Child & Adolescents Developmental Psychology, Jnana Prabodhini Institute Pune</li>
                                </ul>
                            </div>
                            <div className="p-5 bg-white dark:bg-[#252525] rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 rounded-lg">
                                        <Award className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-semibold text-stone-800 dark:text-white">Specialization</h4>
                                </div>
                                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">Anxiety disorders, Academic stress management, and Career counselling.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Promise to You Section */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">My Promise to You</h2>
                        <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
                            Here's what you can expect when we talk — in plain, simple terms.
                        </p>
                    </div>
                    <div className="space-y-4">
                        {/* Card 1 */}
                        <div className="bg-white dark:bg-[#252525] p-6 md:p-8 rounded-[1.5rem] border border-stone-100 dark:border-stone-800 flex flex-col md:flex-row gap-6 items-start shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-2xl bg-[#e3f0e8] dark:bg-[#1f3a2e] flex items-center justify-center flex-shrink-0 text-[#2d5f48] dark:text-[#7abfa1]">
                                <Lock className="w-7 h-7" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">What you share stays with me</h3>
                                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">Our conversations are completely private. No one else has access — not teachers, not staff, not administration.</p>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white dark:bg-[#252525] p-6 md:p-8 rounded-[1.5rem] border border-stone-100 dark:border-stone-800 flex flex-col md:flex-row gap-6 items-start shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-2xl bg-[#e3f0e8] dark:bg-[#1f3a2e] flex items-center justify-center flex-shrink-0 text-[#2d5f48] dark:text-[#7abfa1]">
                                <FileX className="w-7 h-7" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Nothing goes on your record</h3>
                                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">Counselling is entirely separate from your academic file. It won't appear anywhere, ever.</p>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-white dark:bg-[#252525] p-6 md:p-8 rounded-[1.5rem] border border-stone-100 dark:border-stone-800 flex flex-col md:flex-row gap-6 items-start shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-2xl bg-[#e3f0e8] dark:bg-[#1f3a2e] flex items-center justify-center flex-shrink-0 text-[#2d5f48] dark:text-[#7abfa1]">
                                <Shield className="w-7 h-7" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Your parents won't know</h3>
                                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">Unless you're in immediate danger, our sessions remain confidential.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Approach Section */}
                <div className="mb-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">My Approach</h2>
                        <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
                            What I believe about counselling and supporting students.
                        </p>
                    </div>
                    <div className="space-y-4">
                        {[
                            "Every feeling is valid — there's no 'wrong' reason to talk.",
                            "You don't need to have it all figured out before reaching out.",
                            "Healing isn't linear, and that's perfectly okay.",
                            "Sometimes, just being heard is the first step to feeling better."
                        ].map((text, i) => (
                            <div key={i} className="bg-[#fdfbf7] dark:bg-[#23211f] p-6 rounded-[1.5rem] border border-[#f3efe6] dark:border-stone-800 flex items-center gap-6 shadow-sm hover:border-[#e6e0d0] dark:hover:border-stone-700 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[#f0ebd8] dark:bg-[#38332a] flex items-center justify-center flex-shrink-0 text-[#7a7258] dark:text-[#c4bca6]">
                                    <Quote className="w-4 h-4 fill-current" />
                                </div>
                                <p className="text-lg font-medium text-stone-700 dark:text-stone-200">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            <Footer
                onHomeClick={onHomeClick}
                onAboutClick={onAboutClick}
                onMeetCounsellorClick={() => { }}
            />

        </div>
    );
};