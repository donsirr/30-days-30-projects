import React, { useState, useMemo } from 'react';
import { FeedItem } from '@/lib/types';
import { AnswerCard } from './AnswerCard';
import { Search, Filter, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ... (existing code until usage)

interface FeedProps {
    items: FeedItem[];
}

export const Feed: React.FC<FeedProps> = ({ items }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSource, setSelectedSource] = useState<string>('all');

    // Derive unique sources from items
    const uniqueSources = useMemo(() => {
        const sources = new Set<string>();
        items.forEach(item => {
            if (item.answer?.sourceFile) {
                sources.add(item.answer.sourceFile);
            }
        });
        return Array.from(sources);
    }, [items]);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            // Search
            const matchesSearch =
                item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer?.text.toLowerCase().includes(searchQuery.toLowerCase());

            // Filter
            const matchesSource =
                selectedSource === 'all' ||
                item.answer?.sourceFile === selectedSource;

            return matchesSearch && matchesSource;
        });
    }, [items, searchQuery, selectedSource]);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 pb-20">
            {/* Feed Sub-Header */}
            <div className="bg-slate-50/95 backdrop-blur-sm pt-4 pb-2 mb-4 border-b border-slate-200/50 transition-all">
                {/* Note: top position depends on header + input height. 
             If Input is fixed/sticky, we need to adjust 'top' or logic. 
             For now, I'll rely on normal flow or assume parent handles sticky stacking context. 
             Actually, making this sticky might conflict if input zone is also sticky. 
             I'll style it as a toolbar that appears at the top of the feed list.
         */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search feed..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 shadow-sm"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={selectedSource}
                            onChange={(e) => setSelectedSource(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer"
                        >
                            <option value="all">All Sources</option>
                            {uniqueSources.map(source => (
                                <option key={source} value={source}>{source}</option>
                            ))}
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="border-t-[4px] border-t-slate-400 border-x-[3px] border-x-transparent" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 min-h-[50vh]">
                <AnimatePresence initial={false} mode="popLayout">
                    {filteredItems.map(item => (
                        <AnswerCard key={item.id} item={item} />
                    ))}

                    {filteredItems.length === 0 && items.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 text-slate-400"
                        >
                            No matches found.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
