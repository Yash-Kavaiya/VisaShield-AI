'use client';

import React, { useState } from 'react';
import {
    FileStack,
    Clock,
    Target,
    AlertTriangle,
    CheckCircle2,
    Activity,
    RefreshCw,
    Download,
    Filter,
    Search,
    AlertCircle,
    Info,
    XCircle,
} from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, CardTitle, Button, MetricCard, Badge, Select } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';
import { CHART_COLORS } from '@/lib/constants';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

// Mock analytics data
const mockVolumeData = [
    { date: 'Dec 12', h1b: 45, o1: 12, eb2: 8, l1: 5 },
    { date: 'Dec 13', h1b: 52, o1: 15, eb2: 6, l1: 8 },
    { date: 'Dec 14', h1b: 38, o1: 10, eb2: 12, l1: 4 },
    { date: 'Dec 15', h1b: 28, o1: 8, eb2: 5, l1: 6 },
    { date: 'Dec 16', h1b: 48, o1: 14, eb2: 9, l1: 7 },
    { date: 'Dec 17', h1b: 55, o1: 18, eb2: 11, l1: 9 },
    { date: 'Dec 18', h1b: 42, o1: 13, eb2: 7, l1: 5 },
];

const mockHeatmapData = [
    { visa: 'H-1B', week1: 0.2, week2: 0.1, week3: 0.3, week4: 0.2 },
    { visa: 'O-1A', week1: 0.8, week2: 0.5, week3: 0.3, week4: 0.2 },
    { visa: 'O-1B', week1: 1.2, week2: 0.9, week3: 0.7, week4: 0.4 },
    { visa: 'EB-1A', week1: 0.5, week2: 0.3, week3: 0.2, week4: 0.1 },
    { visa: 'EB-2 NIW', week1: 0.4, week2: 0.6, week3: 0.3, week4: 0.2 },
    { visa: 'L-1A', week1: 0.3, week2: 0.2, week3: 0.1, week4: 0.1 },
];

const mockCostData = [
    { category: 'H-1B', cost: 2450, volume: 256 },
    { category: 'O-1A', cost: 3200, volume: 89 },
    { category: 'O-1B', cost: 2800, volume: 45 },
    { category: 'EB-2 NIW', cost: 4100, volume: 67 },
    { category: 'EB-1A', cost: 3800, volume: 34 },
    { category: 'L-1A', cost: 1900, volume: 48 },
];

const mockOutcomeData = [
    { name: 'Approved', value: 847, color: CHART_COLORS.approved },
    { name: 'Denied', value: 89, color: CHART_COLORS.denied },
    { name: 'RFE Issued', value: 156, color: CHART_COLORS.rfe },
    { name: 'Pending', value: 234, color: CHART_COLORS.pending },
];

const mockMonitors = [
    { id: '1', name: 'Citation Hallucination Rate', status: 'ok', lastCheck: '2024-12-18T10:30:00Z' },
    { id: '2', name: 'PII Detection Accuracy', status: 'ok', lastCheck: '2024-12-18T10:28:00Z' },
    { id: '3', name: 'API Latency P95', status: 'warn', lastCheck: '2024-12-18T10:25:00Z' },
    { id: '4', name: 'Model Inference Time', status: 'ok', lastCheck: '2024-12-18T10:30:00Z' },
    { id: '5', name: 'Token Usage Quota', status: 'alert', lastCheck: '2024-12-18T10:15:00Z' },
    { id: '6', name: 'Document Processing Queue', status: 'ok', lastCheck: '2024-12-18T10:30:00Z' },
];

