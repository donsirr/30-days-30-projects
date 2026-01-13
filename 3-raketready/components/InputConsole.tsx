"use client";

import { Briefcase, User, Building2, Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface InputConsoleProps {
    isLicensed: boolean;
    setIsLicensed: (val: boolean) => void;
    isTradeName: boolean;
    setIsTradeName: (val: boolean) => void;
    isMixedIncome: boolean;
    setIsMixedIncome: (val: boolean) => void;
    income: number;
    setIncome: (val: number) => void;
}

export function InputConsole({
    isLicensed,
    setIsLicensed,
    isTradeName,
    setIsTradeName,
    isMixedIncome,
    setIsMixedIncome,
    income,
    setIncome,
}: InputConsoleProps) {

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(val);

    return (
        <section className="space-y-8 p-6 bg-surface rounded-2xl border border-border">
            <div className="space-y-1">
                <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">Configuration</h2>
                <p className="text-2xl font-bold">Profile Setup</p>
            </div>

            <div className="space-y-6">
                {/* Step 1: Profession */}
                <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-accent/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isLicensed ? 'bg-accent/10 text-accent' : 'bg-surface-hover text-foreground/60'}`}>
                            <Briefcase className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="font-semibold">Professional Type</p>
                            <p className="text-xs text-foreground/50">Are you a licensed professional?</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsLicensed(!isLicensed)}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${isLicensed ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-surface-hover text-foreground/70 hover:bg-surface-hover/80'
                            }`}
                    >
                        {isLicensed ? "Licensed" : "Non-Licensed"}
                    </button>
                </div>

                {/* Step 2: Branding */}
                <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-accent/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isTradeName ? 'bg-accent/10 text-accent' : 'bg-surface-hover text-foreground/60'}`}>
                            <Building2 className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="font-semibold">Registration Name</p>
                            <p className="text-xs text-foreground/50">Using a trade name or personal?</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsTradeName(!isTradeName)}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${isTradeName ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-surface-hover text-foreground/70 hover:bg-surface-hover/80'
                            }`}
                    >
                        {isTradeName ? "Trade Name" : "Personal Name"}
                    </button>
                </div>

                {/* Step 3: Employment */}
                <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-accent/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isMixedIncome ? 'bg-accent/10 text-accent' : 'bg-surface-hover text-foreground/60'}`}>
                            <Wallet className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="font-semibold">Income Source</p>
                            <p className="text-xs text-foreground/50">Do you differ mixed income?</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMixedIncome(!isMixedIncome)}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${isMixedIncome ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-surface-hover text-foreground/70 hover:bg-surface-hover/80'
                            }`}
                    >
                        {isMixedIncome ? "Mixed Income" : "Purely Freelance"}
                    </button>
                </div>

                {/* Step 4: Income */}
                <div className="p-4 bg-background rounded-xl border border-border space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">Projected Annual Income</p>
                            <p className="text-xs text-foreground/50">Gross annual receipts</p>
                        </div>
                        <div className="text-right">
                            <input
                                type="number"
                                value={income}
                                onChange={(e) => setIncome(Number(e.target.value))}
                                className="text-right font-mono font-bold text-accent bg-transparent border-none focus:ring-0 p-0 text-lg w-32"
                            />
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="5000000"
                        step="5000"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        className="w-full h-2 bg-surface-hover rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-foreground/40 font-mono">
                        <span>₱0</span>
                        <span>₱5M+</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
