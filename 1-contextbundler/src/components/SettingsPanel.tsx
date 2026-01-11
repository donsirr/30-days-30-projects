'use client';

import { useState } from 'react';
import { Tooltip, InfoIcon } from './Tooltip';
import { AI_PERSONAS, AIPersona } from '@/lib/ai-personas';

interface SettingsPanelProps {
    // Redaction
    redactSecrets: boolean;
    onToggleRedactSecrets: () => void;
    redactionCount?: number;

    // AI Strategy
    selectedPersonaId: string;
    onSelectPersona: (id: string) => void;
    customPrompt: string;
    onCustomPromptChange: (value: string) => void;

    // Strip Comments
    stripComments: boolean;
    onToggleStripComments: () => void;
}

export function SettingsPanel({
    redactSecrets,
    onToggleRedactSecrets,
    redactionCount = 0,
    selectedPersonaId,
    onSelectPersona,
    customPrompt,
    onCustomPromptChange,
    stripComments,
    onToggleStripComments,
}: SettingsPanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showCustomPrompt, setShowCustomPrompt] = useState(selectedPersonaId === 'custom');

    const selectedPersona = AI_PERSONAS.find(p => p.id === selectedPersonaId);

    const handlePersonaChange = (id: string) => {
        onSelectPersona(id);
        setShowCustomPrompt(id === 'custom');
    };

    const getPersonaIcon = (icon: AIPersona['icon']) => {
        switch (icon) {
            case 'strategy':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                    </svg>
                );
            case 'bug':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082" />
                    </svg>
                );
            case 'rocket':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                );
            case 'custom':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
        }
    };

    return (
        <div className="settings-panel relative overflow-hidden rounded-xl">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20 opacity-50" />

            <div className="relative bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-xl overflow-hidden">
                {/* Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800/30 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20">
                            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm font-semibold text-zinc-200">Bundle Settings</h3>
                            <p className="text-xs text-zinc-500">AI strategy, security, and optimization</p>
                        </div>
                    </div>

                    <svg
                        className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Content */}
                <div className={`
          transition-all duration-500 ease-out overflow-hidden
          ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
                    <div className="px-5 pb-5 space-y-5">
                        {/* AI Strategy Dropdown */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-zinc-300">AI Strategy</label>
                                <Tooltip content="Sets the 'System Prompt' to prime the AI for specific tasks like architecture review, bug hunting, or rapid development.">
                                    <span><InfoIcon /></span>
                                </Tooltip>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {AI_PERSONAS.map((persona) => (
                                    <button
                                        key={persona.id}
                                        onClick={() => handlePersonaChange(persona.id)}
                                        className={`
                      group relative flex items-center gap-3 px-4 py-3 rounded-xl text-left
                      transition-all duration-200
                      ${selectedPersonaId === persona.id
                                                ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                                                : 'bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800'
                                            }
                    `}
                                    >
                                        <div className={`
                      p-2 rounded-lg transition-colors
                      ${selectedPersonaId === persona.id
                                                ? 'bg-violet-500/20 text-violet-400'
                                                : 'bg-zinc-700/50 text-zinc-400 group-hover:text-zinc-300'
                                            }
                    `}>
                                            {getPersonaIcon(persona.icon)}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${selectedPersonaId === persona.id ? 'text-violet-300' : 'text-zinc-300'}`}>
                                                {persona.name}
                                            </p>
                                            <p className="text-xs text-zinc-500">{persona.shortDescription}</p>
                                        </div>

                                        {/* Selection indicator */}
                                        {selectedPersonaId === persona.id && (
                                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Custom prompt textarea */}
                            {showCustomPrompt && (
                                <div className="animate-[fadeInUp_0.3s_ease-out]">
                                    <textarea
                                        value={customPrompt}
                                        onChange={(e) => onCustomPromptChange(e.target.value)}
                                        placeholder="Enter your custom system prompt..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-300 placeholder-zinc-600 resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}
                                    />
                                </div>
                            )}

                            {/* Preview of selected persona prompt */}
                            {selectedPersona && selectedPersona.id !== 'custom' && (
                                <details className="group">
                                    <summary className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer hover:text-zinc-400 transition-colors">
                                        <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                        View prompt preview
                                    </summary>
                                    <div className="mt-2 p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                                        <p className="text-xs text-zinc-500 font-mono leading-relaxed line-clamp-4">
                                            {selectedPersona.systemPrompt.slice(0, 200)}...
                                        </p>
                                    </div>
                                </details>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-zinc-800" />

                        {/* Security & Optimization Toggles */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Redact Secrets */}
                            <Tooltip content="Scans for common secret patterns (API keys, passwords, tokens) and redacts values before bundling.">
                                <button
                                    onClick={onToggleRedactSecrets}
                                    className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl text-left
                    transition-all duration-200
                    ${redactSecrets
                                            ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/40'
                                            : 'bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600'
                                        }
                  `}
                                >
                                    <div className={`
                    relative w-10 h-5 rounded-full transition-colors duration-300
                    ${redactSecrets ? 'bg-emerald-500' : 'bg-zinc-700'}
                  `}>
                                        <div className={`
                      absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md
                      transition-all duration-300
                      ${redactSecrets ? 'left-5' : 'left-0.5'}
                    `} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${redactSecrets ? 'text-emerald-300' : 'text-zinc-300'}`}>
                                            Redact Secrets
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {redactionCount > 0 ? `${redactionCount} redacted` : 'Protect sensitive data'}
                                        </p>
                                    </div>
                                </button>
                            </Tooltip>

                            {/* Strip Comments */}
                            <Tooltip content="Remove comments from code to reduce token count. May strip important documentation.">
                                <button
                                    onClick={onToggleStripComments}
                                    className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl text-left
                    transition-all duration-200
                    ${stripComments
                                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40'
                                            : 'bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600'
                                        }
                  `}
                                >
                                    <div className={`
                    relative w-10 h-5 rounded-full transition-colors duration-300
                    ${stripComments ? 'bg-cyan-500' : 'bg-zinc-700'}
                  `}>
                                        <div className={`
                      absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md
                      transition-all duration-300
                      ${stripComments ? 'left-5' : 'left-0.5'}
                    `} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${stripComments ? 'text-cyan-300' : 'text-zinc-300'}`}>
                                            Strip Comments
                                        </p>
                                        <p className="text-xs text-zinc-500">Reduce token count</p>
                                    </div>
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
