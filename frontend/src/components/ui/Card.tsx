import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export function Card({ children, className, hover = true, padding = 'none' }: CardProps) {
    return (
        <div
            className={cn(
                'card',
                paddingClasses[padding],
                !hover && 'hover:shadow-none hover:transform-none',
                className
            )}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
    return (
        <div className={cn('card-header flex items-center justify-between', className)}>
            <div>{children}</div>
            {action && <div>{action}</div>}
        </div>
    );
}

interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
    return (
        <div className={cn('card-body', className)}>
            {children}
        </div>
    );
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
    return (
        <div className={cn('card-footer', className)}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function CardTitle({ children, className, as: Tag = 'h3' }: CardTitleProps) {
    return (
        <Tag className={cn('text-lg font-semibold text-gray-900', className)}>
            {children}
        </Tag>
    );
}

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
    return (
        <p className={cn('text-sm text-gray-500 mt-1', className)}>
            {children}
        </p>
    );
}
