"use client";

import { useState, useMemo } from "react";
import { InputConsole } from "./InputConsole";
import { ResultsDashboard } from "./ResultsDashboard";

export function TaxCalculator() {
    const [isLicensed, setIsLicensed] = useState(false);
    const [isTradeName, setIsTradeName] = useState(false);
    const [isMixedIncome, setIsMixedIncome] = useState(false);
    const [income, setIncome] = useState(500000);

    // --- Calculations ---

    // 1. 8% Tax Rate Option
    // If Purely Freelance: (Income - 250k) * 8%
    // If Mixed Income: Income * 8% (250k exemption used in compensation)
    // VAT Threshold: 3,000,000
    const isVatLiable = income > 3000000;

    const tax8Percent = useMemo(() => {
        if (isVatLiable) return 0; // Not applicable
        let taxable = income;
        if (!isMixedIncome) {
            taxable = Math.max(0, income - 250000);
        }
        return taxable * 0.08;
    }, [income, isMixedIncome, isVatLiable]);

    // 2. Graduated Rates (Estimate using OSD)
    // OSD = 40% of Gross Sales. Net Taxable = Income * 60%
    // Tax Table (TRAIN Law):
    // 0-250k: 0
    // 250k-400k: 20% > 250k
    // 400k-800k: 30k + 25% > 400k
    // 800k-2M: 130k + 30% > 800k
    // 2M-8M: 490k + 32% > 2M
    // 8M+: 2.41M + 35% > 8M
    const taxGraduated = useMemo(() => {
        // Note: providing a rough estimate for Mixed Income (stacking logic omitted for simplicity)
        // We assume this is the *tax due on this specific income source* treated via OSD
        const taxableIncome = income * 0.60;

        let tax = 0;
        if (taxableIncome <= 250000) {
            tax = 0;
        } else if (taxableIncome <= 400000) {
            tax = (taxableIncome - 250000) * 0.20;
        } else if (taxableIncome <= 800000) {
            tax = 30000 + (taxableIncome - 400000) * 0.25;
        } else if (taxableIncome <= 2000000) {
            tax = 130000 + (taxableIncome - 800000) * 0.30;
        } else if (taxableIncome <= 8000000) {
            tax = 490000 + (taxableIncome - 2000000) * 0.32;
        } else {
            tax = 2410000 + (taxableIncome - 8000000) * 0.35;
        }

        return tax;
    }, [income]);


    // --- Roadmap & Checklist Logic ---

    const roadmap = [
        {
            title: isTradeName ? "DTI Registration" : "Name Registration",
            desc: isTradeName ? "Register Business Name at DTI" : "Skip DTI (Use Personal Name)",
            status: isTradeName ? 'active' : 'completed', // 'active' implies next step or important
        },
        {
            title: "Local Government (LGU)",
            desc: isLicensed ? "Pay Professional Tax Receipt (PTR) at City Hall" : "Secure Mayor's Permit / OTR",
            status: 'active',
        },
        {
            title: "BIR Registration",
            desc: "File Form 1901 at your RDO",
            status: 'pending',
        },
        {
            title: "Invoicing & Books",
            desc: "Print ORs (or Invoice) & Register Books",
            status: 'pending',
        }
    ] as const;

    const checklist = [
        "BIR Form 1901 (2 copies)",
        "Valid Government ID",
        "Sample Receipt/Invoice Layout",
        "Books of Accounts (Journal/Ledger)",
        ...(isTradeName ? ["DTI Certificate of Registration"] : []),
        ...(isLicensed ? ["PRC ID Copy", "Professional Tax Receipt (PTR)"] : ["Mayor's Permit", "Occupational Tax Receipt"]),
        "Contract of Lease or Proof of Residence"
    ];

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
                    tax8Percent={tax8Percent}
                    taxGraduated={taxGraduated}
                    isVatLiable={isVatLiable}
                    roadmap={roadmap as any}
                    checklist={checklist}
                />
            </div>
        </div>
    );
}
