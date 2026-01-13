"use client";

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer';
import type { TaxProfile } from '@/lib/RaketEngine';

// --- Font Registration (Standard Helvetica fallback is usually fine, but let's be explicit) ---
// Note: We'll stick to standard fonts for reliability unless custom fonts are loaded.
// Helvetica is the standard sans-serif in PDF.

// --- Styles ---
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#000000',
        backgroundColor: '#FFFFFF',
    },
    // Header
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24, // increased spacing
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 12, // increased padding
    },
    logoText: {
        fontSize: 18, // larger logo
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    metaContainer: {
        alignItems: 'flex-end',
    },
    metaText: {
        fontSize: 8,
        color: '#6B7280',
    },
    badge: {
        fontSize: 8,
        color: '#047857',
        backgroundColor: '#ECFDF5',
        paddingVertical: 3, // cleaner padding
        paddingHorizontal: 8,
        borderRadius: 4,
        marginTop: 4,
    },

    // Executive Summary Card
    summaryCard: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 6,
        padding: 16, // more breathing room
        marginBottom: 24,
    },
    summaryTitle: {
        fontSize: 9, // larger title
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    highlightMetric: {
        fontSize: 28, // Distinctly large
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 6,
        letterSpacing: -1,
    },
    featureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    regimeBadge: {
        color: '#2E5BFF',
        fontWeight: 'bold',
        fontSize: 10,
        marginTop: 2,
    },
    eoptAlert: {
        color: '#059669',
        fontWeight: 'bold',
        fontSize: 10,
        marginTop: 2,
    },

    // Section Headers
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 16, // more space before headers
        color: '#111827',
        borderLeftWidth: 3,
        borderLeftColor: '#2E5BFF',
        paddingLeft: 10,
    },

    // Checklist
    checklistContainer: {
        marginTop: 8,
        marginBottom: 24,
    },
    checkItem: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 10, // slightly larger
        height: 10,
        borderWidth: 1,
        borderColor: '#9CA3AF',
        marginRight: 10,
        marginTop: 1,
        borderRadius: 2, // minor aesthetic rounded
    },
    checkText: {
        fontSize: 9,
        color: '#374151',
        flex: 1,
        lineHeight: 1.4,
    },

    // Roadmap
    stepContainer: {
        marginBottom: 14, // better separation between steps
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    stepNumber: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#2E5BFF',
        color: '#FFFFFF',
        fontSize: 8,
        textAlign: 'center',
        marginRight: 12, // more gap from text
        marginTop: 1,
        paddingTop: 2,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 2,
    },
    stepDesc: {
        fontSize: 9,
        color: '#6B7280',
        lineHeight: 1.4,
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 7,
        color: '#9CA3AF',
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 10,
    },
});

// --- Component ---

interface RoadmapPDFProps {
    taxProfile: TaxProfile;
    income: number;
}

export function RoadmapPDF({ taxProfile, income }: RoadmapPDFProps) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(val);

    const dateStr = new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });

    // Filter checklist dynamically based on EOPT & Input (Logic Mirroring engine)
    // We can merge the engine's dynamic checklist with the static hard-reqs requested by prompt
    const staticItems = [
        "BIR Form 1901 (v2024) - 2 Original Copies",
        "Primary Gov ID (PhilID, Passport, or DL) - 1 Photocopy",
        "Proof of Address (Barangay Cert/Utility Bill) - 1 Photocopy",
        "₱30 Documentary Stamp Tax (for COR issuance)",
    ];

    // Merge the engine's contextual items (which handles Licensed/Trade logic) at the end
    // We'll deduplicate conceptually or just append specialized ones.
    // Engine returns: "DTI Cert", "PRC ID", etc.
    const dynamicItems = taxProfile.documentChecklist.filter(item =>
        !item.includes("Form 1901") && !item.includes("Start Reg") && !item.includes("Gov ID") && !item.includes("Address")
    );

    const fullChecklist = [...staticItems, ...dynamicItems, "(Post-Reg) Manual Books of Accounts (Journal/Ledger)"];

    return (
        <Document title="Raket-Ready Compliance Roadmap">
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.headerContainer}>
                    <Text style={styles.logoText}>Raket-Ready</Text>
                    <View style={styles.metaContainer}>
                        <Text style={styles.metaText}>Generated: {dateStr}</Text>
                        <View style={styles.badge}>
                            <Text>Compliance Verified: RA 11976 (EOPT Act)</Text>
                        </View>
                    </View>
                </View>

                {/* Executive Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Executive Tax Summary</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 }}>
                        <Text style={styles.highlightMetric}>
                            {formatCurrency(taxProfile.taxDueEstimate)}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 6, paddingBottom: 2 }}>
                            / year (Est.)
                        </Text>
                    </View>

                    <View style={styles.featureRow}>
                        <View>
                            <Text style={{ fontSize: 8, color: '#6B7280' }}>Recommended Regime</Text>
                            <Text style={[styles.regimeBadge, { fontSize: 10 }]}>
                                {taxProfile.recommendedRegime === '8%' ? '8% Flat Rate' : 'Graduated Tax Table'}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 8, color: '#6B7280' }}>Registration Fee (Form 0605)</Text>
                            <Text style={styles.eoptAlert}>ABOLISHED (₱0.00)</Text>
                        </View>
                    </View>
                </View>

                {/* Roadmap Timeline */}
                <Text style={styles.sectionHeader}>2026 Compliance Roadmap</Text>
                <View style={{ marginBottom: 24 }}>
                    {taxProfile.stepList.map((step, idx) => (
                        <View key={idx} style={styles.stepContainer}>
                            <Text style={styles.stepNumber}>{idx + 1}</Text>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>{step.title}</Text>
                                {/* Replace text per strict requirement if needed, though engine handles it. 
                        Engine output for Step 4 is "Invoicing & Books". */}
                                <Text style={styles.stepDesc}>{step.description.replace("Official Receipts", "Service Invoices")}</Text>
                            </View>
                        </View>
                    ))}
                </View>


                {/* Document Checklist */}
                <Text style={styles.sectionHeader}>Required Documents (The "Pack")</Text>
                <View style={styles.checklistContainer}>
                    {fullChecklist.map((item, idx) => (
                        <View key={idx} style={styles.checkItem}>
                            <View style={styles.checkbox} />
                            <Text style={styles.checkText}>{item}</Text>
                        </View>
                    ))}
                </View>

                {/* Disclaimer / Footer */}
                <Text style={styles.footer}>
                    Generated by Raket-Ready. This document is for guidance purposes only.
                    Review RA 11976 (EOPT Act) or consult a CPA for official advice.
                </Text>

            </Page>
        </Document>
    );
}
