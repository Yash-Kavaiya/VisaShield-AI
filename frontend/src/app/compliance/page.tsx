'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Search,
    Download,
    Shield,
    ShieldCheck,
    ShieldAlert,
    ShieldX,
    Clock,
    Eye,
    Edit,
    Trash2,
    Upload,
    LogIn,
    LogOut,
    CheckCircle,
    ThumbsUp,
    ThumbsDown,
    FileText,
    TrendingUp,
    TrendingDown,
    Minus,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Filter,
    Calendar,
    User,
    Activity,
    Database,
    Brain,
    Lock,
    FileArchive,
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
import { mockAuditLogs, mockPolicyMonitors, mockComplianceMetrics } from '@/lib/mockData';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import { AuditLogEntry, PolicyMonitor, ComplianceMetric, AuditAction, ComplianceStatus } from '@/types';

const ITEMS_PER_PAGE = 8;

// Tabs configuration
const TABS = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'audit-log', label: 'Audit Log', icon: FileText },
    { id: 'policies', label: 'Policy Monitors', icon: ShieldCheck },
] as const;

type TabId = typeof TABS[number]['id'];

// Action icon mapping
const actionIcons: Record<AuditAction, React.ElementType> = {
    view: Eye,
    edit: Edit,
    create: Upload,
    delete: Trash2,
    export: Download,
    approve: ThumbsUp,
    reject: ThumbsDown,
    login: LogIn,
    logout: LogOut,
};

// Category icon mapping
const categoryIcons: Record<string, React.ElementType> = {
    'data-privacy': Lock,
    'access-control': User,
    'processing': Activity,
    'retention': FileArchive,
    'ai-governance': Brain,
};

// Compliance Status Badge
const ComplianceStatusBadge = ({ status }: { status: ComplianceStatus }) => {
    const configs = {
        compliant: { icon: ShieldCheck, label: 'Compliant', className: 'bg-green-100 text-green-700' },
        warning: { icon: ShieldAlert, label: 'Warning', className: 'bg-amber-100 text-amber-700' },
        violation: { icon: ShieldX, label: 'Violation', className: 'bg-red-100 text-red-700' },
        'pending-review': { icon: Clock, label: 'Review Needed', className: 'bg-blue-100 text-blue-700' },
    };
    const config = configs[status];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
};

// Risk Level Badge
const RiskBadge = ({ level }: { level: 'low' | 'medium' | 'high' }) => {
    const configs = {
        low: { label: 'Low', className: 'bg-gray-100 text-gray-600' },
        medium: { label: 'Medium', className: 'bg-amber-100 text-amber-700' },
        high: { label: 'High', className: 'bg-red-100 text-red-700' },
    };
    const config = configs[level];

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
            {config.label}
        </span>
    );
};

