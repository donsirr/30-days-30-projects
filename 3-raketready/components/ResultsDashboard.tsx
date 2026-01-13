"use client";

import { AlertCircle, CheckCircle2, Download, ExternalLink, CalendarDays, TrendingUp, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ResultsDashboardProps {
    income: number;
    tax8Percent: number;
    taxGraduated: number;
    isVatLiable: boolean;
    roadmap: Array<{ title: string; desc: string; status: 'pending' | 'completed' | 'active' }>;
    checklist: string[];
    recommendedRegime: '8%' | 'graduated';
    savings: number;
    birForm: '1701' | '1701A';
    eoptAlert: string;
}

export function ResultsDashboard({
    income,
    tax8Percent,
    taxGraduated,
    isVatLiable,
    roadmap,
    checklist,
    recommendedRegime,
    savings,
    birForm,
    eoptAlert,
}: ResultsDashboardProps) {

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(val);

    const maxTax = Math.max(tax8Percent, taxGraduated) || 1;
    const h8 = (tax8Percent / maxTax) * 100;
    const hG = (taxGraduated / maxTax) * 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">

            {/* Main Card: Roadmap (Vertical Timeline) - Spans 1 col, 2 rows on Desktop */}
            <div className="md:col-span-1 md:row-span-2 bg-surface rounded-2xl border border-border p-6 flex flex-col">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-accent" strokeWidth={1.5} />
                    Registration Roadmap
                </h3>
                <div className="flex-1 relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/50">
                    {roadmap.map((step, idx) => (
                        <div key={idx} className="relative pl-8">
                            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 bg-background z-10 flex items-center justify-center ${step.status === 'active' ? 'border-accent text-accent' : 'border-border text-foreground/20'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${step.status === 'active' ? 'bg-accent' : ''}`} />
                            </div>
                            <div>
                                <h4 className={`font-semibold text-sm ${step.status === 'active' ? 'text-foreground' : 'text-foreground/60'}`}>{step.title}</h4>
                                <p className="text-xs text-foreground/50 mt-1">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground/50">BIR Form Required:</span>
                        <span className="font-mono font-semibold text-accent">{birForm}</span>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                        <Download className="w-4 h-4" strokeWidth={1.5} />
                        Download Roadmap PDF
                    </button>
                </div>
            </div>

            {/* Medium Card: Tax Compare */}
            <div className="md:col-span-1 bg-surface rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Tax Estimate</h3>
                    <span className="text-xs font-mono text-foreground/40">Annual</span>
                </div>

                {/* Recommendation Badge */}
                {!isVatLiable && savings > 0 && (
                    <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-lg border border-accent/20">
                        <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.5} />
                        <span className="text-xs font-medium text-accent">
                            Recommended: <strong>{recommendedRegime === '8%' ? '8% Flat Rate' : 'Graduated'}</strong> — Save {formatCurrency(savings)}
                        </span>
                    </div>
                )}

                <div className="space-y-6">
                    {/* 8% Option */}
                    <div className={`space-y-2 group ${isVatLiable ? 'opacity-40 grayscale' : ''}`}>
                        <div className="flex justify-between text-sm">
                            <span className={`font-medium ${recommendedRegime === '8%' && !isVatLiable ? 'text-emerald-600' : 'text-foreground/80'}`}>
                                8% Flat Rate
                            </span>
                            <span className="font-mono">{formatCurrency(tax8Percent)}</span>
                        </div>
                        <div className="h-3 bg-surface-hover rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${h8}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="h-full bg-emerald-500 rounded-full"
                            />
                        </div>
                        {isVatLiable && <p className="text-[10px] text-red-500">Not available (Income &gt; ₱3M)</p>}
                    </div>

                    {/* Graduated Option */}
                    <div className="space-y-2 group">
                        <div className="flex justify-between text-sm">
                            <span className={`font-medium ${recommendedRegime === 'graduated' ? 'text-accent' : 'text-foreground/80'}`}>
                                Graduated Rates
                            </span>
                            <span className="font-mono">{formatCurrency(taxGraduated)}</span>
                        </div>
                        <div className="h-3 bg-surface-hover rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${hG}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="h-full bg-accent rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Card: Checklist */}
            <div className="md:col-span-1 bg-surface rounded-2xl border border-border p-6 flex flex-col">
                <h3 className="font-bold text-lg mb-4">RDO Checklist</h3>
                <ul className="space-y-3 flex-1 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
                    {checklist.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
                            <span className="text-foreground/70">{item}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-border">
                    <a href="https://orus.bir.gov.ph" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-accent text-sm font-semibold hover:underline">
                        Go to BIR ORUS <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                    </a>
                </div>
            </div>

        </div>
    );
}
