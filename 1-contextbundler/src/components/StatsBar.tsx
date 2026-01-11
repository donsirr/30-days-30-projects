'use client';

import { useEffect, useState, useMemo } from 'react';
import { formatBytes } from '@/lib/file-utils';
import { countTokens, formatTokenCount, getTokenWarningLevel, debounce } from '@/lib/token-utils';
import { Tooltip, InfoIcon } from './Tooltip';

interface StatsBarProps {
    fileCount: number;
    totalSize: number;
    skippedCount: number;
    bundleContent: string;
    stripComments: boolean;
    onToggleStripComments: () => void;
}

export function StatsBar({
    fileCount,
    totalSize,
    skippedCount,
    bundleContent,
    stripComments,
    onToggleStripComments,
}: StatsBarProps) {
    const [tokenCount, setTokenCount] = useState(0);
    const [isCountingTokens, setIsCountingTokens] = useState(false);

    // Debounced token counting
    const debouncedCountTokens = useMemo(
        () =>
            debounce((content: string) => {
                if (!content) {
                    setTokenCount(0);
                    setIsCountingTokens(false);
                    return;
                }

                const tokens = countTokens(content);
                setTokenCount(tokens);
                setIsCountingTokens(false);
            }, 300),
        []
    );

    useEffect(() => {
        if (bundleContent) {
            setIsCountingTokens(true);
            debouncedCountTokens(bundleContent);
        } else {
            setTokenCount(0);
        }
    }, [bundleContent, debouncedCountTokens]);

    const warningLevel = getTokenWarningLevel(tokenCount);

    return (
        <div className="stats-bar relative overflow-hidden">
            {/* Background with gradient border effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 via-transparent to-violet-500/10" />

            <div className="relative flex flex-wrap items-center justify-between gap-4 px-5 py-4 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl">
                {/* Stats Grid */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    {/* Files */}
                    <StatCard
                        icon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        }
                        label="Files"
                        value={fileCount.toString()}
                        color="cyan"
                    />

                    {/* Size */}
                    <StatCard
                        icon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                            </svg>
                        }
                        label="Size"
                        value={formatBytes(totalSize)}
                        color="blue"
                    />

                    {/* Token count with tooltip */}
                    <Tooltip
                        content="Estimated using GPT-4o encoding (o200k_base). High counts may exceed context windows in smaller models."
                        side="bottom"
                    >
                        <div className={`
              flex items-center gap-3 px-3 py-2 rounded-lg cursor-help
              transition-colors duration-200
              ${warningLevel === 'danger' ? 'bg-red-500/10 border border-red-500/20' :
                                warningLevel === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
                                    'bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600'}
            `}>
                            <span className={`
                ${warningLevel === 'danger' ? 'text-red-400' :
                                    warningLevel === 'warning' ? 'text-amber-400' : 'text-emerald-400'}
              `}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                </svg>
                            </span>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Tokens</span>
                                <span className={`
                  text-sm font-bold flex items-center gap-1.5
                  ${warningLevel === 'danger' ? 'text-red-400' :
                                        warningLevel === 'warning' ? 'text-amber-400' : 'text-emerald-400'}
                `}>
                                    {isCountingTokens ? (
                                        <span className="animate-pulse">counting...</span>
                                    ) : (
                                        <>
                                            ~{formatTokenCount(tokenCount)}
                                            {warningLevel !== 'safe' && (
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                                </svg>
                                            )}
                                        </>
                                    )}
                                </span>
                            </div>
                            <InfoIcon className="ml-1" />
                        </div>
                    </Tooltip>

                    {/* Skipped count */}
                    {skippedCount > 0 && (
                        <Tooltip
                            content={`${skippedCount} files/folders were automatically filtered (node_modules, lockfiles, binaries, etc.)`}
                            side="bottom"
                        >
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 cursor-help">
                                <span className="text-amber-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                                    </svg>
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">Filtered</span>
                                    <span className="text-sm font-bold text-amber-400">{skippedCount}</span>
                                </div>
                            </div>
                        </Tooltip>
                    )}
                </div>

                {/* Strip Comments Toggle */}
                <Tooltip
                    content="Remove comments from code to reduce token count. May strip important documentation."
                    side="left"
                >
                    <button
                        onClick={onToggleStripComments}
                        className={`
              group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-300
              ${stripComments
                                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                                : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-300'
                            }
            `}
                    >
                        {/* Custom checkbox */}
                        <span className={`
              flex items-center justify-center w-5 h-5 rounded-md border-2
              transition-all duration-300
              ${stripComments
                                ? 'border-cyan-400 bg-cyan-400'
                                : 'border-zinc-500 group-hover:border-zinc-400'}
            `}>
                            {stripComments && (
                                <svg className="w-3 h-3 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            )}
                        </span>
                        Strip Comments
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: 'cyan' | 'blue' | 'violet';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
    const colorClasses = {
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    };

    return (
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${colorClasses[color]}`}>
            <span className={colorClasses[color].split(' ')[0]}>{icon}</span>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
                <span className={`text-sm font-bold ${colorClasses[color].split(' ')[0]}`}>{value}</span>
            </div>
        </div>
    );
}
