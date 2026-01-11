'use client';

import { useState, useCallback } from 'react';

interface CopyButtonProps {
    content: string;
    disabled?: boolean;
}

export function CopyButton({ content, disabled }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(false);

    const handleCopy = useCallback(async () => {
        if (!content || disabled) return;

        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setError(false);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error('Failed to copy:', err);
            setError(true);
            setTimeout(() => setError(false), 2500);
        }
    }, [content, disabled]);

    const isDisabled = disabled || !content;

    return (
        <button
            onClick={handleCopy}
            disabled={isDisabled}
            className={`
        group relative flex items-center gap-3
        px-6 py-3.5 rounded-xl
        font-medium text-sm
        transition-all duration-300 ease-out
        overflow-hidden
        ${copied
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                    : error
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : isDisabled
                            ? 'bg-zinc-800/30 text-zinc-600 border-zinc-700/30 cursor-not-allowed'
                            : 'bg-zinc-800/50 text-zinc-200 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white hover:shadow-lg'
                }
        border backdrop-blur-sm
      `}
        >
            {/* Background gradient on hover */}
            {!copied && !error && !isDisabled && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}

            {/* Icon */}
            <span className="relative w-5 h-5 flex items-center justify-center">
                {copied ? (
                    <svg
                        className="w-5 h-5 text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                        />
                    </svg>
                ) : error ? (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg
                        className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                )}
            </span>

            {/* Text */}
            <span className="relative font-medium">
                {copied ? 'Copied to Clipboard!' : error ? 'Failed to Copy' : 'Copy Bundle'}
            </span>

            {/* Subtle arrow on hover */}
            {!copied && !error && !isDisabled && (
                <svg
                    className="relative w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            )}

            {/* Success checkmark animation ring */}
            {copied && (
                <span className="absolute inset-0 rounded-xl border-2 border-emerald-400/50 animate-ping opacity-30" />
            )}
        </button>
    );
}
