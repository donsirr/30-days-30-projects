'use client';

import React from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function UrgentDeadlinesCard() {
    // Mock data
    const deadlines = [
        { id: 1, name: 'DOST-SEI Merit', daysLeft: 5, tags: ['Engineering', 'Science'] },
        { id: 2, name: 'Aboitiz Scholarship', daysLeft: 12, tags: ['Business'] },
        { id: 3, name: 'CHED Merit Program', daysLeft: 28, tags: ['Any'] },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 md:col-span-1 md:row-span-1 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-50 rounded-xl text-red-500">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 leading-none">Expiring</h3>
                        <p className="text-xs text-gray-400 font-medium mt-1">Action needed</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {deadlines.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group/item border border-transparent hover:border-gray-200">
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                            <span className="font-semibold text-sm text-gray-800 truncate pr-2">{item.name}</span>
                            <span className={clsx(
                                "text-[10px] font-bold px-2 py-0.5 w-fit rounded-md uppercase tracking-wider",
                                item.daysLeft < 14 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                            )}>
                                {item.daysLeft} days left
                            </span>
                        </div>
                        <ArrowUpRight size={16} className="text-gray-300 group-hover/item:text-gray-600 transition-colors" />
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
