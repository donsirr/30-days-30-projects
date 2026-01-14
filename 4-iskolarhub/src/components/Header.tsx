'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">IH</div>
                    <span className="font-bold text-xl text-primary tracking-tight hidden sm:block">Iskolar-Hub</span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    {/* Profile Readiness */}
                    <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center justify-between w-full md:w-40">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Profile Readiness</span>
                            <span className="text-[10px] font-bold text-secondary">75%</span>
                        </div>
                        <div className="w-28 md:w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                                className="h-full bg-secondary rounded-full"
                            />
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-primary border border-gray-200 shadow-sm">
                            <User size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
