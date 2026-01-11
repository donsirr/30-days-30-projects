'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

interface TooltipProps {
    children: ReactNode;
    content: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    delayDuration?: number;
}

export function Tooltip({
    children,
    content,
    side = 'top',
    align = 'center',
    delayDuration = 200,
}: TooltipProps) {
    return (
        <TooltipPrimitive.Provider delayDuration={delayDuration}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side={side}
                        align={align}
                        sideOffset={6}
                        className="
              z-50 max-w-xs px-3 py-2 text-xs text-zinc-200
              bg-zinc-800/95 backdrop-blur-sm rounded-lg
              border border-zinc-700/50 shadow-xl
              animate-in fade-in-0 zoom-in-95
              data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
              data-[side=bottom]:slide-in-from-top-2
              data-[side=left]:slide-in-from-right-2
              data-[side=right]:slide-in-from-left-2
              data-[side=top]:slide-in-from-bottom-2
            "
                    >
                        {content}
                        <TooltipPrimitive.Arrow className="fill-zinc-800/95" />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}

// Info icon component for tooltip triggers
export function InfoIcon({ className = '' }: { className?: string }) {
    return (
        <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full bg-zinc-700/50 text-zinc-400 hover:text-zinc-300 cursor-help transition-colors ${className}`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </span>
    );
}
