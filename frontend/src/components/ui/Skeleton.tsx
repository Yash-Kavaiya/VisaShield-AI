import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className,
    variant = 'rectangular',
    width,
    height,
}: SkeletonProps) {
    return (
        <div
            className={cn(
                'skeleton',
                variant === 'circular' && 'rounded-full',
                variant === 'text' && 'rounded',
                className
            )}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
        />
    );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="p-4">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

// Card Skeleton
export function CardSkeleton() {
    return (
        <div className="card p-6">
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/4" />
        </div>
    );
}

// List Item Skeleton
export function ListItemSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}

// Chart Skeleton
export function ChartSkeleton() {
    const heights = [60, 80, 45, 90, 70, 55, 75];
    return (
        <div className="card p-6">
            <Skeleton className="h-4 w-1/4 mb-6" />
            <div className="flex items-end gap-2 h-48">
                {heights.map((h, i) => (
                    <Skeleton
                        key={i}
                        className="flex-1"
                        height={`${h}%`}
                    />
                ))}
            </div>
        </div>
    );
}
