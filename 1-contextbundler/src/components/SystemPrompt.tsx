'use client';

import { useState } from 'react';
import { Tooltip, InfoIcon } from './Tooltip';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/token-utils';

interface SystemPromptProps {
    value: string;
    onChange: (value: string) => void;
    enabled: boolean;
    onToggle: () => void;
}

export function SystemPrompt({
    value,
    onChange,
    enabled,
    onToggle,
}: SystemPromptProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleReset = () => {
        onChange(DEFAULT_SYSTEM_PROMPT);
    };

    return (
        <div className="system-prompt space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Toggle Button */}
                    <button
                        onClick={onToggle}
                        className={`
              relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-300
              ${enabled
                                ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                                : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-300'
                            }
            `}
                    >
                        {/* Custom toggle */}
                        <div className={`
              relative w-10 h-5 rounded-full transition-colors duration-300
              ${enabled ? 'bg-violet-500' : 'bg-zinc-700'}
            `}>
                            <div className={`
                absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md
                transition-all duration-300
                ${enabled ? 'left-5' : 'left-0.5'}
              `} />
                        </div>
                        <span>AI Instructions</span>
                    </button>

                    <Tooltip content="Prepends a professional AI persona to your bundle. This helps the AI understand the context better and provide more accurate responses.">
                        <span><InfoIcon /></span>
                    </Tooltip>
                </div>

                {/* Expand/Collapse */}
                {enabled && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-zinc-700/50 hover:border-zinc-600 transition-all"
                    >
                        {isExpanded ? 'Collapse' : 'Expand'}
                        <svg
                            className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Textarea */}
            {enabled && (
                <div className={`
          transition-all duration-500 ease-out overflow-hidden
          ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-[120px] opacity-100'}
        `}>
                    <div className="relative group">
                        {/* Glow effect on focus */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

                        <textarea
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Enter custom AI instructions..."
                            rows={isExpanded ? 10 : 3}
                            className={`
                relative w-full px-4 py-3 rounded-xl
                bg-zinc-900/80 border border-zinc-700/50
                text-sm text-zinc-300 placeholder-zinc-600
                leading-relaxed
                resize-none
                focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20
                transition-all duration-300
              `}
                            style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '13px' }}
                        />

                        {/* Actions overlay */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            {value !== DEFAULT_SYSTEM_PROMPT && (
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-500 hover:text-violet-400 bg-zinc-800/80 hover:bg-zinc-800 rounded-lg border border-zinc-700/50 hover:border-violet-500/30 transition-all"
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset
                                </button>
                            )}
                            <span className="px-2 py-1 text-xs text-zinc-600 bg-zinc-800/50 rounded font-mono">
                                {value.length}
                            </span>
                        </div>
                    </div>

                    {/* Hint */}
                    <p className="mt-3 text-xs text-zinc-600 flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-violet-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        This prompt will be prepended to your bundle output
                    </p>
                </div>
            )}

            {/* Collapsed preview when disabled */}
            {!enabled && (
                <p className="text-xs text-zinc-600 italic">
                    Enable to add AI context instructions to your bundle
                </p>
            )}
        </div>
    );
}
