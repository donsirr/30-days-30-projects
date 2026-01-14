'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Bookmark,
    ChevronDown,
    CheckCircle2,
    XCircle,
    GraduationCap,
    Banknote,
    MapPin,
    FileText,
    ArrowRight
} from 'lucide-react';
import clsx from 'clsx';

export interface Requirement {
    type: 'gwa' | 'income' | 'location' | 'document';
    label: string;
    isMet: boolean;
    value: string;
}

export interface ScholarshipCardProps {
    title: string;
    provider: string;
    matchPercentage: number;
    daysRemaining: number;
    requirements: Requirement[];
    amount?: string;
}

export default function ScholarshipCard({
    title,
    provider,
    matchPercentage,
    daysRemaining,
    requirements,
    amount
}: ScholarshipCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Helpers
    const getUrgencyColor = (days: number) => {
        if (days <= 14) return 'bg-red-50 text-red-600 border-red-100';
        if (days <= 30) return 'bg-orange-50 text-orange-600 border-orange-100';
        return 'bg-green-50 text-green-600 border-green-100';
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'gwa': return <GraduationCap size={16} />;
            case 'income': return <Banknote size={16} />;
            case 'location': return <MapPin size={16} />;
            default: return <FileText size={16} />;
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            {/* Hover Glow Effect */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="p-6">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                        {/* Match Indicator */}
                        <div className="relative size-14 shrink-0 flex items-center justify-center">
                            <svg className="size-full -rotate-90">
                                <circle cx="28" cy="28" r="22" className="stroke-gray-100" strokeWidth="4" fill="none" />
                                <motion.circle
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: matchPercentage / 100 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    cx="28" cy="28" r="22"
                                    className={clsx(
                                        "stroke-current",
                                        matchPercentage >= 90 ? "text-green-500" : matchPercentage >= 75 ? "text-primary" : "text-orange-500"
                                    )}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    fill="none"
                                    strokeDasharray="1"
                                    pathLength="1"
                                />
                            </svg>
                            <span className="absolute text-xs font-bold text-gray-700">{matchPercentage}%</span>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                                {title}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">{provider}</p>
                        </div>
                    </div>

                    <button className="text-gray-300 hover:text-primary transition-colors p-2 hover:bg-blue-50 rounded-full">
                        <Bookmark size={20} />
                    </button>
                </div>

                {/* Meta Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className={clsx("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold", getUrgencyColor(daysRemaining))}>
                        <Clock size={14} />
                        <span>{daysRemaining} days left</span>
                    </div>
                    {amount && (
                        <div className="px-3 py-1.5 rounded-lg bg-blue-50 text-primary border border-blue-100 text-xs font-bold">
                            {amount}
                        </div>
                    )}
                </div>

                {/* Expand Toggle */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-gray-400 hover:text-primary transition-colors py-2 border-t border-gray-50 mt-2"
                >
                    <span>{isExpanded ? 'Hide Requirements' : 'View Requirements'}</span>
                    <ChevronDown size={16} className={clsx("transition-transform duration-300", isExpanded && "rotate-180")} />
                </button>
            </div>

            {/* Expansion Panel: Requirements Checklist */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="bg-gray-50 border-t border-gray-100"
                    >
                        <div className="p-6 pt-2 space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Eligibility Logic</p>

                            {requirements.map((req, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx("p-2 rounded-lg", req.isMet ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500")}>
                                            {getIcon(req.type)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-700">{req.label}</p>
                                            <p className="text-xs text-gray-500">{req.value}</p>
                                        </div>
                                    </div>
                                    {req.isMet ? (
                                        <CheckCircle2 size={18} className="text-green-500" />
                                    ) : (
                                        <XCircle size={18} className="text-red-400" />
                                    )}
                                </div>
                            ))}

                            <button className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                <span>Apply Now</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
