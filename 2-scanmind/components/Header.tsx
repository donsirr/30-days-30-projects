import React from 'react';
import { PdfDocument } from '@/lib/types';
import { X, Trash2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    pdfs: PdfDocument[]; // Used for Demo button visibility logic
    onClearSession: () => void;
    onDemoLoad?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ pdfs, onClearSession, onDemoLoad }) => {
    return (
        <header className="sticky top-0 z-50 w-full bg-slate-50/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-indigo-600 rounded-lg rotate-0 group-hover:rotate-3 transition-transform duration-300 shadow-sm"></div>
                        <div className="absolute inset-0 bg-slate-900 rounded-lg -rotate-3 group-hover:-rotate-3 opacity-20"></div>
                        <span className="relative text-white font-bold text-lg select-none">S</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tight leading-none">
                            SnapMind.ai
                        </h1>
                    </div>
                </div>

                <nav className="hidden sm:block ml-2 pl-4 border-l border-slate-200">
                    <a href="/" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Home</a>
                </nav>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-end">

                {onDemoLoad && pdfs.length === 0 && (
                    <button
                        onClick={onDemoLoad}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded-lg transition-colors shadow-sm"
                    >
                        Load Demo
                    </button>
                )}

                <button
                    onClick={onClearSession}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                    title="Clear Session"
                >
                    <Trash2 size={12} />
                    <span className="hidden sm:inline">Clear</span>
                </button>
            </div>
        </header>
    );
};
