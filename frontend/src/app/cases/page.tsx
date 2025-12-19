'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    Download,
    Plus,
    ChevronLeft,
    ChevronRight,
    Eye,
    UserPlus,
    Flag,
    MoreVertical,
    Calendar,
    SlidersHorizontal,
} from 'lucide-react';
import { MainLayout } from '@/components/layout';
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Button,
    StatusBadge,
    VisaBadge,
    ConfidenceBadge,
    Input,
    Select,
} from '@/components/ui';
import { mockCases } from '@/lib/mockData';
import { formatRelativeTime, formatDateShort } from '@/lib/utils';
import { CaseStatus, VisaType, Case } from '@/types';
import { CASE_STATUSES, VISA_TYPES } from '@/lib/constants';

const ITEMS_PER_PAGE = 10;

export default function CasesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');
    const [visaTypeFilter, setVisaTypeFilter] = useState<VisaType | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Filter cases
    const filteredCases = useMemo(() => {
        return mockCases.filter((c) => {
            const matchesSearch =
                searchQuery === '' ||
                c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.employer?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
            const matchesVisaType = visaTypeFilter === 'all' || c.visaType === visaTypeFilter;

            return matchesSearch && matchesStatus && matchesVisaType;
        });
    }, [searchQuery, statusFilter, visaTypeFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredCases.length / ITEMS_PER_PAGE);
    const paginatedCases = filteredCases.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        ...Object.entries(CASE_STATUSES).map(([key, value]) => ({
            value: key,
            label: value.label,
        })),
    ];

    const visaTypeOptions = [
        { value: 'all', label: 'All Visa Types' },
        ...Object.entries(VISA_TYPES).map(([key, value]) => ({
            value: key,
            label: `${value.label} - ${value.description}`,
        })),
    ];

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-heading text-[var(--primary-navy)]">
                        Case Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Manage and review all immigration petitions
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                        Export
                    </Button>
                    <Button leftIcon={<Plus className="w-4 h-4" />}>
                        New Case
                    </Button>
                </div>
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
                                    placeholder="Search by case number, applicant name, or employer..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="input pl-10"
                                />
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div className="flex items-center gap-3">
                            <Select
                                options={statusOptions}
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value as CaseStatus | 'all');
                                    setCurrentPage(1);
                                }}
                                className="w-40"
                            />
                            <Select
                                options={visaTypeOptions}
                                value={visaTypeFilter}
                                onChange={(e) => {
                                    setVisaTypeFilter(e.target.value as VisaType | 'all');
                                    setCurrentPage(1);
                                }}
                                className="w-48"
                            />
                            <Button
                                variant="ghost"
                                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                More Filters
                            </Button>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Filed After"
                                type="date"
                                leftIcon={<Calendar className="w-4 h-4" />}
                            />
                            <Input
                                label="Filed Before"
                                type="date"
                                leftIcon={<Calendar className="w-4 h-4" />}
                            />
                            <Select
                                label="Assigned Attorney"
                                options={[
                                    { value: 'all', label: 'All Attorneys' },
                                    { value: 'att-001', label: 'Sarah Mitchell' },
                                    { value: 'att-002', label: 'James Rodriguez' },
                                ]}
                            />
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                    Showing{' '}
                    <span className="font-medium text-gray-900">
                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium text-gray-900">
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredCases.length)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium text-gray-900">{filteredCases.length}</span>{' '}
                    cases
                </p>
            </div>

            {/* Cases Table */}
            <Card>
                <div className="table-container border-0 rounded-lg overflow-hidden">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Case Number</th>
                                <th>Applicant</th>
                                <th>Visa Type</th>
                                <th>Status</th>
                                <th>AI Confidence</th>
                                <th>Attorney</th>
                                <th>Filed</th>
                                <th>Last Updated</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCases.length > 0 ? (
                                paginatedCases.map((caseItem) => (
                                    <tr key={caseItem.id}>
                                        <td>
                                            <Link
                                                href={`/cases/${caseItem.id}`}
                                                className="font-mono text-[var(--secondary-blue)] hover:underline"
                                            >
                                                {caseItem.caseNumber}
                                            </Link>
                                        </td>
                                        <td>
                                            <div>
                                                <p className="text-gray-900">{caseItem.applicantNameRedacted}</p>
                                                <p className="text-xs text-gray-500">{caseItem.country}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <VisaBadge visaType={caseItem.visaType} />
                                        </td>
                                        <td>
                                            <StatusBadge status={caseItem.status} />
                                        </td>
                                        <td>
                                            <ConfidenceBadge score={caseItem.aiConfidence} />
                                        </td>
                                        <td className="text-gray-700">{caseItem.assignedAttorney}</td>
                                        <td className="text-gray-500 text-sm">
                                            {formatDateShort(caseItem.filedDate)}
                                        </td>
                                        <td className="text-gray-500 text-sm">
                                            {formatRelativeTime(caseItem.lastUpdated)}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/cases/${caseItem.id}`}
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                    title="Reassign"
                                                >
                                                    <UserPlus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-1.5 text-gray-400 hover:text-[var(--patriot-red)] hover:bg-red-50 rounded"
                                                    title="Flag for Review"
                                                >
                                                    <Flag className="w-4 h-4" />
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
                                            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p className="text-lg font-medium">No cases found</p>
                                            <p className="text-sm mt-1">
                                                Try adjusting your search or filter criteria
                                            </p>
                                            <Button
                                                variant="secondary"
                                                className="mt-4"
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setStatusFilter('all');
                                                    setVisaTypeFilter('all');
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
                {filteredCases.length > ITEMS_PER_PAGE && (
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
