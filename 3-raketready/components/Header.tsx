import { ShieldCheck } from "lucide-react";

export function Header() {
    return (
        <header className="flex items-center justify-between py-6 mb-8 border-b border-border/40">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight">Raket-Ready</h1>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <ShieldCheck className="w-4 h-4 text-green-600" strokeWidth={1.5} />
                <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">2026 Compliance Verified</span>
            </div>
        </header>
    );
}
