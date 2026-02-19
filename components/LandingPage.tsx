import React, { useRef, useState } from 'react';
import { FeelingsSection } from './FeelingsSection';
import { InfoSection } from './InfoSection';
import { ContactModal } from './ContactModal';
import { MarqueeWall } from './MarqueeWall';
import { ProcessTimeline } from './ProcessTimeline';
import { Testimonials } from './Testimonials';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MessageSquare, CheckCircle2, HelpCircle } from 'lucide-react';
import { SplitText } from './SplitText';

interface LandingPageProps {

    onAboutClick: () => void;
    onMeetCounselorClick: () => void;
    isDark: boolean;
    onThemeToggle: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({

    onAboutClick,
    onMeetCounselorClick,
    isDark,
    onThemeToggle
}) => {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const contactRef = useRef<HTMLElement>(null);

    return (
        <div className="min-h-screen flex flex-col bg-[#fbfbfa] dark:bg-[#1a1c1a] transition-colors duration-300 overflow-x-hidden font-sans">

            {/* Reusable Navbar */}
            <Navbar
                onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onAboutClick={onAboutClick}
                onMeetCounselorClick={onMeetCounselorClick}
                isDark={isDark}
                onThemeToggle={onThemeToggle}
                activePage="home"
            />

            <main className="flex-grow flex flex-col pt-16 md:pt-24">
                {/* 1. Hero Section (Off-white BG) */}
                <section className="relative pt-12 md:pt-20 pb-16 md:pb-20 px-4 overflow-hidden bg-[#fbfbfa] dark:bg-[#1a1c1a]">
                    {/* Subtle Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-stone-200/40 to-transparent dark:from-stone-800/20 rounded-[100%] blur-3xl pointer-events-none -z-10"></div>

                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#dbece4] dark:bg-[#1f3a2e] text-[#2c5f46] dark:text-[#7abfa1] text-sm font-medium mb-8 animate-fade-in">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Counseling Centre • AVCOE, Sangamner</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-stone-800 dark:text-stone-100 tracking-tight mb-6 leading-[1.1]">
                            <SplitText text="It's okay to" delay={0} /> <br className="hidden md:inline" />
                            <span className="text-[#4a8067] dark:text-[#7abfa1]">
                                <SplitText text="not be okay" delay={400} />
                            </span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-lg md:text-2xl text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10 font-light animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                            Whether it's exam stress, career confusion, or just feeling overwhelmed — you don't have to figure it out alone.
                        </p>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                            {[
                                { text: '100% Confidential', dotColor: 'bg-[#4a8067]' },
                                { text: 'Free for all students', dotColor: 'bg-[#4a8067]' },
                                { text: 'Off academic records', dotColor: 'bg-[#4a8067]' }
                            ].map((item, idx) => (
                                <span key={idx} className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2 rounded-full bg-white dark:bg-[#252525] text-stone-600 dark:text-stone-300 text-xs md:text-sm font-medium shadow-sm border border-transparent dark:border-stone-800">
                                    <span className={`w-2 h-2 rounded-full ${item.dotColor}`}></span> {item.text}
                                </span>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-brand-orange hover:bg-brand-orangeHover text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-brand-orange/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 group"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></span>
                                <MessageSquare className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">Drop Your Details Here</span>
                            </button>
                            <a
                                href="https://wa.me/918010777641?text=Hello,%20I%20would%20like%20to%20speak%20with%20a%20student%20counsellor."
                                target="_blank"
                                rel="noreferrer"
                                className="relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-brand-green hover:bg-brand-greenHover text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-brand-green/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 group"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></span>
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current relative z-10" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                <span className="relative z-10">Talk to Counselor</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* 2. Marquee Section (White BG) */}
                <section className="bg-white dark:bg-[#1a1c1a]">
                    <MarqueeWall />
                </section>

                {/* 3. Process Timeline (Off-white BG) */}
                <section className="bg-[#fbfbfa] dark:bg-[#202220] border-y border-stone-100 dark:border-stone-800">
                    <ProcessTimeline />
                </section>

                {/* 4. Feelings Grid Section (White BG) */}
                <section className="bg-white dark:bg-[#1a1c1a]">
                    <FeelingsSection />
                </section>

                {/* 5. Hesitation Buster (Off-white BG) */}
                <section className="py-16 md:py-24 px-4 bg-[#fbfbfa] dark:bg-[#202220] border-y border-stone-100 dark:border-stone-800">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-4">Still hesitating?</h2>
                            <p className="text-stone-500 dark:text-stone-400">Let's clear up some common doubts.</p>
                        </div>
                        {/* Updated to grid-cols-2 on mobile */}
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-white dark:bg-[#252525] p-6 md:p-8 rounded-3xl md:rounded-[2rem] shadow-sm border border-stone-100 dark:border-stone-800">
                                <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl shrink-0 mb-2 md:mb-0">
                                        <HelpCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-stone-900 dark:text-white mb-2 leading-tight">"My problem isn't big enough."</h3>
                                        <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                                            You don't need to be in a crisis to seek help. If it bothers you, it matters.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#252525] p-6 md:p-8 rounded-3xl md:rounded-[2rem] shadow-sm border border-stone-100 dark:border-stone-800">
                                <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl shrink-0 mb-2 md:mb-0">
                                        <HelpCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-stone-900 dark:text-white mb-2 leading-tight">"Will my teachers know?"</h3>
                                        <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                                            Absolutely not. Your counseling sessions are confidential and off-record.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Values Section (White BG) */}
                <section className="bg-white dark:bg-[#1a1c1a]">
                    <InfoSection />
                </section>

                {/* 7. Quote Section (Off-white BG) */}
                <section className="py-24 px-4 text-center bg-[#fbfbfa] dark:bg-[#202220] border-y border-stone-100 dark:border-stone-800">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-2xl md:text-4xl font-serif italic text-stone-600 dark:text-stone-300 leading-normal">
                            "Asking for help is not a sign of weakness — it's a sign of strength."
                        </p>
                    </div>
                </section>

                {/* 8. Testimonials (Moved to Bottom) (White BG) */}
                <section className="bg-white dark:bg-[#1a1c1a]">
                    <Testimonials />
                </section>

                {/* 9. Ready to Talk (Brand Color BG) */}
                <section ref={contactRef} className="py-32 px-4 bg-[#558b72] text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to talk?</h2>
                        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                            Take the first step — we're here whenever you're ready. <br className="hidden md:block" />
                            No rush, no pressure, just support.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-white text-[#2a5240] hover:bg-stone-50 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 hover:-translate-y-1 group"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-stone-200/50 to-transparent translate-x-[-100%] animate-shimmer"></span>
                                <MessageSquare className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">Drop Your Details Here</span>
                            </button>

                            <a
                                href="https://wa.me/918010777641?text=Hello,%20I%20would%20like%20to%20speak%20with%20a%20student%20counsellor."
                                target="_blank"
                                rel="noreferrer"
                                className="relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-[#67b588] hover:bg-[#5db878] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 hover:-translate-y-1 group"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></span>
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current relative z-10" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                <span className="relative z-10">Talk to Counselor</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* 10. Footer */}
                <Footer
                    onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    onAboutClick={onAboutClick}
                    onMeetCounselorClick={onMeetCounselorClick}
                />

                {/* Contact Modal */}
                <ContactModal
                    isOpen={isContactModalOpen}
                    onClose={() => setIsContactModalOpen(false)}
                />
            </main>
        </div>
    );
};