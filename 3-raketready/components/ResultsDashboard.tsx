"use client";

import { CheckCircle2, Download, ExternalLink, CalendarDays, ArrowRight, Sparkles, TrendingUp, FileText, Loader2, CheckCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RoadmapPDF } from "./RoadmapPDF";
import { TaxProfile } from "@/lib/RaketEngine";
import { toast } from "sonner";

interface ResultsDashboardProps {
    income: number;
    tax8Percent: number;
    taxGraduated: number;
    recommendedRegime: '8%' | 'graduated';
    savings: number;
    isVatLiable: boolean;
    birForm: '1701' | '1701A';
    roadmap: Array<{ title: string; desc: string; status: string }>;
    checklist: string[];
    isLoading: boolean;
    // We need the full object for PDF generation
    taxProfile: TaxProfile;
}

export function ResultsDashboard({
    income,
    tax8Percent,
    taxGraduated,
    recommendedRegime,
    savings,
    isVatLiable,
    birForm,
    roadmap,
    checklist,
    isLoading,
    taxProfile,
}: ResultsDashboardProps) {

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(val);

    const maxTax = Math.max(tax8Percent, taxGraduated) || 1;
    const h8 = (tax8Percent / maxTax) * 100;
    const hG = (taxGraduated / maxTax) * 100;

    const handleDownloadSuccess = () => {
        toast.custom((t) => (
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="w-full max-w-sm bg-[#ECFDF5] border border-emerald-500/20 rounded-xl shadow-xl shadow-emerald-900/5 p-4 flex gap-3 items-start relative pointer-events-auto"
            >
                <div className="p-1 bg-emerald-500/10 rounded-full shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                </div>
                <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-bold text-emerald-900">Roadmap Ready!</h3>
                    <p className="text-xs text-emerald-800/80 leading-relaxed font-medium">
                        Your {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} BIR compliance pack has been downloaded.
                        <br /><span className="mt-1 block text-emerald-700">FYI: Under the EOPT Act, the ₱500 fee is abolished!</span>
                    </p>
                    <a
                        href="https://orus.bir.gov.ph"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wide text-emerald-700 hover:text-emerald-900 hover:underline transition-colors"
                    >
                        Next Step: Open ORUS <ArrowRight className="w-2.5 h-2.5" />
                    </a>
                </div>
                <button
                    onClick={() => toast.dismiss(t)}
                    className="absolute top-2 right-2 p-1 text-emerald-600/40 hover:text-emerald-800 transition-colors rounded-full hover:bg-emerald-500/10"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </motion.div>
        ), { duration: 6000, position: 'bottom-right' }); // Increased duration slightly for reading
    };

    return (
        <div className="h-full flex flex-col gap-8 relative">
            {isLoading && <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-[2px] transition-all duration-300" />}

            {/* 1. Hero / Executive Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Primary Metric */}
                <div className="p-6 rounded-xl border border-border/40 bg-surface/30">
                    <div className="flex items-center gap-2 mb-6 text-foreground/50">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Estimated Tax Due</span>
                    </div>

                    <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-4xl lg:text-5xl font-bold tracking-tighter text-foreground">
                            {formatCurrency(recommendedRegime === '8%' ? tax8Percent : taxGraduated)}
                        </span>
                        <span className="text-sm text-foreground/40 font-medium">/ year</span>
                    </div>

                    {!isVatLiable && savings > 0 ? (
                        <div className="inline-flex items-center gap-2 mt-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <Sparkles className="w-3 h-3" strokeWidth={1.5} />
                            <span className="text-xs font-medium">Save {formatCurrency(savings)} with {recommendedRegime === '8%' ? '8%' : 'Graduated'}</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 mt-2 px-2.5 py-1 rounded-full bg-foreground/5 text-foreground/60 border border-foreground/10">
                            <span className="text-xs font-medium">Standard Calculation Applied</span>
                        </div>
                    )}
                </div>

                {/* Comparison Chart */}
                <div className="p-6 rounded-xl border border-border/40 bg-surface/30 flex flex-col justify-center">
                    <div className="space-y-5">
                        {/* 8% Bar */}
                        <div className={`space-y-2 group ${isVatLiable ? 'opacity-40 grayscale' : ''}`}>
                            <div className="flex justify-between text-xs font-medium px-1">
                                <span className={recommendedRegime === '8%' ? 'text-emerald-600' : 'text-foreground/60'}>8% Flat Rate</span>
                                <span className="text-foreground">{formatCurrency(tax8Percent)}</span>
                            </div>
                            <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-emerald-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${h8}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Graduated Bar */}
                        <div className="space-y-2 group">
                            <div className="flex justify-between text-xs font-medium px-1">
                                <span className={recommendedRegime === 'graduated' ? 'text-accent' : 'text-foreground/60'}>Graduated Rates</span>
                                <span className="text-foreground">{formatCurrency(taxGraduated)}</span>
                            </div>
                            <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-accent rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${hG}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Detailed Breakdown (Two Pane) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">

                {/* Roadmap - List View */}
                <div className="lg:col-span-7 p-0">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <div className="flex items-center gap-2 text-foreground/50">
                            <CalendarDays className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Compliance Roadmap</span>
                        </div>
                        <span className="text-[10px] font-mono bg-surface-hover px-2 py-1 rounded text-foreground/60">
                            Form {birForm}
                        </span>
                    </div>

                    <div className="space-y-1">
                        {roadmap.map((step, idx) => (
                            <div key={idx} className="group flex items-start gap-4 p-4 rounded-lg hover:bg-surface-hover/60 transition-colors border border-transparent hover:border-border/50">
                                <div className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border text-[10px] font-mono transition-colors ${step.status === 'active' ? 'border-accent bg-accent text-white' :
                                    step.status === 'completed' ? 'border-emerald-500 bg-emerald-500 text-white' :
                                        'border-border text-foreground/40'
                                    }`}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-sm font-medium ${step.status === 'active' ? 'text-foreground' : 'text-foreground/70'}`}>
                                        {step.title}
                                    </h4>
                                    <p className="text-xs text-foreground/50 mt-1 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                                {step.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pl-4">
                        <PDFDownloadLink
                            document={<RoadmapPDF taxProfile={taxProfile} income={income} />}
                            fileName="RaketReady_Roadmap_2026.pdf"
                        >
                            {/* 
                                Note: PDFDownloadLink's children can be a function receiving { loading } 
                                but here we simplify. The button itself handles the click.
                            */}
                            {({ loading }) => (
                                <button
                                    disabled={loading}
                                    className="flex items-center gap-2 text-xs font-semibold text-foreground/60 hover:text-foreground transition-colors group"
                                    onClick={(e) => {
                                        if (!loading) {
                                            handleDownloadSuccess();
                                        }
                                    }}
                                >
                                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                                    <span>{loading ? 'Generating PDF...' : 'Download Full Guide'}</span>
                                    {!loading && <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />}
                                </button>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>

                {/* Checklist - Card View */}
                <div className="lg:col-span-5 border-l border-border/40 pl-8">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <div className="flex items-center gap-2 text-foreground/50">
                            <FileText className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Documents</span>
                        </div>
                    </div>

                    <ul className="space-y-3">
                        {checklist.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm group">
                                <span className={`mt-1 w-3.5 h-3.5 rounded-sm border mr-1 flex items-center justify-center transition-colors ${i < 3 ? 'border-foreground/30 text-foreground/30' : 'border-accent text-accent'
                                    }`}>
                                    {/* Fake Checkbox appearance */}
                                    <span className="w-2 h-2 bg-current opacity-20" />
                                </span>
                                <span className="text-foreground/70 group-hover:text-foreground transition-colors">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 pt-6 border-t border-border/30">
                        <a href="https://orus.bir.gov.ph" target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-xs font-semibold text-foreground transition-colors border border-foreground/5">
                            Open BIR ORUS Portal
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
