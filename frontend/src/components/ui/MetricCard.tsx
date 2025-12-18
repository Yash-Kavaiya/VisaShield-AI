import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    sparkline?: number[];
    loading?: boolean;
}

const colorClasses = {
    default: 'text-[var(--primary-navy)]',
    success: 'text-[var(--success-green)]',
    warning: 'text-[var(--warning-amber)]',
    danger: 'text-[var(--danger-red)]',
    info: 'text-[var(--info-blue)]',
};

const trendColors = {
    up: 'text-[var(--success-green)]',
    down: 'text-[var(--danger-red)]',
    neutral: 'text-gray-500',
};

const TrendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
};

export default function MetricCard({
    title,
    value,
    change,
    changeLabel,
    icon,
    trend = 'neutral',
    color = 'default',
    sparkline,
    loading = false,
}: MetricCardProps) {
    const TrendIcon = TrendIcons[trend];

    if (loading) {
        return (
            <div className="metric-card">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="skeleton h-4 w-24 mb-3" />
                        <div className="skeleton h-9 w-32 mb-2" />
                        <div className="skeleton h-4 w-20" />
                    </div>
                    <div className="skeleton h-10 w-10 rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="metric-card group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    {/* Title */}
                    <p className="text-caption text-gray-500 mb-1">{title}</p>

                    {/* Value */}
                    <p className={cn('metric-value', colorClasses[color])}>
                        {value}
                    </p>

                    {/* Trend/Change */}
                    {change !== undefined && (
                        <div className={cn('metric-trend', trendColors[trend])}>
                            <TrendIcon className="w-3.5 h-3.5" />
                            <span>{change > 0 ? '+' : ''}{change}%</span>
                            {changeLabel && (
                                <span className="text-gray-400 ml-1">{changeLabel}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Icon */}
                {icon && (
                    <div className={cn(
                        'p-2.5 rounded-lg bg-[var(--cream-white)] group-hover:bg-[var(--primary-navy)] transition-colors',
                        'text-[var(--primary-navy)] group-hover:text-white'
                    )}>
                        {icon}
                    </div>
                )}
            </div>

            {/* Sparkline */}
            {sparkline && sparkline.length > 0 && (
                <div className="mt-4 h-8">
                    <Sparkline data={sparkline} color={color} />
                </div>
            )}
        </div>
    );
}

interface SparklineProps {
    data: number[];
    color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

function Sparkline({ data, color = 'default' }: SparklineProps) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const strokeColors = {
        default: 'var(--primary-navy)',
        success: 'var(--success-green)',
        warning: 'var(--warning-amber)',
        danger: 'var(--danger-red)',
        info: 'var(--info-blue)',
    };

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full"
        >
            <polyline
                points={points}
                fill="none"
                stroke={strokeColors[color]}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