const mockEventStream = [
    { id: '1', timestamp: '2024-12-18T10:32:15Z', level: 'info', message: 'Case H1B-2024-00847 analysis completed', service: 'adjudicator' },
    { id: '2', timestamp: '2024-12-18T10:31:45Z', level: 'warning', message: 'High token usage detected for batch processing', service: 'api-gateway' },
    { id: '3', timestamp: '2024-12-18T10:30:12Z', level: 'error', message: 'Citation verification failed for case O1A-2024-00523', service: 'validator' },
    { id: '4', timestamp: '2024-12-18T10:29:30Z', level: 'info', message: 'New case uploaded: EB2-2024-01567', service: 'ingestion' },
    { id: '5', timestamp: '2024-12-18T10:28:45Z', level: 'info', message: 'User sarah.mitchell@lawfirm.com logged in', service: 'auth' },
    { id: '6', timestamp: '2024-12-18T10:27:00Z', level: 'warning', message: 'PII detected in uploaded document, auto-redacted', service: 'scanner' },
];

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState('7d');
    const [eventFilter, setEventFilter] = useState('all');

    const getHeatmapColor = (rate: number) => {
        if (rate === 0) return 'bg-green-100';
        if (rate < 0.5) return 'bg-green-200';
        if (rate < 1) return 'bg-yellow-200';
        if (rate < 2) return 'bg-yellow-400';
        return 'bg-red-400';
    };

    const monitorStatusColors = {
        ok: 'bg-green-500',
        warn: 'bg-yellow-500',
        alert: 'bg-red-500',
        'no-data': 'bg-gray-400',
    };

    const eventLevelIcons = {
        info: <Info className="w-4 h-4 text-blue-500" />,
        warning: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
        error: <XCircle className="w-4 h-4 text-red-500" />,
    };

    const filteredEvents = eventFilter === 'all'
        ? mockEventStream
        : mockEventStream.filter((e) => e.level === eventFilter);

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-heading text-[var(--primary-navy)]">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Performance metrics and observability insights
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select
                        options={[
                            { value: '24h', label: 'Last 24 hours' },
                            { value: '7d', label: 'Last 7 days' },
                            { value: '30d', label: 'Last 30 days' },
                            { value: '90d', label: 'Last 90 days' },
                        ]}
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="w-40"
                    />
                    <Button variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />}>
                        Refresh
                    </Button>
                    <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                        Export
                    </Button>
                </div>
            </div>

            {/* Top Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <MetricCard
                    title="Total Processed"
                    value="1,326"
                    change={8}
                    trend="up"
                    icon={<FileStack className="w-5 h-5" />}
                />
                <MetricCard
                    title="Avg Processing Time"
                    value="3m 24s"
                    change={-12}
                    trend="down"
                    color="success"
                    icon={<Clock className="w-5 h-5" />}
                />
                <MetricCard
                    title="AI Accuracy"
                    value="94.2%"
                    change={1.5}
                    trend="up"
                    color="success"
                    icon={<Target className="w-5 h-5" />}
                />
                <MetricCard
                    title="Manual Review Rate"
                    value="6.8%"
                    change={-0.5}
                    trend="down"
                    color="success"
                    icon={<AlertTriangle className="w-5 h-5" />}
                />
                <MetricCard
                    title="Citation Validity"
                    value="98.7%"
                    change={0.3}
                    trend="up"
                    color="success"
                    icon={<CheckCircle2 className="w-5 h-5" />}
                />
                <MetricCard
                    title="System Uptime"
                    value="99.9%"
                    icon={<Activity className="w-5 h-5" />}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Processing Volume Over Time */}
                <Card>
                    <CardHeader>
                        <CardTitle>Processing Volume by Visa Type</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockVolumeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="h1b" name="H-1B" stroke="#1E5AA8" strokeWidth={2} />
                                    <Line type="monotone" dataKey="o1" name="O-1" stroke="#C9A227" strokeWidth={2} />
                                    <Line type="monotone" dataKey="eb2" name="EB-2" stroke="#2E7D32" strokeWidth={2} />
                                    <Line type="monotone" dataKey="l1" name="L-1" stroke="#5521B5" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>

                {/* Hallucination Rate Heatmap */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <CardTitle>Hallucination Rate Heatmap</CardTitle>
                            <Badge variant="success">Low Risk</Badge>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="text-left py-2 px-3 font-medium text-gray-600">Visa Type</th>
                                        <th className="text-center py-2 px-3 font-medium text-gray-600">Week 1</th>
                                        <th className="text-center py-2 px-3 font-medium text-gray-600">Week 2</th>
                                        <th className="text-center py-2 px-3 font-medium text-gray-600">Week 3</th>
                                        <th className="text-center py-2 px-3 font-medium text-gray-600">Week 4</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockHeatmapData.map((row) => (
                                        <tr key={row.visa}>
                                            <td className="py-2 px-3 font-medium text-gray-900">{row.visa}</td>
                                            <td className="py-2 px-3">
                                                <div className={cn('w-full h-8 rounded flex items-center justify-center text-xs font-medium', getHeatmapColor(row.week1))}>
                                                    {row.week1}%
                                                </div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <div className={cn('w-full h-8 rounded flex items-center justify-center text-xs font-medium', getHeatmapColor(row.week2))}>
                                                    {row.week2}%
                                                </div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <div className={cn('w-full h-8 rounded flex items-center justify-center text-xs font-medium', getHeatmapColor(row.week3))}>
                                                    {row.week3}%
                                                </div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <div className={cn('w-full h-8 rounded flex items-center justify-center text-xs font-medium', getHeatmapColor(row.week4))}>
                                                    {row.week4}%
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                            <span>Rate Legend:</span>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded bg-green-100" />
                                <span>0%</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded bg-yellow-200" />
                                <span>0.5-1%</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded bg-red-400" />
                                <span>&gt;2%</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Processing Cost by Category */}
                <Card>
                    <CardHeader>
                        <CardTitle>ML Token Cost by Visa Category</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockCostData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `$${v}`} />
                                    <YAxis dataKey="category" type="category" tick={{ fontSize: 12, fill: '#6B7280' }} width={80} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value) => [`$${value}`, 'Cost']}
                                    />
                                    <Bar dataKey="cost" fill="#1E5AA8" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>

                {/* Case Outcome Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Case Outcome Distribution</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="h-72 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={mockOutcomeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {mockOutcomeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            {mockOutcomeData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-gray-600">
                                        {item.name} ({item.value})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Real-Time Event Stream */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <CardTitle>Real-Time Event Stream</CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search events..."
                                            className="input pl-9 py-1.5 text-sm w-48"
                                        />
                                    </div>
                                    <Select
                                        options={[
                                            { value: 'all', label: 'All Levels' },
                                            { value: 'info', label: 'Info' },
                                            { value: 'warning', label: 'Warnings' },
                                            { value: 'error', label: 'Errors' },
                                        ]}
                                        value={eventFilter}
                                        onChange={(e) => setEventFilter(e.target.value)}
                                        className="w-32 text-sm"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0">
                            <div className="max-h-80 overflow-y-auto">
                                {filteredEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className={cn(
                                            'flex items-start gap-3 px-6 py-3 border-b border-gray-100 hover:bg-gray-50',
                                            event.level === 'error' && 'bg-red-50/50'
                                        )}
                                    >
                                        {eventLevelIcons[event.level as keyof typeof eventLevelIcons]}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">{event.message}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-gray-400">
                                                    {formatRelativeTime(event.timestamp)}
                                                </span>
                                                <Badge variant="default" className="text-[10px]">
                                                    {event.service}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Active Monitors */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Monitors</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        {mockMonitors.map((monitor) => (
                            <div
                                key={monitor.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn('w-3 h-3 rounded-full', monitorStatusColors[monitor.status as keyof typeof monitorStatusColors])} />
                                    <span className="text-sm text-gray-900">{monitor.name}</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {formatRelativeTime(monitor.lastCheck)}
                                </span>
                            </div>
                        ))}
                    </CardBody>
                </Card>
            </div>
        </MainLayout>
    );
}
