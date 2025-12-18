'use client';

import React, { useState, useEffect } from 'react';
import {
    Play,
    Pause,
    SkipForward,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2,
    ZoomIn,
    ZoomOut,
    ChevronLeft,
    ChevronRight,
    Maximize,
} from 'lucide-react';
import { MainLayout } from '@/components/layout';
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Button,
    VisaBadge,
    Badge,
} from '@/components/ui';
import { PROCESSING_STAGES } from '@/lib/constants';
import { cn, formatElapsedTime } from '@/lib/utils';
import { ProcessingStage } from '@/types';

// Mock streaming analysis data
const mockAnalysisSteps = [
    {
        id: 1,
        action: 'Extracting form data from I-129 petition',
        status: 'complete',
        conclusion: 'Form I-129 validated. All required fields present.',
        confidence: 98,
    },
    {
        id: 2,
        action: 'Analyzing Labor Condition Application',
        status: 'complete',
        conclusion: 'LCA approved. Wage level 3 appropriate for Senior Software Engineer in San Francisco MSA.',
        confidence: 95,
    },
    {
        id: 3,
        action: 'Evaluating beneficiary qualifications',
        status: 'complete',
        conclusion: 'Master\'s degree in Computer Science from accredited institution verified.',
        confidence: 92,
    },
    {
        id: 4,
        action: 'Checking specialty occupation requirements',
        status: 'in-progress',
        conclusion: 'Analyzing job duties against DOL O*NET database...',
        confidence: 0,
    },
    {
        id: 5,
        action: 'Verifying employer-employee relationship',
        status: 'pending',
        conclusion: '',
        confidence: 0,
    },
    {
        id: 6,
        action: 'Cross-referencing USCIS Policy Manual',
        status: 'pending',
        conclusion: '',
        confidence: 0,
    },
];

const mockCriteria = [
    { id: 1, name: 'Specialty Occupation', status: 'complete' as const },
    { id: 2, name: 'Beneficiary Qualifications', status: 'complete' as const },
    { id: 3, name: 'LCA Compliance', status: 'complete' as const },
    { id: 4, name: 'Employer-Employee Relationship', status: 'in-progress' as const },
    { id: 5, name: 'Validity Period', status: 'pending' as const },
    { id: 6, name: 'Prior Violations Check', status: 'pending' as const },
];

