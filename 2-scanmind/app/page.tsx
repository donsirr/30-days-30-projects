'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Clock, BookOpen, Layers, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    const sections = [
        {
            icon: <Layers className="w-6 h-6 text-indigo-500" />,
            title: "The Combined Mind",
            text: "SnapMind is a stateless, session-based AI study engine. It creates a temporary 'Combined Mind' from your uploaded PDFs, allowing you to ask questions via text or screenshots instantly."
        },
        {
            icon: <Zap className="w-6 h-6 text-amber-500" />,
            title: "Velocity First",
            text: "1. Drag & Drop PDF course materials.\n2. Paste (Ctrl+V) a screenshot of a confusing diagram or question.\n3. SnapMind scans your specific documents to find the exact grounded answer."
        },
        {
            icon: <Shield className="w-6 h-6 text-emerald-500" />,
            title: "Privacy by Design",
            text: "Traditional chatbots hallucinate. SnapMind grounds every answer in YOUR files. Plus, it's stateless—once you refresh, your data is gone. Perfect for privacy and focus."
        },
        {
            icon: <Clock className="w-6 h-6 text-blue-500" />,
            title: "When to use it?",
            text: "Ideal for rapid-fire study sessions, open-book exam preparation, or when you need to quickly synthesize information across multiple textbooks without searching manually."
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="sticky top-0 z-50 w-full bg-slate-50/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">SnapMind.ai</h1>
            </header>

            <main className="max-w-4xl mx-auto py-16 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Stop Searching. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Start Snapping.</span>
                    </h2>
                    <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
                        The intelligent layer between you and your study materials. <br />
                        No login, no database, just instant knowledge.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                    {section.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h3>
                                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                        {section.text}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 text-center"
                >
                    <Link
                        href="/engine"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg hover:shadow-indigo-500/30"
                    >
                        Launch SnapMind Engine <ArrowLeft className="rotate-180" />
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}
