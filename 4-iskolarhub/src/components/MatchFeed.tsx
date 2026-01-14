'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import ScholarshipCard, { Requirement } from './ScholarshipCard';

export default function MatchFeed() {
    const matches = [
        {
            id: 1,
            title: 'SM Foundation Scholarship',
            org: 'SM Foundation',
            matchScore: 98,
            daysLeft: 12,
            amount: '₱100k/yr',
            requirements: [
                { type: 'gwa', label: 'Minimum GWA', value: '88% or higher', isMet: true },
                { type: 'income', label: 'Household Income', value: '< ₱250k/year', isMet: true },
                { type: 'location', label: 'Location', value: 'NCR', isMet: true },
            ] as Requirement[]
        },
        {
            id: 2,
            title: 'Landbank Gawad Patnubay',
            org: 'Landbank',
            matchScore: 95,
            daysLeft: 35,
            amount: 'Full Tuition',
            requirements: [
                { type: 'gwa', label: 'Minimum GWA', value: '85% or higher', isMet: true },
                { type: 'document', label: 'Course', value: 'Agriculture Related', isMet: true },
            ] as Requirement[]
        },
        {
            id: 3,
            title: 'Cebu City Scholarship',
            org: 'Cebu City Govt',
            matchScore: 89,
            daysLeft: 5,
            amount: '₱20k/sem',
            requirements: [
                { type: 'location', label: 'Residency', value: 'Cebu City', isMet: true },
                { type: 'gwa', label: 'Minimum GWA', value: '85% or higher', isMet: true },
                { type: 'income', label: 'Income', value: 'Any', isMet: true },
            ] as Requirement[]
        },
        {
            id: 4,
            title: 'Megaworld Foundation',
            org: 'Megaworld',
            matchScore: 85,
            daysLeft: 45,
            amount: 'Full + Allow',
            requirements: [
                { type: 'gwa', label: 'Minimum GWA', value: '85% or higher', isMet: true },
                { type: 'document', label: 'Certificate', value: 'Good Moral', isMet: false },
            ] as Requirement[]
        },
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {matches.map((match) => (
                    <ScholarshipCard
                        key={match.id}
                        title={match.title}
                        provider={match.org}
                        matchPercentage={match.matchScore}
                        daysRemaining={match.daysLeft}
                        requirements={match.requirements}
                        amount={match.amount}
                    />
                ))}
            </motion.div>
        </div>
    );
}
