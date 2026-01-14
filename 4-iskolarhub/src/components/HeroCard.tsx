'use client';

import React from 'react';
import { ArrowRight, Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroCardProps {
    onStart: () => void;
}

export default function HeroCard({ onStart }: HeroCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-[#1e457a] p-8 md:p-10 text-white shadow-xl shadow-primary/10 group cursor-pointer hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300"
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

            {/* Illustration Graphic (Right Side) */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="relative size-64"
                >
                    {/* Floating Card 1 */}
                    <div className="absolute top-0 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-48 rotate-6 animate-[float_4s_ease-in-out_infinite]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-8 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-300">
                                <Sparkles size={16} />
                            </div>
                            <div className="h-2 w-20 bg-white/20 rounded-full" />
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full mb-2" />
                        <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                    </div>

                    {/* Floating Card 2 (Main) */}
                    <div className="absolute top-16 right-20 bg-white text-primary p-5 rounded-2xl w-56 shadow-2xl -rotate-3 animate-[float_5s_ease-in-out_infinite_1s]">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <GraduationCap size={20} className="text-primary" />
                                <span className="font-bold text-sm">Scholarship Match</span>
                            </div>
                            <CheckCircle2 size={16} className="text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-2.5 w-full bg-slate-100 rounded-full" />
                            <div className="h-2.5 w-3/4 bg-slate-100 rounded-full" />
                        </div>
                        <div className="mt-4 flex gap-2">
                            <div className="h-2 w-8 bg-green-100 rounded-full" />
                            <div className="h-2 w-8 bg-blue-100 rounded-full" />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between max-w-lg">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium mb-6"
                    >
                        <Sparkles size={14} className="text-yellow-300" />
                        <span>AI-Powered Matching</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] mb-6 tracking-tight"
                    >
                        Find Scholarships That Fit <span className="text-blue-200">Your Story.</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                            Stop scrolling through endless lists. Answer a 1-minute survey about your grades, location, and potential to get matched instantly.
                        </p>
                        <div className="flex items-center gap-4 text-xs font-medium text-blue-200">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-green-400" />
                                <span>50+ Local Grants</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-green-400" />
                                <span>Real-time Updates</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <button
                        onClick={onStart}
                        className="flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-2xl font-bold mt-8 w-full sm:w-auto justify-center sm:justify-start hover:bg-blue-50 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <span>Start Eligibility Check</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[10px] text-blue-200 mt-3 ml-1 opacity-60">Takes less than 60 seconds • No account needed</p>
                </motion.div>
            </div>
        </motion.div>
    );
}
