'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import ScholarshipCard, { Requirement } from './ScholarshipCard';

export default function MatchFeed() {
    const [matches, setMatches] = useState<any[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    const loadMatches = () => {
        try {
            const stored = localStorage.getItem('matchResults');
            if (stored) {
                const parsed = JSON.parse(stored);

                // Map API MatchResult to UI format
                const mapped = parsed.map((m: any) => ({
                    id: m.scholarshipId,
                    title: m.scholarshipName,
                    org: m.category,
                    matchScore: m.matchScore,
                    daysLeft: m.daysRemaining,
                    amount: 'View Details',
                    requirements: [
                        ...(m.reasons || []).map((r: string) => ({
                            type: 'gwa', // simplified mapping
                            label: 'Match Factor',
                            value: r,
                            isMet: true
                        })),
                        ...(m.warnings || []).map((w: string) => ({
                            type: 'document',
                            label: 'Attention Needed',
                            value: w,
                            isMet: false
                        }))
                    ]
                }));

                setMatches(mapped);
            }
        } catch (e) {
            console.error('Failed to load matches', e);
        } finally {
            setHasLoaded(true);
        }
    };

    useEffect(() => {
        // Initial load
        loadMatches();

        // Listen for updates from Quiz
        const handleUpdate = () => loadMatches();
        window.addEventListener('matchesUpdated', handleUpdate);

        return () => window.removeEventListener('matchesUpdated', handleUpdate);
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    if (!hasLoaded) return null;

    if (matches.length === 0) {
        return (
            <div className="col-span-1 md:col-span-3 flex flex-col gap-4 mt-2">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="text-secondary" size={24} />
                        Recommended for You
                    </h3>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-300 text-center">
                    <div className="inline-flex items-center justify-center size-16 rounded-full bg-yellow-50 text-yellow-500 mb-4">
                        <Lightbulb size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Matches Found Yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        Try taking the 1-Minute Scan to find scholarships that fit your profile. You can also try adjusting your filters or looking for LGU scholarships in your specific city.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div id="match-feed" className="col-span-1 md:col-span-3 flex flex-col gap-4 mt-2">
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
