'use client';

import React from 'react';
import { FileText, CheckCircle2, Circle, Upload } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function DocumentVaultCard() {
    const docs = [
        { name: 'PSA Birth Cert', status: 'completed' },
        { name: 'Form 138 (G11)', status: 'completed' },
        { name: 'ITR / Indigency', status: 'pending' },
        { name: 'Good Moral', status: 'pending' },
    ];

    const progress = Math.round((docs.filter(d => d.status === 'completed').length / docs.length) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 md:col-span-1 md:row-span-1 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col"
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 rounded-xl text-primary">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 leading-none">Vault</h3>
                        <p className="text-xs text-gray-400 font-medium mt-1">Requirements</p>
                    </div>
                </div>
                <div className="relative size-10 flex items-center justify-center">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: progress / 100 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-secondary"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray="100, 100"
                        />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-gray-700">{progress}%</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-3 mt-2">
                {docs.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                            {doc.status === 'completed' ? (
                                <CheckCircle2 size={18} className="text-secondary shrink-0" />
                            ) : (
                                <Circle size={18} className="text-gray-300 shrink-0 group-hover:text-primary transition-colors" />
                            )}
                            <span className={clsx(
                                "text-sm font-medium transition-colors",
                                doc.status === 'completed' ? "text-gray-500 line-through decoration-gray-200" : "text-gray-700 group-hover:text-primary"
                            )}>
                                {doc.name}
                            </span>
                        </div>
                        {doc.status === 'pending' && (
                            <Upload size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
