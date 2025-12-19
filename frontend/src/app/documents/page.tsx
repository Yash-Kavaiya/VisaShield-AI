'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Search,
    Upload,
    Download,
    Eye,
    Trash2,
    FileText,
    FileImage,
    FileSpreadsheet,
    File,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    Brain,
    EyeOff,
    MoreVertical,
    FolderOpen,
    BookOpen,
    Bot,
} from 'lucide-react';
import { MainLayout } from '@/components/layout';
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Button,
    Select,
} from '@/components/ui';
import { mockDocuments } from '@/lib/mockData';
import { formatRelativeTime } from '@/lib/utils';
import { CaseDocument, DocumentCategory, OCRStatus, AIIngestionStatus } from '@/types';

const ITEMS_PER_PAGE = 10;

// Tab configuration
const TABS = [
    { id: 'all', label: 'All Documents', icon: FileText },
    { id: 'case', label: 'Case Documents', icon: FolderOpen },
    { id: 'reference', label: 'Reference Materials', icon: BookOpen },
    { id: 'ai-reports', label: 'AI Reports', icon: Bot },
] as const;

type TabId = typeof TABS[number]['id'];

// Helper to format file size
const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
};

// File type icon component
const FileIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'pdf':
        case 'form':
            return <FileText className="w-5 h-5 text-red-500" />;
        case 'image':
            return <FileImage className="w-5 h-5 text-blue-500" />;
        default:
            return <File className="w-5 h-5 text-gray-500" />;
    }
};

// OCR Status Badge
const OCRStatusBadge = ({ status }: { status: OCRStatus }) => {
    const configs = {
        pending: { icon: Clock, label: 'Pending', className: 'bg-gray-100 text-gray-600' },
        processing: { icon: Loader2, label: 'Processing', className: 'bg-blue-100 text-blue-700', animate: true },
        complete: { icon: CheckCircle2, label: 'Complete', className: 'bg-green-100 text-green-700' },
        failed: { icon: XCircle, label: 'Failed', className: 'bg-red-100 text-red-700' },
    };
    const config = configs[status];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
            <Icon className={`w-3 h-3 ${config.animate ? 'animate-spin' : ''}`} />
            {config.label}
        </span>
    );
};

// AI Status Badge
const AIStatusBadge = ({ status }: { status: AIIngestionStatus }) => {
    const configs = {
        'not-analyzed': { icon: Clock, label: 'Not Analyzed', className: 'bg-gray-100 text-gray-600' },
        processing: { icon: Brain, label: 'Analyzing', className: 'bg-purple-100 text-purple-700', animate: true },
        ingested: { icon: CheckCircle2, label: 'In RAG', className: 'bg-emerald-100 text-emerald-700' },
        failed: { icon: XCircle, label: 'Failed', className: 'bg-red-100 text-red-700' },
    };
    const config = configs[status];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
            <Icon className={`w-3 h-3 ${config.animate ? 'animate-spin' : ''}`} />
            {config.label}
        </span>
    );
};

