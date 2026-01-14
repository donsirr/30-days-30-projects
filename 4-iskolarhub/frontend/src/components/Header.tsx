'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell } from 'lucide-react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDocuments } from '@/hooks/useDocuments';

export default function Header() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    // Readiness Score
    const { readinessScore } = useDocuments();

    // Notifications State
    const [showNotifications, setShowNotifications] = useState(false);
    const notifications = [
        { id: 1, title: 'Application Verified', message: 'Your PSA Birth Certificate has been verified.', time: '2h ago', isRead: false },
        { id: 2, title: 'New Scholarship Match', message: 'You are eligible for the DOST-SEI Scholarship.', time: '5h ago', isRead: false },
        { id: 3, title: 'Profile Update', message: 'Please complete your bio to increase visibility.', time: '1d ago', isRead: true },
    ];
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo & Nav */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 cursor-pointer">
                        <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">IH</div>
                        <span className="font-bold text-xl text-primary tracking-tight hidden sm:block">Iskolar-Hub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive('/') ? 'bg-blue-50 text-primary' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/explore"
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive('/explore') ? 'bg-blue-50 text-primary' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            Scholarships
                        </Link>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    {/* Profile Readiness */}
                    <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center justify-between w-full md:w-40">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Profile Readiness</span>
                            <span className="text-[10px] font-bold text-secondary">{readinessScore}%</span>
                        </div>
                        <div className="w-28 md:w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${readinessScore}%` }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                                className="h-full bg-secondary rounded-full"
                            />
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-2 relative">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-blue-50 text-primary' : 'hover:bg-gray-100 text-gray-600'}`}
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
                                )}
                            </button>

                            {/* Dropdown */}
                            <AnimatePresence>
                                {showNotifications && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-12 z-20 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                                        >
                                            <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                                <span className="text-xs font-bold text-gray-700">Notifications</span>
                                                <span className="text-[10px] text-blue-500 font-medium cursor-pointer">Mark all read</span>
                                            </div>
                                            <div className="max-h-[300px] overflow-y-auto">
                                                {notifications.map(n => (
                                                    <div key={n.id} className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className="text-sm font-bold text-gray-800">{n.title}</h4>
                                                            <span className="text-[10px] text-gray-400">{n.time}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 leading-snug">{n.message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-2 text-center border-t border-gray-50">
                                                <button className="text-[10px] font-bold text-gray-500 hover:text-primary transition-colors">View All History</button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Link */}
                        <Link href="/profile">
                            <button className={`p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm ${isActive('/profile') ? 'bg-blue-50 text-primary border-blue-200 ring-2 ring-blue-100' : 'text-primary'}`}>
                                <User size={20} />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
