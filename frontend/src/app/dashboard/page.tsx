'use client';

import React from 'react';
import Link from 'next/link';
import {
    FileStack,
    Clock,
    AlertTriangle,
    Activity,
    Upload,
    FileText,
    Shield,
    ChevronRight,
    Eye,
    UserPlus,
    Flag,
    AlertCircle,
    CheckCircle,
    Info,
    Loader2,
} from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { MetricCard, Card, CardHeader, CardBody, CardTitle, Button, StatusBadge, VisaBadge, ConfidenceBadge } from '@/components/ui';
import { formatDate, formatRelativeTime, formatElapsedTime, getGreeting, formatNumber } from '@/lib/utils';
import { mockCases, mockAlerts, mockProcessingQueue, mockWeeklyData, mockMetrics } from '@/lib/mockData';
import { PROCESSING_STAGES, CHART_COLORS } from '@/lib/constants';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

export default function DashboardPage() {
    const today = new Date();
    const userName = 'Sarah';

    return (
        <MainLayout>
            {/* Hero Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-heading text-[var(--primary-navy)] mb-1">
                    {getGreeting()}, {userName}
                </h1>
                <p className="text-gray-500">
                    {formatDate(today, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm text-[var(--secondary-blue)] mt-2">
                    You&apos;ve helped process <span className="font-semibold">{formatNumber(mockMetrics.totalCasesThisQuarter)}</span> cases this quarter
                </p>
            </div>

            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Cases Processed Today"
                    value={mockMetrics.casesProcessedToday}
                    change={mockMetrics.casesProcessedChange}
                    changeLabel="vs yesterday"
                    trend="up"
                    color="default"
                    icon={<FileStack className="w-5 h-5" />}
                    sparkline={[85, 92, 78, 105, 98, 115, 127]}
                />
                <MetricCard
                    title="Pending AI Review"
                    value={mockMetrics.pendingReview}
                    change={mockMetrics.pendingReviewChange}
                    changeLabel="from last week"
                    trend="down"
                    color={mockMetrics.pendingReview > 50 ? 'warning' : 'default'}
                    icon={<Clock className="w-5 h-5" />}
                />
                <MetricCard
                    title="Manual Review Required"
                    value={mockMetrics.manualReviewRequired}
                    change={mockMetrics.manualReviewChange}
                    changeLabel="new today"
                    trend="up"
                    color={mockMetrics.manualReviewRequired > 5 ? 'danger' : 'warning'}
                    icon={<AlertTriangle className="w-5 h-5" />}
                />
                <MetricCard
                    title="System Health"
                    value={`${mockMetrics.systemHealth}%`}
                    change={mockMetrics.systemHealthChange}
                    changeLabel="uptime"
                    trend="up"
                    color="success"
                    icon={<Activity className="w-5 h-5" />}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                {/* Active Cases Table */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader action={
                            <Link href="/cases" className="text-sm text-[var(--secondary-blue)] hover:underline flex items-center gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </Link>
                        }>
                            <CardTitle>Active Cases</CardTitle>
                        </CardHeader>
                        <div className="table-container border-0 rounded-none">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Case Number</th>
                                        <th>Applicant</th>
                                        <th>Visa Type</th>
                                        <th>Status</th>
                                        <th>AI Confidence</th>
                                        <th>Updated</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockCases.slice(0, 5).map((caseItem) => (
                                        <tr key={caseItem.id}>
                                            <td>
                                                <Link
                                                    href={`/cases/${caseItem.id}`}
                                                    className="font-mono text-[var(--secondary-blue)] hover:underline"
                                                >
                                                    {caseItem.caseNumber}
                                                </Link>
                                            </td>
                                            <td className="text-gray-900">{caseItem.applicantNameRedacted}</td>
                                            <td><VisaBadge visaType={caseItem.visaType} size="sm" /></td>
                                            <td><StatusBadge status={caseItem.status} size="sm" /></td>
                                            <td><ConfidenceBadge score={caseItem.aiConfidence} size="sm" /></td>
                                            <td className="text-gray-500 text-sm">
                                                {formatRelativeTime(caseItem.lastUpdated)}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                        title="Reassign"
                                                    >
                                                        <UserPlus className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-1.5 text-gray-400 hover:text-[var(--patriot-red)] hover:bg-red-50 rounded"
                                                        title="Flag"
                                                    >
                                                        <Flag className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Right Sidebar Widgets */}
                <div className="lg:col-span-2 space-y-6">
                    {/* AI Processing Queue */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <CardTitle className="text-base">AI Processing Queue</CardTitle>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            {mockProcessingQueue.map((item) => (
                                <div key={item.caseId} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm text-gray-900">
                                                {item.caseNumber}
                                            </span>
                                            <VisaBadge visaType={item.visaType} size="sm" />
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {formatElapsedTime(item.elapsedTime)}
                                        </span>
                                    </div>
                                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="absolute left-0 top-0 h-full bg-[var(--secondary-blue)] rounded-full transition-all"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        <span>{PROCESSING_STAGES[item.stage].label}</span>
                                    </div>
                                </div>
                            ))}
                        </CardBody>
                    </Card>

                    {/* Recent Alerts */}
                    <Card>
                        <CardHeader action={
                            <Link href="/alerts" className="text-xs text-[var(--secondary-blue)] hover:underline">
                                View All
                            </Link>
                        }>
                            <CardTitle className="text-base">Recent Alerts</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-3">
                            {mockAlerts.slice(0, 4).map((alert) => {
                                const alertIcons = {
                                    warning: <AlertCircle className="w-4 h-4 text-[var(--warning-amber)]" />,
                                    error: <AlertTriangle className="w-4 h-4 text-[var(--danger-red)]" />,
                                    success: <CheckCircle className="w-4 h-4 text-[var(--success-green)]" />,
                                    info: <Info className="w-4 h-4 text-[var(--info-blue)]" />,
                                };
                                return (
                                    <div
                                        key={alert.id}
                                        className={`flex gap-3 p-2 rounded-lg ${!alert.read ? 'bg-[var(--cream-white)]' : ''}`}
                                    >
                                        {alertIcons[alert.type]}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 font-medium truncate">
                                                {alert.title}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {alert.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatRelativeTime(alert.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardBody>
                    </Card>

                    {/* Quick Actions */}
                    <Card padding="md">
                        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Button className="w-full justify-start" leftIcon={<Upload className="w-4 h-4" />}>
                                Upload New Petition
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                leftIcon={<FileText className="w-4 h-4" />}
                            >
                                Generate Report
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                leftIcon={<Shield className="w-4 h-4" />}
                            >
                                View Compliance Log
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Weekly Processing Volume Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Processing Volume</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockWeeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    tickFormatter={(value) => {
                                        const date = new Date(value);
                                        return date.toLocaleDateString('en-US', { weekday: 'short' });
                                    }}
                                />
                                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="approved"
                                    name="Approved"
                                    fill={CHART_COLORS.approved}
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="denied"
                                    name="Denied"
                                    fill={CHART_COLORS.denied}
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="pending"
                                    name="Pending"
                                    fill={CHART_COLORS.pending}
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="rfe"
                                    name="RFE Issued"
                                    fill={CHART_COLORS.rfe}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardBody>
            </Card>
        </MainLayout>
    );
}