export default function AdjudicatorPage() {
    const [isProcessing, setIsProcessing] = useState(true);
    const [currentStage, setCurrentStage] = useState<ProcessingStage>('policy-matching');
    const [progress, setProgress] = useState(65);
    const [elapsedTime, setElapsedTime] = useState(145);
    const [streamingText, setStreamingText] = useState('');
    const [documentPage, setDocumentPage] = useState(1);
    const [zoom, setZoom] = useState(100);

    // Simulate elapsed time
    useEffect(() => {
        if (isProcessing) {
            const interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isProcessing]);

    // Simulate streaming text
    useEffect(() => {
        if (isProcessing) {
            const text = `> Analyzing position requirements against O*NET database...
> Job Code: 15-1252.00 (Software Developers)
> Required Education: Bachelor's degree or higher in computer science or related field
> 
> Cross-referencing with USCIS Policy Manual Chapter 2:
> "A specialty occupation requires theoretical and practical application 
>  of a body of highly specialized knowledge..."
>
> Evidence found in petition supporting specialty occupation:
> - Master's degree requirement listed in job posting
> - Specialized duties involving AI/ML development
> - Industry standard for similar positions
>
> Preliminary assessment: PASS ✓`;

            let index = 0;
            const interval = setInterval(() => {
                if (index <= text.length) {
                    setStreamingText(text.slice(0, index));
                    index += 3;
                } else {
                    clearInterval(interval);
                }
            }, 30);
            return () => clearInterval(interval);
        }
    }, [isProcessing]);

    const stages = Object.entries(PROCESSING_STAGES).map(([key, value]) => ({
        id: key as ProcessingStage,
        ...value,
    }));

    const currentStageIndex = stages.findIndex((s) => s.id === currentStage);

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-heading text-[var(--primary-navy)]">
                        AI Adjudicator
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Real-time petition analysis and adjudication
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-green-700 font-medium">Live Analysis</span>
                    </div>
                </div>
            </div>

            {/* Active Case Banner */}
            <Card className="mb-6 bg-[var(--cream-white)]">
                <CardBody className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            <FileText className="w-6 h-6 text-[var(--primary-navy)]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono font-bold text-[var(--primary-navy)]">
                                    H1B-2024-00847
                                </span>
                                <VisaBadge visaType="H-1B" size="sm" />
                            </div>
                            <p className="text-sm text-gray-600">John M*** • TechCorp Inc.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant={isProcessing ? 'danger' : 'primary'}
                            leftIcon={isProcessing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            onClick={() => setIsProcessing(!isProcessing)}
                        >
                            {isProcessing ? 'Pause Analysis' : 'Resume Analysis'}
                        </Button>
                        <Button variant="secondary" leftIcon={<SkipForward className="w-4 h-4" />}>
                            Skip to Summary
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {/* Main Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left: Document Viewer */}
                <Card className="h-[600px] flex flex-col">
                    <CardHeader className="flex-shrink-0">
                        <div className="flex items-center justify-between w-full">
                            <CardTitle className="text-base">Document Viewer</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                                    <ZoomOut className="w-4 h-4" />
                                </Button>
                                <span className="text-sm text-gray-500 w-12 text-center">{zoom}%</span>
                                <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                                    <ZoomIn className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Maximize className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="flex-1 overflow-hidden relative">
                        {/* Mock PDF Viewer */}
                        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div
                                className="bg-white shadow-lg p-8 w-full max-w-md"
                                style={{ transform: `scale(${zoom / 100})` }}
                            >
                                <div className="text-center mb-6">
                                    <p className="text-xs text-gray-400 mb-2">Department of Homeland Security</p>
                                    <h3 className="font-bold text-lg">Form I-129</h3>
                                    <p className="text-sm text-gray-600">Petition for Nonimmigrant Worker</p>
                                </div>
                                <div className="space-y-4 text-sm">
                                    <div className="p-3 bg-yellow-100 border border-yellow-300 rounded">
                                        <p className="text-yellow-800 text-xs">
                                            📍 AI is currently analyzing this section
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">Part 1. Petitioner Information</p>
                                        <p className="font-medium">TechCorp Inc.</p>
                                        <p className="text-gray-600">123 Tech Boulevard</p>
                                        <p className="text-gray-600">San Francisco, CA 94102</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">Part 2. Classification Requested</p>
                                        <p className="font-medium">H-1B Specialty Occupation</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Page Navigation */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white rounded-lg shadow-lg px-3 py-2">
                            <Button variant="ghost" size="sm" onClick={() => setDocumentPage(Math.max(1, documentPage - 1))}>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-sm text-gray-600">
                                Page {documentPage} of 12
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => setDocumentPage(Math.min(12, documentPage + 1))}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Right: AI Reasoning Panel */}
                <Card className="h-[600px] flex flex-col">
                    <CardHeader className="flex-shrink-0">
                        <div className="flex items-center gap-2">
                            {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-[var(--secondary-blue)]" />}
                            <CardTitle className="text-base">Live Analysis</CardTitle>
                        </div>
                    </CardHeader>
                    <CardBody className="flex-1 overflow-auto">
                        {/* Current Action */}
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-600 font-medium mb-1">Currently evaluating:</p>
                            <p className="text-sm text-blue-900">Specialty Occupation Requirements (8 CFR 214.2(h)(4)(ii))</p>
                        </div>

                        {/* Streaming Output */}
                        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 mb-4 h-48 overflow-auto">
                            <pre className="whitespace-pre-wrap">{streamingText}</pre>
                            {isProcessing && (
                                <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1" />
                            )}
                        </div>

                        {/* Analysis Steps */}
                        <div className="space-y-3">
                            {mockAnalysisSteps.map((step) => (
                                <div
                                    key={step.id}
                                    className={cn(
                                        'p-3 rounded-lg border transition-all',
                                        step.status === 'complete' && 'bg-green-50 border-green-200',
                                        step.status === 'in-progress' && 'bg-blue-50 border-blue-200',
                                        step.status === 'pending' && 'bg-gray-50 border-gray-200'
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        {step.status === 'complete' && (
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        {step.status === 'in-progress' && (
                                            <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                                        )}
                                        {step.status === 'pending' && (
                                            <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <p className={cn(
                                                'text-sm font-medium',
                                                step.status === 'complete' && 'text-green-800',
                                                step.status === 'in-progress' && 'text-blue-800',
                                                step.status === 'pending' && 'text-gray-500'
                                            )}>
                                                {step.action}
                                            </p>
                                            {step.conclusion && (
                                                <p className={cn(
                                                    'text-xs mt-1',
                                                    step.status === 'complete' && 'text-green-600',
                                                    step.status === 'in-progress' && 'text-blue-600'
                                                )}>
                                                    {step.conclusion}
                                                </p>
                                            )}
                                        </div>
                                        {step.confidence > 0 && (
                                            <Badge variant="success">{step.confidence}%</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Progress Dashboard */}
            <Card>
                <CardBody>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Elapsed Time</p>
                                <p className="text-lg font-mono font-bold text-[var(--primary-navy)]">
                                    {formatElapsedTime(elapsedTime)}
                                </p>
                            </div>
                            <div className="w-px h-10 bg-gray-200" />
                            <div>
                                <p className="text-sm text-gray-500">Estimated Remaining</p>
                                <p className="text-lg font-mono font-bold text-gray-600">
                                    ~{formatElapsedTime(75)}
                                </p>
                            </div>
                            <div className="w-px h-10 bg-gray-200" />
                            <div>
                                <p className="text-sm text-gray-500">Overall Progress</p>
                                <p className="text-lg font-mono font-bold text-[var(--secondary-blue)]">
                                    {progress}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stage Progress Bar */}
                    <div className="relative mb-6">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--secondary-blue)] rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Stage Indicators */}
                    <div className="flex justify-between">
                        {stages.map((stage, index) => (
                            <div
                                key={stage.id}
                                className={cn(
                                    'flex flex-col items-center',
                                    index <= currentStageIndex ? 'text-[var(--primary-navy)]' : 'text-gray-400'
                                )}
                            >
                                <div
                                    className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors',
                                        index < currentStageIndex && 'bg-green-500 text-white',
                                        index === currentStageIndex && 'bg-[var(--secondary-blue)] text-white',
                                        index > currentStageIndex && 'bg-gray-200'
                                    )}
                                >
                                    {index < currentStageIndex ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : index === currentStageIndex ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <span className="text-xs font-bold">{index + 1}</span>
                                    )}
                                </div>
                                <span className="text-xs font-medium text-center max-w-[100px]">
                                    {stage.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Right Sidebar - Criteria Checklist */}
            <div className="fixed right-6 top-24 w-64 hidden xl:block">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Evaluation Criteria</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-2">
                        {mockCriteria.map((criterion) => (
                            <div
                                key={criterion.id}
                                className={cn(
                                    'flex items-center gap-2 p-2 rounded text-sm',
                                    criterion.status === 'complete' && 'bg-green-50',
                                    criterion.status === 'in-progress' && 'bg-blue-50',
                                    criterion.status === 'pending' && 'bg-gray-50'
                                )}
                            >
                                {criterion.status === 'complete' && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                                {criterion.status === 'in-progress' && (
                                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                )}
                                {criterion.status === 'pending' && (
                                    <Clock className="w-4 h-4 text-gray-400" />
                                )}
                                <span className={cn(
                                    criterion.status === 'complete' && 'text-green-800',
                                    criterion.status === 'in-progress' && 'text-blue-800',
                                    criterion.status === 'pending' && 'text-gray-500'
                                )}>
                                    {criterion.name}
                                </span>
                            </div>
                        ))}
                    </CardBody>
                </Card>
            </div>
        </MainLayout>
    );
}
