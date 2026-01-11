'use client';

import { useCallback, useState } from 'react';
import { Tooltip } from './Tooltip';

interface DropZoneProps {
    onDrop: (items: DataTransferItemList) => void;
    onSelectFolder: () => void;
    isProcessing: boolean;
    supportsDirectoryPicker: boolean;
    skippedCount?: number;
}

export function DropZone({
    onDrop,
    onSelectFolder,
    isProcessing,
    supportsDirectoryPicker,
    skippedCount = 0,
}: DropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (isProcessing) return;
            if (e.dataTransfer.items.length > 0) {
                onDrop(e.dataTransfer.items);
            }
        },
        [isProcessing, onDrop]
    );

    return (
        <div
            className={`
        drop-zone group relative
        flex flex-col items-center justify-center
        min-h-[320px] rounded-2xl
        transition-all duration-500 ease-out cursor-pointer
        overflow-hidden
        ${isDragging ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
        ${isProcessing ? 'pointer-events-none' : ''}
      `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={!isProcessing ? onSelectFolder : undefined}
        >
            {/* Animated background gradient */}
            <div className={`
        absolute inset-0 
        bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800/90
        transition-all duration-500
      `} />

            {/* Glassmorphism overlay */}
            <div className={`
        absolute inset-0
        backdrop-blur-xl
        border-2 rounded-2xl
        transition-all duration-300
        ${isDragging
                    ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_60px_rgba(34,211,238,0.3)]'
                    : 'border-dashed border-zinc-700/70 group-hover:border-zinc-600'
                }
      `} />

            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className={`
          absolute -top-1/2 -left-1/2 w-full h-full
          bg-gradient-radial from-cyan-500/20 to-transparent
          transition-all duration-700
          ${isDragging ? 'opacity-100 scale-150' : 'opacity-0 scale-100'}
        `} />
                <div className={`
          absolute -bottom-1/2 -right-1/2 w-full h-full
          bg-gradient-radial from-violet-500/20 to-transparent
          transition-all duration-700 delay-100
          ${isDragging ? 'opacity-100 scale-150' : 'opacity-0 scale-100'}
        `} />
            </div>

            {/* Animated grid pattern */}
            <div className={`
        absolute inset-0 overflow-hidden rounded-2xl opacity-30
        bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
        bg-[size:32px_32px]
        transition-opacity duration-300
        ${isDragging ? 'opacity-50' : 'opacity-20'}
      `} />

            {/* Processing overlay */}
            {isProcessing && (
                <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center z-20 gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-2 border-zinc-700 rounded-full" />
                        <div className="absolute top-0 left-0 w-16 h-16 border-2 border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin" />
                        <div className="absolute top-2 left-2 w-12 h-12 border-2 border-b-violet-400 border-l-violet-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    </div>
                    <p className="text-zinc-400 font-medium">Scanning project...</p>
                </div>
            )}

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">
                {/* Icon container with hover animation */}
                <div className={`
          relative mb-6 p-6 rounded-2xl
          bg-gradient-to-br from-zinc-800/90 to-zinc-900/90
          border border-zinc-700/50
          backdrop-blur-sm
          transition-all duration-500
          ${isDragging
                        ? 'scale-125 border-cyan-400/50 shadow-[0_0_40px_rgba(34,211,238,0.3)]'
                        : 'group-hover:scale-110 group-hover:border-zinc-600'
                    }
        `}>
                    {/* Glow ring */}
                    <div className={`
            absolute inset-0 rounded-2xl
            bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-500/20
            transition-opacity duration-300
            ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
          `} />

                    <svg
                        className={`relative w-12 h-12 transition-all duration-300 ${isDragging ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-zinc-300'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                    </svg>
                </div>

                {/* Text content */}
                <div className="space-y-3">
                    <h3 className={`text-xl font-semibold transition-colors duration-300 ${isDragging ? 'text-cyan-400' : 'text-zinc-200'}`}>
                        {isDragging ? 'Release to bundle!' : 'Drop your project folder'}
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-xs">
                        {supportsDirectoryPicker ? (
                            <>or <span className="text-cyan-400 hover:underline font-medium">click to browse</span> your files</>
                        ) : (
                            'Drag and drop a folder to get started'
                        )}
                    </p>
                </div>
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="flex items-center justify-between gap-4">
                    {/* Privacy badge */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 group-hover:border-zinc-600 transition-colors">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20">
                            <svg
                                className="w-3.5 h-3.5 text-emerald-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <span className="text-xs text-zinc-400 font-medium">
                            100% Local Processing
                        </span>
                    </div>

                    {/* Smart filter badge */}
                    <Tooltip content="Automatically filtering out node_modules, lockfiles, binaries, and build artifacts to save tokens.">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 cursor-help hover:border-amber-500/30 transition-all group/filter">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20">
                                <svg
                                    className="w-3.5 h-3.5 text-amber-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                                </svg>
                            </div>
                            <span className="text-xs text-zinc-400 font-medium">
                                Smart Filtering
                            </span>
                            {skippedCount > 0 && (
                                <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold animate-pulse">
                                    {skippedCount}
                                </span>
                            )}
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
