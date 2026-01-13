"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { RoadmapPDF } from "./RoadmapPDF";
import { TaxProfile } from "@/lib/RaketEngine";
import { Download, Loader2, ArrowRight } from "lucide-react";

interface PDFDownloadButtonProps {
    taxProfile: TaxProfile;
    income: number;
    onSuccess: () => void;
}

export function PDFDownloadButton({ taxProfile, income, onSuccess }: PDFDownloadButtonProps) {
    return (
        <PDFDownloadLink
            document={<RoadmapPDF taxProfile={taxProfile} income={income} />}
            fileName="RaketReady_Roadmap_2026.pdf"
        >
            {({ loading }) => (
                <button
                    disabled={loading}
                    className="flex items-center gap-2 text-xs font-semibold text-foreground/60 hover:text-foreground transition-colors group"
                    onClick={() => {
                        if (!loading) {
                            onSuccess();
                        }
                    }}
                >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{loading ? 'Generating PDF...' : 'Download Full Guide'}</span>
                    {!loading && <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />}
                </button>
            )}
        </PDFDownloadLink>
    );
}
