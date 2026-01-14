'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
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
            className="col-span-1 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-[#1e457a] p-8 text-white shadow-xl shadow-primary/10 group cursor-pointer hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300"
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

            <div className="relative z-10 flex flex-col h-full justify-between">
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
                        className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-lg leading-[1.1] mb-4 tracking-tight"
                    >
                        Find Scholarships That Fit Your Story.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-blue-100 max-w-md text-sm md:text-base leading-relaxed"
                    >
                        Answer a few questions about your grades, location, and achievements to get matched with up to 50+ opportunities instantly.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <button
                        onClick={onStart}
                        className="flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-2xl font-bold mt-8 w-full sm:w-auto justify-center sm:justify-start hover:bg-blue-50 transition-all transform group-hover:translate-x-1 shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <span>Start Eligibility Check</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}
