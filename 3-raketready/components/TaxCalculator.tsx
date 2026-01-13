"use client";

import { useState, useMemo, useEffect } from "react";
import { InputConsole } from "./InputConsole";
import { ResultsDashboard } from "./ResultsDashboard";
import { RaketEngine, type TaxProfile } from "@/lib/RaketEngine";

export function TaxCalculator() {
    const [isLicensed, setIsLicensed] = useState(false);
    const [isTradeName, setIsTradeName] = useState(false);
    const [isMixedIncome, setIsMixedIncome] = useState(false);
    const [income, setIncome] = useState(500000);

    // Loading State
    const [isCalculating, setIsCalculating] = useState(false);
    // Debounced Params (to simulate network/calc delay if needed, or just smoothen UI)
    const [debouncedIncome, setDebouncedIncome] = useState(income);

    // Debounce the income slider updates
    useEffect(() => {
        setIsCalculating(true);
        const timer = setTimeout(() => {
            setDebouncedIncome(income);
            setIsCalculating(false);
        }, 400); // 400ms delay for "Shimmer" effect
        return () => clearTimeout(timer);
    }, [income]);

    // Immediate update for toggles
    useEffect(() => {
        setIsCalculating(true);
        const timer = setTimeout(() => setIsCalculating(false), 300);
        return () => clearTimeout(timer);
    }, [isLicensed, isTradeName, isMixedIncome]);


    // --- Use RaketEngine for all calculations ---
    const taxProfile: TaxProfile = useMemo(() => {
        // Use debouncedIncome for calculation to prevent layout thrashing
        const engine = new RaketEngine({
            grossIncome: debouncedIncome,
            isLicensed,
            hasTradeName: isTradeName,
            isMixedIncome,
        });
        return engine.compute();
    }, [debouncedIncome, isLicensed, isTradeName, isMixedIncome]);

    // Transform stepList to roadmap format
    const roadmap = taxProfile.stepList.map((step) => ({
        title: step.title,
        desc: step.description,
        status: step.status,
    }));

    return (
        <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
                <InputConsole
                    isLicensed={isLicensed} setIsLicensed={setIsLicensed}
                    isTradeName={isTradeName} setIsTradeName={setIsTradeName}
                    isMixedIncome={isMixedIncome} setIsMixedIncome={setIsMixedIncome}
                    income={income} setIncome={setIncome}
                />
            </div>
            <div className="lg:col-span-8">
                <ResultsDashboard
                    isLoading={isCalculating}
                    income={debouncedIncome}
                    tax8Percent={taxProfile.tax8Percent}
                    taxGraduated={taxProfile.taxGraduated}
                    isVatLiable={taxProfile.isVatLiable}
                    roadmap={roadmap}
                    checklist={taxProfile.documentChecklist}
                    recommendedRegime={taxProfile.recommendedRegime}
                    savings={taxProfile.savings}
                    birForm={taxProfile.birForm}
                    eoptAlert={taxProfile.eoptAlert}
                />
            </div>
        </div>
    );
}
