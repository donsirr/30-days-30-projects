'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import ScholarshipCard, { Requirement } from '@/components/ScholarshipCard';

export default function ScholarshipSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    const categories = ['All', 'Government', 'Private', 'LGU', 'Foundations'];

    // Mock Data
    const scholarships = [
        {
            id: 1,
            title: 'SM Foundation Scholarship',
            provider: 'SM Foundation',
            matchPercentage: 98,
            daysRemaining: 12,
            amount: '₱100k/yr',
            requirements: [
                { type: 'gwa', label: 'Minimum GWA', value: '88% or higher', isMet: true },
                { type: 'income', label: 'Household Income', value: '< ₱250k/year', isMet: true },
            ] as Requirement[],
            category: 'Foundations'
        },
        {
            id: 2,
            title: 'DOST-SEI Merit Scholarship',
            provider: 'DOST',
            matchPercentage: 92,
            daysRemaining: 5,
            amount: 'Full + Stipend',
            requirements: [
                { type: 'gwa', label: 'Minimum GWA', value: '85% or higher', isMet: true },
                { type: 'document', label: 'Course', value: 'STEM Only', isMet: true },
            ] as Requirement[],
            category: 'Government'
        },
        {
            id: 3,
            title: 'Quezon City Scholarship',
            provider: 'LGU - QC',
            matchPercentage: 100,
            daysRemaining: 20,
            amount: '₱10k/year',
            requirements: [
                { type: 'location', label: 'Residency', value: 'Quezon City', isMet: true },
            ] as Requirement[],
            category: 'LGU'
        },
        {
            id: 4,
            title: 'Ayala Foundation',
            provider: 'Ayala Group',
            matchPercentage: 85,
            daysRemaining: 45,
            amount: 'Full Tuition',
            requirements: [
                { type: 'gwa', label: 'Minimum GWA', value: '90%', isMet: false },
            ] as Requirement[],
            category: 'Foundations'
        },
    ];

    const filtered = scholarships.filter(s =>
        (activeTab === 'All' || s.category === activeTab) &&
        (s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.provider.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Search & Filter Top Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 sticky top-20 z-30">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search scholarships..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Toggle (Mobile) */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl font-bold text-slate-600 active:bg-slate-100 active:scale-95 transition-transform"
                    >
                        <SlidersHorizontal size={18} />
                        <span>Filters</span>
                    </button>

                    {/* Desktop Filters / Mobile Drawer Content */}
                    <div className={`flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${activeTab === cat ? 'bg-primary text-white shadow-md shadow-blue-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.length > 0 ? (
                    filtered.map(s => (
                        <ScholarshipCard
                            key={s.id}
                            {...s}
                        />
                    ))
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full py-12 flex flex-col items-center justify-center text-center opacity-50"
                    >
                        <div className="size-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Search size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">No Matches Found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                        <button onClick={() => { setSearchQuery(''); setActiveTab('All'); }} className="mt-4 text-primary font-bold hover:underline">Clear all filters</button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
