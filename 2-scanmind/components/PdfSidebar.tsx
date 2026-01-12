import React from 'react';
import { PdfDocument } from '@/lib/types';
import { X, FileText, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PdfSidebarProps {
    pdfs: PdfDocument[];
    onRemovePdf: (id: string) => void;
}

export const PdfSidebar: React.FC<PdfSidebarProps> = ({ pdfs, onRemovePdf }) => {
    return (
        <div className="h-full">
            <div className="sticky top-24 space-y-4">
                <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-xs font-bold mb-4">
                    <Layers size={14} />
                    <span>Active Mind Sources</span>
                </div>

                <div className="space-y-3">
                    <AnimatePresence>
                        {pdfs.map((pdf) => (
                            <motion.div
                                key={pdf.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="group relative bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
                                layout
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                        <FileText size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-slate-800 truncate" title={pdf.name}>
                                            {pdf.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            {/* {(pdf.file.size / 1024 / 1024).toFixed(2)} MB */}
                                            PDF Document
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onRemovePdf(pdf.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                        title="Remove PDF"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {pdfs.length === 0 && (
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                            <p className="text-slate-400 text-sm">No PDFs uploaded.</p>
                            <p className="text-slate-300 text-xs mt-1">Drag files to the center zone.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
