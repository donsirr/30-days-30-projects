'use client';

import { useState } from 'react';

export default function TestPage() {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testAPI = async () => {
        setLoading(true);
        setResult('Testing...');

        try {
            const response = await fetch('/api/brain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: {
                        type: 'text',
                        content: 'What is photosynthesis?'
                    },
                    pdfContext: [
                        {
                            fileName: 'biology-test.pdf',
                            content: 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water. Photosynthesis in plants generally involves the green pigment chlorophyll and generates oxygen as a byproduct. This process occurs primarily in the leaves of plants.',
                            pageNumber: 1
                        }
                    ]
                })
            });

            const data = await response.json();
            setResult(JSON.stringify(data, null, 2));
        } catch (error) {
            setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '40px',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'monospace',
            backgroundColor: '#0a0a0a',
            minHeight: '100vh',
            color: '#fff'
        }}>
            <h1 style={{ color: '#10b981', marginBottom: '20px' }}>🧠 ScanMind Brain API Test</h1>

            <button
                onClick={testAPI}
                disabled={loading}
                style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: loading ? '#374151' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '20px'
                }}
            >
                {loading ? '⏳ Testing...' : '🚀 Test API'}
            </button>

            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#6b7280' }}>Test Question:</h3>
                <p style={{ color: '#9ca3af' }}>&quot;What is photosynthesis?&quot;</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#6b7280' }}>Test PDF Context:</h3>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                    biology-test.pdf (Page 1): &quot;Photosynthesis is the process by which green plants use sunlight to synthesize foods...&quot;
                </p>
            </div>

            <div>
                <h3 style={{ color: '#6b7280' }}>Response:</h3>
                <pre style={{
                    backgroundColor: '#1f2937',
                    padding: '20px',
                    borderRadius: '8px',
                    overflow: 'auto',
                    maxHeight: '500px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: result.includes('error') || result.includes('Error') ? '#ef4444' : '#10b981'
                }}>
                    {result || 'Click "Test API" to see results'}
                </pre>
            </div>
        </div>
    );
}
