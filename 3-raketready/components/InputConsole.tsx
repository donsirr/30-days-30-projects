"use client";

import { Check, Coins, Briefcase, Building2, Wallet } from "lucide-react";

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

    const ToggleItem = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
        <button
            onClick={onClick}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all w-full text-left group ${active
                    ? 'bg-surface-hover text-foreground font-medium'
                    : 'text-foreground/60 hover:bg-surface-hover/50 hover:text-foreground/80'
                }`}
        >
            <span>{label}</span>
            {active && <Check className="w-4 h-4 text-accent" />}
        </button>
    );

    const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 text-foreground/50 px-3">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{title}</span>
            </div>
            <div className="space-y-0.5">
                {children}
            </div>
        </div>
    );

    return (
        <aside className="w-full h-full flex flex-col">
            {/* Settings Groups */}
            <div className="flex-1">
                <Section title="Profession" icon={Briefcase}>
                    <ToggleItem label="Non-Licensed Professional" active={!isLicensed} onClick={() => setIsLicensed(false)} />
                    <ToggleItem label="Licensed (PRC)" active={isLicensed} onClick={() => setIsLicensed(true)} />
                </Section>

                <Section title="Registration" icon={Building2}>
                    <ToggleItem label="Personal Name" active={!isTradeName} onClick={() => setIsTradeName(false)} />
                    <ToggleItem label="Trade Name (DTI)" active={isTradeName} onClick={() => setIsTradeName(true)} />
                </Section>

                <Section title="Income Source" icon={Wallet}>
                    <ToggleItem label="Purely Freelance" active={!isMixedIncome} onClick={() => setIsMixedIncome(false)} />
                    <ToggleItem label="Mixed Income (Compensation)" active={isMixedIncome} onClick={() => setIsMixedIncome(true)} />
                </Section>

                <div className="mt-8 px-3">
                    <div className="flex items-center gap-2 mb-4 text-foreground/50">
                        <Coins className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Gross Annual Income</span>
                    </div>

                    <div className="bg-surface border border-border/60 rounded-lg p-4 transition-colors hover:border-border/80">
                        <div className="flex items-baseline justify-between mb-4">
                            <span className="text-2xl font-semibold tracking-tight tabular-nums">{formatCurrency(income)}</span>
                            <span className="text-xs text-foreground/40 font-mono">PHP</span>
                        </div>

                        <div className="relative h-5 w-full flex items-center group">
                            <input
                                type="range"
                                min="0"
                                max="5000000"
                                step="10000"
                                value={income}
                                onChange={(e) => setIncome(Number(e.target.value))}
                                className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
                            />
                            <div className="w-full h-1 bg-surface-hover rounded-full overflow-hidden relative">
                                <div
                                    className="h-full bg-foreground transition-all duration-75"
                                    style={{ width: `${(income / 5000000) * 100}%` }}
                                />
                            </div>
                            <div
                                className="absolute w-3 h-3 bg-foreground rounded-full shadow-sm pointer-events-none transition-all duration-75 z-10 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100"
                                style={{ left: `calc(${(income / 5000000) * 100}% - 6px)` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
