'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    Brain,
    Download,
    UserPlus,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    FileText,
    User,
    Building,
    MapPin,
    Calendar,
    DollarSign,
    Globe,
    Copy,
    Eye,
    EyeOff,
    ExternalLink,
    MessageSquare,
    ChevronRight,
} from 'lucide-react';
import { MainLayout } from '@/components/layout';
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    CardDescription,
    Button,
    StatusBadge,
    VisaBadge,
    ConfidenceBadge,
    Badge,
} from '@/components/ui';
import { mockCases } from '@/lib/mockData';
import { formatDate, formatDateShort, cn, getConfidenceColor } from '@/lib/utils';

type TabType = 'overview' | 'documents' | 'ai-analysis' | 'timeline' | 'notes';

// Mock detailed data for a case
const mockCaseDetail = {
    applicantInfo: {
        fullName: 'John Michael Smith',
        dateOfBirth: '1990-05-15',
        countryOfBirth: 'India',
        countryOfCitizenship: 'India',
        passportNumber: 'L1234567',
        aNumber: 'A123456789',
        currentStatus: 'F-1 Student',
        previousVisas: ['F-1', 'B-1/B-2'],
    },
    petitionDetails: {
        employerName: 'TechCorp Inc.',
        employerAddress: '123 Tech Boulevard, San Francisco, CA 94102',
        employerEIN: '12-3456789',
        jobTitle: 'Senior Software Engineer',
        socCode: '15-1252.00',
        wageLevel: 3,
        offeredWage: 165000,
        workLocation: 'San Francisco, CA',
        startDate: '2025-04-01',
        endDate: '2028-03-31',
        fullTime: true,
    },
    documents: [
        { id: '1', name: 'I-129 Petition', status: 'verified', category: 'forms' },
        { id: '2', name: 'Labor Condition Application', status: 'verified', category: 'forms' },
        { id: '3', name: 'Master\'s Degree Transcript', status: 'verified', category: 'evidence' },
        { id: '4', name: 'Degree Evaluation', status: 'pending', category: 'evidence' },
        { id: '5', name: 'Employment Letter', status: 'verified', category: 'evidence' },
        { id: '6', name: 'Passport Copy', status: 'missing', category: 'evidence' },
        { id: '7', name: 'Previous Visa Stamps', status: 'verified', category: 'evidence' },
    ],
    aiAnalysis: {
        overallScore: 87,
        recommendation: 'likely-approvable',
        keyFindings: [
            'Specialty occupation requirement met - position requires specialized knowledge',
            'Beneficiary qualifications verified - Master\'s degree in Computer Science',
            'Employer-employee relationship established',
            'LCA wage level appropriate for position and location',
        ],
        riskFactors: [
            { severity: 'medium', description: 'Passport copy missing from evidence package' },
            { severity: 'low', description: 'Employment gap in 2019 may require explanation' },
        ],
        citationsVerified: true,
    },
    timeline: [
        { date: '2024-11-15', event: 'Petition Filed', type: 'milestone' },
        { date: '2024-11-18', event: 'Receipt Notice Issued', type: 'milestone' },
        { date: '2024-12-10', event: 'AI Analysis Initiated', type: 'processing' },
        { date: '2024-12-18', event: 'AI Analysis Complete', type: 'processing', current: true },
    ],
};

