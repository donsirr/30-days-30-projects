'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UploadCloud,
    FileCheck,
    Trash2,
    AlertCircle,
    MoreVertical,
    Eye,
    RefreshCw
} from 'lucide-react';
import { useDocuments, Document } from '@/hooks/useDocuments';
import clsx from 'clsx';

export default function DocumentVaultCard() {
    const { documents, uploadDocument, deleteDocument, readinessScore, isLoaded } = useDocuments();

    // Circular Progress Calculation
    const circumference = 2 * Math.PI * 40; // r=40
    const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-1 md:col-span-1 bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
        >
            {/* Header: Score & Title */}
            <div className="flex items-center gap-4 mb-4">
                <div className="relative size-16 flex items-center justify-center">
                    {/* Background Circle */}
                    <svg className="size-full -rotate-90">
                        <circle cx="32" cy="32" r="28" className="stroke-slate-100" strokeWidth="6" fill="none" />
                        <motion.circle
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            cx="32" cy="32" r="28"
                            className="stroke-primary"
                            strokeWidth="6"
                            strokeLinecap="round"
                            fill="none"
                            strokeDasharray={2 * Math.PI * 28}
                        />
                    </svg>
                    <span className="absolute text-sm font-bold text-slate-900">{readinessScore}%</span>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">Document Vault</h3>
                    <p className="text-xs text-slate-500 font-medium">
                        {readinessScore === 100 ? 'Application Ready!' : 'Requirements pending'}
                    </p>
                </div>
            </div>

            {/* Document List */}
            <div className="flex-1 space-y-3 min-h-[250px] max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
                {isLoaded && documents.map((doc) => (
                    <VaultItem
                        key={doc.id}
                        doc={doc}
                        onUpload={uploadDocument}
                        onDelete={deleteDocument}
                    />
                ))}
            </div>

            {/* Persistence Note */}
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5 ">
                    <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>Auto-saved to device</span>
                </div>
                <button className="hover:text-primary transition-colors">View All</button>
            </div>
        </motion.div>
    );
}

// --- Sub-Component: Individual Vault Item ---
function VaultItem({ doc, onUpload, onDelete }: {
    doc: Document;
    onUpload: (id: string, file: File) => void;
    onDelete: (id: string) => void;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsHovered(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(doc.id, e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(doc.id, e.target.files[0]);
        }
    };

    return (
        <div
            className="relative group"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {/* Tooltip (Top Right) */}
            <AnimatePresence>
                {showTooltip && doc.status === 'empty' && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-0 -top-8 z-20 bg-slate-800 text-white text-[10px] py-1 px-3 rounded-lg shadow-lg whitespace-nowrap"
                    >
                        {doc.description}
                        <div className="absolute bottom-[-4px] right-4 size-2 bg-slate-800 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            {doc.status === 'uploaded' ? (
                // --- Uploaded State ---
                <div className="flex items-center justify-between p-3 bg-green-50/50 border border-green-100 rounded-xl transition-all group-hover:shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="size-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <FileCheck size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate pr-2">{doc.label}</p>
                            <p className="text-[10px] text-green-600 truncate">{doc.fileName}</p>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 rounded-full hover:bg-green-100 text-green-700 transition-colors"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {/* Action Menu drop-down */}
                        <AnimatePresence>
                            {showMenu && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute right-0 top-8 z-20 w-32 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden flex flex-col py-1"
                                    >
                                        <button
                                            onClick={() => {
                                                if (doc.fileData) {
                                                    // Create a temporary link to download/view
                                                    const win = window.open();
                                                    if (win) {
                                                        win.document.write(
                                                            '<iframe src="' + doc.fileData + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
                                                        );
                                                    }
                                                } else {
                                                    alert('Preview not available for this file.');
                                                }
                                                setShowMenu(false);
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 w-full text-left"
                                        >
                                            <Eye size={12} /> View
                                        </button>
                                        <button
                                            onClick={() => { fileInputRef.current?.click(); setShowMenu(false); }}
                                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 w-full text-left"
                                        >
                                            <RefreshCw size={12} /> Replace
                                        </button>
                                        <div className="h-px bg-slate-50 my-1" />
                                        <button
                                            onClick={() => onDelete(doc.id)}
                                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 w-full text-left"
                                        >
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                // --- Empty / Uploading State ---
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsHovered(true); }}
                    onDragLeave={() => setIsHovered(false)}
                    onDrop={handleDrop}
                    onClick={() => doc.status !== 'uploading' && fileInputRef.current?.click()}
                    className={clsx(
                        "relative flex items-center justify-between p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer group/item",
                        isHovered ? "border-primary bg-blue-50/50" : "border-slate-100 hover:border-blue-200 hover:bg-slate-50",
                        doc.status === 'uploading' && "cursor-wait"
                    )}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={doc.status === 'uploading'}
                    />

                    <div className="flex items-center gap-3 w-full">
                        <div className={clsx(
                            "size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            isHovered ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover/item:bg-blue-100 group-hover/item:text-primary"
                        )}>
                            {doc.status === 'uploading' ? (
                                <div className="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            ) : (
                                <UploadCloud size={16} />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <p className={clsx("text-xs font-bold truncate transition-colors", isHovered ? "text-primary" : "text-slate-700")}>
                                    {doc.label}
                                </p>
                                {/* Help Icon */}
                                <AlertCircle size={12} className="text-slate-300 group-hover/item:text-slate-400" />
                            </div>

                            {doc.status === 'uploading' ? (
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${doc.progress}%` }}
                                        className="h-full bg-primary rounded-full"
                                    />
                                </div>
                            ) : (
                                <p className="text-[10px] text-slate-400 truncate group-hover/item:text-blue-400">
                                    {isHovered ? 'Drop file to upload' : 'Click to upload or drag & drop'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
