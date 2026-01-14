'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Edit2 } from 'lucide-react';

export default function ProfilePage() {
    // Mock user data
    const user = {
        name: "Alex Doe",
        email: "alex.doe@example.com",
        phone: "+63 912 345 6789",
        location: "Quezon City, Philippines",
        bio: "Aspiring Computer Science student with a passion for AI and social impact. Looking for scholarships to fund my education at UP Diliman.",
        education: "Senior High School Graduate (STEM)",
        gpa: "94.5",
        achievements: [
            "Consistent Honor Student",
            "Champion, District Math Olympiad",
            "President, Student Council"
        ]
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10" />

                <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 pt-10">
                    <div className="size-32 rounded-full bg-indigo-100 border-4 border-white shadow-md flex items-center justify-center text-indigo-500">
                        <User size={64} />
                    </div>

                    <div className="flex-1 text-center md:text-left mb-2">
                        <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                        <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                            <MapPin size={16} /> {user.location}
                        </p>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                        <Edit2 size={16} /> Edit Profile
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Contact & Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-slate-800">Contact Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="size-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <Mail size={16} />
                                </div>
                                <span className="text-sm font-medium truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="size-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                                    <Phone size={16} />
                                </div>
                                <span className="text-sm font-medium">{user.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2rem] p-6 text-white shadow-lg shadow-blue-200">
                        <h3 className="font-bold text-lg mb-1 opacity-90">Academic Standing</h3>
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-4xl font-bold">{user.gpa}</span>
                            <span className="text-sm font-medium opacity-75 mb-1.5">GWA</span>
                        </div>
                        <div className="px-3 py-1.5 bg-white/20 rounded-lg inline-block text-xs font-bold backdrop-blur-sm">
                            {user.education}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Bio & Achievements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-2 space-y-6"
                >
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <BookOpen size={20} className="text-indigo-500" />
                            About Me
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            {user.bio}
                        </p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Award size={20} className="text-amber-500" />
                            Key Achievements
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {user.achievements.map((achievement, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                                    <div className="size-2 rounded-full bg-amber-400 shrink-0" />
                                    <span className="text-sm font-bold text-slate-700">{achievement}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
