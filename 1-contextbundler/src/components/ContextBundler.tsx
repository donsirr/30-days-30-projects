'use client';

import { useState, useCallback, useEffect } from 'react';
import { DropZone } from './DropZone';
import { Preview } from './Preview';
import { StatsBar } from './StatsBar';
import { CopyButton } from './CopyButton';
import { DownloadButton } from './DownloadButton';
import { SettingsPanel } from './SettingsPanel';
import {
    processDirectory,
    processDroppedItems,
    generateBundle,
    ProcessingResult,
} from '@/lib/file-utils';
import { redactSecrets as redactSecretsFunc } from '@/lib/secret-redactor';
import { AI_PERSONAS, getDefaultPersonaId } from '@/lib/ai-personas';

export function ContextBundler() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [result, setResult] = useState<ProcessingResult | null>(null);
    const [bundleContent, setBundleContent] = useState('');
    const [supportsDirectoryPicker, setSupportsDirectoryPicker] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Settings state
    const [stripComments, setStripComments] = useState(false);
    const [redactSecrets, setRedactSecrets] = useState(false);
    const [redactionCount, setRedactionCount] = useState(0);

    // AI Persona state
    const [selectedPersonaId, setSelectedPersonaId] = useState(getDefaultPersonaId());
    const [customPrompt, setCustomPrompt] = useState('');

    // Check for File System Access API support
    useEffect(() => {
        setSupportsDirectoryPicker('showDirectoryPicker' in window);
    }, []);

    // Get the current system prompt based on selection
    const getCurrentSystemPrompt = useCallback(() => {
        if (selectedPersonaId === 'custom') {
            return customPrompt;
        }
        const persona = AI_PERSONAS.find(p => p.id === selectedPersonaId);
        return persona?.systemPrompt || '';
    }, [selectedPersonaId, customPrompt]);

    // Generate the full bundle with all options applied
    const generateFullBundle = useCallback((processingResult: ProcessingResult) => {
        // Generate the main bundle
        const { bundle, redactionCount: count } = generateBundle(processingResult, {
            stripComments,
            redactSecrets,
            redactFunction: redactSecretsFunc,
        });

        setRedactionCount(count);

        // Build the final output with proper ordering:
        // 1. AI Persona Header
        // 2. Project Tree & Content
        const lines: string[] = [];

        // Add AI persona header if selected
        const systemPrompt = getCurrentSystemPrompt();
        if (systemPrompt) {
            lines.push('---');
            lines.push('## AI SYSTEM PROMPT');
            lines.push('---');
            lines.push('');
            lines.push(systemPrompt);
            lines.push('');
            lines.push('---');
            lines.push('');
        }

        // Add the bundle content
        lines.push(bundle);

        return lines.join('\n');
    }, [stripComments, redactSecrets, getCurrentSystemPrompt]);

    // Regenerate bundle when options change
    useEffect(() => {
        if (result) {
            const fullBundle = generateFullBundle(result);
            setBundleContent(fullBundle);
        }
    }, [result, generateFullBundle]);

    const handleProgress = useCallback((current: number, total: number) => {
        setProgress({ current, total });
    }, []);

    const handleSelectFolder = useCallback(async () => {
        if (!supportsDirectoryPicker) return;

        try {
            setError(null);
            // @ts-expect-error - showDirectoryPicker is not in TypeScript types yet
            const dirHandle = await window.showDirectoryPicker();

            setIsProcessing(true);
            setProgress({ current: 0, total: 0 });

            const processingResult = await processDirectory(dirHandle, '', handleProgress);
            setResult(processingResult);

            const fullBundle = generateFullBundle(processingResult);
            setBundleContent(fullBundle);
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                console.error('Error processing directory:', err);
                setError('Failed to process directory. Please try again.');
            }
        } finally {
            setIsProcessing(false);
        }
    }, [supportsDirectoryPicker, handleProgress, generateFullBundle]);

    const handleDrop = useCallback(async (items: DataTransferItemList) => {
        try {
            setError(null);
            setIsProcessing(true);
            setProgress({ current: 0, total: 0 });

            const processingResult = await processDroppedItems(items, handleProgress);
            setResult(processingResult);

            const fullBundle = generateFullBundle(processingResult);
            setBundleContent(fullBundle);
        } catch (err) {
            console.error('Error processing dropped items:', err);
            setError('Failed to process dropped files. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    }, [handleProgress, generateFullBundle]);

    const handleClear = useCallback(() => {
        setResult(null);
        setBundleContent('');
        setError(null);
        setProgress({ current: 0, total: 0 });
        setRedactionCount(0);
    }, []);

    return (
        <div className="context-bundler w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Header */}
            <header className="text-center mb-12 pt-8">
                {/* Logo with glow effect */}
                <div className="inline-flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-violet-500/30 rounded-full scale-150" />
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 border border-zinc-700/50 backdrop-blur-xl shadow-2xl">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
                            <svg
                                className="w-10 h-10 text-cyan-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Title with gradient */}
                <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight">
                    <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                        Context
                    </span>
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                        Bundler
                    </span>
                </h1>

                {/* Tagline */}
                <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-4">
                    Transform your codebase into an LLM-ready markdown bundle
                </p>

                {/* Feature badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                        </svg>
                        100% Private
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Lightning Fast
                    </span>
                    {redactSecrets && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 animate-pulse">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secret Redaction On
                        </span>
                    )}
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-5">
                {/* Left Column - Input (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Drop Zone Card */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-violet-500/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                        <div className="relative">
                            <DropZone
                                onDrop={handleDrop}
                                onSelectFolder={handleSelectFolder}
                                isProcessing={isProcessing}
                                supportsDirectoryPicker={supportsDirectoryPicker}
                                skippedCount={result?.skippedCount}
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-[fadeInUp_0.3s_ease-out]">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Progress Bar */}
                    {isProcessing && progress.total > 0 && (
                        <div className="space-y-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                    Processing files...
                                </span>
                                <span className="text-zinc-500 font-mono">{progress.current} / {progress.total}</span>
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-full transition-all duration-200 relative"
                                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Panel (AI Strategy + Redaction + Strip Comments) */}
                    <SettingsPanel
                        redactSecrets={redactSecrets}
                        onToggleRedactSecrets={() => setRedactSecrets(prev => !prev)}
                        redactionCount={redactionCount}
                        selectedPersonaId={selectedPersonaId}
                        onSelectPersona={setSelectedPersonaId}
                        customPrompt={customPrompt}
                        onCustomPromptChange={setCustomPrompt}
                        stripComments={stripComments}
                        onToggleStripComments={() => setStripComments(prev => !prev)}
                    />

                    {/* Stats Bar */}
                    {result && !isProcessing && (
                        <div className="animate-[fadeInUp_0.3s_ease-out]">
                            <StatsBar
                                fileCount={result.fileCount}
                                totalSize={result.totalSize}
                                skippedCount={result.skippedCount}
                                bundleContent={bundleContent}
                                stripComments={stripComments}
                                onToggleStripComments={() => setStripComments(prev => !prev)}
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        <CopyButton content={bundleContent} disabled={isProcessing} />
                        <DownloadButton content={bundleContent} disabled={isProcessing} />

                        {result && (
                            <button
                                onClick={handleClear}
                                className="group px-5 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-all duration-200"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column - Preview (3 cols) */}
                <div className="lg:col-span-3">
                    <div
                        className="relative group"
                        style={{ height: 'calc(100vh - 180px)', minHeight: '500px', maxHeight: '800px' }}
                    >
                        {/* Glow effect - matches container exactly */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                        <div
                            className="relative h-full preview-container rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/90">
                                <div className="flex items-center gap-3">
                                    {/* Window controls decoration */}
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <span className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-400 ml-2">Bundle Preview</span>

                                    {/* Active strategy badge */}
                                    {selectedPersonaId !== 'custom' && (
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30">
                                            {AI_PERSONAS.find(p => p.id === selectedPersonaId)?.name}
                                        </span>
                                    )}
                                </div>
                                {bundleContent && (
                                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                                        {redactionCount > 0 && (
                                            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                                                {redactionCount} redacted
                                            </span>
                                        )}
                                        <span className="px-2 py-1 rounded bg-zinc-800 font-mono">
                                            {bundleContent.length.toLocaleString()} chars
                                        </span>
                                        <span className="px-2 py-1 rounded bg-zinc-800 font-mono">
                                            {bundleContent.split('\n').length.toLocaleString()} lines
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Preview Content - Scrollable */}
                            <div className="flex-1 overflow-hidden">
                                <Preview content={bundleContent} isProcessing={isProcessing} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why ContextBundler Section */}
            <section className="mt-24 relative">
                {/* Background decoration */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-blue-500/10 blur-3xl rounded-full" />
                </div>

                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        <span className="text-zinc-200">Why </span>
                        <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">ContextBundler</span>
                        <span className="text-zinc-200">?</span>
                    </h2>
                    <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
                        The bridge between your codebase and AI-powered development
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {/* The Problem */}
                    <div className="group relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-200 mb-2">The Problem</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Manually copying files into AI chats is tedious. You lose context, miss important files, and waste tokens on irrelevant content like node_modules.
                            </p>
                        </div>
                    </div>

                    {/* The Solution */}
                    <div className="group relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-200 mb-2">The Solution</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                One drag-and-drop generates a perfectly formatted bundle with your project structure, file contents, and AI-optimized prompts—ready in seconds.
                            </p>
                        </div>
                    </div>

                    {/* The Result */}
                    <div className="group relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-200 mb-2">The Result</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                AI understands your code instantly. Better responses, faster iteration, and more productive pair programming with ChatGPT, Claude, or any LLM.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <BenefitItem
                        icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        }
                        title="Zero Data Leaks"
                        description="100% client-side processing. Your code never touches our servers."
                        color="emerald"
                    />
                    <BenefitItem
                        icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        title="Instant Generation"
                        description="Bundle hundreds of files in under a second. No waiting."
                        color="cyan"
                    />
                    <BenefitItem
                        icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-5.25 3.5v-3.5m5.25 0v3.5l-5.25 3.5m0 0L9 18.5m5-4v3.5L9 21.5" />
                            </svg>
                        }
                        title="Token Optimized"
                        description="Smart filtering removes bloat. Focus on what matters to the AI."
                        color="violet"
                    />
                    <BenefitItem
                        icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                            </svg>
                        }
                        title="AI-Ready Prompts"
                        description="Pre-built personas prime your AI for specific tasks."
                        color="amber"
                    />
                </div>

                {/* How It Works */}
                <div className="mt-20">
                    <h3 className="text-2xl font-bold text-center mb-12">
                        <span className="text-zinc-200">How </span>
                        <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">It Works</span>
                    </h3>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="relative text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 mb-6">
                                <span className="text-2xl font-bold text-cyan-400">1</span>
                            </div>
                            <h4 className="text-lg font-semibold text-zinc-200 mb-3">Drop Your Project</h4>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Drag and drop your entire project folder onto the drop zone. ContextBundler instantly scans all files and builds a project tree.
                            </p>
                            {/* Connector line (hidden on mobile) */}
                            <div className="hidden md:block absolute top-7 left-[calc(50%+3.5rem)] w-[calc(100%-3.5rem)] h-0.5 bg-gradient-to-r from-cyan-500/50 to-violet-500/50" />
                        </div>

                        {/* Step 2 */}
                        <div className="relative text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/30 mb-6">
                                <span className="text-2xl font-bold text-violet-400">2</span>
                            </div>
                            <h4 className="text-lg font-semibold text-zinc-200 mb-3">Configure Settings</h4>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Choose an AI persona for your task. Enable secret redaction and comment stripping to optimize your bundle for the AI.
                            </p>
                            {/* Connector line (hidden on mobile) */}
                            <div className="hidden md:block absolute top-7 left-[calc(50%+3.5rem)] w-[calc(100%-3.5rem)] h-0.5 bg-gradient-to-r from-violet-500/50 to-emerald-500/50" />
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 mb-6">
                                <span className="text-2xl font-bold text-emerald-400">3</span>
                            </div>
                            <h4 className="text-lg font-semibold text-zinc-200 mb-3">Copy & Paste</h4>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Click "Copy Bundle" and paste directly into ChatGPT, Claude, or any LLM. Your AI now has full context of your codebase.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-24 py-8 border-t border-zinc-800/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
                    <p>
                        Built for developers who value <span className="text-zinc-400">privacy</span> and <span className="text-zinc-400">efficiency</span>.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            No data leaves your browser
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Benefit Item Component
interface BenefitItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: 'emerald' | 'cyan' | 'violet' | 'amber';
}

function BenefitItem({ icon, title, description, color }: BenefitItemProps) {
    const colorClasses = {
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    };

    return (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
            <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
                {icon}
            </div>
            <div>
                <h4 className="text-sm font-semibold text-zinc-200 mb-1">{title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
