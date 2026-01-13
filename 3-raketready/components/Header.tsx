import { ShieldCheck } from "lucide-react";

export function Header() {
    return (
        <header className="flex items-center justify-between py-8 mb-4 border-b border-border/40">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-background font-bold text-lg font-mono">R</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">Raket-Ready</h1>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.5} />
                <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">2026 Verified</span>
            </div>
        </header>
    );
}