export default function CaseDetailPage() {
    const params = useParams();
    const caseId = params.id as string;
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [showSensitiveData, setShowSensitiveData] = useState(false);

    // Find case from mock data
    const caseData = mockCases.find((c) => c.id === caseId) || mockCases[0];

    const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'ai-analysis', label: 'AI Analysis', icon: Brain },
        { id: 'timeline', label: 'Timeline', icon: Clock },
        { id: 'notes', label: 'Notes', icon: MessageSquare },
    ];

    const documentStatusIcon = (status: string) => {
        switch (status) {
            case 'verified':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'pending':
                return <AlertCircle className="w-4 h-4 text-yellow-600" />;
            case 'missing':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <MainLayout>
            {/* Back Navigation */}
            <Link
                href="/cases"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Cases</span>
            </Link>

            {/* Case Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-heading text-[var(--primary-navy)] font-mono">
                                {caseData.caseNumber}
                            </h1>
                            <StatusBadge status={caseData.status} />
                            <VisaBadge visaType={caseData.visaType} />
                        </div>
                        <h2 className="text-xl text-gray-900 mb-2">
                            {showSensitiveData ? caseData.applicantName : caseData.applicantNameRedacted}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Filed: {formatDateShort(caseData.filedDate)}
                            </span>
                            {caseData.priorityDate && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Priority: {formatDateShort(caseData.priorityDate)}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {caseData.assignedAttorney}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            onClick={() => setShowSensitiveData(!showSensitiveData)}
                        >
                            {showSensitiveData ? 'Hide PII' : 'Show PII'}
                        </Button>
                        <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                            Export PDF
                        </Button>
                        <Button variant="secondary" leftIcon={<UserPlus className="w-4 h-4" />}>
                            Assign
                        </Button>
                        <Button leftIcon={<Brain className="w-4 h-4" />}>
                            Run AI Analysis
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex gap-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 -mb-px transition-colors',
                                activeTab === tab.id
                                    ? 'border-[var(--primary-navy)] text-[var(--primary-navy)]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Applicant Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Applicant Information
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                                        <p className="text-gray-900 font-medium">
                                            {showSensitiveData ? mockCaseDetail.applicantInfo.fullName : caseData.applicantNameRedacted}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date of Birth</p>
                                        <p className="text-gray-900">
                                            {showSensitiveData ? formatDateShort(mockCaseDetail.applicantInfo.dateOfBirth) : '••••-••-••'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Country of Birth</p>
                                        <p className="text-gray-900">{mockCaseDetail.applicantInfo.countryOfBirth}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Citizenship</p>
                                        <p className="text-gray-900">{mockCaseDetail.applicantInfo.countryOfCitizenship}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">A-Number</p>
                                        <div className="flex items-center gap-2">
                                            <code className="text-gray-900 font-mono">
                                                {showSensitiveData ? mockCaseDetail.applicantInfo.aNumber : '••••••••••'}
                                            </code>
                                            <button className="p-1 text-gray-400 hover:text-gray-600">
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Status</p>
                                        <p className="text-gray-900">{mockCaseDetail.applicantInfo.currentStatus}</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Petition Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="w-5 h-5" />
                                    Petition Details
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Employer / Sponsor</p>
                                        <p className="text-gray-900 font-medium">{mockCaseDetail.petitionDetails.employerName}</p>
                                        <p className="text-sm text-gray-500">{mockCaseDetail.petitionDetails.employerAddress}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Job Title</p>
                                        <p className="text-gray-900">{mockCaseDetail.petitionDetails.jobTitle}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">SOC Code</p>
                                        <p className="text-gray-900 font-mono">{mockCaseDetail.petitionDetails.socCode}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Wage Level</p>
                                        <p className="text-gray-900">Level {mockCaseDetail.petitionDetails.wageLevel}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Offered Wage</p>
                                        <p className="text-gray-900">
                                            ${mockCaseDetail.petitionDetails.offeredWage.toLocaleString()} / year
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Work Location</p>
                                        <p className="text-gray-900">{mockCaseDetail.petitionDetails.workLocation}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Employment Period</p>
                                        <p className="text-gray-900">
                                            {formatDateShort(mockCaseDetail.petitionDetails.startDate)} –{' '}
                                            {formatDateShort(mockCaseDetail.petitionDetails.endDate!)}
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Supporting Evidence */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Supporting Evidence
                                </CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-2">
                                {mockCaseDetail.documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {documentStatusIcon(doc.status)}
                                            <span className="text-gray-900">{doc.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    doc.status === 'verified'
                                                        ? 'success'
                                                        : doc.status === 'pending'
                                                            ? 'warning'
                                                            : 'error'
                                                }
                                            >
                                                {doc.status === 'verified'
                                                    ? 'Verified'
                                                    : doc.status === 'pending'
                                                        ? 'Pending Review'
                                                        : 'Missing'}
                                            </Badge>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                ))}
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* AI Adjudication Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="w-5 h-5" />
                                    AI Adjudication Summary
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                {/* Confidence Score Gauge */}
                                <div className="text-center mb-6">
                                    <div className="relative inline-flex items-center justify-center w-32 h-32">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                fill="none"
                                                stroke="#E5E7EB"
                                                strokeWidth="12"
                                            />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                fill="none"
                                                stroke={mockCaseDetail.aiAnalysis.overallScore >= 80 ? '#2E7D32' : mockCaseDetail.aiAnalysis.overallScore >= 60 ? '#F9A825' : '#C62828'}
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                strokeDasharray={`${(mockCaseDetail.aiAnalysis.overallScore / 100) * 352} 352`}
                                            />
                                        </svg>
                                        <div className="absolute">
                                            <span className={cn('text-3xl font-bold', getConfidenceColor(mockCaseDetail.aiAnalysis.overallScore))}>
                                                {mockCaseDetail.aiAnalysis.overallScore}
                                            </span>
                                            <span className="text-gray-400">%</span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <Badge variant="success" className="px-4 py-1.5 text-sm">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            LIKELY APPROVABLE
                                        </Badge>
                                    </div>
                                </div>

                                {/* Key Findings */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Findings</h4>
                                    <ul className="space-y-2">
                                        {mockCaseDetail.aiAnalysis.keyFindings.map((finding, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span>{finding}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Risk Factors */}
                                {mockCaseDetail.aiAnalysis.riskFactors.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Risk Factors</h4>
                                        <ul className="space-y-2">
                                            {mockCaseDetail.aiAnalysis.riskFactors.map((risk, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <AlertCircle className={cn(
                                                        'w-4 h-4 flex-shrink-0 mt-0.5',
                                                        risk.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                                                    )} />
                                                    <span className="text-gray-600">{risk.description}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Citation Check */}
                                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-800">
                                            All citations verified
                                        </span>
                                    </div>
                                </div>

                                <Button className="w-full mt-4" variant="secondary">
                                    View Full Analysis
                                </Button>
                            </CardBody>
                        </Card>

                        {/* Processing Timeline Mini */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Processing Timeline</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="timeline">
                                    {mockCaseDetail.timeline.map((event, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                'timeline-item',
                                                event.current && 'active',
                                                index < mockCaseDetail.timeline.length - 1 && !event.current && 'complete'
                                            )}
                                        >
                                            <p className="text-sm font-medium text-gray-900">{event.event}</p>
                                            <p className="text-xs text-gray-500">{formatDateShort(event.date)}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Assigned Team */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Assigned Team</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--secondary-blue)] flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">SM</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Sarah Mitchell</p>
                                        <p className="text-xs text-gray-500">Lead Attorney</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">JD</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Jane Doe</p>
                                        <p className="text-xs text-gray-500">Paralegal</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'documents' && (
                <Card padding="lg">
                    <p className="text-gray-500 text-center py-12">
                        Document viewer will be implemented here with split-pane PDF viewer.
                    </p>
                </Card>
            )}

            {activeTab === 'ai-analysis' && (
                <Card padding="lg">
                    <p className="text-gray-500 text-center py-12">
                        Full AI analysis with chain-of-thought reasoning will be displayed here.
                    </p>
                </Card>
            )}

            {activeTab === 'timeline' && (
                <Card padding="lg">
                    <p className="text-gray-500 text-center py-12">
                        Complete case timeline with all events will be shown here.
                    </p>
                </Card>
            )}

            {activeTab === 'notes' && (
                <Card padding="lg">
                    <p className="text-gray-500 text-center py-12">
                        Case notes and comments section will be implemented here.
                    </p>
                </Card>
            )}
        </MainLayout>
    );
}
