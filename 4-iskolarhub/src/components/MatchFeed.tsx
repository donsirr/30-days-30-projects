'use client';

import React from 'react';
import { Bookmark, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MatchFeed() {
    const matches = [
        { id: 1, title: 'SM Foundation Scholarship', org: 'SM Foundation', deadline: 'Oct 30', location: 'Nationwide', matchScore: 98, amount: '₱100k/yr' },
        { id: 2, title: 'Landbank Gawad Patnubay', org: 'Landbank', deadline: 'Nov 15', location: 'Nationwide', matchScore: 95, amount: 'Full Tuition' },
        { id: 3, title: 'Cebu City Scholarship', org: 'Cebu City Govt', deadline: 'Dec 01', location: 'Cebu City', matchScore: 89, amount: '₱20k/sem' },
        { id: 4, title: 'Megaworld Foundation', org: 'Megaworld', deadline: 'Jan 10', location: 'Metro Manila', matchScore: 85, amount: 'Full + Allow' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="col-span-1 md:col-span-3 flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="text-secondary" size={24} />
                    Recommended for You
                </h3>
                <button className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors">See All Matches</button>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {matches.map((match) => (
                    <motion.div
                        variants={item}
                        key={match.id}
                        className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex justify-between items-start mb-3">
                            <div className="px-2.5 py-1 bg-green-50 text-secondary text-xs font-bold rounded-lg border border-green-100">
                                {match.matchScore}% Match
                            </div>
                            <button className="text-gray-300 hover:text-primary transition-colors hover:scale-110 active:scale-90">
                                <Bookmark size={20} />
                            </button>
                        </div>

                        <h4 className="font-bold text-gray-900 mb-1 line-clamp-1 text-lg group-hover:text-primary transition-colors">{match.title}</h4>
                        <p className="text-sm text-gray-500 mb-4 font-medium">{match.org}</p>

                        <div className="flex items-center gap-3 text-xs text-gray-500 font-semibold mb-3">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                <Calendar size={14} className="text-gray-400" />
                                <span>{match.deadline}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                <MapPin size={14} className="text-gray-400" />
                                <span>{match.location}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-50 pt-3 mt-1">
                            <span className="text-sm font-bold text-primary">{match.amount}</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
