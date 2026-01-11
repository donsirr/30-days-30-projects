'use client';

import { useMemo, useRef, useEffect, useState } from 'react';

interface PreviewProps {
    content: string;
    isProcessing: boolean;
}

// Maximum characters to show in preview to prevent performance issues
const MAX_PREVIEW_CHARS = 50000;
const TRUNCATION_MESSAGE = '\n\n... [Preview truncated for performance. Full content will be copied.] ...';

export function Preview({ content, isProcessing }: PreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showFullPreview, setShowFullPreview] = useState(false);

    // Auto-scroll to top when new content is loaded
    useEffect(() => {
        if (content && containerRef.current) {
            containerRef.current.scrollTop = 0;
            setShowFullPreview(false);
        }
    }, [content]);

    // Truncate content for preview if too long
    const { displayContent, isTruncated, totalLines, displayedLines } = useMemo(() => {
        if (!content) return { displayContent: '', isTruncated: false, totalLines: 0, displayedLines: 0 };

        const lines = content.split('\n');
        const totalLines = lines.length;

        if (showFullPreview || content.length <= MAX_PREVIEW_CHARS) {
            return {
                displayContent: content,
                isTruncated: false,
                totalLines,
                displayedLines: totalLines
            };
        }

        // Find a good truncation point (end of a file block)
        let truncatedContent = content.slice(0, MAX_PREVIEW_CHARS);

        // Try to truncate at the end of a code block
        const lastCodeBlockEnd = truncatedContent.lastIndexOf('```\n');
        if (lastCodeBlockEnd > MAX_PREVIEW_CHARS * 0.5) {
            truncatedContent = truncatedContent.slice(0, lastCodeBlockEnd + 4);
        }

        const displayedLines = truncatedContent.split('\n').length;

        return {
            displayContent: truncatedContent + TRUNCATION_MESSAGE,
            isTruncated: true,
            totalLines,
            displayedLines
        };
    }, [content, showFullPreview]);

    // Simple syntax highlighting for the preview
    const highlightedContent = useMemo(() => {
        if (!displayContent) return '';

        // Escape HTML first
        let escaped = displayContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Apply highlighting
        return escaped
            // AI System Prompt header
            .replace(/^(--- AI SYSTEM PROMPT ---)/gm, '<span class="text-violet-400 font-bold">$1</span>')
            .replace(/^(--- PROJECT STRUCTURE ---)/gm, '<span class="text-violet-400 font-bold">$1</span>')
            // Headers (markdown)
            .replace(/^(# [^\n]*)/gm, '<span class="text-cyan-300 font-bold text-lg">$1</span>')
            .replace(/^(## [^\n]*)/gm, '<span class="text-cyan-400 font-semibold">$1</span>')
            // File headers with special styling
            .replace(/^(### File: )([^\n]+)/gm, '<span class="text-zinc-500">$1</span><span class="text-amber-400 font-medium">$2</span>')
            // Code block markers with language
            .replace(/^(```)([\w]*)$/gm, '<span class="text-zinc-600">$1</span><span class="text-emerald-500">$2</span>')
            // Tree structure characters
            .replace(/(^[│├└─\s]+)/gm, '<span class="text-zinc-600">$1</span>')
            // Blockquotes (meta info)
            .replace(/^(&gt;[^\n]*)/gm, '<span class="text-zinc-500 italic">$1</span>');
    }, [displayContent]);

    if (!content && !isProcessing) {
        return (
            <div className="preview-empty flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6">
                <div className="relative mb-6">
                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-zinc-700/50 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-0 rounded-full border border-zinc-700/30 animate-ping opacity-10" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />

                    <div className="relative p-5 rounded-2xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50">
                        <svg
                            className="w-10 h-10 text-zinc-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                        </svg>
                    </div>
                </div>
                <h4 className="text-lg font-medium text-zinc-400 mb-2">No bundle yet</h4>
                <p className="text-sm text-zinc-600 max-w-xs">
                    Drop a project folder to generate your LLM-ready bundle
                </p>
            </div>
        );
    }

    if (isProcessing) {
        return (
            <div className="preview-loading flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
                {/* Animated loading rings */}
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-2 border-zinc-700 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin" />
                    <div className="absolute inset-2 border-2 border-b-violet-400 border-l-violet-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    <div className="absolute inset-4 border-2 border-t-blue-400 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
                </div>

                <div className="text-center">
                    <p className="text-zinc-300 font-medium mb-1">Bundling your project...</p>
                    <p className="text-sm text-zinc-600">This may take a moment for large codebases</p>
                </div>
            </div>
        );
    }

    return (
        <div className="preview-wrapper h-full flex flex-col overflow-hidden">
            {/* Truncation notice */}
            {isTruncated && (
                <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20">
                            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-amber-400">
                            Preview limited to {displayedLines.toLocaleString()} of {totalLines.toLocaleString()} lines
                        </span>
                    </div>
                    <button
                        onClick={() => setShowFullPreview(true)}
                        className="px-3 py-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/20 transition-colors"
                    >
                        Show All
                    </button>
                </div>
            )}

            {/* Scrollable content area */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden"
                style={{
                    maxHeight: 'calc(100vh - 350px)',
                    minHeight: '300px'
                }}
            >
                <pre
                    className="p-6 text-sm text-zinc-300 whitespace-pre-wrap break-words leading-relaxed"
                    style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" }}
                    dangerouslySetInnerHTML={{ __html: highlightedContent }}
                />
            </div>
        </div>
    );
}
