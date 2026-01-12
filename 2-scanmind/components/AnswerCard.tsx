import React, { useState } from 'react';
import { FeedItem } from '@/lib/types';
import { Search, MapPin, ChevronDown, ChevronUp, AlertCircle, RefreshCw, FileText, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import Image from 'next/image';

interface AnswerCardProps {
    item: FeedItem;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({ item }) => {
    const [learningMode, setLearningMode] = useState(false);

    if (item.status === 'loading') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                    </div>
                    <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                </div>
            </motion.div>
        );
    }

    if (item.status === 'not_found' || item.status === 'error') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden"
            >
                <div className="border-b border-red-50 bg-red-50/30 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle size={16} />
                        <span className="text-sm font-medium">Information not found</span>
                    </div>
                </div>
                <div className="p-6">
                    <p className="text-slate-600 mb-4">We couldn't find an answer in the provided sources.</p>
                    <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-500 space-y-1">
                        <p className="font-medium text-slate-700">Tips:</p>
                        <ul className="list-disk list-inside">
                            <li>Check image clarity if you uploaded a screenshot.</li>
                            <li>Ensure the relevant PDF modules are uploaded.</li>
                            <li>Try rephrasing your question.</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
        >
            {/* Header Metadata */}
            <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                    <span className={cn(
                        "px-2 py-0.5 rounded-full font-medium uppercase tracking-wider text-[10px]",
                        item.type === 'image' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    )}>
                        {item.type} Query
                    </span>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1.5">
                        <FileText size={12} />
                        <span className="truncate max-w-[200px]" title={item.answer?.sourceFile}>
                            {item.answer?.sourceFile || 'Unknown Source'}
                        </span>
                        {item.answer?.pageNumber && (
                            <>
                                <span className="text-slate-300">•</span>
                                <span>Page {item.answer?.pageNumber}</span>
                            </>
                        )}
                    </div>
                </div>
                <span className="text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            <div className="p-6">
                {/* User Query Preview */}
                <div className="mb-6 flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <Search size={16} />
                        </div>
                    </div>
                    <div className="flex-1">
                        {item.type === 'image' ? (
                            <div className="relative h-32 w-full max-w-sm rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                                <Image
                                    src={item.content}
                                    alt="Query"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <p className="text-lg font-medium text-slate-800 leading-relaxed font-serif italic">
                                "{item.content}"
                            </p>
                        )}
                    </div>
                </div>

                {/* Answer Body */}
                <div className="pl-12 relative">
                    <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-indigo-100"></div>
                    <p className="text-slate-700 leading-7 text-base mb-4">
                        {item.answer?.text}
                    </p>
                </div>
            </div>

            {/* Learning Mode Toggle */}
            {item.answer?.rawSnippet && (
                <div className="border-t border-slate-100 bg-slate-50/30">
                    <button
                        onClick={() => setLearningMode(!learningMode)}
                        className="w-full px-6 py-2.5 flex items-center justify-between text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <MapPin size={14} />
                            Learning Mode: {learningMode ? 'Hide' : 'Show'} Context
                        </span>
                        {learningMode ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <AnimatePresence>
                        {learningMode && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 pb-6 pt-2">
                                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                                        <p className="mb-2 text-indigo-400 uppercase tracking-widest text-[10px] font-bold">Raw Source Snippet</p>
                                        {item.answer.rawSnippet}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};
