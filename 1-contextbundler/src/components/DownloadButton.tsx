'use client';

import { useCallback } from 'react';

interface DownloadButtonProps {
    content: string;
    disabled?: boolean;
    filename?: string;
}

export function DownloadButton({
    content,
    disabled,
    filename = 'context-bundle.md'
}: DownloadButtonProps) {

    const handleDownload = useCallback(() => {
        if (!content || disabled) return;

        try {
            // Create blob from content
            const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });

            // Create download URL
            const url = URL.createObjectURL(blob);

            // Create temporary link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download:', err);
        }
    }, [content, disabled, filename]);

    const isDisabled = disabled || !content;

    return (
        <button
            onClick={handleDownload}
            disabled={isDisabled}
            className={`
        group relative flex items-center gap-2
        px-4 py-3.5 rounded-xl
        font-medium text-sm
        transition-all duration-300 ease-out
        ${isDisabled
                    ? 'bg-zinc-800/30 text-zinc-600 border-zinc-700/30 cursor-not-allowed'
                    : 'bg-zinc-800/50 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white'
                }
        border backdrop-blur-sm
      `}
            title="Download as Markdown file"
        >
            {/* Download icon */}
            <svg
                className={`w-4 h-4 transition-transform duration-200 ${!isDisabled ? 'group-hover:translate-y-0.5' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>

            <span>Export</span>
        </button>
    );
}