// Category Badge
const CategoryBadge = ({ category }: { category: DocumentCategory }) => {
    const configs: Record<DocumentCategory, { label: string; className: string }> = {
        forms: { label: 'Form', className: 'bg-blue-50 text-blue-700 border-blue-200' },
        evidence: { label: 'Evidence', className: 'bg-amber-50 text-amber-700 border-amber-200' },
        correspondence: { label: 'Correspondence', className: 'bg-gray-50 text-gray-700 border-gray-200' },
        'ai-reports': { label: 'AI Report', className: 'bg-purple-50 text-purple-700 border-purple-200' },
        reference: { label: 'Reference', className: 'bg-teal-50 text-teal-700 border-teal-200' },
    };
    const config = configs[category];

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${config.className}`}>
            {config.label}
        </span>
    );
};

export default function DocumentsPage() {
    const [activeTab, setActiveTab] = useState<TabId>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
    const [showRedacted, setShowRedacted] = useState(false);

    // Filter documents based on tab, search, and filters
    const filteredDocuments = useMemo(() => {
        return mockDocuments.filter((doc) => {
            // Tab filter
            if (activeTab === 'case') {
                if (!['forms', 'evidence', 'correspondence'].includes(doc.category)) return false;
            } else if (activeTab === 'reference') {
                if (doc.category !== 'reference') return false;
            } else if (activeTab === 'ai-reports') {
                if (doc.category !== 'ai-reports') return false;
            }

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesName = doc.name.toLowerCase().includes(query);
                const matchesCase = doc.caseNumber?.toLowerCase().includes(query);
                if (!matchesName && !matchesCase) return false;
            }

            // Status filter
            if (statusFilter !== 'all') {
                if (statusFilter === 'ocr-processing' && doc.ocrStatus !== 'processing') return false;
                if (statusFilter === 'ai-processing' && doc.aiStatus !== 'processing') return false;
                if (statusFilter === 'complete' && (doc.ocrStatus !== 'complete' || doc.aiStatus !== 'ingested')) return false;
            }

            return true;
        });
    }, [activeTab, searchQuery, statusFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
    const paginatedDocs = filteredDocuments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Selection handlers
    const toggleSelectAll = () => {
        if (selectedDocs.size === paginatedDocs.length) {
            setSelectedDocs(new Set());
        } else {
            setSelectedDocs(new Set(paginatedDocs.map(d => d.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedDocs);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedDocs(newSelected);
    };

    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'ocr-processing', label: 'OCR Processing' },
        { value: 'ai-processing', label: 'AI Analyzing' },
        { value: 'complete', label: 'Fully Processed' },
    ];

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-heading text-[var(--primary-navy)]">
                        Document Center
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {mockDocuments.length} documents across all cases
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* PII Toggle */}
                    <button
                        onClick={() => setShowRedacted(!showRedacted)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${showRedacted
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {showRedacted ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showRedacted ? 'Redacted View' : 'Full View'}
                    </button>
                    <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                        Export
                    </Button>
                    <Button leftIcon={<Upload className="w-4 h-4" />}>
                        Upload
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-fit">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setCurrentPage(1);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-white text-[var(--primary-navy)] shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
                <CardBody>
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by filename or case number..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="input pl-10"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-3">
                            <Select
                                options={statusOptions}
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-44"
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Bulk Actions Bar */}
            {selectedDocs.size > 0 && (
                <div className="flex items-center justify-between bg-[var(--primary-navy)] text-white px-4 py-3 rounded-lg mb-4">
                    <span className="text-sm font-medium">
                        {selectedDocs.size} document{selectedDocs.size > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-red-300">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                        <button
                            onClick={() => setSelectedDocs(new Set())}
                            className="text-sm text-white/70 hover:text-white ml-2"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                    Showing{' '}
                    <span className="font-medium text-gray-900">
                        {filteredDocuments.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium text-gray-900">
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredDocuments.length)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium text-gray-900">{filteredDocuments.length}</span>{' '}
                    documents
                </p>
            </div>

            {/* Documents Table */}
            <Card>
                <div className="table-container border-0 rounded-lg overflow-hidden">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="w-12">
                                    <input
                                        type="checkbox"
                                        checked={paginatedDocs.length > 0 && selectedDocs.size === paginatedDocs.length}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-[var(--secondary-blue)] focus:ring-[var(--secondary-blue)]"
                                    />
                                </th>
                                <th>Document</th>
                                <th>Category</th>
                                <th>Case</th>
                                <th>OCR Status</th>
                                <th>AI Status</th>
                                <th>Uploaded</th>
                                <th>Size</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDocs.length > 0 ? (
                                paginatedDocs.map((doc) => (
                                    <tr key={doc.id} className={selectedDocs.has(doc.id) ? 'bg-blue-50' : ''}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedDocs.has(doc.id)}
                                                onChange={() => toggleSelect(doc.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-[var(--secondary-blue)] focus:ring-[var(--secondary-blue)]"
                                            />
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <FileIcon type={doc.type} />
                                                <div className="min-w-0">
                                                    <p className="text-gray-900 font-medium truncate max-w-[250px]" title={doc.name}>
                                                        {doc.name}
                                                    </p>
                                                    {doc.isRedacted && (
                                                        <span className="text-xs text-amber-600 flex items-center gap-1">
                                                            <EyeOff className="w-3 h-3" />
                                                            Redacted
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <CategoryBadge category={doc.category} />
                                        </td>
                                        <td>
                                            {doc.caseNumber ? (
                                                <Link
                                                    href={`/cases/${doc.caseId}`}
                                                    className="font-mono text-sm text-[var(--secondary-blue)] hover:underline"
                                                >
                                                    {doc.caseNumber}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400 text-sm">—</span>
                                            )}
                                        </td>
                                        <td>
                                            <OCRStatusBadge status={doc.ocrStatus} />
                                        </td>
                                        <td>
                                            <AIStatusBadge status={doc.aiStatus} />
                                        </td>
                                        <td className="text-gray-500 text-sm">
                                            {formatRelativeTime(doc.uploadDate)}
                                        </td>
                                        <td className="text-gray-500 text-sm font-mono">
                                            {formatFileSize(doc.fileSize)}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                    title="Preview"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                    title="More Options"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center py-12">
                                        <div className="text-gray-500">
                                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p className="text-lg font-medium">No documents found</p>
                                            <p className="text-sm mt-1">
                                                Try adjusting your search or filter criteria
                                            </p>
                                            <Button
                                                variant="secondary"
                                                className="mt-4"
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setStatusFilter('all');
                                                    setActiveTab('all');
                                                }}
                                            >
                                                Clear Filters
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredDocuments.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ChevronLeft className="w-4 h-4" />}
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded text-sm font-medium transition-colors ${page === currentPage
                                            ? 'bg-[var(--primary-navy)] text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            rightIcon={<ChevronRight className="w-4 h-4" />}
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </Card>
        </MainLayout>
    );
}