// Metric Card Component
const MetricCardItem = ({ metric }: { metric: ComplianceMetric }) => {
    const isOnTarget = metric.status === 'compliant';
    const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Minus;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <span className="text-sm text-gray-500 font-medium">{metric.label}</span>
                <ComplianceStatusBadge status={metric.status} />
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <span className="text-3xl font-bold text-[var(--primary-navy)]">
                        {metric.value}
                    </span>
                    <span className="text-lg text-gray-400 ml-1">{metric.unit}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                    <TrendIcon className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-500' :
                            metric.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                        }`} />
                    <span className="text-gray-500">Target: {metric.target}{metric.unit}</span>
                </div>
            </div>
        </div>
    );
};

// Policy Monitor Card
const PolicyCard = ({ policy }: { policy: PolicyMonitor }) => {
    const CategoryIcon = categoryIcons[policy.category] || Shield;
    const complianceRate = ((policy.totalChecks - policy.violations) / policy.totalChecks * 100).toFixed(1);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${policy.status === 'compliant' ? 'bg-green-100' :
                        policy.status === 'warning' ? 'bg-amber-100' :
                            policy.status === 'violation' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                    <CategoryIcon className={`w-5 h-5 ${policy.status === 'compliant' ? 'text-green-600' :
                            policy.status === 'warning' ? 'text-amber-600' :
                                policy.status === 'violation' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900">{policy.name}</h3>
                        <ComplianceStatusBadge status={policy.status} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{policy.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {complianceRate}% rate
                        </span>
                        <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {policy.violations} violations
                        </span>
                        <span className="flex items-center gap-1">
                            <RefreshCw className="w-3.5 h-3.5" />
                            {formatRelativeTime(policy.lastCheck)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function CompliancePage() {
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState<string>('all');
    const [riskFilter, setRiskFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter audit logs
    const filteredLogs = useMemo(() => {
        return mockAuditLogs.filter((log) => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesUser = log.userName.toLowerCase().includes(query);
                const matchesCase = log.caseNumber?.toLowerCase().includes(query);
                const matchesResource = log.resource.toLowerCase().includes(query);
                if (!matchesUser && !matchesCase && !matchesResource) return false;
            }

            if (actionFilter !== 'all' && log.action !== actionFilter) return false;
            if (riskFilter !== 'all' && log.riskLevel !== riskFilter) return false;

            return true;
        });
    }, [searchQuery, actionFilter, riskFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Stats for overview
    const complianceStats = {
        compliant: mockPolicyMonitors.filter(p => p.status === 'compliant').length,
        warning: mockPolicyMonitors.filter(p => p.status === 'warning').length,
        violation: mockPolicyMonitors.filter(p => p.status === 'violation').length,
        pendingReview: mockPolicyMonitors.filter(p => p.status === 'pending-review').length,
    };

    const actionOptions = [
        { value: 'all', label: 'All Actions' },
        { value: 'view', label: 'View' },
        { value: 'edit', label: 'Edit' },
        { value: 'create', label: 'Create' },
        { value: 'delete', label: 'Delete' },
        { value: 'export', label: 'Export' },
        { value: 'approve', label: 'Approve' },
        { value: 'reject', label: 'Reject' },
    ];

    const riskOptions = [
        { value: 'all', label: 'All Risk Levels' },
        { value: 'high', label: 'High Risk' },
        { value: 'medium', label: 'Medium Risk' },
        { value: 'low', label: 'Low Risk' },
    ];

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-heading text-[var(--primary-navy)]">
                        Compliance Center
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Monitor compliance, audit trails, and policy adherence
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                        Export Report
                    </Button>
                    <Button leftIcon={<RefreshCw className="w-4 h-4" />}>
                        Run Audit
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

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center gap-2 text-green-700 mb-2">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="font-medium">Compliant</span>
                            </div>
                            <span className="text-3xl font-bold text-green-700">{complianceStats.compliant}</span>
                            <span className="text-sm text-green-600 ml-1">policies</span>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                            <div className="flex items-center gap-2 text-amber-700 mb-2">
                                <ShieldAlert className="w-5 h-5" />
                                <span className="font-medium">Warning</span>
                            </div>
                            <span className="text-3xl font-bold text-amber-700">{complianceStats.warning}</span>
                            <span className="text-sm text-amber-600 ml-1">policies</span>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                            <div className="flex items-center gap-2 text-red-700 mb-2">
                                <ShieldX className="w-5 h-5" />
                                <span className="font-medium">Violations</span>
                            </div>
                            <span className="text-3xl font-bold text-red-700">{complianceStats.violation}</span>
                            <span className="text-sm text-red-600 ml-1">policies</span>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center gap-2 text-blue-700 mb-2">
                                <Clock className="w-5 h-5" />
                                <span className="font-medium">Pending Review</span>
                            </div>
                            <span className="text-3xl font-bold text-blue-700">{complianceStats.pendingReview}</span>
                            <span className="text-sm text-blue-600 ml-1">policies</span>
                        </div>
                    </div>

                    {/* Compliance Metrics */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Metrics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mockComplianceMetrics.map((metric) => (
                                <MetricCardItem key={metric.id} metric={metric} />
                            ))}
                        </div>
                    </div>

                    {/* Recent Audit Activity */}
                    <Card>
                        <CardHeader action={
                            <button
                                onClick={() => setActiveTab('audit-log')}
                                className="text-sm text-[var(--secondary-blue)] hover:underline"
                            >
                                View All
                            </button>
                        }>
                            <CardTitle>Recent Audit Activity</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-3">
                            {mockAuditLogs.slice(0, 5).map((log) => {
                                const ActionIcon = actionIcons[log.action];
                                return (
                                    <div key={log.id} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                                        <div className="p-2 rounded-lg bg-gray-100">
                                            <ActionIcon className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">
                                                <span className="font-medium">{log.userName}</span>
                                                {' '}{log.action} {log.resource.toLowerCase()}
                                                {log.caseNumber && (
                                                    <Link href={`/cases/${log.resourceId}`} className="text-[var(--secondary-blue)] hover:underline ml-1">
                                                        {log.caseNumber}
                                                    </Link>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-400">{log.details}</p>
                                        </div>
                                        <div className="text-right">
                                            <RiskBadge level={log.riskLevel} />
                                            <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(log.timestamp)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* Audit Log Tab */}
            {activeTab === 'audit-log' && (
                <div className="space-y-4">
                    {/* Filters */}
                    <Card>
                        <CardBody>
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by user, case, or resource..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="input pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Select
                                        options={actionOptions}
                                        value={actionFilter}
                                        onChange={(e) => {
                                            setActionFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-36"
                                    />
                                    <Select
                                        options={riskOptions}
                                        value={riskFilter}
                                        onChange={(e) => {
                                            setRiskFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-40"
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Audit Log Table */}
                    <Card>
                        <div className="table-container border-0 rounded-lg overflow-hidden">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>User</th>
                                        <th>Action</th>
                                        <th>Resource</th>
                                        <th>Case</th>
                                        <th>Risk</th>
                                        <th>IP Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedLogs.map((log) => {
                                        const ActionIcon = actionIcons[log.action];
                                        return (
                                            <tr key={log.id}>
                                                <td className="text-sm">
                                                    <div className="text-gray-900">{formatDate(log.timestamp, { month: 'short', day: 'numeric' })}</div>
                                                    <div className="text-xs text-gray-400">{formatDate(log.timestamp, { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td>
                                                    <div className="text-gray-900 font-medium">{log.userName}</div>
                                                    <div className="text-xs text-gray-400">{log.userRole}</div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <ActionIcon className="w-4 h-4 text-gray-400" />
                                                        <span className="capitalize">{log.action}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-gray-900">{log.resource}</span>
                                                </td>
                                                <td>
                                                    {log.caseNumber ? (
                                                        <Link
                                                            href={`/cases/${log.resourceId}`}
                                                            className="font-mono text-sm text-[var(--secondary-blue)] hover:underline"
                                                        >
                                                            {log.caseNumber}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <RiskBadge level={log.riskLevel} />
                                                </td>
                                                <td className="font-mono text-xs text-gray-500">
                                                    {log.ipAddress}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredLogs.length > ITEMS_PER_PAGE && (
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
                </div>
            )}

            {/* Policies Tab */}
            {activeTab === 'policies' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {mockPolicyMonitors.map((policy) => (
                            <PolicyCard key={policy.id} policy={policy} />
                        ))}
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
