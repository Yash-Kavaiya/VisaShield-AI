import React from 'react';
import { cn } from '@/lib/utils';
import {
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
    AlertCircle,
    FileEdit,
    Send,
    Minus,
} from 'lucide-react';
import { CaseStatus, VisaType } from '@/types';
import { CASE_STATUSES, VISA_TYPES } from '@/lib/constants';

// Status Badge Component
interface StatusBadgeProps {
    status: CaseStatus;
    showIcon?: boolean;
    size?: 'sm' | 'md';
}

const statusIcons: Record<CaseStatus, React.ElementType> = {
    'draft': FileEdit,
    'submitted': Send,
    'processing': Loader2,
    'pending-review': Clock,
    'rfe-issued': AlertCircle,
    'approved': CheckCircle,
    'denied': XCircle,
    'withdrawn': Minus,
};

export function StatusBadge({ status, showIcon = true, size = 'md' }: StatusBadgeProps) {
    const config = CASE_STATUSES[status];
    const Icon = statusIcons[status];

    return (
        <span
            className={cn(
                'badge',
                config.color,
                size === 'sm' && 'text-[10px] px-2 py-0.5'
            )}
        >
            {showIcon && (
                <Icon className={cn(
                    'flex-shrink-0',
                    size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5',
                    status === 'processing' && 'animate-spin'
                )} />
            )}
            <span>{config.label}</span>
        </span>
    );
}

// Visa Type Badge Component
interface VisaBadgeProps {
    visaType: VisaType;
    size?: 'sm' | 'md';
}

export function VisaBadge({ visaType, size = 'md' }: VisaBadgeProps) {
    const config = VISA_TYPES[visaType];

    return (
        <span
            className={cn(
                'visa-badge',
                config.color,
                size === 'sm' && 'text-[10px] px-1.5 py-0.5'
            )}
        >
            {config.label}
        </span>
    );
}

// Confidence Badge Component
interface ConfidenceBadgeProps {
    score: number;
    size?: 'sm' | 'md';
}

export function ConfidenceBadge({ score, size = 'md' }: ConfidenceBadgeProps) {
    const getColor = () => {
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-semibold',
                getColor(),
                size === 'sm' ? 'text-[10px]' : 'text-xs'
            )}
        >
            {score}%
        </span>
    );
}

// Generic Badge Component
interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    children: React.ReactNode;
    className?: string;
}

const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                variantClasses[variant],
                className
            )}
        >
            {children}
        </span>
    );
}

// Government Trust Badge
interface TrustBadgeProps {
    label: string;
    icon?: React.ReactNode;
}

export function TrustBadge({ label, icon }: TrustBadgeProps) {
    return (
        <div className="trust-badge">
            {icon}
            <span>{label}</span>
        </div>
    );
}
