"use client";

import { useState, useMemo } from "react";
import { InputConsole } from "./InputConsole";
import { ResultsDashboard } from "./ResultsDashboard";
import { RaketEngine, type TaxProfile, type RoadmapStep } from "@/lib/RaketEngine";

export function TaxCalculator() {
    const [isLicensed, setIsLicensed] = useState(false);
    const [isTradeName, setIsTradeName] = useState(false);
    const [isMixedIncome, setIsMixedIncome] = useState(false);
    const [income, setIncome] = useState(500000);

    // --- Use RaketEngine for all calculations ---
    const taxProfile: TaxProfile = useMemo(() => {
        const engine = new RaketEngine({
            grossIncome: income,
            isLicensed,
            hasTradeName: isTradeName,
            isMixedIncome,
        });
        return engine.compute();
    }, [income, isLicensed, isTradeName, isMixedIncome]);

    // Transform stepList to legacy roadmap format for dashboard
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
                    income={income}
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
